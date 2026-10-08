export interface ArchitectureService {
  id: string;
  slug: string;
  title: string;
  category: 'Architectural' | 'Engineering' | 'Interiors' | 'Statutory & Management';
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  process: string[];
  timeline: string;
  startingPriceRange: string;
  keywords: string[];
  image: string;
  featured?: boolean;
}

export const ARCHITECTURE_SERVICES: ArchitectureService[] = [
  {
    id: 'residential-architecture',
    slug: 'residential-architecture',
    title: 'Residential Architecture',
    category: 'Architectural',
    shortDescription: 'Bespoke independent houses, bungalows, and luxury residences crafted for climatic comfort and enduring elegance.',
    fullDescription: 'Comprehensive custom architectural design for independent homes, multi-generational villas, and contemporary bungalows. We combine spatial harmony, passive solar principles, and Hyderabad site microclimate considerations to craft residences that feel timeless.',
    deliverables: [
      'Site analysis & conceptual massing layouts',
      'Architectural floor plans & dimensional schematics',
      'Detailed exterior elevations & cross-sections',
      'Window & door schedule specifications',
      'Construction working drawing sets'
    ],
    process: [
      'Client brief & lifestyle exploration',
      'Conceptual sketch zoning & 3D study',
      'Refined design iterations & spatial finalization',
      'Comprehensive GFC (Good For Construction) release'
    ],
    timeline: '4 – 8 weeks',
    startingPriceRange: '₹35 – ₹65 per sq ft (Consultancy)',
    keywords: ['residential', 'house design', 'bungalow', 'independent house', 'ghar', 'makaan', 'home plan', 'nakshaa', 'kothi', 'residence'],
    image: '/src/assets/images/hero_luxury_villa_1791451715925.jpg',
    featured: true
  },
  {
    id: 'apartment-villa-design',
    slug: 'apartment-villa-design',
    title: 'Apartment & Gated Villa Design',
    category: 'Architectural',
    shortDescription: 'Multi-unit residential master planning, luxury duplex layouts, and gated villa communities.',
    fullDescription: 'Master planning and architectural design for luxury villa enclaves, floor-by-floor apartment blocks, and stilt+5 residential developments optimized for FSI and lifestyle density.',
    deliverables: [
      'Master enclave zoning & circulation networks',
      'Unit-level floor plans & luxury penthouses',
      'Common amenity and clubhouse layouts',
      'Structural and MEP coordination drawings'
    ],
    process: [
      'Feasibility & FSI/FAR compliance check',
      'Master zoning & modular unit planning',
      'Exterior aesthetic synthesis',
      'Statutory & construction blueprints'
    ],
    timeline: '6 – 12 weeks',
    startingPriceRange: '₹30 – ₹55 per sq ft',
    keywords: ['apartment', 'villa', 'gated community', 'duplex', 'flats', 'builder floor', 'group housing'],
    image: '/src/assets/images/project_residence_jubilee_1791451774514.jpg',
    featured: true
  },
  {
    id: 'interior-design',
    slug: 'interior-design',
    title: 'Architectural Interior Design',
    category: 'Interiors',
    shortDescription: 'Spatial interior architecture, bespoke millwork, curated lighting design, and material palettes.',
    fullDescription: 'Quiet luxury interior design with a focus on tactile authenticity—natural stone, warm timber, acoustic precision, and bespoke lighting compositions for homes, executive suites, and penthouses.',
    deliverables: [
      'Reflected ceiling & ambient lighting layouts',
      'Custom joinery & modular cabinetry details',
      'Material swatch, stone & veneer selections',
      'Complete furniture layout & electrical marking'
    ],
    process: [
      'Aesthetic mood-boarding & spatial review',
      '3D photo-match renders for all primary rooms',
      'Production detailing & vendor coordination',
      'On-site fitout inspection'
    ],
    timeline: '4 – 7 weeks',
    startingPriceRange: '₹40 – ₹90 per sq ft',
    keywords: ['interior design', 'interiors', 'false ceiling', 'modular kitchen', 'furniture', 'decor', 'lighting design', 'room design', 'hall interior'],
    image: '/src/assets/images/project_interior_living_1791451807928.jpg',
    featured: true
  },
  {
    id: 'commercial-office-design',
    slug: 'commercial-office-design',
    title: 'Commercial & Office Design',
    category: 'Architectural',
    shortDescription: 'Modern corporate offices, tech workplaces, co-working spaces, and boutique commercial complexes.',
    fullDescription: 'High-performance workspace architecture that blends human productivity, energetic wellness, acoustic zones, and efficient vertical circulation.',
    deliverables: [
      'Workstation density & zoning optimization',
      'Executive conference room and cabin blueprints',
      'HVAC & MEP route integration plans',
      'Façade architectural identity'
    ],
    process: [
      'Headcount & workflow workflow study',
      'Circulation & egress planning',
      '3D exterior and lobby visualization',
      'Contractor drawing package'
    ],
    timeline: '6 – 10 weeks',
    startingPriceRange: '₹45 – ₹80 per sq ft',
    keywords: ['office', 'commercial', 'workspace', 'corporate building', 'tech office', 'co-working', 'business center', 'showroom'],
    image: '/src/assets/images/project_commercial_hub_1791451788743.jpg',
    featured: true
  },
  {
    id: 'retail-restaurant-design',
    slug: 'retail-restaurant-design',
    title: 'Retail & Restaurant Design',
    category: 'Interiors',
    shortDescription: 'Brand-driven experiential dining spaces, flagship retail boutiques, and upscale cafe venues.',
    fullDescription: 'Atmospheric hospitality design with dramatic lighting, durable luxury material treatments, acoustic control, and seamless kitchen-to-table service circulation.',
    deliverables: [
      'Customer journey & seating layout masterplan',
      'Commercial kitchen MEP coordination',
      'Storefront & signage architectural details',
      'Custom bar and banquet millwork drawings'
    ],
    process: [
      'Concept hospitality narrative',
      '3D experiential lighting simulation',
      'Technical drawings & MEP alignment',
      'Material sourcing oversight'
    ],
    timeline: '4 – 8 weeks',
    startingPriceRange: '₹50 – ₹100 per sq ft',
    keywords: ['retail', 'restaurant', 'cafe', 'boutique', 'bar', 'hotel', 'hospitality', 'storefront', 'food court'],
    image: '/src/assets/images/project_commercial_hub_1791451788743.jpg'
  },
  {
    id: 'renovation-remodeling',
    slug: 'renovation-remodeling',
    title: 'Renovation & Structural Remodeling',
    category: 'Architectural',
    shortDescription: 'Adaptive reuse, structural alterations, layout remodeling, and modern facade revamps for existing buildings.',
    fullDescription: 'Transforming dated buildings into contemporary architectural gems through load-bearing alterations, floor expansions, facade overhauls, and improved daylighting.',
    deliverables: [
      'As-built measurement & condition survey',
      'Structural load assessment & strengthening plan',
      'Modernized layout & daylighting redesign',
      'Demolition vs retention demarcation drawing'
    ],
    process: [
      'Structural audit & condition assessment',
      'Retrofit schematic alternatives',
      'Beam/column reinforcement engineering',
      'Phase-wise execution guidance'
    ],
    timeline: '3 – 6 weeks',
    startingPriceRange: '₹30 – ₹60 per sq ft',
    keywords: ['renovation', 'remodeling', 'redevelopment', 'facade revamp', 'house repair', 'expansion', 'modernize older house', 'old building redesign'],
    image: '/src/assets/images/sketch_to_structure_1791451751179.jpg',
    featured: true
  },
  {
    id: 'landscape-design',
    slug: 'landscape-design',
    title: 'Landscape & Courtyard Architecture',
    category: 'Architectural',
    shortDescription: 'Serene outdoor environments, private courtyard water features, terrace gardens, and drought-hardy flora.',
    fullDescription: 'Outdoor spatial design incorporating water walls, natural stone paving, shade pergolas, indigenous vegetation, and subtle nocturnal illumination.',
    deliverables: [
      'Hardscape & softscape layout masterplan',
      'Water body & fountain plumbing schematics',
      'Outdoor illumination & electrical scheme',
      'Botanical species selection index'
    ],
    process: [
      'Sunlight and soil micro-study',
      'Hardscape levels and drainage planning',
      'Plant palette harmonization',
      'Site implementation supervision'
    ],
    timeline: '3 – 5 weeks',
    startingPriceRange: '₹20 – ₹40 per sq ft',
    keywords: ['landscape', 'garden', 'terrace garden', 'courtyard', 'swimming pool', 'fountain', 'outdoor living', 'lawn design'],
    image: '/src/assets/images/hero_luxury_villa_1791451715925.jpg'
  },
  {
    id: '3d-visualization-walkthroughs',
    slug: '3d-visualization-walkthroughs',
    title: '3D Visualization & Walkthroughs',
    category: 'Architectural',
    shortDescription: 'Photorealistic architectural renders, cinematic video flythroughs, and virtual reality walk-throughs.',
    fullDescription: 'Ultra-high-definition architectural rendering with physically accurate lighting, realistic material shaders, landscaping, and cinematic camera choreography.',
    deliverables: [
      'High-resolution 4K exterior & interior renders',
      'Day and dusk atmospheric lighting variations',
      '60fps architectural walkthrough videos',
      '360° interactive panoramic scenes'
    ],
    process: [
      'CAD to 3D polygon modeling',
      'Texturing, material refinement & lighting',
      'Draft proof angle selection',
      'Final high-res render production'
    ],
    timeline: '1 – 3 weeks',
    startingPriceRange: '₹6,000 – ₹18,000 per perspective',
    keywords: ['3d render', 'walkthrough', 'animation', 'rendering', '3d elevation', '3d model', 'flythrough', 'photorealistic'],
    image: '/src/assets/images/project_residence_jubilee_1791451774514.jpg',
    featured: true
  },
  {
    id: 'structural-planning-design',
    slug: 'structural-planning-design',
    title: 'Structural Planning & Design',
    category: 'Engineering',
    shortDescription: 'Earthquake-resistant RCC framing, steel trusses, foundation design, and structural safety certifications.',
    fullDescription: 'Robust structural engineering adhering to Indian Standard Codes (IS 456, IS 1893, IS 875, IS 13920) for residential, multi-storey, and commercial edifices.',
    deliverables: [
      'Foundation & footing layout drawings',
      'Column layout and center-line drawing',
      'Plinth & slab beam reinforcement schedules',
      'Staircase, water tank & lintel details',
      'Structural safety certificate & STAAD model'
    ],
    process: [
      'Soil test report review',
      'Load calculations (Dead, Live, Wind, Seismic)',
      'STAAD.Pro / ETABS computational analysis',
      'Detailed bar bending schedule (BBS)'
    ],
    timeline: '2 – 4 weeks',
    startingPriceRange: '₹12 – ₹25 per sq ft',
    keywords: ['structural design', 'rcc design', 'foundation', 'column beam', 'slab steel', 'staad', 'structural engineer', 'civil structural'],
    image: '/src/assets/images/sketch_to_structure_1791451751179.jpg',
    featured: true
  },
  {
    id: 'vastu-compliant-planning',
    slug: 'vastu-compliant-planning',
    title: 'Vastu-Compliant Architectural Planning',
    category: 'Architectural',
    shortDescription: 'Scientific spatial zoning harmonizing classical Vastu Shastra directions with modern aesthetics.',
    fullDescription: 'Modern architecture seamlessly aligned with Vastu Shastra principles—ensuring correct placement of entrance (Ishanya/North-East), master suite (Nairuthi/South-West), kitchen (Agneya/South-East), and Brahma Sthanam without compromising contemporary luxury.',
    deliverables: [
      'Vastu directional grid overlay on site plan',
      'Room-by-room Vastu compliance report',
      'Water reservoir & borewell location recommendation',
      'Remedial layout adjustments for existing structures'
    ],
    process: [
      'Accurate compass orientation audit',
      'Zoning alignment with Ashta Dikpalakas',
      'Integration into contemporary floor plan',
      'Final Vastu certificate of compliance'
    ],
    timeline: '1 – 2 weeks',
    startingPriceRange: '₹8,000 – ₹25,000 flat / consultation',
    keywords: ['vastu', 'vaastu', 'vastu shastra', 'ishanya', 'agneya', 'nairuthi', 'north east', 'vastu naksha', 'vastu compliant plan'],
    image: '/src/assets/images/hero_luxury_villa_1791451715925.jpg'
  },
  {
    id: 'building-permit-approvals',
    slug: 'building-permit-approvals',
    title: 'Building Permits & Approvals (GHMC / HMDA)',
    category: 'Statutory & Management',
    shortDescription: 'Sanction drawings, TS-bPASS submissions, HMDA/GHMC municipal compliance, and NOC documentation.',
    fullDescription: 'End-to-end statutory architectural preparation for building permissions under GHMC, HMDA, and TS-bPASS Telangana guidelines. Setbacks, parking standards, and fire NOC compliance verified.',
    deliverables: [
      'Municipal sanction drawing sets',
      'Auto-DCR formatted drawing layers',
      'FAR, setback and parking calculation sheets',
      'TS-bPASS submission file package'
    ],
    process: [
      'Survey coordinate verification & revenue records check',
      'GHMC building bye-law zoning compliance',
      'Online submission drawing packaging',
      'Liaison coordination during departmental inspection'
    ],
    timeline: '2 – 5 weeks',
    startingPriceRange: '₹15,000 – ₹45,000 per sanction set',
    keywords: ['ghmc approval', 'hmda permission', 'ts-bpass', 'sanction drawing', 'municipal plan', 'building permit', 'hyderabad municipal approval', 'patta permit'],
    image: '/src/assets/images/sketch_to_structure_1791451751179.jpg'
  },
  {
    id: 'project-management-supervision',
    slug: 'project-management-supervision',
    title: 'Project Management & Site Supervision',
    category: 'Statutory & Management',
    shortDescription: 'Quality control, contractor oversight, milestone billing audits, and periodic site inspection visits.',
    fullDescription: 'Rigorous architectural site monitoring ensuring contractor fidelity to working drawings, concrete pour quality checks, rebar inspection, and timeline accountability.',
    deliverables: [
      'Periodic site inspection observation reports',
      'Concrete pour & slab reinforcement checklists',
      'Contractor measurement book (MB) verification',
      'Snag list and completion certification'
    ],
    process: [
      'Master construction milestone scheduling',
      'Crucial casting & stage-wise site visits',
      'Snag identification & rectification orders',
      'Final quality signoff'
    ],
    timeline: 'Project Lifecycle (12 – 18 months)',
    startingPriceRange: '₹12,000 – ₹35,000 per month / custom',
    keywords: ['site supervision', 'pms', 'project management', 'site engineer', 'quality check', 'contractor management', 'construction supervision'],
    image: '/src/assets/images/project_commercial_hub_1791451788743.jpg'
  },
  {
    id: 'civil-engineering-consultancy',
    slug: 'civil-engineering-consultancy',
    title: 'Civil Engineering Consultancy',
    category: 'Engineering',
    shortDescription: 'Soil investigation advisory, drainage master planning, retaining wall design, and material testing audits.',
    fullDescription: 'Full-spectrum technical civil advisory for complex topographies, deep basements, subterranean stormwater drainage, retaining walls, and soil stabilization.',
    deliverables: [
      'Substructure engineering reports',
      'Site grading & stormwater runoff designs',
      'Retaining wall & slope stability calculations',
      'Concrete cube strength audit analysis'
    ],
    process: [
      'Geotechnical investigation evaluation',
      'Drainage catchment computations',
      'Civil engineering structural documentation',
      'Execution inspection'
    ],
    timeline: '2 – 4 weeks',
    startingPriceRange: '₹15,000 – ₹50,000 project based',
    keywords: ['civil engineering', 'civil consultant', 'drainage plan', 'retaining wall', 'soil test', 'civil drawings', 'site grading'],
    image: '/src/assets/images/sketch_to_structure_1791451751179.jpg'
  },
  {
    id: 'elevation-facade-design',
    slug: 'elevation-facade-design',
    title: 'Elevation & Facade Design',
    category: 'Architectural',
    shortDescription: 'Signature exterior architectural identities, louvers, ACP/HPL cladding, and parametric facade treatments.',
    fullDescription: 'Creating striking street elevations that balance sun shading, visual lightness, contemporary materials (travertine, metal louvers, exposed brick, textured plasters), and LED accentuation.',
    deliverables: [
      'Front, side, and rear architectural elevations',
      'Facade material & color specifications',
      'Louver & shading detail sections',
      'Architectural lighting coordination'
    ],
    process: [
      'Existing building / layout massing review',
      'Multiple 3D facade concept iterations',
      'Material swatch selection',
      'Fabrication & installation details'
    ],
    timeline: '1 – 3 weeks',
    startingPriceRange: '₹15,000 – ₹45,000 per design',
    keywords: ['elevation', 'front elevation', 'facade', 'exterior design', 'front design', 'building front', 'modern elevation', '3d elevation design'],
    image: '/src/assets/images/project_residence_jubilee_1791451774514.jpg',
    featured: true
  },
  {
    id: 'estimation-boq-preparation',
    slug: 'estimation-boq-preparation',
    title: 'Estimation & BOQ Preparation',
    category: 'Statutory & Management',
    shortDescription: 'Itemized Bills of Quantities, material take-offs, market rate analyses, and contractor tender documents.',
    fullDescription: 'Detailed, line-by-line financial estimation protecting clients from contractor cost overruns. Accurate quantification of cement, steel, bricks, sand, plumbing fixtures, and finishes.',
    deliverables: [
      'Comprehensive Bill of Quantities (BOQ) spreadsheet',
      'Material quantity take-off document',
      'Labor component rate analysis',
      'Comparative contractor tender evaluation template'
    ],
    process: [
      'Full drawing measurement quantification',
      'Standard schedule of rates (SSR) & market benchmarking',
      'Itemized rate formulation',
      'Tender document generation'
    ],
    timeline: '1 – 2 weeks',
    startingPriceRange: '₹10,000 – ₹30,000 per project',
    keywords: ['estimation', 'boq', 'bill of quantities', 'cost estimation', 'material estimation', 'construction budget', 'budget calculation'],
    image: '/src/assets/images/sketch_to_structure_1791451751179.jpg'
  }
];
