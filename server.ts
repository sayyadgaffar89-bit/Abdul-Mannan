import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { Storage, StoredLead, StoredEnquiry } from './src/server/storage.ts';
import { dispatchLeadNotification, dispatchEnquiryNotification } from './src/server/whatsapp.ts';
import { ARCHITECTURE_SERVICES, ArchitectureService } from './src/data/services.ts';
import { calculateProjectEstimate, EstimateInput } from './src/data/rates.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'architect_admin_hyderabad_2026';
const ADMIN_TOKEN = 'ud_admin_sess_' + Buffer.from(ADMIN_PASSWORD).toString('base64');

// Parse JSON bodies
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting in-memory stores
const ipRateLimits = new Map<string, { count: number; firstSeen: number }>();
const mobileRateLimits = new Map<string, { count: number; firstSeen: number }>();

function isRateLimited(key: string, map: Map<string, { count: number; firstSeen: number }>, maxCount: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry) {
    map.set(key, { count: 1, firstSeen: now });
    return false;
  }
  if (now - entry.firstSeen > windowMs) {
    map.set(key, { count: 1, firstSeen: now });
    return false;
  }
  entry.count += 1;
  return entry.count > maxCount;
}

// Helper for IST time
function getIstTimestamp(): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date());
}

// Bot crawler detection for bot-safe SEO rendering
app.use((req: Request, res: Response, next: NextFunction) => {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const isSearchBot = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest\/0\.|slackbot|vkshare|w3c_validator/i.test(
    userAgent
  );
  if (isSearchBot) {
    res.setHeader('X-Bot-Safe-Rendering', 'true');
  }
  next();
});

// Admin auth middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const tokenHeader = req.headers['x-admin-token'] as string;
  const token = authHeader.replace('Bearer ', '').trim() || tokenHeader;

  if (token === ADMIN_TOKEN) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized admin access' });
}

// --- API Endpoints ---

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 2. Entry Gate Lead Submission (POST /api/lead)
app.post('/api/lead', async (req: Request, res: Response) => {
  try {
    const { name, mobile, consent, honeypot, sourcePage } = req.body;
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';

    // Honeypot check for spam bots
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn(`[Lead Gate] Honeypot triggered by IP ${clientIp}`);
      return res.json({ success: true, name: 'Visitor' });
    }

    // Server-side validation
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const cleanMobile = typeof mobile === 'string' ? mobile.replace(/\D/g, '').slice(-10) : '';

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 80) {
      return res.status(400).json({ error: 'Please enter a valid full name (2 to 80 characters).' });
    }

    // 10-digit Indian mobile regex: ^[6-9]\d{9}$
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.' });
    }

    if (!consent) {
      return res.status(400).json({ error: 'Consent to contact and Privacy Policy agreement is required.' });
    }

    // Rate limiting: 6 submissions per IP per 10 mins, 3 submissions per mobile number per hour
    if (isRateLimited(clientIp, ipRateLimits, 6, 10 * 60 * 1000)) {
      return res.status(429).json({ error: 'Too many requests. Please wait a few moments before trying again.' });
    }
    if (isRateLimited(cleanMobile, mobileRateLimits, 3, 60 * 60 * 1000)) {
      return res.status(429).json({ error: 'This mobile number was recently registered. You may proceed.' });
    }

    const leadId = 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const nowIso = new Date().toISOString();
    const istTime = getIstTimestamp();

    const storedLead: StoredLead = {
      id: leadId,
      name: trimmedName,
      mobile: cleanMobile,
      createdAt: nowIso,
      istTimestamp: istTime,
      sourcePage: sourcePage || 'Homepage Entry Gate',
      consent: true,
      consentTimestamp: nowIso,
      whatsappStatus: 'pending',
      whatsappRetries: 0,
      contacted: false,
      ipAddress: clientIp,
    };

    Storage.addLead(storedLead);

    // Dispatch background WhatsApp notification to owner (+91 87904 55491)
    // Non-blocking, visitor never sees the owner number or any API result
    dispatchLeadNotification(storedLead);

    // Set cookie to remember user
    res.cookie('ud_gate_cleared', '1', {
      maxAge: 90 * 24 * 60 * 60 * 1000,
      path: '/',
      sameSite: 'lax',
      httpOnly: false,
    });

    return res.json({
      success: true,
      name: trimmedName,
      message: `Welcome, ${trimmedName}`,
    });
  } catch (err: any) {
    console.error('[Lead Gate Error]', err);
    // Graceful entry fallback: do not block visitor access on unexpected server error
    return res.json({ success: true, name: 'Guest' });
  }
});

