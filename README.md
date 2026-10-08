# Ultimate Design and Consultant — Premium Architecture Web Application

A production-ready luxury architectural and civil engineering website for **Ultimate Design and Consultant**, located in Gudimalkapur, Hyderabad.

---

## 🏛️ Business Overview
- **Name:** Ultimate Design and Consultant
- **Category:** Architectural designer (Google Maps Category)
- **Studio Address:** Flat No. 2, Second Floor, near M.S. Junior College, Santosh Nagar, Gudimalkapur, Hyderabad, Telangana 500006
- **Plus Code:** `9CVQ+5P Hyderabad, Telangana`
- **Phone:** `087904 55491` (+91 87904 55491)
- **Google Rating:** 4.9 from 11 verified reviews
- **Hours:** Open daily, closes 8:00 PM

---

## ⚡ Core Capabilities & Features Built

1. **Mandatory Entry Login Gate (Name + Mobile):**
   - Full-screen split-layout luxury modal shown on first visit before any content is accessible.
   - Strictly validates 10-digit Indian mobile numbers (`^[6-9]\d{9}$`) and full names.
   - Built-in honeypot spam protection and rate limiting per IP and mobile.
   - Automatically and silently transmits incoming leads to the studio owner's WhatsApp number (`+91 87904 55491`) using the Meta WhatsApp Cloud API in the background. The user never sees the destination number or API token.
   - Remembers cleared visitors via cookies and local storage.
   - DPDP Act 2023 compliance with data erasure request form.

2. **Natural Language Service Search Engine:**
   - Prominent search bar on the homepage hero and navigation bar.
   - Matches across 15 architectural and civil engineering services with typo tolerance, Telugu/Hindi transliterations (`ghar`, `nakshaa`, `vastu`, `patta`, `boq`), and AI fallback.
   - When a service is not offered, gracefully presents the 3 closest alternatives and direct consultation triggers.

3. **Project Cost & Requirements Planner (Chatbot & Full-Page Estimator):**
   - Floating chat advisor and dedicated full-page calculator.
   - **Math is performed in server-side TypeScript** based on verified Hyderabad rates (October 2026).
   - Generates realistic INR cost ranges, trade breakdowns, material quantities (cement bags, steel kg, bricks, sand), and timeline phases.
   - Generates and downloads branded architectural PDF estimates.

4. **Real Map with Real Turn-by-Turn Directions:**
   - Interactive Leaflet cartography mapped to the exact coordinates in Santosh Nagar, Gudimalkapur (`17.3820, 78.4342`).
   - One-click "Get Directions" uses the browser location to draw the real route and compute distance and travel time across car, bike, and walking modes.
   - Includes "Open in Google Maps", "Copy Address", and "Share Location" utilities.

5. **Storytelling & Motion Sequences:**
   - "From Sketch to Structure" 4-phase interactive sequence.
   - Before/After interactive comparison slider for structural remodeling.
   - Custom desktop architectural cursor and top scroll progress indicator.

6. **Password-Protected Studio Admin Console (`/admin`):**
   - View captured leads with time, mobile, and WhatsApp status.
   - Filter and search leads, toggle "Contacted" status, and export to CSV.
   - Live editable Hyderabad construction rate table with reset to defaults.
   - Search telemetry and chatbot completion analytics.

---

## 🛠️ Environment Variables (`.env`)

```env
# AI Studio Gemini Key
GEMINI_API_KEY="your_api_key"

# Application URL
APP_URL="https://your-domain.com"

# WhatsApp Business Cloud API (Meta Graph API)
WHATSAPP_TOKEN="your_meta_system_user_access_token"
WHATSAPP_PHONE_NUMBER_ID="your_meta_phone_number_id"
OWNER_WHATSAPP_NUMBER="918790455491"
WHATSAPP_TEMPLATE_NAME="lead_notification"

# Google Maps Platform (Optional: falls back to Leaflet if not supplied)
VITE_GOOGLE_MAPS_KEY=""

# Admin Console Password
ADMIN_PASSWORD="architect_admin_hyderabad_2026"
```

---

## 📲 How to Configure Meta WhatsApp Cloud API

1. Visit [Meta for Developers](https://developers.facebook.com/) and create a **Business App**.
2. Add the **WhatsApp** product to your app.
3. In the WhatsApp API Setup panel:
   - Note down the **Phone Number ID**.
   - Generate a permanent **System User Access Token** with `whatsapp_business_messaging` permissions.
4. Under WhatsApp Manager -> Message Templates, create a utility template named `lead_notification`:
   ```
   New website visitor:
   Name: {{1}}
   Mobile: {{2}}
   Time: {{3}}
   ```
5. Set `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` in your `.env` file.

*Note: In local or unconfigured mode, the server operates in realistic simulation mode, logging dispatches without errors.*

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```
The server runs on `http://localhost:3000`.
