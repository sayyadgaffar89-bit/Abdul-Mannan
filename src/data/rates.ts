/**
 * Ultimate Design and Consultant - Construction & Architectural Rate Master Table
 * Verified Hyderabad / South India Benchmark Rates (Updated: October 2026)
 * Server-side source of truth for realistic cost estimates and material quantities.
 */

export type QualityGrade = 'standard' | 'premium' | 'luxury';
export type ProjectType = 'independent_house' | 'villa' | 'duplex' | 'commercial' | 'apartment_interior' | 'renovation';
export type HyderabadZone = 'hyderabad_central' | 'hyderabad_west' | 'hyderabad_suburbs' | 'telangana_tier2';

export interface RateTableConfig {
  lastUpdated: string;
  currency: string;
  city: string;
  baseRatePerSqFt: Record<ProjectType, Record<QualityGrade, { min: number; max: number }>>;
  zoneMultiplier: Record<HyderabadZone, number>;
  categoryDistribution: {
    name: string;
    key: string;
    percentage: number;
    description: string;
  }[];
  materialFormulasPer1000SqFt: {
    material: string;
    unit: string;
    ratePerUnitInr: number;
    quantityBasic: number;
    quantityLuxury: number;
  }[];
}

export const HYDERABAD_RATE_MASTER: RateTableConfig = {
  lastUpdated: '2026-10-01',
  currency: 'INR (₹)',
  city: 'Hyderabad & Telangana Region',
  baseRatePerSqFt: {
    independent_house: {
      standard: { min: 1850, max: 2150 },
      premium: { min: 2350, max: 2850 },
      luxury: { min: 3100, max: 4100 },
    },
    villa: {
      standard: { min: 2100, max: 2450 },
      premium: { min: 2650, max: 3300 },
      luxury: { min: 3500, max: 4800 },
    },
    duplex: {
      standard: { min: 1950, max: 2300 },
      premium: { min: 2500, max: 3100 },
      luxury: { min: 3300, max: 4400 },
    },
    commercial: {
      standard: { min: 1750, max: 2100 },
      premium: { min: 2400, max: 3100 },
      luxury: { min: 3400, max: 4600 },
    },
    apartment_interior: {
      standard: { min: 950, max: 1350 },
      premium: { min: 1550, max: 2200 },
      luxury: { min: 2450, max: 3800 },
    },
    renovation: {
      standard: { min: 1100, max: 1500 },
      premium: { min: 1650, max: 2300 },
      luxury: { min: 2500, max: 3600 },
    },
  },
  zoneMultiplier: {
    hyderabad_central: 1.0, // Gudimalkapur, Santosh Nagar, Mehdipatnam, Attapur, Banjara Hills
    hyderabad_west: 1.08, // Jubilee Hills, Financial District, Hitec City, Kokapet
    hyderabad_suburbs: 0.95, // Tellapur, Shamshabad, Kompally, Ghatkesar
    telangana_tier2: 0.88, // Warangal, Karimnagar, Nizamabad
  },
  categoryDistribution: [
    { name: 'Foundation & RCC Structure', key: 'structure', percentage: 0.32, description: 'Earthwork, footing, columns, beams, slab casting & TMT steel' },
    { name: 'Masonry & Internal Plastering', key: 'masonry', percentage: 0.12, description: 'Red clay bricks / AAC lightweight blocks and river sand plaster' },
    { name: 'Flooring, Stone & Tiling', key: 'flooring', percentage: 0.10, description: 'Italian marble, vitrified tiles, granite treads & skirting' },
    { name: 'Doors, Windows & Glazing', key: 'openings', percentage: 0.09, description: 'Teak wood main frame, UPVC/Aluminum double-glazed windows' },
    { name: 'Electrical & Concealed Conduits', key: 'electrical', percentage: 0.08, description: 'Finolex/Polycab wiring, Schneider modular switches & DBs' },
    { name: 'Finishing, Paint & False Ceiling', key: 'finishes', percentage: 0.08, description: 'Gypsum ceiling, Asian Paints Royale acrylic emulsion' },
    { name: 'Plumbing & Sanitaryware', key: 'plumbing', percentage: 0.07, description: 'CPVC pipes, Jaquar/Kohler diverters & sanitary fittings' },
    { name: 'Architectural & Structural Fees', key: 'consultancy', percentage: 0.04, description: 'Architectural blueprints, 3D elevations, STAAD engineering' },
    { name: 'Municipal Approvals (GHMC/HMDA)', key: 'approvals', percentage: 0.03, description: 'TS-bPASS sanction drawing preparation and documentation' },
    { name: 'Unforeseen Contingency Reserve', key: 'contingency', percentage: 0.07, description: 'Buffer for site soil anomalies, monsoon buffers, market swings' },
  ],
  materialFormulasPer1000SqFt: [
    { material: 'Cement (OPC / PPC 53 Grade)', unit: 'Bags (50 kg)', ratePerUnitInr: 390, quantityBasic: 420, quantityLuxury: 460 },
    { material: 'TMT Steel Rebar (Fe 550D)', unit: 'Kilograms (Kg)', ratePerUnitInr: 68, quantityBasic: 3700, quantityLuxury: 4200 },
    { material: 'Red Clay Bricks / AAC Blocks', unit: 'Numbers', ratePerUnitInr: 9.5, quantityBasic: 17500, quantityLuxury: 18500 },
    { material: 'M-Sand / River Sand', unit: 'Cubic Feet (cft)', ratePerUnitInr: 58, quantityBasic: 1900, quantityLuxury: 2100 },
    { material: 'Coarse Aggregate (20mm / 40mm)', unit: 'Cubic Feet (cft)', ratePerUnitInr: 45, quantityBasic: 1250, quantityLuxury: 1400 },
    { material: 'Vitrified / Natural Stone Tiles', unit: 'Square Feet', ratePerUnitInr: 110, quantityBasic: 1150, quantityLuxury: 1250 },
    { material: 'Architectural Paint & Primer', unit: 'Litres', ratePerUnitInr: 340, quantityBasic: 170, quantityLuxury: 220 },
  ],
};

