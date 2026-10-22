/* ==============================================================================
   ChannelStrip.jsx
   PhytoTouch: 7-Channel Bio-Attenuator & Saptak Channel Strips
   Supports 3 Live Preview Styles:
   1. Minimalist Pro (Apple Pro / Teenage Engineering Faders)
   3. Warm Organic Conservatory (Terracotta & Olive Moss Leaf Pads)
   4. Vedic Indian Classical Saptak (Brushed Copper & Gold Swara Plates)
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useRef } from 'react';
import { SCALES, audioEngine, getNoteFrequency } from '../audio/PlantAudioEngine';

export const CHANNEL_METADATA = [
  { id: 0, tag: 'CH-01', swara: 'Sa', hindi: 'सा', name: 'Shadja (Source)', pin: 'GPIO 04', color: '#ef4444' },
  { id: 1, tag: 'CH-02', swara: 'Re', hindi: 'रे', name: 'Rishabh (Bull)', pin: 'GPIO 14', color: '#f59e0b' },
  { id: 2, tag: 'CH-03', swara: 'Ga', hindi: 'ग', name: 'Gandhar (Sky)', pin: 'GPIO 15', color: '#eab308' },
  { id: 3, tag: 'CH-04', swara: 'Ma', hindi: 'म', name: 'Madhyam (Center)', pin: 'GPIO 13', color: '#10b981' },
  { id: 4, tag: 'CH-05', swara: 'Pa', hindi: 'प', name: 'Pancham (Fifth)', pin: 'GPIO 12', color: '#06b6d4' },
  { id: 5, tag: 'CH-06', swara: 'Dha', hindi: 'ध', name: 'Dhaivat (Earth)', pin: 'GPIO 27', color: '#8b5cf6' },
  { id: 6, tag: 'CH-07', swara: 'Ni', hindi: 'नी', name: 'Nishad (Crown)', pin: 'GPIO 33', color: '#ec4899' }
];

export const ChannelStrip = ({
  activeLeaves = [false, false, false, false, false, false, false],
  onLeafTouch,
  currentScale = 'saptak',
  baseFrequency = 432,
  octaveOffset = 0,
  previewStyle = 'style4'
}) => {
  const scaleNotes = SCALES[currentScale]?.notes || SCALES.saptak.notes;
  const lastTriggerTimeRef = useRef({});
  const channelLeafIcons = ['🌱', '🍃', '🌿', '🎋', '🌴', '🍀', '🍄'];

  const handleChannelTrigger = (id, intensity = 0.70, e) => {
    if (e) e.stopPropagation();
    const now = Date.now();
    if (lastTriggerTimeRef.current[id] && (now - lastTriggerTimeRef.current[id] < 180)) {
      return;
    }
    lastTriggerTimeRef.current[id] = now;

    audioEngine.unlock();
    onLeafTouch(id, intensity);
  };

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Bus Header */}
      <div className="flex items-center justify-between border-b pb-2 mb-2 text-xs transition-colors"
        style={{
          borderColor: previewStyle === 'style3' ? 'rgba(217, 119, 6, 0.3)' : previewStyle === 'style1' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.35)'
        }}
      >
        <span className="font-bold uppercase tracking-wider flex items-center gap-1.5"
          style={{
            color: previewStyle === 'style3' ? '#fed7aa' : previewStyle === 'style1' ? '#f8fafc' : '#fef08a'
          }}
        >
          {previewStyle === 'style4' ? (
            <><span>🪕</span> 7-SWARA SAPTAK CONSOLE (सा रे ग म प ध नी) • VEDIC 432 Hz</>
          ) : previewStyle === 'style3' ? (
            <><span>🪴</span> 7-LEAF HERBARIUM ATTENUATOR BUS • ORGANIC TERRACOTTA</>
          ) : (
            <><span>🎛️</span> 7-CHANNEL PRO MIXING FADERS • RC RELAXATION DECODER</>
          )}
        </span>
        <span className="font-mono text-[11px] font-bold"
          style={{
            color: previewStyle === 'style3' ? '#f59e0b' : previewStyle === 'style1' ? '#10b981' : '#f59e0b'
          }}
        >
          {previewStyle === 'style4' ? 'SHUDDHA THAAT' : '0ms TOUCH LATENCY'}
        </span>
      </div>

      {/* 7-Channel Saptak Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {CHANNEL_METADATA.map((ch) => {
          const isActive = activeLeaves[ch.id];
          const note = scaleNotes[ch.id % scaleNotes.length];

          // STYLE 4: Vedic Classical Saptak (Brushed Copper & Temple Gold)
          if (previewStyle === 'style4') {
            return (
              <div
                key={ch.id}
                onPointerDown={(e) => handleChannelTrigger(ch.id, 0.70, e)}
                onClick={(e) => handleChannelTrigger(ch.id, 0.70, e)}
                className={`p-1.5 sm:p-2.5 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-between text-center select-none cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-b from-[#b45309] to-[#d97706] border-[#fef08a] shadow-[0_0_24px_rgba(245,158,11,0.65)] scale-[1.02]'
                    : 'bg-gradient-to-b from-[#1a1209] to-[#0d0905] border-[#b45309]/40 hover:border-[#f59e0b]/70 hover:shadow-[0_0_15px_rgba(180,83,9,0.3)]'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                {/* Channel Tag */}
                <div className="w-full flex items-center justify-between text-[10px] font-mono border-b border-[#b45309]/30 pb-1 mb-1">
                  <span className={`font-bold ${isActive ? 'text-white' : 'text-[#fde047]'}`}>
                    {ch.swara}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isActive ? '#ffffff' : ch.color }}></span>
                </div>

                {/* Big Devanagari Sacred Swara Character */}
                <div className="my-0.5">
                  <div className={`text-xl sm:text-2xl font-black font-serif leading-none ${isActive ? 'text-white drop-shadow-[0_0_10px_#fff]' : 'text-[#fbbf24]'}`}>
                    {ch.hindi}
                  </div>
                  <div className={`text-[11px] font-mono font-bold mt-0.5 ${isActive ? 'text-white' : 'text-[#fef08a]'}`}>
                    {note}
                  </div>
                </div>

                {/* Frequency */}
                <div className="text-[9px] sm:text-[10px] font-mono text-[#fde047]/80 leading-none mb-1.5">
                  {getNoteFrequency(note, baseFrequency, octaveOffset).toFixed(1)}Hz
                </div>

                {/* Swara Plate Touch Button */}
                <div className={`w-full py-1 px-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                  isActive
                    ? 'bg-white text-[#b45309] border-white shadow-md'
                    : 'bg-[#b45309]/20 text-[#fef08a] border-[#b45309]/40'
                }`}>
                  {ch.pin}
                </div>
              </div>
            );
          }

          // STYLE 3: Warm Organic Conservatory (Terracotta & Olive Moss)
          if (previewStyle === 'style3') {
            return (
              <div
                key={ch.id}
                onPointerDown={(e) => handleChannelTrigger(ch.id, 0.70, e)}
                onClick={(e) => handleChannelTrigger(ch.id, 0.70, e)}
                className={`p-1.5 sm:p-2.5 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-between text-center select-none cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-b from-[#b45309] to-[#78350f] border-[#fef3c7] shadow-[0_0_20px_rgba(217,119,6,0.6)]'
                    : 'bg-[#21140e]/90 border-[#d97706]/30 hover:border-[#f59e0b]/50'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <div className="w-full flex items-center justify-between text-[10px] font-mono border-b border-[#d97706]/20 pb-1 mb-1 text-[#fed7aa]">
                  <span>{channelLeafIcons[ch.id]}</span>
                  <span className="font-bold">{ch.swara}</span>
                </div>

                <div className="my-0.5">
                  <div className={`text-sm sm:text-base font-black font-serif ${isActive ? 'text-white' : 'text-[#fef3c7]'}`}>
                    {ch.name.split(' ')[0]}
                  </div>
                  <div className="text-xs font-mono font-bold text-[#f59e0b]">
                    {note}
                  </div>
                </div>

                <div className="text-[10px] font-mono text-[#fed7aa]/80 mb-1.5">
                  {getNoteFrequency(note, baseFrequency, octaveOffset).toFixed(1)}Hz
                </div>

                <div className={`w-full py-1 rounded-lg text-[10px] font-bold border ${
                  isActive ? 'bg-[#f59e0b] text-white border-white' : 'bg-[#180f0a] text-[#fed7aa] border-[#d97706]/30'
                }`}>
                  TOUCH
                </div>
              </div>
            );
          }

          // STYLE 1: Modern Minimalist & Industrial Pro (Apple Pro Fader)
          return (
            <div
              key={ch.id}
              onPointerDown={(e) => handleChannelTrigger(ch.id, 0.70, e)}
              onClick={(e) => handleChannelTrigger(ch.id, 0.70, e)}
              className={`p-1.5 sm:p-2.5 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-between text-center select-none cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-[#16251c] border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                  : 'bg-[#0f141c]/90 border-white/10 hover:border-[#10b981]/40'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <div className="w-full flex items-center justify-between text-[10px] font-mono border-b border-white/10 pb-1 mb-1 text-[#94a3b8]">
                <span>{ch.tag}</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isActive ? '#10b981' : ch.color }}></span>
              </div>

              <div className="my-0.5">
                <div className={`text-sm sm:text-base font-black font-mono ${isActive ? 'text-white' : 'text-white'}`}>
                  {ch.swara} • {note}
                </div>
                <div className="text-[10px] font-mono text-[#10b981]">
                  {getNoteFrequency(note, baseFrequency, octaveOffset).toFixed(1)}Hz
                </div>
              </div>

              {/* Fader LED Ladder */}
              <div className="flex flex-col gap-0.5 my-1.5">
                <div className={`w-4 h-1 rounded-sm ${isActive ? 'bg-[#ef4444]' : 'bg-[#ef4444]/20'}`}></div>
                <div className={`w-4 h-1 rounded-sm ${isActive ? 'bg-[#f59e0b]' : 'bg-[#f59e0b]/20'}`}></div>
                <div className={`w-4 h-1 rounded-sm ${isActive ? 'bg-[#10b981]' : 'bg-[#10b981]/20'}`}></div>
                <div className={`w-4 h-1 rounded-sm ${isActive ? 'bg-[#10b981]' : 'bg-[#10b981]/20'}`}></div>
              </div>

              <div className={`w-full py-1 rounded-lg text-[10px] font-mono font-bold border ${
                isActive ? 'bg-[#10b981] text-[#090c10] border-white' : 'bg-[#090c10] text-[#94a3b8] border-white/10'
              }`}>
                {ch.pin}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

