/* ==============================================================================
   InteractivePlant.jsx
   PhytoTouch: Bioluminescent Specimen & 7-Channel Saptak Bio-Pads
   Supports 3 Live Preview Styles:
   1. Minimalist Pro (Apple Pro / Teenage Engineering)
   3. Warm Organic Conservatory (Terracotta & Olive Moss)
   4. Vedic Indian Classical Saptak (Royal Emerald, Brushed Copper & Temple Gold)
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useRef } from 'react';
import { SCALES, audioEngine, getNoteFrequency } from '../audio/PlantAudioEngine';

export const LEAF_ELECTRODES = [
  { id: 0, key: '1', label: 'CH-01', swara: 'Sa', hindi: 'सा', name: 'Apex Sprout', noteIdx: 0, wireColor: '#ef4444', clipX: 200, clipY: 65 },
  { id: 1, key: '2', label: 'CH-02', swara: 'Re', hindi: 'रे', name: 'Upper Left', noteIdx: 1, wireColor: '#f59e0b', clipX: 110, clipY: 135 },
  { id: 2, key: '3', label: 'CH-03', swara: 'Ga', hindi: 'ग', name: 'Upper Right', noteIdx: 2, wireColor: '#eab308', clipX: 290, clipY: 125 },
  { id: 3, key: '4', label: 'CH-04', swara: 'Ma', hindi: 'म', name: 'Mid Left', noteIdx: 3, wireColor: '#10b981', clipX: 120, clipY: 220 },
  { id: 4, key: '5', label: 'CH-05', swara: 'Pa', hindi: 'प', name: 'Mid Right', noteIdx: 4, wireColor: '#06b6d4', clipX: 280, clipY: 210 },
  { id: 5, key: '6', label: 'CH-06', swara: 'Dha', hindi: 'ध', name: 'Basal Left', noteIdx: 5, wireColor: '#8b5cf6', clipX: 130, clipY: 295 },
  { id: 6, key: '7', label: 'CH-07', swara: 'Ni', hindi: 'नी', name: 'Basal Right', noteIdx: 6, wireColor: '#ec4899', clipX: 270, clipY: 290 }
];

export const InteractivePlant = ({
  activeLeaves = [false, false, false, false, false, false, false],
  onLeafTouch,
  currentScale = 'saptak',
  baseFrequency = 432,
  octaveOffset = 0,
  previewStyle = 'style4'
}) => {
  const scaleNotes = SCALES[currentScale]?.notes || SCALES.saptak?.notes || ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
  const lastTriggerTimeRef = useRef({});

  const handleTrigger = (id, intensity = 0.70, e) => {
    if (e) e.stopPropagation();
    const now = Date.now();
    // Guard against pointerdown + click double firing within 180ms
    if (lastTriggerTimeRef.current[id] && (now - lastTriggerTimeRef.current[id] < 180)) {
      return;
    }
    lastTriggerTimeRef.current[id] = now;

    // Synchronously unlock audio on mobile pointer gesture
    audioEngine.unlock();
    onLeafTouch(id, intensity);
  };

  const channelLeafIcons = ['🌱', '🍃', '🌿', '🎋', '🌴', '🍀', '🪷'];

  return (
    <div className="w-full flex flex-col items-center justify-between p-2.5 sm:p-4 select-none font-sans">
      
      {/* Specimen Telemetry Header */}
      <div 
        className="w-full flex flex-wrap items-center justify-between gap-2 border-b pb-2 mb-2 text-xs transition-colors"
        style={{
          borderColor: previewStyle === 'style3' ? 'rgba(217, 119, 6, 0.3)' : previewStyle === 'style1' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.35)'
        }}
      >
        <div className="flex items-center gap-2">
          <span 
            className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
            style={{
              backgroundColor: previewStyle === 'style3' ? '#f59e0b' : previewStyle === 'style1' ? '#10b981' : '#f59e0b',
              boxShadow: `0 0 10px ${previewStyle === 'style3' ? '#f59e0b' : previewStyle === 'style1' ? '#10b981' : '#f59e0b'}`
            }}
          ></span>
          <span 
            className="font-bold tracking-wide flex items-center gap-1.5"
            style={{
              color: previewStyle === 'style3' ? '#fed7aa' : previewStyle === 'style1' ? '#ffffff' : '#fef08a'
            }}
          >
            {previewStyle === 'style4' ? (
              <><span>🪕</span> SPECIMEN: SACRED TULSI & MONSTERA (7-SWARA SAPTAK)</>
            ) : previewStyle === 'style3' ? (
              <><span>🪴</span> SPECIMEN: BOTANICAL HERBARIUM (TERRACOTTA & MOSS)</>
            ) : (
              <><span>🌱</span> SPECIMEN: MONSTERA DELICIOSA (INDUSTRIAL PRO CH 01-07)</>
            )}
          </span>
          <span className="hidden sm:inline opacity-40">•</span>
          <span className="hidden sm:inline font-mono text-[11px] text-[#34d399]">
            7-PT HARDWARE BUS
          </span>
        </div>
        <div className="flex items-center gap-2.5 font-mono text-[11px] text-[#dcfce7]">
          <span>IMP: <strong className="text-[#34d399]">142 kΩ</strong></span>
          <span>•</span>
          <span>SAP: <strong className="text-[#2dd4bf]">432 Hz RESONANT</strong></span>
        </div>
      </div>

      {/* Bioluminescent Botanical Stage & Interactive SVG */}
      <div className="relative w-full max-w-[370px] aspect-[4/5] flex items-center justify-center my-1 sm:my-2">
        
        {/* Soft Ambient Plant Backlight Glow */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-full blur-3xl transition-opacity duration-300"
          style={{
            background: previewStyle === 'style3'
              ? 'radial-gradient(circle, rgba(217, 119, 6, 0.22) 0%, rgba(101, 163, 13, 0.12) 50%, transparent 75%)'
              : previewStyle === 'style1'
              ? 'radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 75%)'
              : 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(16, 185, 129, 0.14) 50%, transparent 75%)'
          }}
        ></div>

        <svg
          viewBox="0 0 400 480"
          className="w-full h-full filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.85)] overflow-visible"
          style={{ touchAction: 'manipulation' }}
        >
          <defs>
            {/* Bioluminescent Multi-Stop Deep Emerald Gradient */}
            <linearGradient id="bioChlorophyll" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="35%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#047857" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>

            {/* Vedic / Autumn Warm Gradient */}
            <linearGradient id="bioWarmOrganic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="40%" stopColor="#65a30d" />
              <stop offset="75%" stopColor="#3f6212" />
              <stop offset="100%" stopColor="#1a2e05" />
            </linearGradient>

            {/* Active Electrical Resonance Gradient */}
            <linearGradient id="bioActiveResonance" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#86efac" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Ceramic Terracotta Pot Gradient */}
            <linearGradient id="terracottaPot" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#26150d" />
              <stop offset="30%" stopColor="#451a03" />
              <stop offset="65%" stopColor="#5c2415" />
              <stop offset="100%" stopColor="#26150d" />
            </linearGradient>

            {/* Dewdrop Specular Highlight */}
            <radialGradient id="dewdropShine" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#a7f3d0" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
            </radialGradient>

            {/* Radial Glow Filter */}
            <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Plant Central Trunk / Main Stem */}
          <path d="M 200 380 Q 198 250 200 65" fill="none" stroke="#032e1b" strokeWidth="9" strokeLinecap="round" />
          <path d="M 200 380 Q 198 250 200 65" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

          {/* Flexible Hardware Leads from Terminal to 7 Leaves */}
          <path d="M 195 430 C 160 280, 180 140, 200 65" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" opacity={activeLeaves[0] ? 1 : 0.45} />
          <path d="M 180 430 C 130 330, 80 220, 110 135" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" opacity={activeLeaves[1] ? 1 : 0.45} />
          <path d="M 210 430 C 260 320, 310 210, 290 125" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="3 3" opacity={activeLeaves[2] ? 1 : 0.45} />
          <path d="M 185 430 C 140 350, 100 300, 120 220" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" opacity={activeLeaves[3] ? 1 : 0.45} />
          <path d="M 215 430 C 255 350, 290 290, 280 210" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 3" opacity={activeLeaves[4] ? 1 : 0.45} />
          <path d="M 175 430 C 145 370, 125 340, 130 295" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 3" opacity={activeLeaves[5] ? 1 : 0.45} />
          <path d="M 220 430 C 245 370, 260 340, 270 290" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="3 3" opacity={activeLeaves[6] ? 1 : 0.45} />

          {/* --- Leaf 0 (Sa - Shadja - Apex Sprout) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(0, 0.70, e)} onClick={(e) => handleTrigger(0, 0.70, e)}>
            {activeLeaves[0] && <circle cx="200" cy="35" r="45" fill="none" stroke="#fef08a" strokeWidth="2.5" opacity="0.85" className="animate-ping" />}
            <path
              d="M 200 65 C 165 35, 155 -5, 200 -15 C 245 -5, 235 35, 200 65 Z"
              fill={activeLeaves[0] ? 'url(#bioActiveResonance)' : previewStyle === 'style3' ? 'url(#bioWarmOrganic)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[0] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[0] ? '3' : '2'}
              filter={activeLeaves[0] ? 'url(#neonGlow)' : undefined}
            />
            <path d="M 200 55 L 200 -5" stroke={activeLeaves[0] ? '#ffffff' : '#a7f3d0'} strokeWidth="2" />
            <circle cx="192" cy="18" r="3" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Leaf 1 (Re - Rishabh - Upper Left) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(1, 0.70, e)} onClick={(e) => handleTrigger(1, 0.70, e)}>
            <path d="M 198 155 Q 150 150 110 135" fill="none" stroke="#032e1b" strokeWidth="5.5" />
            {activeLeaves[1] && <circle cx="95" cy="95" r="48" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.85" className="animate-ping" />}
            <path
              d="M 110 135 C 55 125, 35 75, 80 55 C 125 35, 150 85, 110 135 Z"
              fill={activeLeaves[1] ? 'url(#bioActiveResonance)' : previewStyle === 'style3' ? 'url(#bioWarmOrganic)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[1] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[1] ? '3' : '2'}
              filter={activeLeaves[1] ? 'url(#neonGlow)' : undefined}
            />
            <path d="M 110 130 C 95 105, 80 85, 82 60" stroke={activeLeaves[1] ? '#ffffff' : '#a7f3d0'} strokeWidth="2" />
            <circle cx="86" cy="85" r="3" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Leaf 2 (Ga - Gandhar - Upper Right) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(2, 0.70, e)} onClick={(e) => handleTrigger(2, 0.70, e)}>
            <path d="M 200 165 Q 240 150 290 125" fill="none" stroke="#032e1b" strokeWidth="5.5" />
            {activeLeaves[2] && <circle cx="305" cy="85" r="48" fill="none" stroke="#eab308" strokeWidth="2.5" opacity="0.85" className="animate-ping" />}
            <path
              d="M 290 125 C 345 115, 365 65, 315 45 C 270 30, 250 80, 290 125 Z"
              fill={activeLeaves[2] ? 'url(#bioActiveResonance)' : previewStyle === 'style3' ? 'url(#bioWarmOrganic)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[2] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[2] ? '3' : '2'}
              filter={activeLeaves[2] ? 'url(#neonGlow)' : undefined}
            />
            <path d="M 290 120 C 305 95, 320 75, 315 50" stroke={activeLeaves[2] ? '#ffffff' : '#a7f3d0'} strokeWidth="2" />
            <circle cx="318" cy="80" r="3" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Leaf 3 (Ma - Madhyam - Mid Left) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(3, 0.70, e)} onClick={(e) => handleTrigger(3, 0.70, e)}>
            <path d="M 199 235 Q 155 230 120 220" fill="none" stroke="#032e1b" strokeWidth="5.5" />
            {activeLeaves[3] && <circle cx="100" cy="180" r="45" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.85" className="animate-ping" />}
            <path
              d="M 120 220 C 65 210, 45 160, 90 135 C 135 110, 155 165, 120 220 Z"
              fill={activeLeaves[3] ? 'url(#bioActiveResonance)' : previewStyle === 'style3' ? 'url(#bioWarmOrganic)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[3] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[3] ? '3' : '2'}
              filter={activeLeaves[3] ? 'url(#neonGlow)' : undefined}
            />
            <path d="M 120 215 C 105 185, 90 160, 92 140" stroke={activeLeaves[3] ? '#ffffff' : '#a7f3d0'} strokeWidth="2" />
            <circle cx="95" cy="170" r="2.8" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Leaf 4 (Pa - Pancham - Mid Right) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(4, 0.70, e)} onClick={(e) => handleTrigger(4, 0.70, e)}>
            <path d="M 200 240 Q 240 230 280 210" fill="none" stroke="#032e1b" strokeWidth="5.5" />
            {activeLeaves[4] && <circle cx="295" cy="170" r="45" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.85" className="animate-ping" />}
            <path
              d="M 280 210 C 335 200, 355 150, 310 125 C 265 110, 245 160, 280 210 Z"
              fill={activeLeaves[4] ? 'url(#bioActiveResonance)' : previewStyle === 'style3' ? 'url(#bioWarmOrganic)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[4] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[4] ? '3' : '2'}
              filter={activeLeaves[4] ? 'url(#neonGlow)' : undefined}
            />
            <path d="M 280 205 C 295 180, 310 155, 305 130" stroke={activeLeaves[4] ? '#ffffff' : '#a7f3d0'} strokeWidth="2" />
            <circle cx="308" cy="165" r="2.8" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Leaf 5 (Dha - Dhaivat - Basal Left) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(5, 0.70, e)} onClick={(e) => handleTrigger(5, 0.70, e)}>
            <path d="M 199 305 Q 165 300 130 295" fill="none" stroke="#032e1b" strokeWidth="6" />
            {activeLeaves[5] && <circle cx="115" cy="255" r="42" fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.85" className="animate-ping" />}
            <path
              d="M 130 295 C 80 285, 55 240, 100 215 C 145 190, 170 245, 130 295 Z"
              fill={activeLeaves[5] ? 'url(#bioActiveResonance)' : previewStyle === 'style3' ? 'url(#bioWarmOrganic)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[5] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[5] ? '3' : '2'}
              filter={activeLeaves[5] ? 'url(#neonGlow)' : undefined}
            />
            <path d="M 130 290 C 115 265, 100 245, 102 220" stroke={activeLeaves[5] ? '#ffffff' : '#a7f3d0'} strokeWidth="2" />
            <circle cx="106" cy="245" r="2.5" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Leaf 6 (Ni - Nishad - Basal Right) --- */}
          <g className="cursor-pointer transition-transform duration-100 active:scale-95" onPointerDown={(e) => handleTrigger(6, 0.70, e)} onClick={(e) => handleTrigger(6, 0.70, e)}>
            <path d="M 200 310 Q 235 305 270 290" fill="none" stroke="#032e1b" strokeWidth="6" />
            {activeLeaves[6] && <circle cx="285" cy="250" r="42" fill="none" stroke="#ec4899" strokeWidth="2" opacity="0.85" className="animate-ping" />}
            <path
              d="M 270 290 C 320 280, 345 235, 300 210 C 255 185, 230 240, 270 290 Z"
              fill={activeLeaves[6] ? 'url(#bioActiveResonance)' : previewStyle === 'style3' ? 'url(#bioWarmOrganic)' : 'url(#bioChlorophyll)'}
              stroke={activeLeaves[6] ? '#ffffff' : '#6ee7b7'}
              strokeWidth={activeLeaves[6] ? '3' : '2'}
              filter={activeLeaves[6] ? 'url(#neonGlow)' : undefined}
            />
            <path d="M 270 285 C 285 260, 300 240, 298 215" stroke={activeLeaves[6] ? '#ffffff' : '#a7f3d0'} strokeWidth="2" />
            <circle cx="294" cy="245" r="2.5" fill="url(#dewdropShine)" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />
          </g>

          {/* --- Terracotta Pot with Living Moss Rim Base --- */}
          <g>
            <ellipse cx="200" cy="375" rx="74" ry="15" fill="#140a06" />
            <path d="M 132 375 L 146 442 Q 200 452 254 442 L 268 375 Z" fill="url(#terracottaPot)" stroke="#311308" strokeWidth="2.5" />
            <ellipse cx="200" cy="375" rx="68" ry="10" fill="#0b0604" />
            <ellipse cx="200" cy="375" rx="66" ry="7" fill="none" stroke="#15803d" strokeWidth="3" strokeDasharray="5 3" opacity="0.8" />
          </g>

          {/* Physical Copper Alligator Electrodes Clamped to 7 Leaves */}
          {LEAF_ELECTRODES.map((elec) => {
            const isActive = activeLeaves[elec.id];
            const note = scaleNotes[elec.id % scaleNotes.length];

            return (
              <g
                key={elec.id}
                className="cursor-pointer group select-none"
                onPointerDown={(e) => handleTrigger(elec.id, 0.70, e)}
                onClick={(e) => handleTrigger(elec.id, 0.70, e)}
                transform={`translate(${elec.clipX}, ${elec.clipY})`}
              >
                {/* Copper Electrode Clip Body */}
                <rect
                  x="-9"
                  y="-7"
                  width="18"
                  height="14"
                  rx="3"
                  fill={isActive ? '#ffffff' : '#072416'}
                  stroke={isActive ? '#f59e0b' : elec.wireColor}
                  strokeWidth="2"
                  filter={isActive ? 'url(#neonGlow)' : undefined}
                />
                <rect x="-4" y="-3" width="8" height="6" fill={elec.wireColor} rx="1" />

                {/* Botanical Channel Readout Flag */}
                <g transform="translate(15, -10)">
                  <rect
                    x="0"
                    y="0"
                    width="62"
                    height="20"
                    rx="5"
                    fill="#041a0f"
                    stroke={isActive ? '#34d399' : 'rgba(52,211,153,0.3)'}
                    strokeWidth="1.4"
                  />
                  <text
                    x="6"
                    y="14"
                    fill={isActive ? '#fef08a' : '#f0fdf4'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {previewStyle === 'style4' ? `${elec.hindi} ${note}` : `${elec.label} ${note}`}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Botanical 7-Channel Terminal Distribution Block */}
          <g transform="translate(142, 424)">
            <rect x="0" y="0" width="116" height="24" rx="6" fill="#04180d" stroke="rgba(52,211,153,0.3)" strokeWidth="1.4" />
            <circle cx="12" cy="12" r="4.5" fill="#ef4444" />
            <circle cx="28" cy="12" r="4.5" fill="#f59e0b" />
            <circle cx="44" cy="12" r="4.5" fill="#eab308" />
            <circle cx="60" cy="12" r="4.5" fill="#10b981" />
            <circle cx="76" cy="12" r="4.5" fill="#06b6d4" />
            <circle cx="92" cy="12" r="4.5" fill="#8b5cf6" />
            <circle cx="106" cy="12" r="4" fill="#ec4899" />
          </g>
        </svg>

        {/* Soil Probe Status Badge */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full phyto-badge text-xs font-mono shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse"></span>
          <span className="text-[#34d399] font-bold">🌱 7-CH RHIZOME BIO-BUS GROUNDED</span>
        </div>
      </div>

      {/* 7-Channel Tactile Mobile Thumb Pads (Thumb-friendly & 0ms Gesture Response) */}
      <div className="w-full mt-2">
        <div className="flex items-center justify-between text-xs text-[#86efac] mb-1.5 px-1">
          <span 
            className="font-bold uppercase tracking-wider flex items-center gap-1.5"
            style={{
              color: previewStyle === 'style3' ? '#fed7aa' : previewStyle === 'style1' ? '#ffffff' : '#fef08a'
            }}
          >
            {previewStyle === 'style4' ? (
              <><span>🪕</span> 7 SAPTAK SWARAS (TOUCH LEAF / KEY [1-7])</>
            ) : previewStyle === 'style3' ? (
              <><span>🪴</span> 7 ORGANIC LEAF SENSORS (TOUCH TO PLAY)</>
            ) : (
              <><span>🌿</span> 7-CH RC CAPACITIVE PADS (KEYS 1 - 7)</>
            )}
          </span>
          <span className="font-mono text-[11px] text-[#34d399] font-bold">KEYS [1 - 7]</span>
        </div>
        
        <div className="w-full grid grid-cols-7 gap-1 sm:gap-2">
          {LEAF_ELECTRODES.map((elec) => {
            const isActive = activeLeaves[elec.id];
            const note = scaleNotes[elec.id % scaleNotes.length];

            return (
              <button
                key={elec.id}
                type="button"
                onPointerDown={(e) => handleTrigger(elec.id, 0.70, e)}
                onClick={(e) => handleTrigger(elec.id, 0.70, e)}
                className={`phyto-touch-pad ${isActive ? 'active' : ''}`}
                style={{
                  touchAction: 'manipulation',
                  borderColor: isActive 
                    ? '#fef08a' 
                    : previewStyle === 'style3' 
                    ? 'rgba(217, 119, 6, 0.35)' 
                    : previewStyle === 'style1' 
                    ? 'rgba(16, 185, 129, 0.3)' 
                    : 'rgba(245, 158, 11, 0.35)'
                }}
              >
                {/* Hindi Swara or Leaf Icon */}
                <div className="flex items-center gap-0.5 justify-center">
                  <span className="text-xs sm:text-sm font-bold" style={{ color: elec.wireColor }}>
                    {previewStyle === 'style4' ? elec.hindi : channelLeafIcons[elec.id]}
                  </span>
                </div>

                {/* Swara Name or Tag */}
                <div className="my-0.5">
                  <span className={`text-sm sm:text-lg font-black font-mono tracking-tight ${isActive ? 'text-white drop-shadow-[0_0_8px_#fff]' : 'text-white'}`}>
                    {previewStyle === 'style4' ? elec.swara : note}
                  </span>
                </div>

                {/* Frequency & Key Badge */}
                <div className="flex flex-col items-center leading-none">
                  <span className={`text-[9px] font-mono font-medium ${isActive ? 'text-white/95' : 'text-[#86efac]'}`}>
                    {getNoteFrequency(note, baseFrequency, octaveOffset).toFixed(0)}Hz
                  </span>
                  <span className="text-[8px] font-mono text-white/50 mt-0.5">
                    [{elec.key}]
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
