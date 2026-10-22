/* ==============================================================================
   SampleLemons.js
   Synthetic Optical Calibration Standards & Pathology Specimens
   Renders pixel-accurate test specimens directly onto Canvas for zero-fail demos
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

/**
 * Draws a calibrated citrus specimen onto a target 2D canvas context
 * @param {CanvasRenderingContext2D} ctx 
 * @param {string} sampleId 
 * @param {number} width 
 * @param {number} height 
 */
export function renderCalibratedLemon(ctx, sampleId, width = 480, height = 360, angle = 0) {
  ctx.clearRect(0, 0, width, height);

  // Optical staging platform background (Dark non-reflective laboratory benchtop)
  ctx.fillStyle = '#0f1114';
  ctx.fillRect(0, 0, width, height);

  // Subtle circular optical illumination vignette
  const illumGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, 220);
  illumGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
  illumGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = illumGrad;
  ctx.fillRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;

  // Render based on specimen type
  switch (sampleId) {
    case 'sample_grade_a':
      drawGradeAExportLemon(ctx, cx, cy);
      break;
    case 'sample_grade_b':
      drawGradeBRetailLemon(ctx, cx, cy);
      break;
    case 'sample_grade_c':
      drawGradeCProcessingLemon(ctx, cx, cy);
      break;
    case 'sample_grade_d_anthracnose':
      drawGradeDAnthracnoseLemon(ctx, cx, cy);
      break;
    case 'sample_grade_d_mold':
      drawGradeDFungalMoldLemon(ctx, cx, cy);
      break;
    case 'sample_unripe_green':
      drawUnripeGreenCitrus(ctx, cx, cy);
      break;
    case 'sample_hidden_defect':
      drawBlindSpotSpecimen(ctx, cx, cy, angle);
      break;
    default:
      drawGradeAExportLemon(ctx, cx, cy);
      break;
  }
}

