export interface Project {
  id: string;
  slug: string;
  title: string;
  category: 'Residential' | 'Commercial' | 'Interior' | 'Renovation';
  location: string;
  builtUpArea: string;
  year: string;
  scope: string;
  summary: string;
  challenge: string;
  solution: string;
  coverImage: string;
  galleryImages: string[];
  beforeImage?: string;
  afterImage?: string;
  isPlaceholderNotice: string;
}

export const ARCHITECTURE_PROJECTS: Project[] = [
  {
    id: 'travertine-sanctuary',
    slug: 'travertine-sanctuary',
    title: 'The Travertine Pavilion Villa',
    category: 'Residential',
    location: 'Jubilee Hills, Hyderabad',
    builtUpArea: '6,400 sq.ft',
    year: '2025',
    scope: 'Architecture, Structural Engineering & Landscape',
    summary: 'A quiet luxury private estate orchestrated around an inward-looking travertine courtyard and natural reflecting water body, shielded from urban noise.',
    challenge: 'A steep rocky gradient on a corner plot with harsh western afternoon sun exposure and requirement for total family privacy.',
    solution: 'Designed deep cantilevered brass-edged overhangs with passive wind funnels and natural stone massing on the west, opening into a serene eastern garden.',
    coverImage: '/src/assets/images/hero_luxury_villa_1791451715925.jpg',
    galleryImages: [
      '/src/assets/images/hero_luxury_villa_1791451715925.jpg',
      '/src/assets/images/project_residence_jubilee_1791451774514.jpg',
      '/src/assets/images/sketch_to_structure_1791451751179.jpg'
    ],
    isPlaceholderNotice: 'Representative studio concept portfolio piece. {{CLIENT_REAL_PROJECT_PENDING}}'
  },
  {
    id: 'monolith-commercial-studio',
    slug: 'monolith-commercial-studio',
    title: 'Monolith Corporate Studio',
    category: 'Commercial',
    location: 'HITEC City Corridor, Hyderabad',
    builtUpArea: '14,200 sq.ft',
    year: '2024',
    scope: 'Commercial Architecture, Façade Engineering & Approvals',
    summary: 'A boutique corporate headquarters integrating bronze acoustic louvers, open biophilic sky-terraces, and high-efficiency column-free work floors.',
    challenge: 'Strict municipal setback constraints combined with developer requirement for maximum rentable carpet area and energy-efficient daylit floors.',
    solution: 'Engineered post-tensioned slab construction with perimeter glass and automated angled bronze louvers minimizing solar heat gain by 32%.',
    coverImage: '/src/assets/images/project_commercial_hub_1791451788743.jpg',
    galleryImages: [
      '/src/assets/images/project_commercial_hub_1791451788743.jpg',
      '/src/assets/images/sketch_to_structure_1791451751179.jpg'
    ],
    isPlaceholderNotice: 'Representative studio concept portfolio piece. {{CLIENT_REAL_PROJECT_PENDING}}'
  },
  {
    id: 'fluted-haven-penthouse',
    slug: 'fluted-haven-penthouse',
    title: 'The Fluted Timber Residence',
    category: 'Interior',
    location: 'Banjara Hills, Hyderabad',
    builtUpArea: '4,800 sq.ft',
    year: '2025',
    scope: 'Interior Architecture, Lighting & Custom Millwork',
    summary: 'A warm minimalist apartment interior defined by double-height acoustic fluted teak paneling, bespoke brass hardware, and concealed architectural illuminations.',
    challenge: 'Low perceived ceiling heights and harsh glare from existing developer window apertures.',
    solution: 'Introduced vertical fluted wall cladding that visually stretches height, combined with recessed indirect coffer lighting and linen sheer diffusers.',
    coverImage: '/src/assets/images/project_interior_living_1791451807928.jpg',
    galleryImages: [
      '/src/assets/images/project_interior_living_1791451807928.jpg',
      '/src/assets/images/project_residence_jubilee_1791451774514.jpg'
    ],
    isPlaceholderNotice: 'Representative studio concept portfolio piece. {{CLIENT_REAL_PROJECT_PENDING}}'
  },
  {
    id: 'courtyard-revival-remodel',
    slug: 'courtyard-revival-remodel',
    title: 'Courtyard Revival & Façade Retrofit',
    category: 'Renovation',
    location: 'Gudimalkapur Vicinity, Hyderabad',
    builtUpArea: '3,200 sq.ft',
    year: '2024',
    scope: 'Structural Retrofit, Remodeling & Modern Elevation',
    summary: 'Transforming a 28-year-old load-bearing residence into an open-plan contemporary home with reinforced RCC lintels and expanded light wells.',
    challenge: 'Existing dark load-bearing masonry walls prevented open plan living; roof exhibited minor deflection.',
    solution: 'Introduced structural steel portal frames to eliminate central dividing walls while preserving foundational integrity.',
    coverImage: '/src/assets/images/sketch_to_structure_1791451751179.jpg',
    galleryImages: [
      '/src/assets/images/sketch_to_structure_1791451751179.jpg',
      '/src/assets/images/hero_luxury_villa_1791451715925.jpg'
    ],
    beforeImage: '/src/assets/images/sketch_to_structure_1791451751179.jpg',
    afterImage: '/src/assets/images/project_residence_jubilee_1791451774514.jpg',
    isPlaceholderNotice: 'Representative studio concept portfolio piece. {{CLIENT_REAL_PROJECT_PENDING}}'
  }
];
