# Client Supply Checklist: Ultimate Design and Consultant

Before taking this production application live on your primary custom domain, the client leadership must review and supply the items listed below:

---

### 1. Statutory Credentials & Numbers
- [ ] **Council of Architecture Registration Number:** Replace `{{COUNCIL_OF_ARCH_REG_NO}}` in `src/config/company.ts` with your official COA registration number (e.g. `CA/20XX/XXXXX`).
- [ ] **GHMC / HMDA Empanelment Licence:** Replace `{{GHMC_EMPANELMENT_NO}}` in `src/config/company.ts` with your municipal engineer license code.
- [ ] **Founding Year & Metrics:** Provide exact values for `{{YEARS_IN_BUSINESS}}`, `{{PROJECTS_COMPLETED}}`, and `{{SQFT_DELIVERED}}`.

### 2. Branding Assets & Typography
- [ ] **Official Logo & Wordmark:** Vector SVG or high-resolution PNG of the studio's official mark to replace the procedural compass emblem.
- [ ] **Official Email Address:** Replace `contact@ultimatedesign.in` with your verified Google Workspace or corporate email inbox.
- [ ] **Social Media Links:** Provide official Instagram, LinkedIn, and Houzz profile URLs.

### 3. Media & Photography
- [ ] **Real Portfolio Project Photos:** Replace the representative concept assets with high-resolution photography of completed residential, commercial, and interior projects in Hyderabad.
- [ ] **Before & After Photos:** Provide real photographs of structural renovations and remodeling projects.
- [ ] **CAD & 3D Walkthrough Renders:** Supply actual 3D models and elevation drawings.

### 4. Client Testimonials
- [ ] **Reviewer Name Consent:** Verify that Shah Maqdoom, Syed Jawwad, and Mohammad Tanveer are comfortable with their names appearing on the public website, or obtain written permission for additional client case studies.

### 5. API Keys & Production Services
- [ ] **Meta WhatsApp Business Cloud API:**
  - Create a Meta Business Manager account.
  - Set up a WhatsApp Business Phone Number ID.
  - Generate a permanent System User Access Token and set `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` in `.env`.
  - Create and get Meta approval for the `lead_notification` message template.
- [ ] **Google Cloud Platform (Optional Maps Key):**
  - If you wish to use the Google Maps JavaScript API with a custom dark/warm style, create an API key in Google Cloud Console, restrict it by HTTP Referrer, and set `VITE_GOOGLE_MAPS_KEY`.
  - The application automatically falls back to an interactive Leaflet + OpenStreetMap engine if no key is configured.
- [ ] **Legal Review:**
  - Have your legal counsel review the Privacy Policy in `src/components/PrivacyPolicyModal.tsx` for alignment with your specific corporate entity structure under India's Digital Personal Data Protection Act, 2023.
