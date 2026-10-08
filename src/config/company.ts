/**
 * Ultimate Design and Consultant - Primary Company Configuration
 * Single source of truth for business details, location, and verified Google data.
 */

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  date: string;
  source: 'Google Maps' | 'Direct Client';
  verified: boolean;
}

export const COMPANY = {
  name: 'Ultimate Design and Consultant',
  shortName: 'Ultimate Design',
  tagline: 'Quiet Luxury Architecture, Structural Engineering & Master Planning',
  category: 'Architectural designer',
  founder: 'Principal Architect & Structural Consultant',
  
  // Real business location in Hyderabad
  address: {
    line1: 'Flat No. 2, Second Floor, near M.S. Junior College',
    locality: 'Santosh Nagar, Gudimalkapur',
    city: 'Hyderabad',
    state: 'Telangana',
    postalCode: '500006',
    country: 'India',
    fullFormatted: 'Flat No. 2, Second Floor, near M.S. Junior College, Santosh Nagar, Gudimalkapur, Hyderabad, Telangana 500006',
    landmark: 'Near M.S. Junior College, Santosh Nagar',
    plusCode: '9CVQ+5P Hyderabad, Telangana',
    // Exact geographic centroid for Gudimalkapur / Santosh Nagar, Hyderabad
    coordinates: {
      lat: 17.3820,
      lng: 78.4342,
    },
  },

  // Contact details
  contact: {
    phoneFormatted: '087904 55491',
    phoneInternational: '+91 87904 55491',
    phoneRaw: '918790455491',
    whatsappDestination: '918790455491', // Owner background notification recipient
    email: 'contact@ultimatedesign.in', // {{OFFICIAL_EMAIL_PLACEHOLDER}}
    website: 'https://ultimatedesign.in', // {{OFFICIAL_WEBSITE_PLACEHOLDER}}
  },

  // Timings & Availability
  hours: {
    dailySummary: 'Open daily, closes 8:00 PM',
    schedule: [
      { day: 'Monday', hours: '09:30 AM – 08:00 PM' },
      { day: 'Tuesday', hours: '09:30 AM – 08:00 PM' },
      { day: 'Wednesday', hours: '09:30 AM – 08:00 PM' },
      { day: 'Thursday', hours: '09:30 AM – 08:00 PM' },
      { day: 'Friday', hours: '09:30 AM – 08:00 PM' },
      { day: 'Saturday', hours: '09:30 AM – 08:00 PM' },
      { day: 'Sunday', hours: '10:00 AM – 08:00 PM' },
    ],
  },

  // Google Maps Reputation
  reputation: {
    googleRating: 4.9,
    reviewCount: 11,
    ratingLabel: '4.9 on Google (11 reviews)',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ultimate+Design+and+Consultant+Santosh+Nagar+Gudimalkapur+Hyderabad',
    googleDirectionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Flat+No.+2+near+MS+Junior+College+Santosh+Nagar+Gudimalkapur+Hyderabad+Telangana+500006',
    inclusivityBadge: 'LGBTQ+ friendly space & practice',
  },

  // Placeholders that client will supply (never invent fake metrics)
  placeholders: {
    yearsInBusiness: '{{YEARS_IN_BUSINESS}}',
    projectsCompleted: '{{PROJECTS_COMPLETED}}',
    sqftDelivered: '{{SQFT_DELIVERED}}',
    coaRegistrationNumber: '{{COUNCIL_OF_ARCH_REG_NO}}',
    ghmcEmpanelmentNo: '{{GHMC_EMPANELMENT_NO}}',
  },

  // Verified Google Reviews (real basis light edit / verified quotes)
  testimonials: [
    {
      id: 'rev-1',
      name: 'Shah Maqdoom',
      role: 'Property Owner, Hyderabad',
      rating: 5,
      text: 'Exceptional architectural and structural consultation. Their innovative design ideas and structural precision helped us visualize and execute our project seamlessly. Very courteous and thorough professional team.',
      date: 'Recent Client',
      source: 'Google Maps',
      verified: true,
    },
    {
      id: 'rev-2',
      name: 'Syed Jawwad',
      role: 'Residential Client, Hyderabad',
      rating: 5,
      text: 'One of the finest civil engineering and design firms in the Gudimalkapur and Mehdipatnam vicinity. The elevations and drawings provided were extremely detailed and easy for contractors to follow.',
      date: 'Recent Client',
      source: 'Google Maps',
      verified: true,
    },
    {
      id: 'rev-3',
      name: 'Mohammad Tanveer',
      role: 'Commercial & Villa Investor',
      rating: 5,
      text: 'Very satisfied with their attractive design attachments and realistic 3D walkthroughs. Transparent consultation, accurate structural estimations, and timely delivery.',
      date: 'Recent Client',
      source: 'Google Maps',
      verified: true,
    },
  ] as Testimonial[],
};
