export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Services' | 'Approvals & Permits' | 'Pricing & Process' | 'Vastu';
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Services',
    question: 'Where is your studio located and which areas of Hyderabad do you serve?',
    answer: 'Our studio is located at Flat No. 2, Second Floor, near M.S. Junior College, Santosh Nagar, Gudimalkapur, Hyderabad (Telangana 500006). We handle residential, commercial, and interior architecture across Greater Hyderabad—including Gudimalkapur, Mehdipatnam, Banjara Hills, Jubilee Hills, Attapur, Tolichowki, Gachibowli, Financial District, and surrounding Telangana districts.',
  },
  {
    id: 'faq-2',
    category: 'Pricing & Process',
    question: 'What is the difference between architectural consultancy and turnkey construction?',
    answer: 'Under architectural and engineering consultancy, we provide complete creative concept layouts, structural drawings, 3D visualizations, municipal approvals, and periodic site quality supervision, allowing you to hire your preferred contractor while we protect your design fidelity and budget. On select projects, we also provide project management and contractor liaison.',
  },
  {
    id: 'faq-3',
    category: 'Approvals & Permits',
    question: 'Do you help with GHMC, HMDA, and TS-bPASS building permissions?',
    answer: 'Yes. We prepare full statutory architectural sanction drawings compliant with Hyderabad building bye-laws, calculate floor area ratios (FAR/FSI), setback distances, parking mandates, and assist with TS-bPASS submission documentation.',
  },
  {
    id: 'faq-4',
    category: 'Vastu',
    question: 'Can you design a modern, minimalist home while strictly following Vastu Shastra?',
    answer: 'Absolutely. We specialize in scientific Vastu compliance that works with contemporary aesthetics—utilizing open courtyards, large glass apertures, and double-height living areas while strictly honoring sacred spatial orientation for master bedrooms (South-West), kitchen (South-East), and main entrance (North-East).',
  },
  {
    id: 'faq-5',
    category: 'Pricing & Process',
    question: 'How do you calculate architectural fees and estimate construction costs?',
    answer: 'Architectural and structural consultancy fees are typically structured on a transparent per-square-foot basis or lump-sum stage milestones. For construction budgets, we prepare a detailed Bill of Quantities (BOQ) with itemized cement, steel, masonry, and finish specifications anchored to current Hyderabad market indices.',
  },
  {
    id: 'faq-6',
    category: 'Services',
    question: 'What documents should I bring for our initial consultation?',
    answer: 'Helpful items include your plot survey sketch or registration deed (indicating dimensions and road width), photos of the site/existing building, a brief list of requirements (number of bedrooms, floors, special needs), and your tentative project timeline.',
  },
];
