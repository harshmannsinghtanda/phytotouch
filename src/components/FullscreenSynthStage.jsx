/* ==============================================================================
   FullscreenSynthStage.jsx
   PhytoTouch: Fullscreen Synthesizer Stage & Curved Saptak Arc Keybed
   Photorealistic Studio Glass & Copper Aesthetics with Bioluminescent Fluid Pulses
   Engineered with world-class-clean-ui standards & high-contrast legibility
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useRef } from 'react';
import { Activity, Zap, Radio, Sliders, Sparkles, ShieldCheck } from 'lucide-react';
import { SCALES, audioEngine, getNoteFrequency } from '../audio/PlantAudioEngine';
import { calculateLeafFrequency, TUNING_SYSTEMS } from '../audio/ShrutiTuning';

export const SAPTAK_CHANNELS = [
  { id: 0, key: '1', swara: 'Sa', hindi: 'सा', name: 'Shadja (Source)', noteIdx: 0, pin: 'GPIO 04', wireColor: '#ef4444', arcY: 10, clipX: 200, clipY: 65 },
  { id: 1, key: '2', swara: 'Re', hindi: 'रे', name: 'Rishabh (Bull)', noteIdx: 1, pin: 'GPIO 14', wireColor: '#f59e0b', arcY: 4, clipX: 110, clipY: 135 },
  { id: 2, key: '3', swara: 'Ga', hindi: 'ग', name: 'Gandhar (Sky)', noteIdx: 2, pin: 'GPIO 15', wireColor: '#eab308', arcY: 0, clipX: 290, clipY: 125 },
  { id: 3, key: '4', swara: 'Ma', hindi: 'म', name: 'Madhyam (Heart)', noteIdx: 3, pin: 'GPIO 13', wireColor: '#10b981', arcY: 0, clipX: 120, clipY: 220 },
  { id: 4, key: '5', swara: 'Pa', hindi: 'प', name: 'Pancham (Fifth)', noteIdx: 4, pin: 'GPIO 12', wireColor: '#06b6d4', arcY: 0, clipX: 280, clipY: 210 },
  { id: 5, key: '6', swara: 'Dha', hindi: 'ध', name: 'Dhaivat (Earth)', noteIdx: 5, pin: 'GPIO 27', wireColor: '#8b5cf6', arcY: 4, clipX: 130, clipY: 295 },
  { id: 6, key: '7', swara: 'Ni', hindi: 'नी', name: 'Nishad (Crown)', noteIdx: 6, pin: 'GPIO 33', wireColor: '#ec4899', arcY: 10, clipX: 270, clipY: 290 }
];

export const FullscreenSynthStage = ({
  activeLeaves = [false, false, false, false, false, false, false],
  onLeafTouch,
  currentScale = 'saptak',
  baseFrequency = 432,
  octaveOffset = 0,
  telemetryData,
  lastTriggeredNote,
  onOpenDrawer,
  onOpenShrutiTuner,
  activeTargetLeaf = null,
  tuningSystem = 'shuddha_just',
  leafCentsOffsets = [0, 0, 0, 0, 0, 0, 0],
  currentTheme = 'obsidian'
}) => {
  const scaleNotes = SCALES[currentScale]?.notes || SCALES.saptak?.notes || ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
  const lastTriggerTimeRef = useRef({});
  const activePointersRef = useRef(new Set());

  // Haptic Vibration Feedback (Supported on Android Chrome & modern mobile devices)
  const triggerHaptic = (type = 'light') => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'light') {
          navigator.vibrate(12);
        } else if (type === 'chord') {
          navigator.vibrate([16, 25, 16]);
        }
      } catch {}
    }
  };

  const handleTrigger = (id, intensity = 0.70, e) => {
    if (e) {
      if (e.cancelable && e.type === 'pointerdown') {
        e.preventDefault();
      }
      e.stopPropagation();
      if (e.pointerId !== undefined) {
        activePointersRef.current.add(e.pointerId);
      }
    }

    const now = Date.now();
    if (lastTriggerTimeRef.current[id] && (now - lastTriggerTimeRef.current[id] < 120)) {
      return;
    }
    lastTriggerTimeRef.current[id] = now;

    const isMultiFingerChord = activePointersRef.current.size > 1;
    triggerHaptic(isMultiFingerChord ? 'chord' : 'light');

    audioEngine.unlock();
    onLeafTouch(id, intensity);
  };

  const handlePointerUp = (e) => {
    if (e && e.pointerId !== undefined) {
      activePointersRef.current.delete(e.pointerId);
    }
  };

  const isAnyActive = activeLeaves.some(Boolean);

  const getThemeAuraGlow = () => {
    if (isAnyActive) {
      if (currentTheme === 'moonlight') {
        return 'radial-gradient(circle, rgba(6, 182, 212, 0.45) 0%, rgba(139, 92, 246, 0.22) 50%, transparent 75%)';
      }
      if (currentTheme === 'vedic') {
        return 'radial-gradient(circle, rgba(234, 179, 8, 0.45) 0%, rgba(249, 115, 22, 0.22) 50%, transparent 75%)';
      }
      if (currentTheme === 'lab') {
        return 'radial-gradient(circle, rgba(255, 255, 255, 0.35) 0%, rgba(16, 185, 129, 0.18) 50%, transparent 75%)';
      }
      return 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, rgba(16, 185, 129, 0.22) 50%, transparent 75%)';
    } else {
      if (currentTheme === 'moonlight') {
        return 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 75%)';
      }
      if (currentTheme === 'vedic') {
        return 'radial-gradient(circle, rgba(234, 179, 8, 0.18) 0%, rgba(249, 115, 22, 0.08) 50%, transparent 75%)';
      }
      if (currentTheme === 'lab') {
        return 'radial-gradient(circle, rgba(255, 255, 255, 0.10) 0%, transparent 70%)';
      }
      return 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 75%)';
    }
  };

  return (
    <div 
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="fullscreen-stage-wrapper"
      style={{ touchAction: 'none' }}
    >
      
      {/* 1. Top Specimen Status Bar */}
      <div className="specimen-status-bar">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse"></span>
          <span className="text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
            <span>🌿</span> LIVING SPECIMEN: MONSTERA DELICIOSA (FLORA-01)
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="hidden sm:inline text-xs font-mono text-emerald-400 font-semibold">
            7-CHANNEL BIOLUMINESCENT TRANSDUCTION
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>IMPEDANCE: <strong className="text-white">{telemetryData?.impedanceKOhm || 142.4} kΩ</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>CAPACITANCE: <strong className="text-white">{telemetryData?.capacitancePf || 48.6} pF</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Central Botanical Specimen Display (Photorealistic Studio Glass & Copper) */}
      <div className="plant-specimen-viewport">
        
        {/* Soft Ambient Backlight Glow (Bioluminescent Aura) */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-full blur-3xl transition-all duration-500"
          style={{
            background: getThemeAuraGlow()
          }}
        ></div>

        <svg
          viewBox="0 0 400 480"
          className="plant-specimen-svg"
          style={{ touchAction: 'none' }}
        >
          <defs>
            {/* Bioluminescent Deep Emerald Gradient */}
            <linearGradient id="bioChlorophyll" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="35%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#047857" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>

            {/* Active Electrical Resonance Gradient */}
            <linearGradient id="bioActiveResonance" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Brushed Copper Electrode Clip Gradient */}
            <linearGradient id="copperClipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            {/* Studio Ceramic Pot Gradient */}
            <linearGradient id="studioPot" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="35%" stopColor="#1f2937" />
              <stop offset="65%" stopColor="#374151" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>

            {/* Dewdrop Specular Highlight */}
            <radialGradient id="dewdropShine" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#a7f3d0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
            </radialGradient>

            {/* Neon Glow Shockwave Filter */}
            <filter id="studioNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Plant Central Trunk / Main Stem */}
          <path d="M 200 380 Q 198 250 200 65" fill="none" stroke="#042013" strokeWidth="10" strokeLinecap="round" />
          <path 
            d="M 200 380 Q 198 250 200 65" 
            fill="none" 
            stroke={isAnyActive ? '#fef08a' : '#10b981'} 
            strokeWidth={isAnyActive ? '4' : '3'} 
            strokeLinecap="round" 
            opacity={isAnyActive ? 0.9 : 0.65}
            filter={isAnyActive ? 'url(#studioNeonGlow)' : undefined}
          />

          {/* Flexible Hardware Leads from Terminal to 7 Leaves with Animated Current */}
          <path d="M 195 430 C 160 280, 180 140, 200 65" fill="none" stroke="#ef4444" strokeWidth={activeLeaves[0] ? '3' : '2'} strokeDasharray={activeLeaves[0] ? '6 3' : '3 3'} opacity={activeLeaves[0] ? 1 : 0.45} className={activeLeaves[0] ? 'animate-wire-pulse' : ''} />
          <path d="M 180 430 C 130 330, 80 220, 110 135" fill="none" stroke="#f59e0b" strokeWidth={activeLeaves[1] ? '3' : '2'} strokeDasharray={activeLeaves[1] ? '6 3' : '3 3'} opacity={activeLeaves[1] ? 1 : 0.45} className={activeLeaves[1] ? 'animate-wire-pulse' : ''} />
          <path d="M 210 430 C 260 320, 310 210, 290 125" fill="none" stroke="#eab308" strokeWidth={activeLeaves[2] ? '3' : '2'} strokeDasharray={activeLeaves[2] ? '6 3' : '3 3'} opacity={activeLeaves[2] ? 1 : 0.45} className={activeLeaves[2] ? 'animate-wire-pulse' : ''} />
          <path d="M 185 430 C 140 350, 100 300, 120 220" fill="none" stroke="#10b981" strokeWidth={activeLeaves[3] ? '3' : '2'} strokeDasharray={activeLeaves[3] ? '6 3' : '3 3'} opacity={activeLeaves[3] ? 1 : 0.45} className={activeLeaves[3] ? 'animate-wire-pulse' : ''} />
          <path d="M 215 430 C 255 350, 290 290, 280 210" fill="none" stroke="#06b6d4" strokeWidth={activeLeaves[4] ? '3' : '2'} strokeDasharray={activeLeaves[4] ? '6 3' : '3 3'} opacity={activeLeaves[4] ? 1 : 0.45} className={activeLeaves[4] ? 'animate-wire-pulse' : ''} />
          <path d="M 175 430 C 145 370, 125 340, 130 295" fill="none" stroke="#8b5cf6" strokeWidth={activeLeaves[5] ? '3' : '2'} strokeDasharray={activeLeaves[5] ? '6 3' : '3 3'} opacity={activeLeaves[5] ? 1 : 0.45} className={activeLeaves[5] ? 'animate-wire-pulse' : ''} />
          <path d="M 220 430 C 245 370, 260 340, 270 290" fill="none" stroke="#ec4899" strokeWidth={activeLeaves[6] ? '3' : '2'} strokeDasharray={activeLeaves[6] ? '6 3' : '3 3'} opacity={activeLeaves[6] ? 1 : 0.45} className={activeLeaves[6] ? 'animate-wire-pulse' : ''} />

          {/* --- Leaf 0 (Sa - Apex Sprout) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(0, 0.70, e)} onClick={(e) => handleTrigger(0, 0.70, e)}>
            {activeLeaves[0] && <circle cx="200" cy="35" r="48" fill="none" stroke="#fef08a" strokeWidth="2.5" opacity="0.9" className="animate-ping" />}
            <path
              d="M 200 65 C 165 35, 155 -5, 200 -15 C 245 -5, 235 35, 200 65 Z"
              fill={activeLeaves[0] ? 'url(#bioActiveResonance)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[0] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[0] ? '3' : '2'}
              filter={activeLeaves[0] ? 'url(#studioNeonGlow)' : undefined}
            />
            {/* Bioluminescent Vein Pulse */}
            <path d="M 200 55 L 200 -5" stroke={activeLeaves[0] ? '#ffffff' : '#a7f3d0'} strokeWidth={activeLeaves[0] ? '3' : '2'} className={activeLeaves[0] ? 'animate-fluid-vein' : ''} />
            <path d="M 200 35 Q 185 30 180 25 M 200 35 Q 215 30 220 25" stroke={activeLeaves[0] ? '#fef08a' : '#6ee7b7'} strokeWidth="1.5" opacity={activeLeaves[0] ? 1 : 0.8} />
            <circle cx="192" cy="18" r="3" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Leaf 1 (Re - Upper Left) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(1, 0.70, e)} onClick={(e) => handleTrigger(1, 0.70, e)}>
            <path d="M 198 155 Q 150 150 110 135" fill="none" stroke="#042013" strokeWidth="5.5" />
            {activeLeaves[1] && <circle cx="95" cy="95" r="48" fill="none" stroke="#f59e0b" strokeWidth="2.5" opacity="0.9" className="animate-ping" />}
            <path
              d="M 110 135 C 55 125, 35 75, 80 55 C 125 35, 150 85, 110 135 Z"
              fill={activeLeaves[1] ? 'url(#bioActiveResonance)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[1] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[1] ? '3' : '2'}
              filter={activeLeaves[1] ? 'url(#studioNeonGlow)' : undefined}
            />
            {/* Bioluminescent Vein Pulse */}
            <path d="M 110 130 C 95 105, 80 85, 82 60" stroke={activeLeaves[1] ? '#ffffff' : '#a7f3d0'} strokeWidth={activeLeaves[1] ? '3' : '2'} className={activeLeaves[1] ? 'animate-fluid-vein' : ''} />
            <circle cx="86" cy="85" r="3" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Leaf 2 (Ga - Upper Right) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(2, 0.70, e)} onClick={(e) => handleTrigger(2, 0.70, e)}>
            <path d="M 200 165 Q 240 150 290 125" fill="none" stroke="#042013" strokeWidth="5.5" />
            {activeLeaves[2] && <circle cx="305" cy="85" r="48" fill="none" stroke="#eab308" strokeWidth="2.5" opacity="0.9" className="animate-ping" />}
            <path
              d="M 290 125 C 345 115, 365 65, 315 45 C 270 30, 250 80, 290 125 Z"
              fill={activeLeaves[2] ? 'url(#bioActiveResonance)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[2] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[2] ? '3' : '2'}
              filter={activeLeaves[2] ? 'url(#studioNeonGlow)' : undefined}
            />
            {/* Bioluminescent Vein Pulse */}
            <path d="M 290 120 C 305 95, 320 75, 315 50" stroke={activeLeaves[2] ? '#ffffff' : '#a7f3d0'} strokeWidth={activeLeaves[2] ? '3' : '2'} className={activeLeaves[2] ? 'animate-fluid-vein' : ''} />
            <circle cx="318" cy="80" r="3" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Leaf 3 (Ma - Mid Left) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(3, 0.70, e)} onClick={(e) => handleTrigger(3, 0.70, e)}>
            <path d="M 199 235 Q 155 230 120 220" fill="none" stroke="#042013" strokeWidth="5.5" />
            {activeLeaves[3] && <circle cx="100" cy="180" r="45" fill="none" stroke="#10b981" strokeWidth="2.5" opacity="0.9" className="animate-ping" />}
            <path
              d="M 120 220 C 65 210, 45 160, 90 135 C 135 110, 155 165, 120 220 Z"
              fill={activeLeaves[3] ? 'url(#bioActiveResonance)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[3] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[3] ? '3' : '2'}
              filter={activeLeaves[3] ? 'url(#studioNeonGlow)' : undefined}
            />
            {/* Bioluminescent Vein Pulse */}
            <path d="M 120 215 C 105 185, 90 160, 92 140" stroke={activeLeaves[3] ? '#ffffff' : '#a7f3d0'} strokeWidth={activeLeaves[3] ? '3' : '2'} className={activeLeaves[3] ? 'animate-fluid-vein' : ''} />
            <circle cx="95" cy="170" r="2.8" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Leaf 4 (Pa - Mid Right) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(4, 0.70, e)} onClick={(e) => handleTrigger(4, 0.70, e)}>
            <path d="M 200 240 Q 240 230 280 210" fill="none" stroke="#042013" strokeWidth="5.5" />
            {activeLeaves[4] && <circle cx="295" cy="170" r="45" fill="none" stroke="#06b6d4" strokeWidth="2.5" opacity="0.9" className="animate-ping" />}
            <path
              d="M 280 210 C 335 200, 355 150, 310 125 C 265 110, 245 160, 280 210 Z"
              fill={activeLeaves[4] ? 'url(#bioActiveResonance)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[4] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[4] ? '3' : '2'}
              filter={activeLeaves[4] ? 'url(#studioNeonGlow)' : undefined}
            />
            {/* Bioluminescent Vein Pulse */}
            <path d="M 280 205 C 295 180, 310 155, 305 130" stroke={activeLeaves[4] ? '#ffffff' : '#a7f3d0'} strokeWidth={activeLeaves[4] ? '3' : '2'} className={activeLeaves[4] ? 'animate-fluid-vein' : ''} />
            <circle cx="308" cy="165" r="2.8" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Leaf 5 (Dha - Basal Left) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(5, 0.70, e)} onClick={(e) => handleTrigger(5, 0.70, e)}>
            <path d="M 199 305 Q 165 300 130 295" fill="none" stroke="#042013" strokeWidth="6" />
            {activeLeaves[5] && <circle cx="115" cy="255" r="42" fill="none" stroke="#8b5cf6" strokeWidth="2.5" opacity="0.9" className="animate-ping" />}
            <path
              d="M 130 295 C 80 285, 55 240, 100 215 C 145 190, 170 245, 130 295 Z"
              fill={activeLeaves[5] ? 'url(#bioActiveResonance)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[5] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[5] ? '3' : '2'}
              filter={activeLeaves[5] ? 'url(#studioNeonGlow)' : undefined}
            />
            {/* Bioluminescent Vein Pulse */}
            <path d="M 130 290 C 115 265, 100 245, 102 220" stroke={activeLeaves[5] ? '#ffffff' : '#a7f3d0'} strokeWidth={activeLeaves[5] ? '3' : '2'} className={activeLeaves[5] ? 'animate-fluid-vein' : ''} />
            <circle cx="106" cy="245" r="2.5" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Leaf 6 (Ni - Basal Right) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(6, 0.70, e)} onClick={(e) => handleTrigger(6, 0.70, e)}>
            <path d="M 200 310 Q 235 305 270 290" fill="none" stroke="#042013" strokeWidth="6" />
            {activeLeaves[6] && <circle cx="285" cy="250" r="42" fill="none" stroke="#ec4899" strokeWidth="2.5" opacity="0.9" className="animate-ping" />}
            <path
              d="M 270 290 C 320 280, 345 235, 300 210 C 255 185, 230 240, 270 290 Z"
              fill={activeLeaves[6] ? 'url(#bioActiveResonance)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[6] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[6] ? '3' : '2'}
              filter={activeLeaves[6] ? 'url(#studioNeonGlow)' : undefined}
            />
            {/* Bioluminescent Vein Pulse */}
            <path d="M 270 285 C 285 260, 300 240, 298 215" stroke={activeLeaves[6] ? '#ffffff' : '#a7f3d0'} strokeWidth={activeLeaves[6] ? '3' : '2'} className={activeLeaves[6] ? 'animate-fluid-vein' : ''} />
            <circle cx="294" cy="245" r="2.5" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* Modern Minimalist Studio Pot */}
          <g>
            <ellipse cx="200" cy="375" rx="74" ry="14" fill="#0d1117" />
            <path d="M 134 375 L 148 442 Q 200 452 252 442 L 266 375 Z" fill="url(#studioPot)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            <ellipse cx="200" cy="375" rx="66" ry="9" fill="#090d14" />
            <ellipse cx="200" cy="375" rx="64" ry="6" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" opacity="0.7" />
          </g>

          {/* Physical Copper Alligator Electrodes Clamped to 7 Leaves */}
          {SAPTAK_CHANNELS.map((ch) => {
            const isActive = activeLeaves[ch.id];
            const isTarget = activeTargetLeaf === ch.id;
            const note = scaleNotes[ch.id % scaleNotes.length];

            return (
              <g
                key={ch.id}
                className="cursor-pointer group select-none"
                onPointerDown={(e) => handleTrigger(ch.id, 0.70, e)}
                onClick={(e) => handleTrigger(ch.id, 0.70, e)}
                transform={`translate(${ch.clipX}, ${ch.clipY})`}
              >
                {/* Guided Tutorial Target Pulse Beacon */}
                {isTarget && (
                  <g>
                    <circle cx="0" cy="0" r="26" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 3" className="animate-spin" />
                    <circle cx="0" cy="0" r="14" fill="rgba(245, 158, 11, 0.35)" className="animate-ping" />
                  </g>
                )}

                {/* Copper Electrode Clip Body */}
                <rect
                  x="-10"
                  y="-8"
                  width="20"
                  height="16"
                  rx="3.5"
                  fill={isActive ? '#ffffff' : 'url(#copperClipGrad)'}
                  stroke={isActive ? '#fef08a' : isTarget ? '#f59e0b' : '#78350f'}
                  strokeWidth={isTarget ? '2.5' : '1.8'}
                  filter={isActive || isTarget ? 'url(#studioNeonGlow)' : undefined}
                />
                <rect x="-5" y="-4" width="10" height="8" fill={ch.wireColor} rx="1.5" />

                {/* Swara Flag Badge */}
                <g transform="translate(16, -11)">
                  <rect
                    x="0"
                    y="0"
                    width={isTarget ? '74' : '60'}
                    height="22"
                    rx="6"
                    fill={isTarget ? '#2a1a05' : '#0d111a'}
                    stroke={isActive ? '#fef08a' : isTarget ? '#fbbf24' : 'rgba(255,255,255,0.18)'}
                    strokeWidth={isTarget ? '2' : '1.2'}
                  />
                  <text
                    x="8"
                    y="15"
                    fill={isActive || isTarget ? '#fef08a' : '#ffffff'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {ch.hindi} {note} {isTarget ? '★' : ''}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Central 7-Channel Studio Terminal Block */}
          <g transform="translate(140, 424)">
            <rect x="0" y="0" width="120" height="24" rx="7" fill="#0d111a" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
            <circle cx="12" cy="12" r="4.5" fill="#ef4444" />
            <circle cx="28" cy="12" r="4.5" fill="#f59e0b" />
            <circle cx="44" cy="12" r="4.5" fill="#eab308" />
            <circle cx="60" cy="12" r="4.5" fill="#10b981" />
            <circle cx="76" cy="12" r="4.5" fill="#06b6d4" />
            <circle cx="92" cy="12" r="4.5" fill="#8b5cf6" />
            <circle cx="108" cy="12" r="4.5" fill="#ec4899" />
          </g>
        </svg>

      </div>

      {/* 3. Curved Arc Saptak Keybed (Thumb-Ergonomic Curved Arc with Tactile Fluid Feedback) */}
      <div className="saptak-keybed-box">
        
        {/* Keybed Title Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-1">
          <div className="flex items-center gap-1.5 font-bold tracking-wider uppercase text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>7-SWARA SAPTAK KEYBED (TOUCH LEAF OR KEY [1-7])</span>
          </div>
          <span className="font-mono text-emerald-400 font-bold hidden sm:inline text-[11px]">
            ZERO-LATENCY CAPACITIVE RESPONSE
          </span>
        </div>

        {/* Curved Keycaps Arc Grid */}
        <div className="saptak-grid">
          {SAPTAK_CHANNELS.map((ch) => {
            const isActive = activeLeaves[ch.id];
            const isTarget = activeTargetLeaf === ch.id;
            const note = scaleNotes[ch.id % scaleNotes.length];
            const freq = calculateLeafFrequency(ch.id, tuningSystem, baseFrequency, octaveOffset, leafCentsOffsets[ch.id] || 0);

            return (
              <button
                key={ch.id}
                type="button"
                onPointerDown={(e) => handleTrigger(ch.id, 0.70, e)}
                onClick={(e) => handleTrigger(ch.id, 0.70, e)}
                style={{
                  transform: `translateY(${ch.arcY * 0.7}px)`,
                  touchAction: 'none'
                }}
                className={`keycap-tactile saptak-keycap ${
                  isActive ? 'active' : ''
                } ${
                  isTarget ? 'border-amber-400 ring-2 ring-amber-400/80 shadow-[0_0_24px_rgba(245,158,11,0.55)] bg-amber-500/15 scale-[1.02]' : ''
                }`}
              >
                {/* Guided Next Note Target Badge */}
                {isTarget && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-black text-[8px] sm:text-[9px] shadow-[0_0_12px_#f59e0b] animate-bounce z-20 whitespace-nowrap">
                    TOUCH NEXT
                  </span>
                )}

                {/* Active Fluid Ring Accent */}
                {isActive && (
                  <span className="absolute -inset-1 rounded-2xl bg-amber-400/20 blur-sm pointer-events-none animate-pulse"></span>
                )}

                {/* Pin Badge & Hotkey */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono pb-0.5 border-b border-white/10 relative z-10">
                  <span className="text-slate-400 hidden sm:inline">{ch.pin}</span>
                  <span className={`px-1 rounded font-bold border ${isTarget ? 'bg-amber-400 text-black border-amber-300' : 'bg-black/40 text-amber-300 border-white/10'}`}>
                    [{ch.key}]
                  </span>
                </div>

                {/* Prominent Devanagari Character */}
                <div className="my-0.5 relative z-10">
                  <span className={`text-xl sm:text-3xl font-black ${isActive ? 'text-white drop-shadow-[0_0_10px_#fff]' : 'text-white'}`}>
                    {ch.hindi}
                  </span>
                </div>

                {/* Swara English Name & Western Note */}
                <div className="flex flex-col items-center relative z-10 leading-tight">
                  <span className={`text-xs sm:text-sm font-bold tracking-tight ${isActive ? 'text-amber-200' : 'text-slate-200'}`}>
                    {ch.swara}
                  </span>
                  <span className="text-[11px] sm:text-xs font-mono font-bold text-emerald-400">
                    {note}
                  </span>
                </div>

                {/* Frequency Readout */}
                <div className="mt-0.5 pt-0.5 border-t border-white/5 w-full relative z-10">
                  <span className="text-[10px] sm:text-[11px] font-mono text-slate-400">
                    {freq.toFixed(1)} Hz
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Quick Status Ribbon */}
      <div className="bottom-quick-ribbon">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 font-medium">TUNING:</span>
            <strong className="text-white font-mono">{baseFrequency} Hz</strong>
          </div>
          
          <button
            onClick={onOpenShrutiTuner}
            className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Open 22-Shruti Microtonal Frequency Lab"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{TUNING_SYSTEMS[tuningSystem]?.name?.split(' ')[0] || 'Shruti'} Scale</span>
            <span className="text-[10px] text-amber-400 font-mono">EDIT</span>
          </button>

          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">LAST NOTE:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 font-mono font-bold text-xs">
              {lastTriggeredNote ? `${lastTriggeredNote.swara || ''} ${lastTriggeredNote.note} (${lastTriggeredNote.freq}Hz)` : 'Ready'}
            </span>
          </div>
        </div>

        <button
          onClick={onOpenDrawer}
          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Open 7-Channel Faders & Telemetry Lab</span>
          <span>→</span>
        </button>
      </div>

    </div>
  );
};
