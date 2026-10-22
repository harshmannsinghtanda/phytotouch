/* ==============================================================================
   ShrutiTunerPanel.jsx
   PhytoTouch: Microtonal Shruti & Frequency Tuning Lab
   Engineered with world-class-clean-ui standards & high-contrast legibility
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState } from 'react';
import { 
  Radio, 
  RotateCcw, 
  Volume2, 
  Sliders, 
  Sparkles, 
  Info, 
  Check, 
  HelpCircle,
  TrendingUp,
  Music
} from 'lucide-react';
import { TUNING_SYSTEMS, calculateLeafFrequency } from '../audio/ShrutiTuning';
import { audioEngine } from '../audio/PlantAudioEngine';
import { SAPTAK_CHANNELS } from './FullscreenSynthStage';

export const ShrutiTunerPanel = ({
  tuningSystem = 'shuddha_just',
  onSelectTuningSystem,
  baseFrequency = 432,
  setBaseFrequency,
  leafCentsOffsets = [0, 0, 0, 0, 0, 0, 0],
  onUpdateLeafCents,
  onResetMicrotuning,
  onLeafTouch
}) => {
  const [selectedLeafIdx, setSelectedLeafIdx] = useState(0);
  const currentSystem = TUNING_SYSTEMS[tuningSystem] || TUNING_SYSTEMS.shuddha_just;

  const handleSliderChange = (leafIdx, cents) => {
    onUpdateLeafCents(leafIdx, parseInt(cents, 10));
  };

  const handleTestTone = (leafIdx) => {
    audioEngine.unlock();
    onLeafTouch(leafIdx, 0.75);
  };

  return (
    <div className="space-y-5 select-none font-sans">
      
      {/* 1. Header & Explanation */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#121622] border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white tracking-wider uppercase">
              MICROTONAL SHRUTI & HARMONIC RATIO LAB
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
              22-SHRUTI ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Unlike tempered Western scales, Indian classical music and natural acoustic biology divide the octave into <strong>22 microtonal Shrutis</strong> with pure integer harmonic ratios, eliminating dissonant acoustic beating.
          </p>
        </div>

        <button
          onClick={onResetMicrotuning}
          className="py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Reset all fine microtonal cent offsets to zero"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>RESET TO ZERO</span>
        </button>
      </div>

      {/* 2. Tuning System Presets */}
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
          SELECT TUNING SYSTEM PRESET:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(TUNING_SYSTEMS).map(([key, sys]) => {
            const isSelected = tuningSystem === key;
            return (
              <button
                key={key}
                onClick={() => onSelectTuningSystem(key)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 text-white border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                    : 'bg-[#10141f] text-slate-400 hover:text-slate-200 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    {sys.name}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold mt-1">
                  {sys.subtitle}
                </span>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                  {sys.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Master Base Frequency Quick Pitch Selector */}
      <div className="p-3.5 rounded-2xl bg-[#10141f] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300 uppercase">MASTER FUNDAMENTAL (SA):</span>
          <span className="font-mono font-black text-amber-400 text-sm">{baseFrequency} Hz</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
          <button
            onClick={() => setBaseFrequency(396)}
            className={`px-2 py-1 rounded-lg border transition-all ${baseFrequency === 396 ? 'bg-amber-500 text-black border-amber-400' : 'bg-black/30 text-slate-400 border-white/5 hover:text-white'}`}
          >
            396 Hz (Root)
          </button>
          <button
            onClick={() => setBaseFrequency(432)}
            className={`px-2 py-1 rounded-lg border transition-all ${baseFrequency === 432 ? 'bg-amber-500 text-black border-amber-400' : 'bg-black/30 text-slate-400 border-white/5 hover:text-white'}`}
          >
            432 Hz (Sacred)
          </button>
          <button
            onClick={() => setBaseFrequency(440)}
            className={`px-2 py-1 rounded-lg border transition-all ${baseFrequency === 440 ? 'bg-emerald-500 text-black border-emerald-400' : 'bg-black/30 text-slate-400 border-white/5 hover:text-white'}`}
          >
            440 Hz (Concert)
          </button>
          <button
            onClick={() => setBaseFrequency(528)}
            className={`px-2 py-1 rounded-lg border transition-all ${baseFrequency === 528 ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-black/30 text-slate-400 border-white/5 hover:text-white'}`}
          >
            528 Hz (Miracle)
          </button>
        </div>
      </div>

      {/* 4. 7-Leaf Microtonal Channel Strips */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-bold text-white uppercase tracking-wider">
            INDIVIDUAL LEAF FREQUENCY & CENTS EDITORS (±50¢)
          </span>
          <span className="font-mono text-emerald-400 font-bold hidden sm:inline">
            ZERO ACCUMULATED HARMONIC DRIFT
          </span>
        </div>

        <div className="space-y-2.5">
          {SAPTAK_CHANNELS.map((ch) => {
            const cents = leafCentsOffsets[ch.id] || 0;
            const liveHz = calculateLeafFrequency(ch.id, tuningSystem, baseFrequency, 0, cents);
            const shrutiLabel = currentSystem.shrutis?.[ch.id] || '';

            return (
              <div
                key={ch.id}
                className="p-3 rounded-2xl bg-[#121622] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                {/* Left Swara Badge */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/15 flex items-center justify-center font-black text-xl text-white">
                    {ch.hindi}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">{ch.swara}</span>
                      <span className="px-1.5 py-0.2 rounded bg-black/60 text-amber-300 font-mono text-[10px] font-bold border border-white/10">
                        [{ch.key}]
                      </span>
                      <span className="text-xs text-slate-400 font-mono font-bold">
                        {ch.pin}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {shrutiLabel}
                    </span>
                  </div>
                </div>

                {/* Center Cents Slider (-50 to +50 cents) */}
                <div className="flex-1 w-full max-w-sm flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 w-8 text-right">-50¢</span>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="1"
                    value={cents}
                    onChange={(e) => handleSliderChange(ch.id, e.target.value)}
                    className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <span className="text-[10px] font-mono text-slate-500 w-8">+50¢</span>
                </div>

                {/* Right Live Frequency Readout & Audition Button */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="font-mono font-black text-amber-300 text-sm">
                      {liveHz.toFixed(1)} Hz
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {cents === 0 ? 'Exact Ratio' : `${cents > 0 ? '+' : ''}${cents} cents`}
                    </div>
                  </div>

                  <button
                    onClick={() => handleTestTone(ch.id)}
                    className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer"
                    title={`Audition Leaf ${ch.swara} at ${liveHz.toFixed(1)} Hz`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>TEST</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