export interface EstimateInput {
  projectType: ProjectType;
  quality: QualityGrade;
  builtUpAreaSqFt: number;
  floors?: number;
  zone?: HyderabadZone;
  budgetInr?: number;
}

export interface EstimateResult {
  totalCostMin: number;
  totalCostMax: number;
  totalCostAvg: number;
  ratePerSqFtMin: number;
  ratePerSqFtMax: number;
  builtUpAreaSqFt: number;
  projectType: ProjectType;
  quality: QualityGrade;
  categoryBreakdown: {
    name: string;
    costMin: number;
    costMax: number;
    costAvg: number;
    percentage: number;
    description: string;
  }[];
  materialEstimates: {
    material: string;
    unit: string;
    quantity: number;
    estimatedCost: number;
  }[];
  timelinePhases: {
    phase: string;
    durationWeeks: string;
    tasks: string[];
  }[];
  assumptions: string[];
  budgetWarning?: string;
  disclaimer: string;
}

export function calculateProjectEstimate(input: EstimateInput): EstimateResult {
  const area = Math.max(250, Number(input.builtUpAreaSqFt) || 1500);
  const typeRates = HYDERABAD_RATE_MASTER.baseRatePerSqFt[input.projectType] || HYDERABAD_RATE_MASTER.baseRatePerSqFt.independent_house;
  const gradeRates = typeRates[input.quality] || typeRates.premium;
  const zoneMult = HYDERABAD_RATE_MASTER.zoneMultiplier[input.zone || 'hyderabad_central'] || 1.0;

  const minRate = Math.round(gradeRates.min * zoneMult);
  const maxRate = Math.round(gradeRates.max * zoneMult);

  const totalMin = minRate * area;
  const totalMax = maxRate * area;
  const totalAvg = Math.round((totalMin + totalMax) / 2);

  // Category breakdown
  const categoryBreakdown = HYDERABAD_RATE_MASTER.categoryDistribution.map((cat) => {
    return {
      name: cat.name,
      costMin: Math.round(totalMin * cat.percentage),
      costMax: Math.round(totalMax * cat.percentage),
      costAvg: Math.round(totalAvg * cat.percentage),
      percentage: Math.round(cat.percentage * 100),
      description: cat.description,
    };
  });

  // Material approximations scaled by area (per 1,000 sq ft)
  const areaRatio = area / 1000;
  const isLuxury = input.quality === 'luxury';
  const materialEstimates = HYDERABAD_RATE_MASTER.materialFormulasPer1000SqFt.map((mat) => {
    const baseQty = isLuxury ? mat.quantityLuxury : mat.quantityBasic;
    const qty = Math.round(baseQty * areaRatio);
    return {
      material: mat.material,
      unit: mat.unit,
      quantity: qty,
      estimatedCost: Math.round(qty * mat.ratePerUnitInr),
    };
  });

  // Realistic timeline phases
  const timelinePhases = [
    {
      phase: 'Phase 1: Discovery & Conceptual Design',
      durationWeeks: '2 – 3 weeks',
      tasks: ['Site contour & soil analysis', 'Spatial requirements matrix', 'Vastu orientation layout', 'Initial 3D massing model'],
    },
    {
      phase: 'Phase 2: Approvals & Structural Engineering',
      durationWeeks: '3 – 5 weeks',
      tasks: ['STAAD structural frame analysis', 'TS-bPASS / GHMC sanction drawing release', 'Plumbing & electrical conduits schematic'],
    },
    {
      phase: 'Phase 3: Substructure & RCC Framing',
      durationWeeks: '8 – 16 weeks',
      tasks: ['Earth excavation & PCC blinding', 'Isolated footings & plinth tie beams', 'Slab casting up to terrace level'],
    },
    {
      phase: 'Phase 4: Masonry, Plaster & Conduiting',
      durationWeeks: '6 – 10 weeks',
      tasks: ['AAC block / brick partitions', 'Concealed electrical boxes & plumbing drops', 'Internal & exterior double-coat plastering'],
    },
    {
      phase: 'Phase 5: Finishes, Millwork & Handover',
      durationWeeks: '8 – 14 weeks',
      tasks: ['Flooring installation & skirting', 'Doors, UPVC windows & glazing', 'Painting, lighting fixtures & snag-list audit'],
    },
  ];

  const assumptions = [
    'Assumes standard accessible site logistics in Hyderabad metropolitan area without deep rock blasting requirements.',
    'Excludes ultra-luxury imported furniture, high-voltage substations, and private elevators unless quoted separately.',
    'Material prices are anchored to current Hyderabad market indices (OPC 53 cement at ~₹390/bag, Fe550 steel at ~₹68/kg).',
    'Timelines account for typical Telangana municipal approval turnarounds and concrete curing cycles.',
  ];

  let budgetWarning: string | undefined;
  if (input.budgetInr && input.budgetInr > 0) {
    if (input.budgetInr < totalMin * 0.8) {
      budgetWarning = `Your indicated budget of ₹${(input.budgetInr / 100000).toFixed(1)} Lakh is below the current market baseline for ${area} sq.ft (${input.quality} grade). We recommend adjusting the built-up area or optimizing finishes to ensure structural integrity without compromising quality.`;
    } else if (input.budgetInr >= totalMin && input.budgetInr <= totalMax) {
      budgetWarning = `Your indicated budget of ₹${(input.budgetInr / 100000).toFixed(1)} Lakh aligns well with standard Hyderabad benchmarks for this scope.`;
    }
  }

  return {
    totalCostMin: totalMin,
    totalCostMax: totalMax,
    totalCostAvg: totalAvg,
    ratePerSqFtMin: minRate,
    ratePerSqFtMax: maxRate,
    builtUpAreaSqFt: area,
    projectType: input.projectType,
    quality: input.quality,
    categoryBreakdown,
    materialEstimates,
    timelinePhases,
    assumptions,
    budgetWarning,
    disclaimer: 'This is an approximate estimate based on average Hyderabad market rates. Final costs depend on site conditions, material choices, and a detailed Bill of Quantities (BOQ) quotation from our engineering team.',
  };
}