// DPDP Act 2023: Right to erasure / data deletion request
app.post('/api/lead/delete-request', (req: Request, res: Response) => {
  const { mobile } = req.body;
  const cleanMobile = typeof mobile === 'string' ? mobile.replace(/\D/g, '').slice(-10) : '';
  if (!cleanMobile) {
    return res.status(400).json({ error: 'Valid mobile number required' });
  }
  const deleted = Storage.deleteLeadByMobile(cleanMobile);
  return res.json({
    success: true,
    message: deleted
      ? `Data associated with +91 ${cleanMobile} has been permanently purged from records in compliance with DPDP Act 2023.`
      : `No records found for +91 ${cleanMobile}.`,
  });
});

// 3. Consultation / Site Visit Enquiry (POST /api/enquiry)
app.post('/api/enquiry', async (req: Request, res: Response) => {
  try {
    const { name, mobile, email, serviceId, serviceTitle, projectType, builtUpArea, message, preferredDate, preferredTimeSlot, estimateSnapshot } = req.body;

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const cleanMobile = typeof mobile === 'string' ? mobile.replace(/\D/g, '').slice(-10) : '';

    if (!trimmedName || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({ error: 'Valid name and 10-digit mobile number required.' });
    }

    const enquiryId = 'enq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const enquiry: StoredEnquiry = {
      id: enquiryId,
      name: trimmedName,
      mobile: cleanMobile,
      email: typeof email === 'string' ? email.trim() : undefined,
      serviceId,
      serviceTitle,
      projectType,
      builtUpArea,
      message: typeof message === 'string' ? message.trim() : undefined,
      preferredDate,
      preferredTimeSlot,
      estimateSnapshot,
      createdAt: new Date().toISOString(),
      istTimestamp: getIstTimestamp(),
      status: 'new',
    };

    Storage.addEnquiry(enquiry);
    dispatchEnquiryNotification(enquiry);

    return res.json({
      success: true,
      id: enquiryId,
      message: 'Thank you! Your architectural consultation request has been booked. Our engineering team will call you shortly.',
    });
  } catch (err: any) {
    console.error('[Enquiry Error]', err);
    return res.status(500).json({ error: 'Could not process enquiry at this time.' });
  }
});

