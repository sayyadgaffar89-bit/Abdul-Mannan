export interface InsightArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Approvals & Municipal' | 'Vastu Architecture' | 'Cost Optimization' | 'Material Science';
  excerpt: string;
  content: string[];
  readTime: string;
  date: string;
  author: string;
  image: string;
}

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    id: 'ghmc-hmda-tsbpass-guide',
    slug: 'ghmc-hmda-tsbpass-guide',
    title: 'Navigating TS-bPASS & GHMC Building Sanctions in Hyderabad: 2026 Architect’s Guide',
    category: 'Approvals & Municipal',
    excerpt: 'Key setback rules, FAR computations, and essential documentation needed for hassle-free building permissions in Hyderabad.',
    content: [
      'Securing municipal sanction in Hyderabad underwent a major transformation with the Telangana State Building Permission and Self-Certification System (TS-bPASS). Understanding the zoning regulations is crucial before pouring concrete.',
      'For plots up to 75 square yards (ground floor or ground + 1), registration is instantaneous without fee. For residential plots between 75 and 500 square meters with height up to 10 meters, online self-certification applies under standard setback parameters.',
      'For plots above 500 square meters or heights exceeding 10 meters, full scrutiny clearance from GHMC or HMDA is mandatory. Key requirements include ownership title deed chain, encumbrance certificate (EC) for 30 years, approved layout copy, and Geo-referenced Auto-DCR architectural drawings.',
      'Our studio coordinates the entire TS-bPASS drawing package, ensuring setback geometry, parking circulation radii, and rainwater harvesting pits comply with Hyderabad Revised Master Plan norms to prevent rejection or delays.'
    ],
    readTime: '6 min read',
    date: 'February 2026',
    author: 'Principal Architect & Statutory Consultant',
    image: '/src/assets/images/sketch_to_structure_1791451751179.jpg',
  },
  {
    id: 'scientific-vastu-for-modern-villas',
    slug: 'scientific-vastu-for-modern-villas',
    title: 'Scientific Vastu Shastra in Contemporary Luxury Architecture',
    category: 'Vastu Architecture',
    excerpt: 'How to harmonize cosmic orientations with open-plan layouts, double-height volumes, and floor-to-ceiling glass.',
    content: [
      'Many homeowners believe Vastu compliance requires boxy, dated, compartmentalized room arrangements. In reality, classical Vastu Shastra is fundamentally an ancient science of solar trajectory, geomagnetic lines, and prevailing winds.',
      'The Ishanya (North-East) quadrant corresponds to the morning ultraviolet spectrum, requiring openness, light structures, water features, or meditation zones. Placing the entrance or living foyer here floods the residence with gentle morning light.',
      'The Nairuthi (South-West) quadrant absorbs heavy infrared heat in the afternoon. Anchoring the master bedroom suite and heavier structural masonry in this zone creates thermal ballast and stability.',
      'By calculating the Vastu Purusha Mandala alongside modern structural grids, we craft homes that feel expansive, naturally ventilated, and deeply serene without sacrificing modern luxury.'
    ],
    readTime: '5 min read',
    date: 'January 2026',
    author: 'Principal Architect',
    image: '/src/assets/images/hero_luxury_villa_1791451715925.jpg',
  },
  {
    id: 'reducing-construction-cost-without-cutting-corners',
    slug: 'reducing-construction-cost-without-cutting-corners',
    title: '5 Strategic Ways to Optimize Construction Costs in Hyderabad',
    category: 'Cost Optimization',
    excerpt: 'Where to economize and where never to cut corners during structural execution and interior finishing.',
    content: [
      'Construction cost escalations in Hyderabad often stem from lack of early structural planning and last-minute on-site revisions rather than material price inflation.',
      '1. Optimize structural grids: Slabs with regular column spacing reduce steel rebar tonnage by up to 14% compared to erratic, offset spans.',
      '2. Adopt AAC lightweight blocks over heavy clay bricks: They reduce dead loads on foundation beams and offer superior thermal insulation during harsh Hyderabad summers, cutting AC power bills.',
      '3. Demand a comprehensive BOQ before awarding contracts: Clear itemized quantities prevent arbitrary contractor extra-item claims during mid-construction.',
      '4. Invest in proper waterproofing and soil compaction: Never skimp on substructure waterproofing—remedial repairs cost 10x more once marble floors are laid.'
    ],
    readTime: '7 min read',
    date: 'March 2026',
    author: 'Civil & Structural Consultancy Team',
    image: '/src/assets/images/project_commercial_hub_1791451788743.jpg',
  },
];
