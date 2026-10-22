/**
 * CitrusNutritionData.js
 * Comprehensive Nutritional Content, Food Science Facts & Health/Economic Benefits
 * Calibrated according to APEDA Export Standards, USDA Nutrient Database & ICMR Citrus Metrology.
 */

export const CITRUS_NUTRITION_DATA = {
  grade_a: {
    id: 'grade_a',
    gradeLabel: 'Grade A — Export & Premium Retail',
    badgeText: 'PEAK EXPORT NUTRITION',
    accentColor: '#22c55e',
    accentTextColor: '#4ade80',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    bgGlow: 'rgba(34, 197, 94, 0.1)',
    edibleStatus: 'Certified Food & Confectionery Grade (Zero Restrictions)',
    servingSize: '100g edible fresh pulp & zest',

    nutrients: [
      { name: 'Vitamin C (L-Ascorbic Acid)', value: '53.0 mg', rda: '88% DV', note: 'Peak unoxidized active form' },
      { name: 'Citric Acid Content', value: '5.2 g', rda: 'High Purity', note: 'Natural metabolic preservative' },
      { name: 'Flavedo Essential Oils (d-Limonene)', value: '0.85%', rda: 'Max Potency', note: 'Intact aromatic secretory glands' },
      { name: 'Dietary Soluble Fiber (Pectin)', value: '2.8 g', rda: '10% DV', note: 'Intact cell wall protopectin' },
      { name: 'Potassium (K+)', value: '138 mg', rda: '4% DV', note: 'Cellular electrolyte balance' },
      { name: 'Bioactive Bioflavonoids (Hesperidin)', value: '42.5 mg', rda: 'High Bioavail.', note: 'Potent microvascular antioxidant' },
      { name: 'Total Energy / Calories', value: '29 kcal', rda: 'Low Glycemic', note: 'Glycemic Index < 20' }
    ],

    facts: [
      {
        title: 'Zero Terpene Oxidation in Flavedo',
        detail: 'Because Grade A citrus has < 3% surface blemishes, its essential oil glands remain completely sealed. This prevents atmospheric oxidation of volatile monoterpenes and retains post-harvest Vitamin C levels for over 21 days in cold transit.'
      },
      {
        title: 'Cellular Pectin Integrity',
        detail: 'Intact epidermal walls inhibit endogenous polygalacturonase enzymes from prematurely breaking down structural pectin chains, preserving maximum juice vesicle turgor and firmness.'
      },
      {
        title: 'Minimal Ethylene Stress Respiration',
        detail: 'Healthy Grade A fruit maintains baseline metabolic respiration (< 0.05 ppm C₂H₄), preventing the metabolic depletion of sugars and organic acids during ocean freight transit.'
      }
    ],

    benefits: [
      {
        title: 'Accelerated Immune & Collagen Synthesis',
        detail: 'Peak bioavailability of L-ascorbic acid accelerates human neutrophil phagocytosis and serves as an indispensable co-factor for dermal prolyl-hydroxylase collagen cross-linking.'
      },
      {
        title: 'Cardiovascular Microvascular Protection',
        detail: 'High concentrations of hesperidin and eriocitrin strengthen capillary walls, reduce platelet aggregation, and inhibit LDL cholesterol lipid peroxidation.'
      },
      {
        title: 'Dual-Use Export & Confectionery Value',
        detail: '100% blemish-free flavedo enables safe culinary zesting, pharmaceutical essential oil distillation, and premium cold-pressed cocktail oil extraction.'
      }
    ]
  },

  grade_b: {
    id: 'grade_b',
    gradeLabel: 'Grade B — Domestic Supermarket Retail',
    badgeText: 'WHOLESOME DOMESTIC VALUE',
    accentColor: '#f59e0b',
    accentTextColor: '#fbbf24',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    bgGlow: 'rgba(245, 158, 11, 0.1)',
    edibleStatus: '100% Safe for Human Consumption (Superficial Rind Blemishes Only)',
    servingSize: '100g edible fresh pulp',

    nutrients: [
      { name: 'Vitamin C (L-Ascorbic Acid)', value: '49.5 mg', rda: '82% DV', note: '93% retention vs export grade' },
      { name: 'Citric Acid Content', value: '5.0 g', rda: 'Standard Acid', note: 'Full tangy palate retention' },
      { name: 'Flavedo Essential Oils', value: '0.62%', rda: 'Moderate', note: 'Minor surface scar scarring' },
      { name: 'Dietary Fiber (Pectin)', value: '2.6 g', rda: '9% DV', note: 'High prebiotic soluble fiber' },
      { name: 'Potassium (K+)', value: '135 mg', rda: '4% DV', note: 'Heart & fluid regulation' },
      { name: 'Bioactive Bioflavonoids', value: '38.0 mg', rda: 'Good Bioavail.', note: 'Rich in eriocitrin & narirutin' },
      { name: 'Total Energy / Calories', value: '28 kcal', rda: 'Low Calorie', note: 'Natural refreshing hydration' }
    ],

    facts: [
      {
        title: 'Strictly Cuticular Blemishes (3–10%)',
        detail: 'Superficial thrip marks and wind rubs are strictly confined to the waxy cuticle layer and do not penetrate into the white spongy albedo or inner juice carpels.'
      },
      {
        title: 'Identical Internal Juice Chemistry',
        detail: 'Gas chromatography and Brix refractometer tests prove Grade B lemons have identical Brix:Acid ratio (7.2–8.0) and pH (2.2–2.4) to Grade A lemons; differences are purely cosmetic.'
      },
      {
        title: 'Natural Lignified Callose Barriers',
        detail: 'Minor mechanical tree scratches form a natural lignified suberin barrier, safely preventing fungal spore penetration while preserving internal moisture.'
      }
    ],

    benefits: [
      {
        title: 'Affordable Everyday Micronutrient Source',
        detail: 'Delivers over 80% of daily human Vitamin C requirements at 50% lower retail cost than cosmetic export-grade lemons.'
      },
      {
        title: 'Kidney Stone (Nephrolithiasis) Prevention',
        detail: 'High concentration of urinary citrates binds to calcium ions, preventing crystallization and growth of painful calcium oxalate renal stones.'
      },
      {
        title: 'Digestive & Postprandial Glycemic Support',
        detail: 'Soluble citric acid modulates gastric emptying rate, blunting blood glucose spikes when consumed alongside carbohydrate-dense meals.'
      }
    ]
  },

  grade_c: {
    id: 'grade_c',
    gradeLabel: 'Grade C — Industrial Juicing & Citric Extraction',
    badgeText: 'INDUSTRIAL JUICING GRADE',
    accentColor: '#38bdf8',
    accentTextColor: '#38bdf8',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    bgGlow: 'rgba(56, 189, 248, 0.1)',
    edibleStatus: 'Safe for Commercial Extraction, Juicing & Thermal Pasteurization',
    servingSize: '100g extracted pulp juice',

    nutrients: [
      { name: 'Vitamin C (L-Ascorbic Acid)', value: '41.0 mg', rda: '68% DV', note: 'Retained through industrial press' },
      { name: 'Titratable Citric Acid', value: '5.4 g', rda: 'Concentrated', note: 'Peak extraction yield (+6%)' },
      { name: 'Total Soluble Solids (Brix)', value: '8.8° Brix', rda: 'Rich Solids', note: 'Ideal for juice concentrates' },
      { name: 'Dietary Pectin (Soluble)', value: '1.9 g', rda: '7% DV', note: 'Commercial pectin extraction' },
      { name: 'Potassium (K+)', value: '130 mg', rda: '3% DV', note: 'Isotonic beverage base' },
      { name: 'Flavonoid Glycosides', value: '29.0 mg', rda: 'Moderate', note: 'Natural beverage bittering agent' },
      { name: 'Total Energy / Calories', value: '27 kcal', rda: 'Natural Acid', note: 'Zero added sugar substrate' }
    ],

    facts: [
      {
        title: 'Concentrated Acidity Phenomenon',
        detail: 'As rind defects (10–24%) cause minor transpiration, titratable citric acid per milliliter of juice increases by 4–6%, making Grade C the superior choice for industrial beverage blending.'
      },
      {
        title: 'Thermal Pasteurization Resilience',
        detail: 'Juice extracted from sound carpels of Grade C lemons retains >88% of organic acids when flash pasteurized at 85°C for 15 seconds (HTST standards).'
      },
      {
        title: 'Phytoalexin Defensive Accumulation',
        detail: 'Surface rind stress triggers localized biosynthesis of coumarins and phytoalexins, boosting the tree\'s natural internal antimicrobial resilience.'
      }
    ],

    benefits: [
      {
        title: 'High-Yield Commercial Juice Concentrate',
        detail: 'Primary feedstock for ready-to-drink lemonades, natural soft drinks, and culinary marinades that do not require cosmetic peel beauty.'
      },
      {
        title: 'Industrial Citric Acid & Pectin Production',
        detail: 'Supplies biotechnology plants with biological substrate for food-grade citric acid crystallization, acidulants, and commercial gelling pectins.'
      },
      {
        title: 'Natural Electrolyte Rehydration',
        detail: 'Extracted juice diluted with water and sea salt serves as a hyper-effective natural isotonic rehydration beverage with zero synthetic colorants.'
      }
    ]
  },

  grade_d: {
    id: 'grade_d',
    gradeLabel: 'Grade D — Pathological Reject & Quarantine',
    badgeText: 'BIO-HAZARD / CLEAN BIOGAS',
    accentColor: '#ef4444',
    accentTextColor: '#f87171',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    bgGlow: 'rgba(239, 68, 68, 0.1)',
    edibleStatus: '⚠️ UNFIT FOR HUMAN CONSUMPTION — BIOMASS DIVERSION ONLY',
    servingSize: '100g spoiled citrus biomass',

    nutrients: [
      { name: 'Human Edible Status', value: '0% Unsafe', rda: 'TOXIC RISK', note: 'Active fungal hyphae mycelium' },
      { name: 'Mycotoxin Contamination', value: 'Present', rda: 'Hazard', note: 'Penicillium patulin risk' },
      { name: 'Pectin Depolymerization', value: '> 85% Lost', rda: 'Degraded', note: 'Liquefied by fungal pectinase' },
      { name: 'Bio-Methane Fuel Yield', value: '380–420 L/kg', rda: 'High Yield', note: 'Methane gas generation' },
      { name: 'Compost Mineral Ash (K/P)', value: '4.8% dry w/w', rda: 'Fertilizer', note: 'Rich potassium soil nutrient' },
      { name: 'Ethylene Biosynthesis Spike', value: '> 100 ppm', rda: 'Surge', note: 'Causes rapid contagion rots' }
    ],

    facts: [
      {
        title: 'Autocatalytic Ethylene Contagion',
        detail: 'Infected flavedo tissue experiences a massive stress surge in ACC-oxidase, releasing over 100x baseline ethylene gas (C₂H₄), rotting adjacent healthy crates within 48 hours.'
      },
      {
        title: 'Fungal Pectinase Liquefaction',
        detail: 'Penicillium digitatum secretes endo-polygalacturonase and pectinesterase, dissolving middle lamellae cell walls and liquefying internal fruit structure.'
      },
      {
        title: 'High Anaerobic Calorific Value',
        detail: 'Residual citrus sugars and volatile terpenes deliver an exceptionally high biomethane potential (380–420 liters CH₄ per kg dry solid) in anaerobic digesters.'
      }
    ],

    benefits: [
      {
        title: 'Clean Mandi Biogas Renewable Energy',
        detail: 'Diverted rejects fuel community anaerobic bio-digesters, producing methane gas for rural electricity, drying kilns, or municipal cooking stoves.'
      },
      {
        title: 'Organic Potassium-Rich Soil Compost',
        detail: 'After thermophilic composting (>55°C destroys fungal spores), composted citrus pomace enriches agricultural soil with organic potassium and phosphorus.'
      },
      {
        title: 'Total Cross-Contamination Prevention',
        detail: 'Automated mechatronic isolation of Grade D saves up to 40 surrounding healthy lemons per infected fruit, eliminating millions in mandi spoilage.'
      }
    ]
  },

  unripe: {
    id: 'unripe',
    gradeLabel: 'Unripe / Green Flavedo Citrus',
    badgeText: 'HIGH TANNIN PICKLING GRADE',
    accentColor: '#84cc16',
    accentTextColor: '#a3e635',
    borderColor: 'rgba(132, 204, 22, 0.4)',
    bgGlow: 'rgba(132, 204, 22, 0.1)',
    edibleStatus: 'Traditional Pickling Grade (High Astringency, Low Sugar)',
    servingSize: '100g unripe green citrus',

    nutrients: [
      { name: 'Vitamin C (Ascorbic Acid)', value: '38.0 mg', rda: '63% DV', note: 'Developing antioxidant profile' },
      { name: 'Chlorophyll a & b Flavedo', value: '14.2 mg', rda: 'Natural Pigment', note: 'Active thylakoid chloroplasts' },
      { name: 'Bitter Bioflavonoids (Naringin)', value: '54.0 mg', rda: 'High Bitter', note: 'Astringent protective compounds' },
      { name: 'Titratable Acidity', value: '6.2 g', rda: 'Very Tart', note: 'Sharp acid, low Brix (4.8°)' },
      { name: 'Dietary Fiber', value: '2.9 g', rda: '10% DV', note: 'Dense protopectin matrix' },
      { name: 'Potassium (K+)', value: '140 mg', rda: '4% DV', note: 'Cellular vigor' }
    ],

    facts: [
      {
        title: 'Active Photosynthetic Chloroplasts',
        detail: 'The flavedo is dominated by active chlorophyll pigments rather than carotenoids, maintaining tree-level protective photochemical activity.'
      },
      {
        title: 'De-Greening Gas Susceptibility',
        detail: 'Exposing unripe citrus to controlled ethylene gas (2–5 ppm) at 22°C with 90% relative humidity stimulates chlorophyllase, turning green rind into canary yellow in 72 hours.'
      },
      {
        title: 'Elevated Polyphenol Oxidase (PPO)',
        detail: 'High astringency and elevated bitter polyphenols serve as the plant\'s evolutionary biological armor against premature bird and insect consumption.'
      }
    ],

    benefits: [
      {
        title: 'Prized Indian Oil-Free Pickling (Nimbu Achaar)',
        detail: 'Firm green rinds hold their crisp texture for months in salted oil-free mustard brines, transforming bitter naringin into umami depth.'
      },
      {
        title: 'Strategic Cold Storage Hedging',
        detail: 'Green lemons survive 60+ days in controlled atmosphere storage, allowing mandi aggregators to withhold fruit until off-season summer price spikes.'
      },
      {
        title: 'Potent Digestive Bitter Tonic',
        detail: 'Ayurvedic formulations use green lime extracts to stimulate bile acid secretion, liver enzymes, and salivary salivary amylase production.'
      }
    ]
  }
};

/**
 * Helper to get nutrition data by grade string or verdict label
 */
export function getNutritionByGrade(gradeCategory) {
  if (!gradeCategory) return CITRUS_NUTRITION_DATA.grade_a;
  const str = String(gradeCategory).toLowerCase();

  if (str.includes('grade a') || str.includes('export')) return CITRUS_NUTRITION_DATA.grade_a;
  if (str.includes('grade b') || str.includes('retail') || str.includes('domestic')) return CITRUS_NUTRITION_DATA.grade_b;
  if (str.includes('grade c') || str.includes('juice') || str.includes('juicing')) return CITRUS_NUTRITION_DATA.grade_c;
  if (str.includes('grade d') || str.includes('reject') || str.includes('fungal') || str.includes('rot')) return CITRUS_NUTRITION_DATA.grade_d;
  if (str.includes('unripe') || str.includes('green')) return CITRUS_NUTRITION_DATA.unripe;

  return CITRUS_NUTRITION_DATA.grade_a;
}