// 4. Natural Language Service Search (POST /api/search)
app.post('/api/search', async (req: Request, res: Response) => {
  try {
    const query = typeof req.body.query === 'string' ? req.body.query.trim().toLowerCase() : '';
    if (!query) {
      return res.json({ matched: true, results: ARCHITECTURE_SERVICES.slice(0, 4) });
    }

    // Exact or keyword match check
    const matches: ArchitectureService[] = [];
    const queryTokens = query.split(/\s+/).filter(Boolean);

    for (const service of ARCHITECTURE_SERVICES) {
      const titleLower = service.title.toLowerCase();
      const descLower = service.shortDescription.toLowerCase();
      const catLower = service.category.toLowerCase();
      const keywords = service.keywords.map((k) => k.toLowerCase());

      const fullText = `${titleLower} ${descLower} ${catLower} ${keywords.join(' ')}`;

      // Direct match
      if (fullText.includes(query)) {
        matches.push(service);
        continue;
      }

      // Token overlap
      const tokenMatch = queryTokens.some((token: string) => fullText.includes(token));
      if (tokenMatch) {
        matches.push(service);
      }
    }

    // Record analytics
    const hasMatch = matches.length > 0;
    Storage.recordSearch(query, hasMatch);

    if (hasMatch) {
      return res.json({
        matched: true,
        query,
        count: matches.length,
        results: matches,
      });
    }

    // Check Gemini API fallback for natural language architectural query mapping
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const serviceIndex = ARCHITECTURE_SERVICES.map((s) => ({ id: s.id, title: s.title, keywords: s.keywords }));

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `The user typed this search query on an architectural firm's website: "${query}".
Available services: ${JSON.stringify(serviceIndex)}
Determine if this query maps to any of the listed services (including Telugu/Hindi terms or synonyms).
Only choose service IDs from the provided list. If unrelated or not offered (e.g. car repair, cryptocurrency, medicine, legal divorce), respond with an empty list.
Return strictly valid JSON in this format:
{"matchedIds": ["id1", "id2"]}`,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (Array.isArray(parsed.matchedIds) && parsed.matchedIds.length > 0) {
            const aiMatched = ARCHITECTURE_SERVICES.filter((s) => parsed.matchedIds.includes(s.id));
            if (aiMatched.length > 0) {
              return res.json({
                matched: true,
                query,
                count: aiMatched.length,
                results: aiMatched,
              });
            }
          }
        }
      } catch (aiErr) {
        console.warn('[Search AI Fallback Notice]', aiErr);
      }
    }

    // NO MATCH: Return structured polite message and top 3 closest alternative services
    const closestAlternatives = ARCHITECTURE_SERVICES.slice(0, 3);
    return res.json({
      matched: false,
      query,
      message: `Sorry, we do not currently offer "${query}". As a dedicated architectural and structural consultancy, our core expertise is outlined below.`,
      alternatives: closestAlternatives,
      talkToTeam: {
        phone: '087904 55491',
        phoneInternational: '+91 87904 55491',
        whatsappUrl: 'https://wa.me/918790455491?text=Hello%20Ultimate%20Design%2C%20I%20had%20an%20enquiry%20regarding%20architectural%20services.',
      },
    });
  } catch (err: any) {
    console.error('[Search Error]', err);
    return res.status(500).json({ error: 'Search service unavailable.' });
  }
});

// 5. Cost Estimator Calculation (POST /api/estimate)
app.post('/api/estimate', (req: Request, res: Response) => {
  try {
    const input: EstimateInput = {
      projectType: req.body.projectType || 'independent_house',
      quality: req.body.quality || 'premium',
      builtUpAreaSqFt: Number(req.body.builtUpAreaSqFt) || 2000,
      floors: Number(req.body.floors) || 2,
      zone: req.body.zone || 'hyderabad_central',
      budgetInr: req.body.budgetInr ? Number(req.body.budgetInr) : undefined,
    };

    const estimate = calculateProjectEstimate(input);
    return res.json(estimate);
  } catch (err: any) {
    console.error('[Estimate Calculation Error]', err);
    return res.status(400).json({ error: 'Failed to calculate estimate.' });
  }
});

