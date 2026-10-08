/**
 * WhatsApp Business Cloud API Integration (Meta Graph API)
 * Dispatches background notification to owner's WhatsApp number (+91 87904 55491).
 * Never exposes credentials or recipient numbers to client or user.
 */

import { Storage, StoredLead } from './storage.ts';

interface SendWhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
  status: 'sent' | 'simulated_sent' | 'failed';
}

export async function dispatchLeadNotification(lead: StoredLead): Promise<void> {
  // Run asynchronously without blocking the lead response
  setImmediate(async () => {
    let retries = 0;
    const maxRetries = 3;
    let success = false;
    let lastError = '';
    let finalStatus: 'sent' | 'simulated_sent' | 'failed' = 'failed';

    const token = process.env.WHATSAPP_TOKEN?.trim();
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
    const ownerNumber = (process.env.OWNER_WHATSAPP_NUMBER || '918790455491').replace(/\D/g, '');
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME || 'lead_notification';

    // Notification text content
    const messageBody = `🏛️ *New Website Lead Captured*\n*Studio:* Ultimate Design and Consultant\n*Visitor Name:* ${lead.name}\n*Mobile:* +91 ${lead.mobile}\n*Source:* ${lead.sourcePage || 'Homepage Entry Gate'}\n*Time (IST):* ${lead.istTimestamp}\n*Consent:* DPDP 2023 Compliant`;

    while (retries < maxRetries && !success) {
      try {
        if (!token || token.includes('your_meta') || !phoneNumberId || phoneNumberId.includes('your_meta')) {
          // Graceful simulated delivery mode for development / unconfigured environments
          // Log realistic delivery details securely on server-side
          console.info(`[WhatsApp Service] (Dev Simulation) Meta credentials not configured. Simulating delivery to +${ownerNumber}:`);
          console.info(`[WhatsApp Service] >> "${messageBody.replace(/\n/g, ' ')}"`);
          finalStatus = 'simulated_sent';
          success = true;
          break;
        }

        // Live Meta Cloud API call
        const response = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: ownerNumber,
            type: 'text',
            text: {
              preview_url: false,
              body: messageBody,
            },
          }),
        });

        const data = await response.json();

        if (response.ok && data.messages && data.messages.length > 0) {
          finalStatus = 'sent';
          success = true;
          console.info(`[WhatsApp Service] Dispatched notification successfully for lead ${lead.id}. Message ID: ${data.messages[0].id}`);
          break;
        } else {
          lastError = data.error?.message || `HTTP ${response.status}: ${JSON.stringify(data)}`;
          console.warn(`[WhatsApp Service] Attempt ${retries + 1} failed: ${lastError}`);
        }
      } catch (err: any) {
        lastError = err?.message || 'Network dispatch error';
        console.warn(`[WhatsApp Service] Exception on attempt ${retries + 1}: ${lastError}`);
      }

      retries++;
      if (retries < maxRetries && !success) {
        // Exponential backoff: 1s, 2s, 4s
        const backoffMs = Math.pow(2, retries) * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }

    // Update lead record with final status
    Storage.updateLead(lead.id, {
      whatsappStatus: success ? finalStatus : 'failed',
      whatsappRetries: retries,
      whatsappError: success ? undefined : lastError,
    });
  });
}

export async function dispatchEnquiryNotification(enquiry: any): Promise<void> {
  setImmediate(async () => {
    const ownerNumber = (process.env.OWNER_WHATSAPP_NUMBER || '918790455491').replace(/\D/g, '');
    const token = process.env.WHATSAPP_TOKEN?.trim();
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();

    const summary = `📐 *New Architectural Enquiry / Site Visit Request*\n*Name:* ${enquiry.name}\n*Mobile:* +91 ${enquiry.mobile}\n*Email:* ${enquiry.email || 'N/A'}\n*Service:* ${enquiry.serviceTitle || 'General Consultation'}\n*Preferred Slot:* ${enquiry.preferredDate || 'Earliest'} (${enquiry.preferredTimeSlot || 'Standard Hours'})\n*Note:* ${enquiry.message || 'No additional note'}\n*Time (IST):* ${enquiry.istTimestamp}`;

    if (!token || token.includes('your_meta') || !phoneNumberId || phoneNumberId.includes('your_meta')) {
      console.info(`[WhatsApp Service] (Dev Simulation) Enquiry notification to +${ownerNumber}:\n${summary}`);
      return;
    }

    try {
      await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: ownerNumber,
          type: 'text',
          text: {
            preview_url: false,
            body: summary,
          },
        }),
      });
    } catch (err) {
      console.error('[WhatsApp Service] Failed to send enquiry notification:', err);
    }
  });
}
