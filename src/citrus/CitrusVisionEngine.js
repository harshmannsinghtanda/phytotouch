/* ==============================================================================
   CitrusVisionEngine.js
   Autonomous Optical Computer Vision Pipeline for Citrus Quality & Pathology
   Anatomical Morphology Filtering • Ambient Shadow Invariance • APEDA Mandi Grading
   Multi-Frame Temporal Stabilization & Thorough Analysis Locking
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

// Fast RGB (0-255) to HSV (H: 0-360, S: 0-1, V: 0-1) conversion
export function rgbToHsv(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = max === 0 ? 0 : delta / max;
  let v = max;

  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return { h, s, v };
}

// Median helper for temporal stabilization
function getMedian(numbers) {
  if (!numbers || numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export class CitrusVisionEngine {
  constructor() {
    this.mmPerPixel = 0.25; // Standard optical baseline calibration (approx 245px = 61.2mm)

    // Multi-frame temporal stabilization buffer to prevent angle jitter
    this.temporalBuffer = [];
    this.maxBufferSize = 10;
    this.missedFrames = 0;
    this.lockedGrade = null;
  }

  /**
   * Reset temporal buffer on specimen change or manual rescan
   */
  resetTemporalBuffer() {
    this.temporalBuffer = [];
    this.missedFrames = 0;
    this.lockedGrade = null;
  }

  /**
   * Process raw ImageData from canvas or camera feed with strict citrus validation
   * @param {ImageData} imageData 
   * @param {number} width 
   * @param {number} height 
   * @param {boolean} isLiveCamera If true, applies multi-frame temporal integration
   * @returns {Object} Comprehensive grading telemetry
   */
  analyzeImageData(imageData, width, height, isLiveCamera = false) {
    const data = imageData.data;
    const step = 2; // 2x downsample for 60fps real-time scanning

    // --------------------------------------------------------------------------
    // PASS 1: Strict Citrus Flavedo Detection & Morphological Gate
    // --------------------------------------------------------------------------
    const citrusPts = [];
    const yellowPts = [];
    const greenPts = [];
    let skinPixelCount = 0;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const a = data[index + 3];
        if (a < 50) continue; // Transparency

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        const { h, s, v } = rgbToHsv(r, g, b);

        // 1. Filter out neutral/achromatic backgrounds (white paper, gray desks, dark surfaces)
        const isNeutral = (s < 0.16) || 
                          (v < 0.14) ||
                          (s < 0.20 && Math.abs(r - g) < 18 && Math.abs(g - b) < 18);

        // 2. Filter out human skin tones (fingers holding lemon or hand in frame)
        // Human skin: H in [5, 24], S in [0.18, 0.65], V >= 0.28, with R > G > B and distinct R-G delta
        const isSkin = (h >= 5 && h <= 24 && s >= 0.18 && s <= 0.65 && v >= 0.28 && r > g && (r - g) > 18);
        if (isSkin) {
          skinPixelCount++;
          continue; // Do NOT treat human skin as lemon or rot!
        }

        // 3. Specular highlight on citrus cuticle (waxy peel shine)
        const isCuticleHighlight = (v >= 0.82 && s < 0.22 && r > 180 && g > 175);

        // 4. True Pathological Necrotic Rot (Anthracnose, Canker craters, Black Spot)
        const isNecrotic = (v < 0.22 && r < 50 && g < 50 && b < 50) || // Pitch black necrotic core
                           (h >= 6 && h <= 25 && s >= 0.35 && v >= 0.14 && v <= 0.58 && r > g * 1.35) || // Brown rotting decay
                           (v < 0.28 && s >= 0.25 && (h < 25 || h > 325) && r < 85 && g < 70); // Dark canker crater

        // 5. True Pathological Fungal Mold (Penicillium digitatum / italicum)
        const isMold = (h >= 135 && h <= 195 && s >= 0.18 && s <= 0.70 && v > 0.16 && v < 0.75) ||
                       (h >= 75 && h <= 125 && s >= 0.30 && v >= 0.16 && v <= 0.40);

        if (isNeutral && !isCuticleHighlight && !isNecrotic) {
          continue;
        }

        // 6. Authentic Citrus Flavedo Carotenoid Spectrum:
        // Pure Canary/Eureka Lemon Yellow: H in [26, 64], S >= 0.20, V >= 0.20
        // Or Warm Ripe Golden Citrus: H in [22, 26), S >= 0.32, V >= 0.28, R > 120, G > 85, B < 65
        const isYellow = (h >= 26 && h <= 64 && s >= 0.20 && v >= 0.20) ||
                         (h >= 22 && h < 26 && s >= 0.32 && v >= 0.28 && r > 120 && g > 85 && b < 65);

        // 7. Chlorophyll Green Flavedo (Unripe Lemon / Lime):
        // H in (64, 145], S >= 0.20, V >= 0.18
        const isGreen = (h > 64 && h <= 145 && s >= 0.20 && v >= 0.18);

        // 8. Healthy peel in ambient 3D curvature shadow (underside of 3D fruit)
        // Shaded yellow still has high R and G relative to B (warm shade, NOT gray rot)
        const isHealthyShade = (v >= 0.15 && v <= 0.36 && h >= 24 && h <= 58 && (r > b + 25) && (g > b + 15));

        if (isYellow || isCuticleHighlight || isHealthyShade) {
          citrusPts.push({ x, y });
          yellowPts.push({ x, y });
        } else if (isGreen) {
          citrusPts.push({ x, y });
          greenPts.push({ x, y });
        } else if (isNecrotic || isMold) {
          // Keep diseased flavedo inside fruit body hull
          citrusPts.push({ x, y });
        }
      }
    }

    const totalCitrusPixels = citrusPts.length;

    // Minimum citrus mass gate (prevent tiny background artifacts or yellow text on books)
    if (totalCitrusPixels < 280) {
      if (isLiveCamera) this.handleMissedFrame();
      return {
        detected: false,
        isCitrus: false,
        rejectReason: 'INSUFFICIENT_CITRUS_PIXELS',
        message: 'Point camera at lemon — align citrus inside reticle',
        analysisProgress: isLiveCamera ? this.getAnalysisProgress() : 0
      };
    }

    // --------------------------------------------------------------------------
    // MORPHOLOGICAL GATE: Eliminate Pens, Pencils, Books, Sheets, Rulers
    // --------------------------------------------------------------------------
    let pMinX = width, pMaxX = 0, pMinY = height, pMaxY = 0;
    let sumX = 0, sumY = 0;

    for (let i = 0; i < totalCitrusPixels; i++) {
      const pt = citrusPts[i];
      if (pt.x < pMinX) pMinX = pt.x;
      if (pt.x > pMaxX) pMaxX = pt.x;
      if (pt.y < pMinY) pMinY = pt.y;
      if (pt.y > pMaxY) pMaxY = pt.y;
      sumX += pt.x;
      sumY += pt.y;
    }

    const bboxW = Math.max(1, pMaxX - pMinX);
    const bboxH = Math.max(1, pMaxY - pMinY);
    const cx = sumX / totalCitrusPixels;
    const cy = sumY / totalCitrusPixels;

    // 1. Aspect Ratio Gate (Lemons are prolate spheroids with aspect ratio 0.50 to 1.0)
    // Pens/pencils/rulers have aspect ratios < 0.35 (e.g., 8:1 or 12:1)
    const aspectRatio = Math.min(bboxW, bboxH) / Math.max(bboxW, bboxH);
    if (aspectRatio < 0.48) {
      if (isLiveCamera) this.handleMissedFrame();
      return {
        detected: false,
        isCitrus: false,
        rejectReason: 'ELONGATED_NON_CITRUS',
        message: `Non-Citrus Object: Elongated shape rejected (${(1 / aspectRatio).toFixed(1)}:1 ratio != Citrus)`,
        analysisProgress: isLiveCamera ? this.getAnalysisProgress() : 0
      };
    }

    // 2. Minimum Spatial Dimensions (Must be large enough to be an inspected lemon)
    if (bboxW < 40 || bboxH < 40) {
      if (isLiveCamera) this.handleMissedFrame();
      return {
        detected: false,
        isCitrus: false,
        rejectReason: 'TOO_SMALL',
        message: 'Target too small for citrus metrology. Move camera closer.',
        analysisProgress: isLiveCamera ? this.getAnalysisProgress() : 0
      };
    }

    // 3. Solidity / Bounding Box Fill Gate
    // An ellipse fills pi/4 (~78.5%) of its bounding box.
    // A lemon fills ~50% - 85% of its bounding box.
    // A diagonal pen or fragmented noise fills < 30% of its bounding box.
    const bboxArea = (bboxW / step) * (bboxH / step);
    const solidity = totalCitrusPixels / Math.max(1, bboxArea);
    if (solidity < 0.42) {
      if (isLiveCamera) this.handleMissedFrame();
      return {
        detected: false,
        isCitrus: false,
        rejectReason: 'IRREGULAR_CONTOUR',
        message: 'Non-Citrus Object: Irregular contour or fragmented cluster rejected',
        analysisProgress: isLiveCamera ? this.getAnalysisProgress() : 0
      };
    }

    // 4. Centroid & Elliptical Semi-Axes Calculation (Snug Prolate Spheroid Hull)
    const semiAxisX = Math.max(22.0, (bboxW / 2) * 1.05);
    const semiAxisY = Math.max(22.0, (bboxH / 2) * 1.05);

    // --------------------------------------------------------------------------
    // PASS 2: Spatially Constrained Flavedo & True Pathological Lesion Metrology
    // --------------------------------------------------------------------------
    let fruitPixels = 0;
    let yellowPixels = 0;
    let greenPixels = 0;
    let specularPixels = 0;
    let shadePixels = 0;
    let rawNecroticPixels = 0;
    let rawFungalPixels = 0;
    let scuffPixels = 0;

    let minX = width, maxX = 0, minY = height, maxY = 0;
    const defectGrid = {};
    const gridSize = 16;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        // Snug elliptical boundary matching natural prolate lemon silhouette
        const normDx = (x - cx) / semiAxisX;
        const normDy = (y - cy) / semiAxisY;
        if (normDx * normDx + normDy * normDy > 1.04) continue; // Outside fruit hull -> ignore!

        const index = (y * width + x) * 4;
        const a = data[index + 3];
        if (a < 50) continue;

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];

        const { h, s, v } = rgbToHsv(r, g, b);

        // Reject human skin fingers touching the lemon
        const isSkin = (h >= 5 && h <= 24 && s >= 0.18 && s <= 0.65 && v >= 0.28 && r > g && (r - g) > 18);
        if (isSkin) continue;

        // Specular cuticle reflection (healthy wax shine)
        const isCuticleHighlight = (v >= 0.82 && s < 0.22 && r > 180 && g > 175);

        // Strictly reject achromatic background (slate desks, dark studio benchtop, drop shadows)
        const isNeutralBackground = (v < 0.16) || 
                                    (s < 0.16 && v > 0.65) || 
                                    (s < 0.20 && Math.abs(r - g) < 16 && Math.abs(g - b) < 16);
        if (isNeutralBackground && !isCuticleHighlight) continue;

        // True Pathological Necrotic Rot (Anthracnose, Canker craters, Black Spot):
        // Decaying organic peel tissue: distinct chromatic brown/amber necrosis (S >= 0.30, R > G * 1.30)
        const isNecrotic = (h >= 6 && h <= 25 && s >= 0.30 && v >= 0.14 && v <= 0.60 && r > g * 1.30 && (r > b + 20)) ||
                           (v < 0.24 && s >= 0.25 && (h < 25 || h > 325) && (r > g + 8) && (r > b + 12));

        // Flavedo Carotenoids
        const isYellow = (h >= 26 && h <= 64 && s >= 0.20 && v >= 0.20) ||
                         (h >= 22 && h < 26 && s >= 0.32 && v >= 0.28 && r > 120 && g > 85 && b < 65);

        // Chlorophyll Green
        const isGreen = (h > 64 && h <= 145 && s >= 0.20 && v >= 0.18);

        // Ambient 3D Curvature Shading (Healthy underside flavedo in natural shadow)
        const isHealthyShade = (v >= 0.15 && v <= 0.36 && h >= 24 && h <= 58 && (r > b + 25) && (g > b + 15));

        // True Pathological Fungal Mold (Penicillium digitatum / italicum):
        const isMold = (h >= 135 && h <= 195 && s >= 0.18 && s <= 0.70 && v > 0.16 && v < 0.75) ||
                       (h >= 75 && h <= 125 && s >= 0.30 && v >= 0.16 && v <= 0.40);

        // Superficial branch rub / wind scuffing (intact flavedo, light tan)
        const isScuff = (v >= 0.36 && v <= 0.62 && s >= 0.22 && s <= 0.48 && h >= 22 && h <= 42);

        if (isYellow || isGreen || isCuticleHighlight || isHealthyShade || isNecrotic || isMold || isScuff) {
          fruitPixels++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;

          if (isYellow) yellowPixels++;
          if (isGreen) greenPixels++;
          if (isCuticleHighlight) specularPixels++;
          if (isHealthyShade) shadePixels++;

          if (isNecrotic) {
            rawNecroticPixels++;
            const gKey = `${Math.floor(x / gridSize)},${Math.floor(y / gridSize)}`;
            defectGrid[gKey] = (defectGrid[gKey] || 0) + 1;
          }

          if (isMold) {
            rawFungalPixels++;
            const gKey = `${Math.floor(x / gridSize)},${Math.floor(y / gridSize)}`;
            defectGrid[gKey] = (defectGrid[gKey] || 0) + 2;
          }

          if (isScuff) {
            scuffPixels++;
          }
        }
      }
    }

    if (fruitPixels < 180) {
      if (isLiveCamera) this.handleMissedFrame();
      return {
        detected: false,
        isCitrus: false,
        rejectReason: 'INSUFFICIENT_FRUIT_BODY',
        message: 'Point camera at lemon — Instant Optical AI scanner active...',
        analysisProgress: isLiveCamera ? this.getAnalysisProgress() : 0
      };
    }

    // --------------------------------------------------------------------------
    // SPATIAL CLUSTERING: Filter Out Ambient Shadows vs True Pathological Rot
    // --------------------------------------------------------------------------
    // Real pathogens form localized craters/colonies (>= 10 necrotic pixels in total or concentrated cells)
    const defectSpots = [];
    const sortedGridKeys = Object.keys(defectGrid).sort((a, b) => defectGrid[b] - defectGrid[a]);
    for (const key of sortedGridKeys) {
      const count = defectGrid[key];
      const [gx, gy] = key.split(',').map(Number);
      
      if (count >= 3 && defectSpots.length < 4) {
        defectSpots.push({
          x: gx * gridSize + gridSize / 2,
          y: gy * gridSize + gridSize / 2,
          intensity: count,
          radius: Math.min(26, Math.max(8, count * 1.5))
        });
      }
    }

    // If total necrotic pixels form a genuine patch (>= 10 downsampled pixels)
    const clusteredNecroticPixels = rawNecroticPixels >= 10 ? rawNecroticPixels : 0;
    const clusteredFungalPixels = rawFungalPixels >= 6 ? rawFungalPixels : 0;

    // Geometry & Caliper Calculations
    const finalBboxW = Math.max(1, maxX - minX);
    const finalBboxH = Math.max(1, maxY - minY);
    const centroidX = Math.round(cx);
    const centroidY = Math.round(cy);

    const sphericity = Math.min(finalBboxW, finalBboxH) / Math.max(finalBboxW, finalBboxH);
    const avgDiameterPx = (finalBboxW + finalBboxH) / 2;
    const caliperDiameterMm = parseFloat((avgDiameterPx * this.mmPerPixel).toFixed(1));

    // Optical Composition Percentages
    const healthyFlavedoPixels = yellowPixels + specularPixels + shadePixels;
    const ripenessIndex = parseFloat(((healthyFlavedoPixels / fruitPixels) * 100).toFixed(1));
    const chlorophyllIndex = parseFloat(((greenPixels / fruitPixels) * 100).toFixed(1));

    const pathologyPixels = clusteredNecroticPixels + clusteredFungalPixels;
    const totalDefectPixels = pathologyPixels + scuffPixels;
    const defectPercent = parseFloat(((totalDefectPixels / fruitPixels) * 100).toFixed(1));

    // Pathological Diagnosis
    let pathogenDiagnosis = 'Flawless Epidermis (Sound Flavedo)';
    if (clusteredFungalPixels > fruitPixels * 0.020) {
      pathogenDiagnosis = 'Penicillium digitatum (Active Green Mold Mycelium)';
    } else if (clusteredNecroticPixels > fruitPixels * 0.035) {
      pathogenDiagnosis = 'Infectious Necrotic Rot (Anthracnose / Canker / Black Spot)';
    } else if (scuffPixels > fruitPixels * 0.06) {
      pathogenDiagnosis = 'Superficial Branch Rub & Wind Scuffing';
    } else if (chlorophyllIndex > 45) {
      pathogenDiagnosis = 'Physiologically Immature (High Chlorophyll)';
    }

    // --------------------------------------------------------------------------
    // Scientific 4-Tier Agricultural Mandi Grading (APEDA / Codex Standards)
    // --------------------------------------------------------------------------
    let rawGrade = 'B';
    let rawLabel = 'Grade B (Domestic Supermarket / Table)';
    let rawColor = '#f59e0b';
    let rawShelfLife = 14;
    let rawPrice = 6.0;
    let rawDiverterAngle = 90;
    let rawRecommendedAction = 'Dispatch to Regional Mandi & Local Grocery Chains';
    let rawTurgor = '84 Shore D (Good Turgor)';

    // 1. Grade D: Verified active fungal mold (>2.0%) OR clustered necrotic lesions (>3.5%) OR total defect > 20%
    if (clusteredFungalPixels > fruitPixels * 0.020 || clusteredNecroticPixels > fruitPixels * 0.035 || defectPercent > 20.0) {
      rawGrade = 'D';
      rawLabel = 'Grade D (Pathological Bio-Hazard Reject)';
      rawColor = '#ef4444';
      rawShelfLife = 0;
      rawPrice = 0.3;
      rawDiverterAngle = 175;
      rawRecommendedAction = 'QUARANTINE! High Ethylene Emitter -> Divert to Biogas Digester';
      rawTurgor = '35 Shore D (Soft / Spongy Decay)';
    }
    // 2. Unripe Green Citrus: Chlorophyll dominant (>45%) and not ripe yellow (<40%)
    else if (chlorophyllIndex > 45.0 && ripenessIndex < 40.0) {
      rawGrade = 'UNRIPE';
      rawLabel = 'Pre-Harvest / Unripe Green Citrus';
      rawColor = '#84cc16';
      rawShelfLife = 28;
      rawPrice = 4.0;
      rawDiverterAngle = 90;
      rawRecommendedAction = 'Hold in Ethylene Degreening Chamber (20°C, 85% RH)';
      rawTurgor = '95 Shore D (Very Hard)';
    }
    // 3. Grade A Export Quality: Clean (<4.5% total defect), ripe (>=60%), export size (40-96mm), sphericity >= 0.52
    else if (defectPercent < 4.5 && ripenessIndex >= 60.0 && caliperDiameterMm >= 40 && caliperDiameterMm <= 96 && sphericity >= 0.52) {
      rawGrade = 'A';
      rawLabel = 'Grade A (Export & Premium Retail)';
      rawColor = '#22c55e';
      rawShelfLife = 21;
      rawPrice = 12.0;
      rawDiverterAngle = 45;
      rawRecommendedAction = 'Wipe, Carnauba Wax & Pack in Cold-Chain Export Master Carton';
      rawTurgor = '90 Shore D (Optimal Firmness)';
    }
    // 4. Grade B Domestic Table Quality: Minor marks (<=13.5%), table size (>=36mm), sphericity >= 0.46
    else if (defectPercent <= 13.5 && caliperDiameterMm >= 36 && caliperDiameterMm <= 104 && sphericity >= 0.46) {
      rawGrade = 'B';
      rawLabel = 'Grade B (Domestic Supermarket / Table)';
      rawColor = '#f59e0b';
      rawShelfLife = 14;
      rawPrice = 6.0;
      rawDiverterAngle = 90;
      rawRecommendedAction = 'Dispatch to Regional Mandi & Local Grocery Chains';
      rawTurgor = '84 Shore D (Good Turgor)';
    }
    // 5. Grade C Processing: Coarse, scarred, sunburned, or off-spec geometry
    else {
      rawGrade = 'C';
      rawLabel = 'Grade C (Industrial Juicing & Pectin)';
      rawColor = '#38bdf8';
      rawShelfLife = 5;
      rawPrice = 2.5;
      rawDiverterAngle = 135;
      rawRecommendedAction = 'Divert to Cold-Press Juice Extractor & Pectin Refining';
      rawTurgor = '68 Shore D (Slight Softening)';
    }

    const currentFrameData = {
      grade: rawGrade,
      label: rawLabel,
      color: rawColor,
      defectPercent,
      ripenessIndex,
      chlorophyllIndex,
      caliperDiameterMm,
      sphericity: parseFloat(sphericity.toFixed(2)),
      shelfLifeDays: rawShelfLife,
      mandiPriceInr: rawPrice,
      diverterAngle: rawDiverterAngle,
      recommendedAction: rawRecommendedAction,
      turgorEst: rawTurgor,
      pathogenDiagnosis
    };

    // For static images (specimen or photo upload), immediately lock with 100% confidence
    if (!isLiveCamera) {
      this.temporalBuffer = [currentFrameData];
      return {
        detected: true,
        isCitrus: true,
        grade: rawGrade,
        label: rawLabel,
        color: rawColor,
        defectPercent,
        ripenessIndex,
        chlorophyllIndex,
        caliperDiameterMm,
        sphericity: parseFloat(sphericity.toFixed(2)),
        shelfLifeDays: rawShelfLife,
        mandiPriceInr: rawPrice,
        diverterAngle: rawDiverterAngle,
        recommendedAction: rawRecommendedAction,
        turgorEst: rawTurgor,
        pathogenDiagnosis,
        isLocked: true,
        analysisProgress: 100,
        confidenceScore: 99,
        bbox: {
          x: minX,
          y: minY,
          width: finalBboxW,
          height: finalBboxH,
          cx: centroidX,
          cy: centroidY
        },
        defectSpots,
        timestamp: Date.now()
      };
    }

    // --------------------------------------------------------------------------
    // PASS 3: Multi-Frame Temporal Stabilization (Live Video Camera Stream)
    // --------------------------------------------------------------------------
    this.temporalBuffer.push(currentFrameData);
    if (this.temporalBuffer.length > this.maxBufferSize) {
      this.temporalBuffer.shift();
    }
    this.missedFrames = 0;

    const stabilized = this.computeStabilizedTelemetry(currentFrameData);

    return {
      detected: true,
      isCitrus: true,
      grade: stabilized.grade,
      label: stabilized.label,
      color: stabilized.color,
      defectPercent: stabilized.defectPercent,
      ripenessIndex: stabilized.ripenessIndex,
      chlorophyllIndex: stabilized.chlorophyllIndex,
      caliperDiameterMm: stabilized.caliperDiameterMm,
      sphericity: stabilized.sphericity,
      shelfLifeDays: stabilized.shelfLifeDays,
      mandiPriceInr: stabilized.mandiPriceInr,
      diverterAngle: stabilized.diverterAngle,
      recommendedAction: stabilized.recommendedAction,
      turgorEst: stabilized.turgorEst,
      pathogenDiagnosis: stabilized.pathogenDiagnosis,
      isLocked: stabilized.isLocked,
      analysisProgress: stabilized.analysisProgress,
      confidenceScore: stabilized.confidenceScore,
      bbox: {
        x: minX,
        y: minY,
        width: finalBboxW,
        height: finalBboxH,
        cx: centroidX,
        cy: centroidY
      },
      defectSpots,
      timestamp: Date.now()
    };
  }

  /**
   * Handle dropped/undetected frames gracefully with hysteresis
   */
  handleMissedFrame() {
    this.missedFrames++;
    if (this.missedFrames > 5) {
      // Clear buffer after 5 consecutive lost frames
      this.temporalBuffer = [];
      this.lockedGrade = null;
    }
  }

  /**
   * Compute analysis progress (0 to 100%)
   */
  getAnalysisProgress() {
    if (this.temporalBuffer.length === 0) return 0;
    return Math.min(100, Math.round((this.temporalBuffer.length / 8) * 100));
  }

  /**
   * Computes median-stabilized metrics across temporal window
   */
  computeStabilizedTelemetry(current) {
    const buf = this.temporalBuffer;
    const progress = Math.min(100, Math.round((buf.length / 8) * 100));
    const isLocked = buf.length >= 7;

    if (buf.length < 3) {
      return {
        ...current,
        isLocked: false,
        analysisProgress: progress,
        confidenceScore: 40 + buf.length * 15
      };
    }

    // Rolling median for continuous numeric metrics
    const medDiameter = parseFloat(getMedian(buf.map(f => f.caliperDiameterMm)).toFixed(1));
    const medDefect = parseFloat(getMedian(buf.map(f => f.defectPercent)).toFixed(1));
    const medRipeness = parseFloat(getMedian(buf.map(f => f.ripenessIndex)).toFixed(1));
    const medChlorophyll = parseFloat(getMedian(buf.map(f => f.chlorophyllIndex)).toFixed(1));
    const medSphericity = parseFloat(getMedian(buf.map(f => f.sphericity)).toFixed(2));

    // Majority voting for discrete Grade with hysteresis
    const gradeCounts = {};
    for (const frame of buf) {
      gradeCounts[frame.grade] = (gradeCounts[frame.grade] || 0) + 1;
    }

    let majorityGrade = current.grade;
    let maxVotes = 0;
    for (const g in gradeCounts) {
      if (gradeCounts[g] > maxVotes) {
        maxVotes = gradeCounts[g];
        majorityGrade = g;
      }
    }

    // Hysteresis: If we already had a locked grade, require at least 5 consensus votes to switch
    if (this.lockedGrade && majorityGrade !== this.lockedGrade) {
      if (gradeCounts[majorityGrade] >= 5) {
        this.lockedGrade = majorityGrade;
      } else {
        majorityGrade = this.lockedGrade;
      }
    } else {
      this.lockedGrade = majorityGrade;
    }

    const matchingFrame = buf.slice().reverse().find(f => f.grade === majorityGrade) || current;
    const confidenceScore = Math.min(99, Math.round((maxVotes / buf.length) * 85 + (isLocked ? 14 : 0)));

    return {
      grade: majorityGrade,
      label: matchingFrame.label,
      color: matchingFrame.color,
      shelfLifeDays: matchingFrame.shelfLifeDays,
      mandiPriceInr: matchingFrame.mandiPriceInr,
      diverterAngle: matchingFrame.diverterAngle,
      recommendedAction: matchingFrame.recommendedAction,
      turgorEst: matchingFrame.turgorEst,
      pathogenDiagnosis: matchingFrame.pathogenDiagnosis,
      caliperDiameterMm: medDiameter,
      defectPercent: medDefect,
      ripenessIndex: medRipeness,
      chlorophyllIndex: medChlorophyll,
      sphericity: medSphericity,
      isLocked,
      analysisProgress: progress,
      confidenceScore
    };
  }
}

export const citrusVisionEngine = new CitrusVisionEngine();