// 6. Architectural Planner Chat Advisor (POST /api/chat-advisor)
app.post('/api/chat-advisor', async (req: Request, res: Response) => {
  try {
    const { messages, currentRequirements } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Conversation history required' });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Guard against prompt injection & length cap
    if (typeof lastUserMessage !== 'string' || lastUserMessage.length > 500) {
      return res.status(400).json({ error: 'Message exceeds maximum allowable length (500 chars).' });
    }

    // Safety guard against injection
    const injectionPatterns = [/ignore previous instructions/i, /system prompt/i, /jailbreak/i, /forget rules/i, /you are now/i];
    if (injectionPatterns.some((pattern) => pattern.test(lastUserMessage))) {
      return res.json({
        reply: 'As the architectural consultant for Ultimate Design and Consultant, I specialize exclusively in architectural design, structural engineering, and construction planning in Hyderabad. How can I assist with your project scope or dimensions?',
        updatedRequirements: currentRequirements || {},
      });
    }

    // Check if user is asking for calculation or conversational advice
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are the lead architectural consultant for "Ultimate Design and Consultant", an elite architecture and civil engineering studio located in Gudimalkapur, Hyderabad (Google rating 4.9/5).
Strict Operating Rules:
1. Stay strictly on topics of architectural design, civil engineering, Vastu Shastra, municipal approvals (GHMC/HMDA/TS-bPASS), and Hyderabad construction.
2. Politely refuse unrelated questions (coding, medicine, legal, politics, etc.).
3. Guide the client step-by-step through discovering their project:
   - Project type (Independent House, Luxury Villa, Duplex, Commercial, Apartment Interior, Renovation)
   - Location/locality in Hyderabad or Telangana
   - Plot dimensions or built-up area in square feet
   - Floors (G+1, G+2, etc.) and bedroom requirements
   - Preferred style (Contemporary Minimalist, Modern Luxury, Classical Vastu)
   - Quality grade (Standard, Premium, Luxury)
   - Tentative budget if known
4. NEVER invent fake cost rates or total rupees yourself! Always remind them that calculations use the studio's verified Hyderabad benchmark engine (₹1,850 - ₹4,100/sq.ft for civil structure, ₹35 - ₹65/sq.ft for architectural consultancy).
5. Extract any mentioned project parameters into the JSON block.

Respond in warm, quiet luxury tone with concise professional guidance (max 2-3 short paragraphs).
At the end of your response, output a JSON block wrapped in triple backticks:
\`\`\`json
{
  "projectType": "independent_house" | "villa" | "duplex" | "commercial" | "apartment_interior" | "renovation" | null,
  "builtUpAreaSqFt": number | null,
  "quality": "standard" | "premium" | "luxury" | null,
  "floors": number | null,
  "bedrooms": number | null,
  "location": string | null,
  "isReadyForEstimate": boolean
}
\`\`\``;

        const conversationContext = messages
          .slice(-6)
          .map((m: any) => `${m.role === 'user' ? 'Client' : 'Architect'}: ${m.content}`)
          .join('\n');

        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemInstruction}\n\nConversation so far:\n${conversationContext}\n\nCurrent extracted requirements: ${JSON.stringify(currentRequirements || {})}\n\nClient's latest message: "${lastUserMessage}"`,
        });

        const rawText = result.text || '';
        let reply = rawText;
        let extractedReqs = currentRequirements || {};

        // Parse JSON block if present
        const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          try {
            const parsed = JSON.parse(jsonMatch[1]);
            extractedReqs = { ...extractedReqs, ...parsed };
            reply = rawText.replace(/```json[\s\S]*?```/, '').trim();
          } catch {
            // Keep reply as is
          }
        }

        Storage.recordBotCompletion();

        return res.json({
          reply,
          updatedRequirements: extractedReqs,
        });
      } catch (aiErr) {
        console.warn('[Gemini Chat Error]', aiErr);
      }
    }

    // Deterministic rule-based fallback if Gemini is offline
    let extracted = { ...(currentRequirements || {}) };
    let reply = '';

    const lower = lastUserMessage.toLowerCase();
    if (lower.includes('villa')) extracted.projectType = 'villa';
    else if (lower.includes('commercial') || lower.includes('office')) extracted.projectType = 'commercial';
    else if (lower.includes('interior')) extracted.projectType = 'apartment_interior';
    else if (lower.includes('renovat')) extracted.projectType = 'renovation';
    else if (lower.includes('house') || lower.includes('ghar') || lower.includes('kothi')) extracted.projectType = 'independent_house';

    const areaMatch = lower.match(/(\d{3,5})\s*(sq\s*ft|sqft|sft|square\s*feet)?/);
    if (areaMatch) {
      extracted.builtUpAreaSqFt = parseInt(areaMatch[1], 10);
    }

    if (lower.includes('luxury')) extracted.quality = 'luxury';
    else if (lower.includes('premium')) extracted.quality = 'premium';
    else if (lower.includes('basic') || lower.includes('standard')) extracted.quality = 'standard';

    if (!extracted.projectType) {
      reply = 'Welcome to Ultimate Design and Consultant. To begin structuring your project plan, could you tell us your project type? We specialize in Independent Residences, Luxury Villas, Commercial Studios, Interiors, and Structural Renovations.';
    } else if (!extracted.builtUpAreaSqFt) {
      reply = `Understood, planning for a ${extracted.projectType.replace('_', ' ')}. What is your estimated built-up area or plot size in square feet (e.g., 2,400 sq.ft)?`;
    } else {
      reply = `We have registered your scope: ${extracted.builtUpAreaSqFt} sq.ft for a ${extracted.projectType.replace('_', ' ')}. You can now view the itemized Hyderabad rate table and material breakdown below, or schedule an in-person site consultation.`;
      extracted.isReadyForEstimate = true;
    }

    return res.json({
      reply,
      updatedRequirements: extracted,
    });
  } catch (err: any) {
    console.error('[Chat Advisor Error]', err);
    return res.status(500).json({ error: 'Chat service temporarily unavailable.' });
  }
});

