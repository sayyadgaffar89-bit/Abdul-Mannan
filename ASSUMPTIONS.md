# Architectural System Assumptions: Ultimate Design and Consultant

This document details every design, business, and algorithmic assumption made in constructing the web application for **Ultimate Design and Consultant** where details were not explicitly supplied in the client brief.

---

### 1. Business & Geo Location Defaults
- **Geographic Centroid:** The studio address is *Flat No. 2, Second Floor, near M.S. Junior College, Santosh Nagar, Gudimalkapur, Hyderabad, Telangana 500006*. The precise coordinates are mapped to **Latitude: 17.3820, Longitude: 78.4342** (Plus Code: `9CVQ+5P Hyderabad, Telangana`).
- **Studio Hours:** The Google listing states *"Open daily, closes 8 pm"*. We assumed daily operating hours from **09:30 AM to 08:00 PM** (Monday through Saturday) and **10:00 AM to 08:00 PM** (Sunday).
- **Inclusivity Marker:** Displayed tastefullly as *"LGBTQ+ friendly space & practice"* in the footer and contact sections as confirmed by Google Maps attributes.
- **Review Basis:** Uses strictly the three real Google reviews provided (Shah Maqdoom, Syed Jawwad, Mohammad Tanveer) with a verified 4.9 rating from 11 reviews. No fictitious reviews were generated.

---

### 2. Hyderabad Construction & Architectural Rate Master Table
- **Pricing Benchmark:** All calculations use server-side TypeScript code grounded in average Hyderabad market rates (October 2026 indices):
  - **Standard Specification:** ₹1,850 to ₹2,150 per sq.ft (vitrified tiles, standard UPVC glazing, ISI standard wiring and CPVC plumbing).
  - **Premium Specification:** ₹2,350 to ₹2,850 per sq.ft (teak main frame, natural granite/stone flooring, Jaquar/Kohler diverters).
  - **Luxury Specification:** ₹3,100 to ₹4,100 per sq.ft (imported Italian marble, high-end double glazed facades, smart automation conduit infrastructure).
  - **Architectural & Structural Consultancy:** ₹35 to ₹65 per sq.ft.
- **Trade Cost Breakdown Allocations:**
  - RCC Substructure & Framing: 32%
  - Masonry & Internal Plaster: 12%
  - Flooring, Marble & Tiling: 10%
  - Doors, Windows & Glazing: 9%
  - Concealed Electrical Conduits & Wiring: 8%
  - Finishes, Acrylic Painting & False Ceiling: 8%
  - Plumbing, Water Drainage & Sanitaryware: 7%
  - Architectural & Structural Consultancy: 4%
  - Municipal & TS-bPASS Approvals: 3%
  - Unforeseen Site Contingency Buffer: 7%
- **Material Approximations per 1,000 sq.ft built-up area:**
  - Cement: ~420 to 460 bags (50kg OPC 53 / PPC grade)
  - TMT Rebar (Fe 550D): ~3,700 to 4,200 kg
  - Red clay bricks / AAC blocks: ~17,500 to 18,500 units
  - M-Sand / River Sand: ~1,900 to 2,100 cubic feet
  - Coarse Aggregate: ~1,250 to 1,400 cubic feet
  - Flooring tiles / stone: ~1,150 to 1,250 sq.ft (with 15% cutting allowance)
  - Architectural Paint: ~170 to 220 litres

---

### 3. Entry Gate & WhatsApp Cloud API
- **Background Dispatch:** On submission of the entry gate (`POST /api/lead`), details are transmitted directly to the owner's WhatsApp number (`+91 87904 55491`). The visitor never sees the owner's number, a `wa.me` URL, or API tokens.
- **Fail-Safe Resilience:** If Meta credentials are unconfigured in development or if Meta returns an error, the background task logs the simulation and retries up to 3 times with exponential backoff, without blocking the visitor's immediate welcome experience.
- **Storage & DPDP Compliance:** Leads are stored in a persistent server-side store with timestamp, consent flag, and IP address. A dedicated Data Erasure endpoint (`POST /api/lead/delete-request`) allows visitors to purge their data on demand in accordance with India's DPDP Act 2023.

---

### 4. Search Engine Matching Architecture
- **Natural Language + Synonyms:** Services are mapped to multilingual synonyms and Telugu/Hindi transliterations (`ghar`, `nakshaa`, `vastu`, `patta`, `elevation`, `sanction`, `boq`).
- **No-Match Discipline:** When a user queries a service the firm does not provide (e.g. car detailing or pharmaceuticals), the engine displays a courteous *"Service Not Offered"* banner alongside the top 3 closest architectural alternatives, and never hallucinates an unprovided capability.