// 1. Grade A Export Quality (Eureka Lemon: Flawless, vibrant yellow, 61mm, <1% blemish)
function drawGradeAExportLemon(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);

  // Soft contact shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 95, 110, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  // Primary Lemon Silhouette Path
  ctx.beginPath();
  ctx.moveTo(-115, 0);
  ctx.bezierCurveTo(-115, -75, -50, -88, 0, -88);
  ctx.bezierCurveTo(60, -88, 115, -70, 115, 0);
  ctx.bezierCurveTo(115, 70, 60, 88, 0, 88);
  ctx.bezierCurveTo(-50, 88, -115, 75, -115, 0);
  ctx.closePath();

  // Vibrant Flavedo Gradient
  const grad = ctx.createRadialGradient(-25, -25, 15, 0, 0, 120);
  grad.addColorStop(0, '#fff566'); // Highlight yellow
  grad.addColorStop(0.35, '#ffd60a'); // Saturated canary yellow
  grad.addColorStop(0.85, '#eab308'); // Golden yellow
  grad.addColorStop(1, '#ca8a04'); // Rim amber
  ctx.fillStyle = grad;
  ctx.fill();

  // Subtle oil-gland pore texture
  ctx.fillStyle = 'rgba(180, 120, 0, 0.12)';
  for (let i = 0; i < 45; i++) {
    const rx = (Math.sin(i * 3.7) * 85);
    const ry = (Math.cos(i * 2.3) * 65);
    ctx.beginPath();
    ctx.arc(rx, ry, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Small Fresh Green Stem / Calyx Nub
  ctx.fillStyle = '#4d7c0f';
  ctx.beginPath();
  ctx.ellipse(-116, 0, 6, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Glossy rim highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();
}

// 2. Grade B Domestic Retail (Meyer Lemon: Minor superficial branch rub scratch, ~6% blemish)
function drawGradeBRetailLemon(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 95, 105, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Silhouette
  ctx.beginPath();
  ctx.moveTo(-110, 0);
  ctx.bezierCurveTo(-110, -72, -45, -84, 0, -84);
  ctx.bezierCurveTo(55, -84, 110, -68, 110, 0);
  ctx.bezierCurveTo(110, 68, 55, 84, 0, 84);
  ctx.bezierCurveTo(-45, 84, -110, 72, -110, 0);
  ctx.closePath();

  // Meyer lemon warm yellow-orange gradient
  const grad = ctx.createRadialGradient(-20, -20, 20, 0, 0, 115);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.4, '#facc15');
  grad.addColorStop(0.85, '#eab308');
  grad.addColorStop(1, '#b45309');
  ctx.fillStyle = grad;
  ctx.fill();

  // Superficial branch rub / minor scuff marks (non-pathogenic, domestic supermarket quality)
  const scuffGrad = ctx.createRadialGradient(28, -20, 2, 28, -20, 26);
  scuffGrad.addColorStop(0, '#582404');
  scuffGrad.addColorStop(0.7, '#854d0e');
  scuffGrad.addColorStop(1, 'rgba(133, 77, 14, 0)');
  ctx.fillStyle = scuffGrad;
  ctx.beginPath();
  ctx.ellipse(28, -20, 28, 16, 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(-20, 22, 18, 10, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Small dry calyx
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(-111, 0, 5, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 3. Grade C Processing Stock (Sunburned, lumpy, 18% surface discoloration, good interior)
function drawGradeCProcessingLemon(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 95, 105, 25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Slightly lopsided shape
  ctx.beginPath();
  ctx.moveTo(-105, -5);
  ctx.bezierCurveTo(-105, -78, -35, -88, 10, -82);
  ctx.bezierCurveTo(65, -76, 115, -60, 112, 10);
  ctx.bezierCurveTo(108, 75, 45, 88, -10, 85);
  ctx.bezierCurveTo(-60, 82, -105, 68, -105, -5);
  ctx.closePath();

  const grad = ctx.createRadialGradient(-15, -20, 20, 0, 0, 115);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.5, '#eab308');
  grad.addColorStop(1, '#92400e');
  ctx.fillStyle = grad;
  ctx.fill();

  // Broad light tan / brown sunburn patch (~18% surface blemish, intact sound pulp)
  const burnGrad = ctx.createRadialGradient(25, 10, 5, 25, 10, 52);
  burnGrad.addColorStop(0, '#582404');
  burnGrad.addColorStop(0.65, '#854d0e');
  burnGrad.addColorStop(1, 'rgba(133, 77, 14, 0)');
  ctx.fillStyle = burnGrad;
  ctx.beginPath();
  ctx.ellipse(25, 10, 54, 40, 0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 4. Grade D Anthracnose Rot (Severe necrotic black sunken lesions, 32% rot)
function drawGradeDAnthracnoseLemon(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 95, 100, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Dull, decomposing lemon body
  ctx.beginPath();
  ctx.moveTo(-108, 0);
  ctx.bezierCurveTo(-108, -72, -45, -82, 0, -82);
  ctx.bezierCurveTo(55, -82, 108, -68, 108, 0);
  ctx.bezierCurveTo(108, 68, 55, 82, 0, 82);
  ctx.bezierCurveTo(-45, 82, -108, 72, -108, 0);
  ctx.closePath();

  // Desaturated decaying flavedo
  const grad = ctx.createRadialGradient(-15, -15, 20, 0, 0, 115);
  grad.addColorStop(0, '#fde047');
  grad.addColorStop(0.4, '#ca8a04');
  grad.addColorStop(0.8, '#854d0e');
  grad.addColorStop(1, '#451a03');
  ctx.fillStyle = grad;
  ctx.fill();

  // Major Anthracnose necrotic lesion #1 (Sunken dark brown-black rot)
  const lesionGrad1 = ctx.createRadialGradient(15, -10, 5, 15, -10, 48);
  lesionGrad1.addColorStop(0, '#1c1917'); // Pitch black necrotic core
  lesionGrad1.addColorStop(0.55, '#451a03'); // Dark rotten brown
  lesionGrad1.addColorStop(0.85, '#78350f'); // Softening margin
  lesionGrad1.addColorStop(1, 'rgba(120, 53, 15, 0)');
  ctx.fillStyle = lesionGrad1;
  ctx.beginPath();
  ctx.ellipse(15, -10, 50, 36, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Secondary Anthracnose satellite lesion #2
  const lesionGrad2 = ctx.createRadialGradient(-40, 25, 4, -40, 25, 34);
  lesionGrad2.addColorStop(0, '#1c1917');
  lesionGrad2.addColorStop(0.65, '#451a03');
  lesionGrad2.addColorStop(1, 'rgba(69, 26, 3, 0)');
  ctx.fillStyle = lesionGrad2;
  ctx.beginPath();
  ctx.ellipse(-40, 25, 36, 28, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Third small lesion near stem
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.ellipse(-78, -12, 18, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 5. Grade D Penicillium Fungal Rot (Green/Blue Mold Mycelium Spores, Bio-hazard)
function drawGradeDFungalMoldLemon(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 95, 102, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Deformed softened fruit outline
  ctx.beginPath();
  ctx.moveTo(-110, 0);
  ctx.bezierCurveTo(-110, -70, -45, -85, 0, -82);
  ctx.bezierCurveTo(55, -80, 105, -60, 104, 5);
  ctx.bezierCurveTo(102, 65, 48, 80, -5, 82);
  ctx.bezierCurveTo(-50, 84, -110, 70, -110, 0);
  ctx.closePath();

  const grad = ctx.createRadialGradient(-15, -15, 20, 0, 0, 115);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.4, '#d97706');
  grad.addColorStop(0.85, '#78350f');
  grad.addColorStop(1, '#292524');
  ctx.fillStyle = grad;
  ctx.fill();

  // Soft rot water-soaked lesion base
  ctx.fillStyle = 'rgba(69, 26, 3, 0.85)';
  ctx.beginPath();
  ctx.ellipse(5, 5, 68, 52, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Penicillium White Mycelial Margin (Fuzzy fungal fringe)
  ctx.fillStyle = 'rgba(240, 253, 250, 0.9)';
  ctx.beginPath();
  ctx.ellipse(5, 5, 54, 42, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Penicillium digitatum Teal-Green Spore Center (Contagious pathogen)
  const moldGrad = ctx.createRadialGradient(5, 5, 5, 5, 5, 42);
  moldGrad.addColorStop(0, '#134e4a'); // Deep teal mold center
  moldGrad.addColorStop(0.55, '#14b8a6'); // Vivid green-blue mycelium
  moldGrad.addColorStop(0.85, '#99f6e4'); // Pale fungal rim
  moldGrad.addColorStop(1, 'rgba(153, 246, 228, 0)');
  ctx.fillStyle = moldGrad;
  ctx.beginPath();
  ctx.ellipse(5, 5, 44, 34, 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 6. Pre-Harvest / Unripe Green Citrus (78% chlorophyll, firm, needs degreening)
function drawUnripeGreenCitrus(ctx, cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 95, 108, 23, 0, 0, Math.PI * 2);
  ctx.fill();

  // Silhouette
  ctx.beginPath();
  ctx.moveTo(-112, 0);
  ctx.bezierCurveTo(-112, -74, -48, -86, 0, -86);
  ctx.bezierCurveTo(58, -86, 112, -70, 112, 0);
  ctx.bezierCurveTo(112, 70, 58, 86, 0, 86);
  ctx.bezierCurveTo(-48, 86, -112, 74, -112, 0);
  ctx.closePath();

  // Vibrant Lime Green Chlorophyll Gradient
  const grad = ctx.createRadialGradient(-20, -25, 20, 0, 0, 120);
  grad.addColorStop(0, '#bef264'); // Pale lime highlight
  grad.addColorStop(0.35, '#84cc16'); // Bright chlorophyll green
  grad.addColorStop(0.8, '#4d7c0f'); // Deep citrus olive green
  grad.addColorStop(1, '#365314'); // Dark rim
  ctx.fillStyle = grad;
  ctx.fill();

  // Tight fresh green stem
  ctx.fillStyle = '#166534';
  ctx.beginPath();
  ctx.ellipse(-113, 0, 6, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// 7. Blind-Spot Specimen: Pristine Top (0°), Hidden Anthracnose Rot on Underside (180°)
function drawBlindSpotSpecimen(ctx, cx, cy, angle = 0) {
  ctx.save();
  ctx.translate(cx, cy);

  // Optical staging shadow
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 95, 108, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  // Lemon body (smooth Eureka contour)
  ctx.beginPath();
  ctx.moveTo(-110, 0);
  ctx.bezierCurveTo(-110, -75, -45, -86, 0, -86);
  ctx.bezierCurveTo(55, -86, 110, -70, 110, 0);
  ctx.bezierCurveTo(110, 70, 55, 86, 0, 86);
  ctx.bezierCurveTo(-45, 86, -110, 75, -110, 0);
  ctx.closePath();

  // Base flavedo gradient (bright healthy yellow)
  const grad = ctx.createRadialGradient(-20, -25, 20, 0, 0, 120);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.35, '#facc15');
  grad.addColorStop(0.8, '#ca8a04');
  grad.addColorStop(1, '#854d0e');
  ctx.fillStyle = grad;
  ctx.fill();

  // Rotational defect appearance based on biconical roller angle
  if (angle === 180) {
    // 180° UNDERSIDE VENTRAL VIEW: Hidden severe rotting patch exposed!
    const lesionGrad = ctx.createRadialGradient(10, 5, 5, 10, 5, 52);
    lesionGrad.addColorStop(0, '#1c1917'); // Pitch black necrotic core
    lesionGrad.addColorStop(0.55, '#451a03'); // Dark rotting brown
    lesionGrad.addColorStop(0.85, '#78350f'); // Softening decay ring
    lesionGrad.addColorStop(1, 'rgba(120, 53, 15, 0)');
    ctx.fillStyle = lesionGrad;
    ctx.beginPath();
    ctx.ellipse(10, 5, 52, 38, -0.15, 0, Math.PI * 2);
    ctx.fill();

    // Satellite lesion
    const satGrad = ctx.createRadialGradient(-40, -12, 2, -40, -12, 24);
    satGrad.addColorStop(0, '#1c1917');
    satGrad.addColorStop(0.65, '#451a03');
    satGrad.addColorStop(1, 'rgba(69, 26, 3, 0)');
    ctx.fillStyle = satGrad;
    ctx.beginPath();
    ctx.ellipse(-40, -12, 25, 18, 0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (angle === 90 || angle === 270) {
    // 90° & 270° LATERAL VIEWS: Peripheral edge of the sunken brown rot creeping in
    const edgeGrad = ctx.createRadialGradient(0, 50, 4, 0, 50, 30);
    edgeGrad.addColorStop(0, '#451a03');
    edgeGrad.addColorStop(0.65, '#78350f');
    edgeGrad.addColorStop(1, 'rgba(120, 53, 15, 0)');
    ctx.fillStyle = edgeGrad;
    ctx.beginPath();
    ctx.ellipse(0, 50, 34, 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // At angle === 0 (0° TOP DORSAL VIEW): Completely clean, spotless flavedo!

  // Calyx
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  ctx.ellipse(-111, 0, 5, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export const SAMPLE_CITRUS_CATALOG = [
  {
    id: 'sample_real_photo',
    title: 'Specimen 0: Real Eureka Photo',
    gradeExpected: 'A',
    badge: 'REAL PHOTO',
    badgeColor: '#22c55e',
    spec: 'Studio macro photo, organic flavedo pores & calyx',
    desc: 'Authentic high-resolution fruit photograph validating edge vision.'
  },
  {
    id: 'sample_hidden_defect',
    title: 'Specimen F: 360° Roller Blind-Spot',
    gradeExpected: 'D (AT 180°)',
    badge: '360° BLIND-SPOT',
    badgeColor: '#ec4899',
    spec: 'Clean at 0°, Severe Anthracnose rot at 180°',
    desc: 'Critical proof that single-angle vision fails without biconical rollers.'
  },
  {
    id: 'sample_grade_a',
    title: 'Specimen A: Export Eureka',
    gradeExpected: 'A',
    badge: 'GRADE A - EXPORT',
    badgeColor: '#22c55e',
    spec: 'Flawless 61mm, <1% blemish, 94% yellow ripeness',
    desc: 'Meets APEDA & European import standards. High turgor, sound flavedo.'
  },
  {
    id: 'sample_grade_b',
    title: 'Specimen B: Supermarket Meyer',
    gradeExpected: 'B',
    badge: 'GRADE B - RETAIL',
    badgeColor: '#f59e0b',
    spec: 'Minor superficial rub, 5.8% blemish, 58mm',
    desc: 'Local supermarket quality. Edible, firm pulp with light skin scuff.'
  },
  {
    id: 'sample_grade_c',
    title: 'Specimen C: Juicing & Pectin',
    gradeExpected: 'C',
    badge: 'GRADE C - JUICING',
    badgeColor: '#38bdf8',
    spec: 'Sunburned rind, 17.5% blemish, 66mm',
    desc: 'Cosmetically flawed, but high citric acid yield. Divert to juice press.'
  },
  {
    id: 'sample_grade_d_anthracnose',
    title: 'Specimen D1: Anthracnose Rot',
    gradeExpected: 'D',
    badge: 'GRADE D - REJECT',
    badgeColor: '#ef4444',
    spec: 'Necrotic black lesions, 31.4% decay, Soft',
    desc: 'Colletotrichum fungus. High ethylene producer. Must be quarantined.'
  },
  {
    id: 'sample_grade_d_mold',
    title: 'Specimen D2: Penicillium Mold',
    gradeExpected: 'D',
    badge: 'GRADE D - CONTAGIOUS',
    badgeColor: '#ef4444',
    spec: 'Teal spore mycelium, Soft water-soaked rot',
    desc: 'Green mold spores. Will contaminate adjacent crates in 48 hours!'
  },
  {
    id: 'sample_unripe_green',
    title: 'Specimen E: Unripe Green Citrus',
    gradeExpected: 'UNRIPE',
    badge: 'UNRIPE - GREEN',
    badgeColor: '#84cc16',
    spec: '78% Chlorophyll retention, High firmness',
    desc: 'Early harvest. Requires ethylene degreening chamber incubation.'
  }
];

export const INTERNET_CITRUS_BENCHMARK = [
  // Grade A (Export)
  {
    id: 'lemon_01',
    title: 'Internet #01: Eureka Table Lemon',
    category: 'Grade A',
    gradeExpected: 'A',
    badge: 'GRADE A - EXPORT',
    badgeColor: '#22c55e',
    spec: 'Canary yellow flavedo, 0% defect, 66.8mm, high turgor',
    desc: 'Real table lemon photographed on clean staging surface. Flawless export standard.',
    imgSrc: '/samples/internet/lemon_01.jpg'
  },
  {
    id: 'lemon_02',
    title: 'Internet #02: Lisbon European Lemon',
    category: 'Grade A',
    gradeExpected: 'A',
    badge: 'GRADE A - EXPORT',
    badgeColor: '#22c55e',
    spec: 'Salzburg orchard harvest, smooth oil glands, sound pulp',
    desc: 'Meets European Class I import standard. Uniform canary flavedo.',
    imgSrc: '/samples/internet/lemon_02.jpg'
  },
  {
    id: 'lemon_03',
    title: 'Internet #03: Orchard Lemon with Leaf',
    category: 'Grade A',
    gradeExpected: 'A',
    badge: 'GRADE A - EXPORT',
    badgeColor: '#22c55e',
    spec: 'Fresh tree harvest, green calyx leaf, ripe yellow flavedo',
    desc: 'Tests foliage rejection: algorithm correctly isolates yellow fruit from green leaves.',
    imgSrc: '/samples/internet/lemon_03.jpg'
  },
  {
    id: 'lemon_04',
    title: 'Internet #04: Flawless Market Lemon',
    category: 'Grade A',
    gradeExpected: 'A',
    badge: 'GRADE A - EXPORT',
    badgeColor: '#22c55e',
    spec: 'Single whole lemon, high sphericity, 0% blemish',
    desc: 'Premium table market specimen with vibrant canary coloration.',
    imgSrc: '/samples/internet/lemon_04.jpg'
  },

  // Grade B (Retail Table)
  {
    id: 'lemon_05',
    title: 'Internet #05: Tabletop Retail Lemon',
    category: 'Grade B',
    gradeExpected: 'B',
    badge: 'GRADE B - RETAIL',
    badgeColor: '#f59e0b',
    spec: 'Supermarket table lemon on rustic board, minor handling friction',
    desc: 'Domestic supermarket table quality. Edible, firm pulp with light skin scuff.',
    imgSrc: '/samples/internet/lemon_05.jpg'
  },
  {
    id: 'lemon_06',
    title: 'Internet #06: Citrus Branch Rub',
    category: 'Grade B',
    gradeExpected: 'B',
    badge: 'GRADE B - RETAIL',
    badgeColor: '#f59e0b',
    spec: 'Tree-ripened citrus with localized foliage rub (<8% rind area)',
    desc: 'Domestic grocery grade. Rind shows natural branch friction marks.',
    imgSrc: '/samples/internet/lemon_06.jpg'
  },
  {
    id: 'lemon_07',
    title: 'Internet #07: Harvested Calyx Lemon',
    category: 'Grade B',
    gradeExpected: 'B',
    badge: 'GRADE B - RETAIL',
    badgeColor: '#f59e0b',
    spec: 'Ripe lemon with natural rind texture variations, sound pulp',
    desc: 'Domestic table fruit with natural surface oil gland mottling.',
    imgSrc: '/samples/internet/lemon_07.jpg'
  },
  {
    id: 'lemon_08',
    title: 'Internet #08: Orchard Rind Mottle',
    category: 'Grade B',
    gradeExpected: 'B',
    badge: 'GRADE B - RETAIL',
    badgeColor: '#f59e0b',
    spec: 'Domestic market grade, superficial wind scuffing, 5.0% defect',
    desc: 'Sound interior pulp, minor superficial weathering on outer flavedo.',
    imgSrc: '/samples/internet/lemon_08.jpg'
  },

  // Grade C (Industrial Processing)
  {
    id: 'lemon_09',
    title: 'Internet #09: Citrus Jambhiri Rough Lemon',
    category: 'Grade C',
    gradeExpected: 'C',
    badge: 'GRADE C - JUICING',
    badgeColor: '#38bdf8',
    spec: 'Heavily textured rough flavedo, thick albedo rind',
    desc: 'High citric acid content. Divert to commercial juice & pectin processing.',
    imgSrc: '/samples/internet/lemon_09.jpg'
  },
  {
    id: 'lemon_10',
    title: 'Internet #10: Assam Kaji Nemu Processing',
    category: 'Grade C',
    gradeExpected: 'C',
    badge: 'GRADE C - JUICING',
    badgeColor: '#38bdf8',
    spec: 'Oblong indigenous Assam citrus, thick pitted rind',
    desc: 'Acidic juicing fruit. High ascorbic acid yield for concentrate extraction.',
    imgSrc: '/samples/internet/lemon_10.jpg'
  },
  {
    id: 'lemon_11',
    title: 'Internet #11: Rough Skinned Processing Citrus',
    category: 'Grade C',
    gradeExpected: 'C',
    badge: 'GRADE C - JUICING',
    badgeColor: '#38bdf8',
    spec: 'Coarse flavedo with irregular ridges, asymmetric shape',
    desc: 'Too cosmetically irregular for table display. Sent to juice press.',
    imgSrc: '/samples/internet/lemon_11.jpg'
  },
  {
    id: 'lemon_12',
    title: 'Internet #12: Scarred Organic Lemon',
    category: 'Grade C',
    gradeExpected: 'C',
    badge: 'GRADE C - JUICING',
    badgeColor: '#38bdf8',
    spec: 'Organic fruit with thrips scarring and thick pebbled skin',
    desc: 'Unsprayed organic fruit diverted to pectin and industrial citrus oil.',
    imgSrc: '/samples/internet/lemon_12.jpg'
  },

  // Grade D (Pathological Reject / Biohazard)
  {
    id: 'lemon_13',
    title: 'Internet #13: Citrus Canker (Xanthomonas)',
    category: 'Grade D',
    gradeExpected: 'D',
    badge: 'GRADE D - BIOHAZARD',
    badgeColor: '#ef4444',
    spec: 'Eruptive corky pustules with chlorotic halos (Xanthomonas citri)',
    desc: 'USDA quarantined bacterial phytosanitary biohazard. Zero-tolerance cull.',
    imgSrc: '/samples/internet/lemon_13.jpg'
  },
  {
    id: 'lemon_14',
    title: 'Internet #14: Citrus Black Spot (Phyllosticta)',
    category: 'Grade D',
    gradeExpected: 'D',
    badge: 'GRADE D - REJECT',
    badgeColor: '#ef4444',
    spec: 'Necrotic hard spot lesions with dark margins (Phyllosticta citricarpa)',
    desc: 'Fungal pathogen causing fruit drop. Prohibited under APEDA export laws.',
    imgSrc: '/samples/internet/lemon_14.jpg'
  },
  {
    id: 'lemon_15',
    title: 'Internet #15: Penicillium Green Mold',
    category: 'Grade D',
    gradeExpected: 'D',
    badge: 'GRADE D - CONTAGIOUS',
    badgeColor: '#ef4444',
    spec: 'Powdery green mold mycelium, rapid rot decomposition',
    desc: 'Penicillium digitatum spores. Cross-contaminates adjacent mandi crates.',
    imgSrc: '/samples/internet/lemon_15.jpg'
  },
  {
    id: 'lemon_16',
    title: 'Internet #16: Advanced Canker Pustules',
    category: 'Grade D',
    gradeExpected: 'D',
    badge: 'GRADE D - REJECT',
    badgeColor: '#ef4444',
    spec: 'Deep crater-like canker lesions, necrotic fruit collapse',
    desc: 'Advanced stage phytosanitary reject. Immediate compost diversion.',
    imgSrc: '/samples/internet/lemon_16.jpg'
  },

  // Unripe Green Citrus
  {
    id: 'lemon_17',
    title: 'Internet #17: Unripe Green Branch Lemon',
    category: 'Unripe',
    gradeExpected: 'UNRIPE',
    badge: 'UNRIPE - GREEN',
    badgeColor: '#84cc16',
    spec: 'Deep chlorophyll flavedo, high turgor, pre-harvest maturity',
    desc: 'Immature citrus. Requires ethylene incubation for commercial color break.',
    imgSrc: '/samples/internet/lemon_17.jpg'
  },
  {
    id: 'lemon_18',
    title: 'Internet #18: Orchard Green Citrus',
    category: 'Unripe',
    gradeExpected: 'UNRIPE',
    badge: 'UNRIPE - GREEN',
    badgeColor: '#84cc16',
    spec: '88% Chlorophyll retention, immature acid ratio',
    desc: 'Early harvest. Divert to degreening chamber or sour condiment market.',
    imgSrc: '/samples/internet/lemon_18.jpg'
  },
  {
    id: 'lemon_19',
    title: 'Internet #19: Immature Green Lime Citrus',
    category: 'Unripe',
    gradeExpected: 'UNRIPE',
    badge: 'UNRIPE - GREEN',
    badgeColor: '#84cc16',
    spec: 'Dark green lime peel, acidic juice vesicle density',
    desc: 'Green citrus wholesale grade. Held for degreening or sold as tart lime.',
    imgSrc: '/samples/internet/lemon_19.jpg'
  },
  {
    id: 'lemon_20',
    title: 'Internet #20: Early Season Green Citrus',
    category: 'Unripe',
    gradeExpected: 'UNRIPE',
    badge: 'UNRIPE - GREEN',
    badgeColor: '#84cc16',
    spec: '99% Chlorophyll retention, hard peel',
    desc: 'Pre-climacteric fruit before natural carotenoid flavedo synthesis.',
    imgSrc: '/samples/internet/lemon_20.jpg'
  }
];