// 7. Rate Table Access & Management (GET & PUT /api/rate-table)
app.get('/api/rate-table', (req: Request, res: Response) => {
  res.json(Storage.getRateTable());
});

app.put('/api/rate-table', requireAdmin, (req: Request, res: Response) => {
  try {
    const updatedRates = req.body;
    if (!updatedRates || !updatedRates.baseRatePerSqFt) {
      return res.status(400).json({ error: 'Invalid rate table format' });
    }
    updatedRates.lastUpdated = new Date().toISOString().split('T')[0];
    Storage.saveRateTable(updatedRates);
    return res.json({ success: true, rates: updatedRates });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update rates.' });
  }
});

app.post('/api/rate-table/reset', requireAdmin, (req: Request, res: Response) => {
  const defaults = Storage.resetRateTable();
  return res.json({ success: true, rates: defaults });
});

// 8. Admin Authentication
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      user: { role: 'admin', name: 'Principal Architect' },
    });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

app.get('/api/admin/me', requireAdmin, (req: Request, res: Response) => {
  res.json({ authenticated: true, role: 'admin', studio: 'Ultimate Design and Consultant' });
});

// 9. Admin Leads and Enquiries Management
app.get('/api/leads', requireAdmin, (req: Request, res: Response) => {
  const leads = Storage.getLeads();
  res.json(leads);
});

app.post('/api/leads/:id/contacted', requireAdmin, (req: Request, res: Response) => {
  const { contacted, notes } = req.body;
  const updated = Storage.updateLead(req.params.id, {
    contacted: Boolean(contacted),
    notes: typeof notes === 'string' ? notes : undefined,
  });
  if (!updated) return res.status(404).json({ error: 'Lead not found' });
  res.json(updated);
});

app.post('/api/leads/:id/retry-whatsapp', requireAdmin, async (req: Request, res: Response) => {
  const leads = Storage.getLeads();
  const lead = leads.find((l) => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  await dispatchLeadNotification(lead);
  res.json({ success: true, message: 'WhatsApp dispatch triggered in background.' });
});

app.get('/api/enquiries', requireAdmin, (req: Request, res: Response) => {
  const enquiries = Storage.getEnquiries();
  res.json(enquiries);
});

app.post('/api/enquiries/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status, notes } = req.body;
  const updated = Storage.updateEnquiry(req.params.id, {
    status,
    notes: typeof notes === 'string' ? notes : undefined,
  });
  if (!updated) return res.status(404).json({ error: 'Enquiry not found' });
  res.json(updated);
});

app.get('/api/analytics', requireAdmin, (req: Request, res: Response) => {
  res.json(Storage.getAnalytics());
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.info(`[Ultimate Design] Architecture Studio running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Startup Error]', err);
});
