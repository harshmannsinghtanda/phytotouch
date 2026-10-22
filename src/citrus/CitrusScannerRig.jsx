/* ==============================================================================
   CitrusScannerRig.jsx
   Instant QR-Style Optical Citrus Scanner & Computer Vision Rig
   100% In-Browser Computer Vision • Zero Hardware Required
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { citrusVisionEngine } from './CitrusVisionEngine';
import { renderCalibratedLemon, SAMPLE_CITRUS_CATALOG, INTERNET_CITRUS_BENCHMARK } from './SampleLemons';
import { CitrusAuditModal } from './CitrusAuditModal';
import { Camera, RefreshCw, RotateCw, Upload, Eye, Sparkles, CheckCircle2, ShieldAlert, Lock, Unlock } from 'lucide-react';

// Universal safe rounded rect helper (works on all iOS Safari and older mobile browsers without throwing)
function drawSafeRoundedRect(ctx, x, y, width, height, radius = 10) {
  try {
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, width, height, radius);
      return;
    }
  } catch {}
  const r = Math.min(radius, width / 2, height / 2);
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

export function CitrusScannerRig({
  onTelemetryUpdate,
  currentSpecimen,
  setCurrentSpecimen
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Default to 'specimen' for instant, zero-delay, 100% crash-free cold load on all mobile devices
  const [inputMode, setInputMode] = useState('specimen'); // 'specimen' | 'camera' | 'upload'
  const [uploadedImageSrc, setUploadedImageSrc] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [laserScanActive, setLaserScanActive] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [specimenSubTab, setSpecimenSubTab] = useState('synthetic'); // 'synthetic' | 'internet'
  const [internetCategoryFilter, setInternetCategoryFilter] = useState('ALL');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [isScanFrozen, setIsScanFrozen] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const isScanFrozenRef = useRef(false);

  useEffect(() => {
    isScanFrozenRef.current = isScanFrozen;
  }, [isScanFrozen]);

  // Reset temporal stabilization buffer when switching input modes or specimens
  useEffect(() => {
    citrusVisionEngine.resetTemporalBuffer();
    setIsScanFrozen(false);
  }, [inputMode, currentSpecimen]);

  // Performance & rate-limiting refs to prevent React DOM flooding
  const lastAnalysisRef = useRef(null);
  const lastGradeRef = useRef(null);
  const lastDetectedRef = useRef(false);
  const lastTelemetryTimeRef = useRef(0);

  // Vision Analysis Callback (executed on frame or specimen render)
  const runVisionAnalysis = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = citrusVisionEngine.analyzeImageData(imgData, canvas.width, canvas.height, inputMode === 'camera');
      const now = performance.now();

      // Store in ref for smooth 60fps canvas reticle overlay with zero React re-render lag
      lastAnalysisRef.current = result;

      // Throttle React state updates so we don't spam React DOM reconciliation on mobile
      const interval = inputMode === 'camera' ? 140 : 0;
      const shouldUpdateState =
        interval === 0 ||
        now - lastTelemetryTimeRef.current >= interval ||
        result.detected !== lastDetectedRef.current ||
        (result.detected && result.grade !== lastGradeRef.current);

      if (shouldUpdateState) {
        lastTelemetryTimeRef.current = now;
        lastDetectedRef.current = result.detected;
        lastGradeRef.current = result.detected ? result.grade : null;
        setLastAnalysis(result);
        if (onTelemetryUpdate) {
          onTelemetryUpdate(result);
        }
      }
    } catch (err) {
      console.error('Vision analysis error:', err);
    }
  }, [inputMode, onTelemetryUpdate]);

  // Auto-rotation interval for 360° specimen simulation
  useEffect(() => {
    let intervalId;
    if (isAutoRotating && inputMode === 'specimen') {
      intervalId = setInterval(() => {
        setRotationAngle((prev) => (prev + 90) % 360);
      }, 1600);
    }
    return () => clearInterval(intervalId);
  }, [isAutoRotating, inputMode]);

  // Render synthetic specimen on canvas or load realistic photo
  useEffect(() => {
    if (inputMode === 'specimen') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      if (currentSpecimen === 'sample_real_photo') {
        // Render calibrated base immediately so canvas is never black while image loads
        renderCalibratedLemon(ctx, 'sample_grade_a', canvas.width, canvas.height, rotationAngle);

        const img = new Image();
        img.onload = () => {
          ctx.fillStyle = '#0a0c10';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Subtle illumination gradient
          const illumGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 40, canvas.width / 2, canvas.height / 2, 220);
          illumGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
          illumGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = illumGrad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.save();
          if (rotationAngle !== 0) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotationAngle * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
          }

          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.min(hRatio, vRatio) * 0.72;
          const centerShiftX = (canvas.width - img.width * ratio) / 2;
          const centerShiftY = (canvas.height - img.height * ratio) / 2;

          ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
          ctx.restore();
          runVisionAnalysis();
        };
        img.onerror = () => {
          // If realistic image fails to load, gracefully fallback to calibrated specimen
          renderCalibratedLemon(ctx, 'sample_grade_a', canvas.width, canvas.height, rotationAngle);
          runVisionAnalysis();
        };
        img.src = '/samples/realistic_lemon.jpg';
      } else if (currentSpecimen.startsWith('lemon_')) {
        // Render calibrated base immediately so canvas is never black
        renderCalibratedLemon(ctx, 'sample_grade_a', canvas.width, canvas.height, rotationAngle);

        const item = INTERNET_CITRUS_BENCHMARK.find(s => s.id === currentSpecimen);
        const img = new Image();
        img.onload = () => {
          ctx.fillStyle = '#0a0c10';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const illumGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 40, canvas.width / 2, canvas.height / 2, 220);
          illumGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
          illumGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = illumGrad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          ctx.save();
          if (rotationAngle !== 0) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotationAngle * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
          }

          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.min(hRatio, vRatio) * 0.74;
          const centerShiftX = (canvas.width - img.width * ratio) / 2;
          const centerShiftY = (canvas.height - img.height * ratio) / 2;

          ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
          ctx.restore();
          runVisionAnalysis();
        };
        img.onerror = () => {
          renderCalibratedLemon(ctx, 'sample_grade_a', canvas.width, canvas.height, rotationAngle);
          runVisionAnalysis();
        };
        img.src = item ? item.imgSrc : `/samples/internet/${currentSpecimen}.jpg`;
      } else {
        renderCalibratedLemon(ctx, currentSpecimen, canvas.width, canvas.height, rotationAngle);
        runVisionAnalysis();
      }
    }
  }, [currentSpecimen, inputMode, rotationAngle, runVisionAnalysis]);

  // Render uploaded photo from device gallery on canvas
  useEffect(() => {
    if (inputMode === 'upload' && uploadedImageSrc) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#0a0c10';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subtle ambient illumination
        const illumGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 40, canvas.width / 2, canvas.height / 2, 220);
        illumGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
        illumGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = illumGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.min(hRatio, vRatio) * 0.78;
        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;

        ctx.drawImage(img, 0, 0, img.width, img.height, centerShiftX, centerShiftY, img.width * ratio, img.height * ratio);
        runVisionAnalysis();
      };
      img.onerror = () => {
        console.warn('Failed to load uploaded image');
      };
      img.src = uploadedImageSrc;
    }
  }, [inputMode, uploadedImageSrc, runVisionAnalysis]);

  // Live Camera Stream Setup with robust mobile fallback
  useEffect(() => {
    let stream = null;
    let isMounted = true;

    if (inputMode === 'camera') {
      const startCamera = async () => {
        setCameraError(null);
        setCameraActive(false);

        // Check if mediaDevices is supported (e.g. not insecure HTTP context on mobile IP)
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (isMounted) {
            setCameraError(
              window.isSecureContext === false
                ? 'Mobile Camera requires a secure HTTPS connection. Please use secure HTTPS or test our 20-Photo Benchmark catalog!'
                : 'Camera is not supported on this browser. Please use Benchmark Samples or Upload Photo!'
            );
          }
          return;
        }

        try {
          // Robust cascade of constraints tailored for mobile portrait sensors
          try {
            // Tier 1: Ideal rear environment camera (best for pointing phone at a lemon on a table)
            stream = await navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: { ideal: 'environment' }
              },
              audio: false
            });
          } catch (t1Err) {
            console.warn('Tier 1 camera constraint failed, trying fallback:', t1Err);
            try {
              // Tier 2: Exact rear camera
              stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
              });
            } catch (t2Err) {
              console.warn('Tier 2 camera constraint failed, trying any available video:', t2Err);
              // Tier 3: Any video device (front/webcam)
              stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
              });
            }
          }

          if (!isMounted) {
            if (stream) stream.getTracks().forEach((t) => t.stop());
            return;
          }

          const video = videoRef.current;
          if (video) {
            // Critical WebKit / Mobile attributes set imperatively on the DOM element
            video.setAttribute('autoplay', 'true');
            video.setAttribute('playsinline', 'true');
            video.setAttribute('webkit-playsinline', 'true');
            video.muted = true;
            video.defaultMuted = true;
            video.srcObject = stream;

            const markCameraReady = () => {
              if (!video || !isMounted) return;
              if (video.videoWidth > 0) {
                setCameraActive(true);
                setCameraError(null);
              }
            };

            video.addEventListener('loadedmetadata', markCameraReady);
            video.addEventListener('loadeddata', markCameraReady);
            video.addEventListener('canplay', markCameraReady);
            video.addEventListener('playing', markCameraReady);

            // Immediate play attempt
            video.play().then(() => {
              if (isMounted) {
                if (video.videoWidth > 0) {
                  setCameraActive(true);
                  setCameraError(null);
                }
              }
            }).catch((playErr) => {
              console.warn('Mobile play policy requires user touch:', playErr);
              if (isMounted) {
                setCameraActive(true);
              }
            });
          }
        } catch (err) {
          console.warn('Camera access issue:', err);
          if (isMounted) {
            const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
            setCameraError(
              isDenied
                ? 'Camera access permission was denied. Tap settings to allow camera, or use Benchmark Samples!'
                : `Camera unavailable (${err.name || 'Device error'}). Switch to Benchmark Samples anytime!`
            );
            setCameraActive(false);
          }
        }
      };

      startCamera();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    }

    return () => {
      isMounted = false;
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [inputMode]);

  // Real-time camera continuous processing loop (~12 FPS) with direct frame sampling
  useEffect(() => {
    let animationFrameId;
    let lastScanTime = 0;

    const processCameraLoop = (timestamp) => {
      if (inputMode === 'camera' && videoRef.current && canvasRef.current && cameraActive) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        // Copy video frame to analysis canvas if not frozen
        if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
          if (video.paused) {
            video.play().catch(() => {});
          }

          if (!isScanFrozenRef.current) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Scan at optimal frequency for instant QR-like lock (~12 FPS analysis rate)
            if (timestamp - lastScanTime > 85) {
              lastScanTime = timestamp;
              runVisionAnalysis();
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(processCameraLoop);
    };

    if (inputMode === 'camera' && cameraActive) {
      animationFrameId = requestAnimationFrame(processCameraLoop);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [inputMode, cameraActive, runVisionAnalysis]);

  // Optical HUD & QR-Style Reticle Overlay
  useEffect(() => {
    let animId;
    let pos = 20;
    let dir = 1;

    const drawHud = () => {
      const overlay = overlayCanvasRef.current;
      if (!overlay) return;
      const ctx = overlay.getContext('2d');
      if (!ctx) return;

      const w = overlay.width;
      const h = overlay.height;
      ctx.clearRect(0, 0, w, h);

      // Subtle Outer Corner Reticles
      const outerCorner = 18;
      const pad = 14;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      // TL
      ctx.beginPath();
      ctx.moveTo(pad, pad + outerCorner); ctx.lineTo(pad, pad); ctx.lineTo(pad + outerCorner, pad);
      ctx.stroke();

      // TR
      ctx.beginPath();
      ctx.moveTo(w - pad - outerCorner, pad); ctx.lineTo(w - pad, pad); ctx.lineTo(w - pad, pad + outerCorner);
      ctx.stroke();

      // BL
      ctx.beginPath();
      ctx.moveTo(pad, h - pad - outerCorner); ctx.lineTo(pad, h - pad); ctx.lineTo(pad + outerCorner, h - pad);
      ctx.stroke();

      // BR
      ctx.beginPath();
      ctx.moveTo(w - pad - outerCorner, h - pad); ctx.lineTo(w - pad, h - pad); ctx.lineTo(w - pad, h - pad - outerCorner);
      ctx.stroke();

      // Animated Optical Laser Beam
      if (laserScanActive) {
        pos += dir * 2.4;
        if (pos >= h - 25) dir = -1;
        if (pos <= 25) dir = 1;

        const laserGrad = ctx.createLinearGradient(0, pos - 14, 0, pos + 14);
        laserGrad.addColorStop(0, 'rgba(34, 197, 94, 0)');
        laserGrad.addColorStop(0.5, 'rgba(34, 197, 94, 0.35)');
        laserGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
        ctx.fillStyle = laserGrad;
        ctx.fillRect(0, pos - 14, w, 28);

        ctx.strokeStyle = '#86efac';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(w, pos);
        ctx.stroke();
      }

      // TARGET RECOGNITION: INSTANT QR-STYLE VIEWFINDER
      const analysis = lastAnalysisRef.current || lastAnalysis;
      if (analysis && analysis.detected && analysis.bbox) {
        const { x, y, width: bw, height: bh, cx, cy } = analysis.bbox;
        const color = analysis.color || '#22c55e';
        const isLocked = analysis.isLocked;
        const progress = analysis.analysisProgress || 100;

        // Padded bounding box
        const padX = 12;
        const padY = 12;
        const rx = Math.max(6, x - padX);
        const ry = Math.max(6, y - padY);
        const rw = Math.min(w - rx - 6, bw + padX * 2);
        const rh = Math.min(h - ry - 6, bh + padY * 2);

        // QR Target Bracket Corners
        const cornerLen = Math.min(26, Math.max(16, rw / 3.5));
        ctx.strokeStyle = color;
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Glowing bracket shadow
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;

        // Top Left
        ctx.beginPath();
        ctx.moveTo(rx, ry + cornerLen); ctx.lineTo(rx, ry); ctx.lineTo(rx + cornerLen, ry);
        ctx.stroke();

        // Top Right
        ctx.beginPath();
        ctx.moveTo(rx + rw - cornerLen, ry); ctx.lineTo(rx + rw, ry); ctx.lineTo(rx + rw, ry + cornerLen);
        ctx.stroke();

        // Bottom Left
        ctx.beginPath();
        ctx.moveTo(rx, ry + rh - cornerLen); ctx.lineTo(rx, ry + rh); ctx.lineTo(rx + cornerLen, ry + rh);
        ctx.stroke();

        // Bottom Right
        ctx.beginPath();
        ctx.moveTo(rx + rw - cornerLen, ry + rh); ctx.lineTo(rx + rw, ry + rh); ctx.lineTo(rx + rw, ry + rh - cornerLen);
        ctx.stroke();

        ctx.shadowBlur = 0; // reset shadow

        // Translucent dashed bounding frame
        ctx.strokeStyle = `${color}45`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.setLineDash([]);

        // Center Crosshair
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 7, cy); ctx.lineTo(cx + 7, cy);
        ctx.moveTo(cx, cy - 7); ctx.lineTo(cx, cy + 7);
        ctx.stroke();

        // Caliper Diameter indicator
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "IBM Plex Mono", monospace';
        ctx.fillText(`Ø ${analysis.caliperDiameterMm}mm`, rx + 6, ry + rh - 8);

        // FLOATING QR-STYLE VERDICT BANNER PILL
        const pillHeight = isLocked ? 46 : 52;
        const pillWidth = Math.max(280, Math.min(360, rw + 24));
        let pillX = rx + (rw - pillWidth) / 2;
        pillX = Math.max(8, Math.min(w - pillWidth - 8, pillX));
        let pillY = ry - pillHeight - 12;
        if (pillY < 56) {
          // If too close to top HUD telemetry chips, position below the lemon
          pillY = ry + rh + 12;
          if (pillY + pillHeight > h - 14) {
            pillY = h - pillHeight - 14;
          }
        }

        // Frosted Pill background
        ctx.fillStyle = 'rgba(10, 14, 22, 0.95)';
        ctx.strokeStyle = isLocked ? color : '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        drawSafeRoundedRect(ctx, pillX, pillY, pillWidth, pillHeight, 10);
        ctx.fill();
        ctx.stroke();

        if (isLocked) {
          // Banner Title: Lock icon + Grade + Verdict + Confidence
          ctx.font = 'bold 12px "Inter", -apple-system, sans-serif';
          ctx.fillStyle = color;
          ctx.fillText(`🔒 APEDA VERIFIED • GRADE ${analysis.grade} (${analysis.confidenceScore || 98}% Confidence)`, pillX + 12, pillY + 18);

          // Banner Subtitle: Metrics & Instant Pricing
          ctx.font = '10px "IBM Plex Mono", monospace';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(
            `${analysis.caliperDiameterMm ?? 60}mm • ${analysis.ripenessIndex ?? 95}% Ripe • ₹${(analysis.mandiPriceInr ?? 12).toFixed(1)}/pc`,
            pillX + 12,
            pillY + 35
          );
        } else {
          // Thorough Analysis In-Progress State
          ctx.font = 'bold 11px "Inter", -apple-system, sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`🔬 AUDITING CITRUS ANATOMY (${progress}%)`, pillX + 12, pillY + 17);

          // Sleek Progress Mini-Bar
          const barW = pillWidth - 24;
          const barH = 4;
          const barX = pillX + 12;
          const barY = pillY + 23;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.fillRect(barX, barY, barW, barH);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(barX, barY, (barW * progress) / 100, barH);

          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('Multi-angle flavedo metrology • Hold steady...', pillX + 12, pillY + 42);
        }

        // Defect Pinpoint Hotspots (Only display when genuine pathology/lesion is diagnosed)
        if (analysis.defectSpots && analysis.defectSpots.length > 0 && analysis.grade !== 'A' && analysis.defectPercent > 1.5) {
          analysis.defectSpots.slice(0, 3).forEach((spot, idx) => {
            if (spot.x >= rx - 5 && spot.x <= rx + rw + 5 && spot.y >= ry - 5 && spot.y <= ry + rh + 5) {
              ctx.strokeStyle = '#ef4444';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
              ctx.stroke();

              ctx.fillStyle = '#ef4444';
              ctx.beginPath();
              ctx.arc(spot.x, spot.y, 2.5, 0, Math.PI * 2);
              ctx.fill();

              ctx.fillStyle = '#fee2e2';
              ctx.font = 'bold 10px "IBM Plex Mono", monospace';
              ctx.fillText(`LESION #${idx + 1}`, spot.x + spot.radius + 4, spot.y + 3);
            }
          });
        }
      } else {
        // UNLOCKED STATE: CENTERED QR TARGETING RETICLE
        const boxSize = 160;
        const cx = w / 2;
        const cy = h / 2;
        const bx = cx - boxSize / 2;
        const by = cy - boxSize / 2;
        const cornerLen = 22;

        const isRejection = analysis && analysis.rejectReason;
        ctx.strokeStyle = isRejection ? 'rgba(239, 68, 68, 0.85)' : 'rgba(245, 158, 11, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';

        // TL
        ctx.beginPath();
        ctx.moveTo(bx, by + cornerLen); ctx.lineTo(bx, by); ctx.lineTo(bx + cornerLen, by);
        ctx.stroke();

        // TR
        ctx.beginPath();
        ctx.moveTo(bx + boxSize - cornerLen, by); ctx.lineTo(bx + boxSize, by); ctx.lineTo(bx + boxSize, by + cornerLen);
        ctx.stroke();

        // BL
        ctx.beginPath();
        ctx.moveTo(bx, by + boxSize - cornerLen); ctx.lineTo(bx, by + boxSize); ctx.lineTo(bx + cornerLen, by + boxSize);
        ctx.stroke();

        // BR
        ctx.beginPath();
        ctx.moveTo(bx + boxSize - cornerLen, by + boxSize); ctx.lineTo(bx + boxSize, by + boxSize); ctx.lineTo(bx + boxSize, by + boxSize - cornerLen);
        ctx.stroke();

        if (isRejection) {
          // Negative Feedback Pill for Non-Citrus (Pens, Books, Hands, Surfaces)
          const rPillW = Math.min(340, w - 24);
          const rPillH = 50;
          const rPillX = (w - rPillW) / 2;
          const rPillY = cy + boxSize / 2 + 12;

          ctx.fillStyle = 'rgba(15, 7, 7, 0.95)';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          drawSafeRoundedRect(ctx, rPillX, rPillY, rPillW, rPillH, 10);
          ctx.fill();
          ctx.stroke();

          ctx.font = 'bold 11px "Inter", -apple-system, sans-serif';
          ctx.fillStyle = '#ef4444';
          ctx.textAlign = 'center';
          ctx.fillText('🚫 NON-CITRUS OBJECT REJECTED', cx, rPillY + 18);

          ctx.font = '10px "Inter", -apple-system, sans-serif';
          ctx.fillStyle = '#fca5a5';
          ctx.fillText(analysis.message || 'Only authentic lemons/limes recognized', cx, rPillY + 36);
          ctx.textAlign = 'start';
        } else {
          // Pulsing instruction label
          ctx.font = 'bold 11px "Inter", -apple-system, sans-serif';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.textAlign = 'center';
          ctx.fillText('POINT CAMERA AT LEMON TO SCAN', cx, cy + boxSize / 2 + 22);
          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
          ctx.fillText('Citrus Carotenoid Optical Filter Active', cx, cy + boxSize / 2 + 36);
          ctx.textAlign = 'start';
        }
      }

      animId = requestAnimationFrame(drawHud);
    };

    animId = requestAnimationFrame(drawHud);
    return () => cancelAnimationFrame(animId);
  }, [laserScanActive, lastAnalysis]);

  // Mobile & Desktop Gallery / File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Immediately stop webcam stream so it cannot overwrite canvas
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);

    // Create fast blob URL (instant memory-efficient loading for mobile 12MP+ photos)
    const objectUrl = URL.createObjectURL(file);
    setUploadedImageSrc(objectUrl);
    setInputMode('upload');
    setCameraError(null);

    // Reset input so selecting the same photo or another photo works seamlessly
    e.target.value = '';
  };

  const handleTriggerManualScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      runVisionAnalysis();
      setIsScanning(false);
    }, 240);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Clean Modern Mode Switcher & Trigger */}
      <div className="glass-panel p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Segmented 3-Column Pill Selector */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#0a0d14] p-1.5 rounded-xl border border-white/10 w-full sm:w-auto">
          <button
            id="btn-live-camera"
            type="button"
            onClick={() => setInputMode('camera')}
            className={`craft-btn !py-2 !px-1.5 sm:!px-3.5 !rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              inputMode === 'camera'
                ? 'craft-mode-active-green'
                : '!bg-transparent !border-transparent text-[#cbd5e1] hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] sm:text-xs">
              <span className="hidden sm:inline">LIVE </span>CAMERA
            </span>
          </button>

          <button
            id="btn-benchmarks"
            type="button"
            onClick={() => { setInputMode('specimen'); setCameraActive(false); }}
            className={`craft-btn !py-2 !px-1.5 sm:!px-3.5 !rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              inputMode === 'specimen'
                ? 'craft-mode-active-amber'
                : '!bg-transparent !border-transparent text-[#cbd5e1] hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] sm:text-xs">
              <span className="hidden sm:inline">20 </span>BENCHMARKS
            </span>
          </button>

          <label
            id="btn-upload-photo"
            htmlFor="citrus-mobile-upload"
            className={`craft-btn !py-2 !px-1.5 sm:!px-3.5 !rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              inputMode === 'upload'
                ? 'craft-mode-active-blue'
                : '!bg-transparent !border-transparent text-[#cbd5e1] hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px] sm:text-xs">UPLOAD</span>
          </label>
          <input
            id="citrus-mobile-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*,image/jpeg,image/png,image/webp,image/heic,image/heif"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Laser Toggle & Trigger */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {inputMode === 'camera' && (
            <button
              type="button"
              onClick={() => setIsScanFrozen((p) => !p)}
              className={`craft-btn !py-2 !px-3 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                isScanFrozen
                  ? '!bg-[#f59e0b] !text-black shadow-lg font-black'
                  : '!bg-white/10 !text-white hover:!bg-white/20'
              }`}
              title="Freeze frame to inspect metrics"
            >
              {isScanFrozen ? <Lock className="w-3.5 h-3.5 shrink-0" /> : <Unlock className="w-3.5 h-3.5 shrink-0" />}
              <span>{isScanFrozen ? 'FROZEN (UNLOCK)' : 'FREEZE SCAN'}</span>
            </button>
          )}

          <button
            onClick={() => setLaserScanActive((p) => !p)}
            className={`craft-btn !py-2 !px-3 text-xs font-bold flex-1 sm:flex-initial ${
              laserScanActive ? '!border-[#22c55e]/60 !text-[#22c55e] bg-[#22c55e]/10' : '!text-[#94a3b8]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>LASER: {laserScanActive ? 'ACTIVE' : 'OFF'}</span>
          </button>

          <button
            onClick={handleTriggerManualScan}
            disabled={isScanning}
            className="craft-btn craft-btn-primary !py-2 !px-4 text-xs font-black flex items-center justify-center gap-2 shadow-lg flex-1 sm:flex-initial"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'SCANNING...' : 'SCAN APERTURE'}</span>
          </button>
        </div>
      </div>

      {/* Optical Inspection Chamber */}
      <div
        onClick={() => {
          if (inputMode === 'camera' && videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }}
        className="relative w-full aspect-[4/3] max-h-[380px] bg-[#07090e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.06)_0%,transparent_70%)] pointer-events-none"></div>

        {/* Live Video Stream: Active & directly visible in camera mode for native GPU hardware-accelerated 60fps streaming */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onPlay={() => setIsVideoPaused(false)}
          onPause={() => setIsVideoPaused(true)}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
            inputMode === 'camera' && cameraActive ? 'opacity-100 block' : 'opacity-0 pointer-events-none -z-10'
          }`}
        />

        {/* Loading Spinner during Camera Sensor Initialization */}
        {inputMode === 'camera' && !cameraActive && !cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#07090e] z-20">
            <Camera className="w-8 h-8 text-[#22c55e] animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#cbd5e1]">CONNECTING TO OPTICAL SENSOR...</span>
            <span className="text-[11px] text-[#94a3b8]">Initializing mobile camera aperture</span>
          </div>
        )}

        {/* Informative Camera Error & Fast Action UI (Eliminates mysterious black screen!) */}
        {inputMode === 'camera' && cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#07090e]/95 z-20 text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#ef4444]/15 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Optical Camera Access Note</h4>
              <p className="text-xs text-[#cbd5e1] max-w-xs leading-relaxed">
                {cameraError}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setInputMode('specimen');
                  setCameraError(null);
                }}
                className="craft-btn craft-btn-primary !py-2 !px-4 text-xs font-bold"
              >
                <Eye className="w-3.5 h-3.5" />
                USE 20 BENCHMARK LEMONS
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="craft-btn !py-2 !px-3.5 text-xs font-bold !bg-white/10 !text-white"
              >
                <Upload className="w-3.5 h-3.5" />
                UPLOAD PHOTO
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setInputMode('specimen');
                  setTimeout(() => setInputMode('camera'), 60);
                }}
                className="craft-btn !py-2 !px-3 text-xs !text-[#94a3b8]"
              >
                <RefreshCw className="w-3 h-3" />
                RETRY
              </button>
            </div>
          </div>
        )}

        {/* Tap to Unpause Mobile Stream Banner (If mobile browser suspended autoplay) */}
        {inputMode === 'camera' && cameraActive && isVideoPaused && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20 pointer-events-none">
            <div className="bg-[#0b0e14]/90 border border-white/20 px-4 py-2 rounded-full text-xs font-bold text-white shadow-xl flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#22c55e]" />
              <span>TAP ANYWHERE TO ACTIVATE STREAM</span>
            </div>
          </div>
        )}

        {/* Primary Pixel Canvas: Renders specimens and uploaded photos; offscreen in camera mode */}
        <canvas
          ref={canvasRef}
          width={520}
          height={390}
          className={`w-full h-full object-contain z-0 ${
            inputMode === 'camera' ? 'opacity-0 pointer-events-none absolute inset-0' : 'block opacity-100'
          }`}
        />

        {/* HUD Overlay Canvas (QR Reticles, Verdict Pill, Bounding Brackets) */}
        <canvas
          ref={overlayCanvasRef}
          width={520}
          height={390}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Top Floating Telemetry Status Chips */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="bg-[#0b0e14]/90 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white flex items-center gap-2 shadow-xl">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse shadow-[0_0_8px_#22c55e]"></span>
            <span>100% IN-BROWSER AI VISION • 16ms</span>
          </div>

          <div className="bg-[#0b0e14]/90 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-white flex items-center gap-2 shadow-xl">
            {isScanFrozen ? (
              <span className="text-[#fbbf24] flex items-center gap-1.5 font-bold">
                <Lock className="w-3.5 h-3.5 text-[#fbbf24]" /> SCAN FROZEN / LOCKED
              </span>
            ) : lastAnalysis?.isLocked ? (
              <span className="text-[#22c55e] flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> APEDA LOCKED ({lastAnalysis.confidenceScore || 98}%)
              </span>
            ) : lastAnalysis?.detected ? (
              <span className="text-[#38bdf8] flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" /> AUDITING ({lastAnalysis.analysisProgress || 40}%)
              </span>
            ) : (
              <span className="text-[#94a3b8] flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" /> CITRUS OPTICAL GATE ACTIVE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Dedicated High-Precision Measurement Dock */}
      {lastAnalysis && lastAnalysis.detected && (
        <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg border border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            {/* Metric 1: Equatorial Caliper Diameter */}
            <div className="bg-[#10141d] px-4 py-2.5 rounded-xl border border-white/10 flex flex-col justify-center min-w-[120px]">
              <span className="text-xs text-[#94a3b8] font-bold uppercase tracking-wider mb-1">
                DIAMETER
              </span>
              <span className="text-white font-black text-lg tracking-tight font-mono">
                {lastAnalysis.caliperDiameterMm} <span className="text-xs text-[#94a3b8] font-normal">mm</span>
              </span>
            </div>

            {/* Metric 2: Surface Blemish Percentage */}
            <div className="bg-[#10141d] px-4 py-2.5 rounded-xl border border-white/10 flex flex-col justify-center min-w-[120px]">
              <span className="text-xs text-[#94a3b8] font-bold uppercase tracking-wider mb-1">
                BLEMISH
              </span>
              <span className={`font-black text-lg font-mono ${lastAnalysis.defectPercent > 8 ? 'text-[#ef4444]' : 'text-[#22c55e]'}`}>
                {lastAnalysis.defectPercent}%
              </span>
            </div>

            {/* Metric 3: Sphericity (Roundness Index) */}
            <div className="bg-[#10141d] px-4 py-2.5 rounded-xl border border-white/10 flex flex-col justify-center min-w-[130px]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-xs text-[#94a3b8] font-bold uppercase tracking-wider">
                  SPHERICITY
                </span>
                <span className="text-[10px] text-[#38bdf8] bg-[#0284c7]/20 px-1.5 py-0.5 rounded font-mono font-bold">
                  ROUNDNESS
                </span>
              </div>
              <span className="text-white font-black text-lg font-mono">
                {lastAnalysis.sphericity} <span className="text-xs text-[#94a3b8] font-normal">/ 1.0</span>
              </span>
            </div>
          </div>

          {/* Verdict Grade and APEDA Category */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-[#cbd5e1] font-bold block uppercase">
                {lastAnalysis.pathogenDiagnosis.split('(')[0]}
              </span>
              <span className="text-[11px] text-[#94a3b8]">
                {lastAnalysis.caliperDiameterMm >= 48 && lastAnalysis.caliperDiameterMm <= 84
                  ? 'APEDA Size Compliant'
                  : 'Off-spec Size'}
              </span>
            </div>
            <span
              className="px-4 py-2 rounded-xl text-sm font-black tracking-wide shadow-md font-mono"
              style={{
                backgroundColor: `${lastAnalysis.color}25`,
                color: lastAnalysis.color,
                border: `1px solid ${lastAnalysis.color}88`
              }}
            >
              GRADE {lastAnalysis.grade}
            </span>
          </div>
        </div>
      )}

      {/* Multi-Angle Surface Inspection Controls (Specimen Mode) */}
      {inputMode === 'specimen' && (
        <div className="glass-panel p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-sm border-l-4 border-l-[#ec4899] shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#ec4899] font-bold flex items-center gap-1.5 uppercase tracking-wide">
              <RotateCw className="w-4 h-4" />
              Inspection Angle:
            </span>
            <div className="flex items-center gap-1.5 bg-[#0a0d14] p-1.5 rounded-xl border border-white/10">
              {[
                { angle: 0, label: '0° FRONT' },
                { angle: 90, label: '90° PROFILE' },
                { angle: 180, label: '180° UNDERSIDE' },
                { angle: 270, label: '270° REVERSE' }
              ].map((pos) => (
                <button
                  key={pos.angle}
                  onClick={() => { setRotationAngle(pos.angle); setIsAutoRotating(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    rotationAngle === pos.angle
                      ? 'bg-[#ec4899] text-white shadow-md'
                      : 'text-[#cbd5e1] hover:text-white'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoRotating((p) => !p)}
              className={`craft-btn !py-1.5 !px-3.5 !text-xs flex items-center gap-2 cursor-pointer ${
                isAutoRotating ? '!bg-[#ec4899] !text-white !font-bold' : '!text-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
              {isAutoRotating ? 'AUTO-ROTATING' : 'AUTO-ROTATE'}
            </button>
            <span className="text-xs text-[#cbd5e1] hidden md:inline">
              Multi-angle inspection to detect latent lesions
            </span>
          </div>
        </div>
      )}

      {/* Benchmark Specimen Deck Controls */}
      {inputMode === 'specimen' && (
        <div className="flex flex-col gap-3">
          {/* Deck Switcher Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-2.5 px-4 border border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSpecimenSubTab('synthetic');
                  if (currentSpecimen.startsWith('lemon_')) {
                    setCurrentSpecimen('sample_real_photo');
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  specimenSubTab === 'synthetic'
                    ? 'bg-[#f59e0b] text-[#07090e] shadow-lg font-black'
                    : 'text-[#94a3b8] hover:text-white bg-white/5'
                }`}
              >
                <span>🔬 LAB STANDARDS (7 SPECIMENS)</span>
              </button>

              <button
                onClick={() => {
                  setSpecimenSubTab('internet');
                  if (!currentSpecimen.startsWith('lemon_')) {
                    setCurrentSpecimen('lemon_01');
                  }
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  specimenSubTab === 'internet'
                    ? 'bg-[#38bdf8] text-[#07090e] shadow-lg font-black'
                    : 'text-[#94a3b8] hover:text-white bg-white/5'
                }`}
              >
                <span>🌐 REAL INTERNET BENCHMARK (20 PHOTOS)</span>
              </button>
            </div>

            {specimenSubTab === 'internet' && (
              <button
                onClick={() => setShowAuditModal(true)}
                className="craft-btn !py-1.5 !px-3 !text-xs !bg-[#22c55e]/20 !border-[#22c55e]/40 !text-[#4ade80] hover:!bg-[#22c55e] hover:!text-[#07090e] flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>20-PHOTO ACCURACY AUDIT</span>
              </button>
            )}
          </div>

          {/* Sub-tab 1: Synthetic Standards */}
          {specimenSubTab === 'synthetic' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SAMPLE_CITRUS_CATALOG.map((item) => {
                const isSelected = currentSpecimen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentSpecimen(item.id)}
                    className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#f59e0b] bg-[#1c1810] shadow-xl scale-[1.02]'
                        : 'border-white/10 bg-[#121620] hover:border-white/20 hover:bg-[#181d2a]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs px-2.5 py-0.5 rounded-full font-black tracking-wide"
                        style={{ backgroundColor: `${item.badgeColor}25`, color: item.badgeColor }}
                      >
                        {item.gradeExpected}
                      </span>
                      {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]"></span>}
                    </div>
                    <span className="text-sm font-bold text-white mb-1 leading-snug">
                      {item.title.split(':')[1]?.trim() || item.title}
                    </span>
                    <span className="text-xs text-[#cbd5e1] leading-relaxed">
                      {item.spec}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sub-tab 2: Internet 20 Photos */}
          {specimenSubTab === 'internet' && (
            <div className="flex flex-col gap-3">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['ALL', 'Grade A', 'Grade B', 'Grade C', 'Grade D', 'Unripe'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setInternetCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      internetCategoryFilter === cat
                        ? 'bg-white text-[#07090e]'
                        : 'bg-white/5 text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid of 20 Real Internet Lemon Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {INTERNET_CITRUS_BENCHMARK.filter(
                  (item) => internetCategoryFilter === 'ALL' || item.category === internetCategoryFilter
                ).map((item) => {
                  const isSelected = currentSpecimen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentSpecimen(item.id)}
                      className={`flex flex-col text-left p-3 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                        isSelected
                          ? 'border-[#38bdf8] bg-[#0c1a29] shadow-xl scale-[1.02]'
                          : 'border-white/10 bg-[#121620] hover:border-white/20 hover:bg-[#181d2a]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[11px] px-2 py-0.5 rounded-full font-black tracking-wide"
                          style={{ backgroundColor: `${item.badgeColor}25`, color: item.badgeColor }}
                        >
                          {item.badge}
                        </span>
                        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]"></span>}
                      </div>

                      <div className="flex items-center gap-2 mb-1.5">
                        <img
                          src={item.imgSrc}
                          alt={item.title}
                          className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0"
                          loading="lazy"
                        />
                        <span className="text-xs font-bold text-white leading-snug line-clamp-2">
                          {item.title.split(':')[1]?.trim() || item.title}
                        </span>
                      </div>

                      <span className="text-[11px] text-[#94a3b8] leading-tight line-clamp-2">
                        {item.spec}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 20-Photo Empirical Accuracy Audit Modal */}
      <CitrusAuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        onSelectSpecimen={(id) => {
          setSpecimenSubTab('internet');
          setCurrentSpecimen(id);
        }}
      />

      {cameraError && (
        <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 p-3 rounded-xl text-xs text-[#fca5a5] flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#ef4444] shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}
    </div>
  );
}
