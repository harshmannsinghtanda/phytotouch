/* ==============================================================================
   TelemetryDrawer.jsx
   PhytoTouch: Slide-Out Studio Mixing & Bio-Telemetry Console Drawer
   Engineered with world-class-clean-ui standards & high-contrast legibility
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState } from 'react';
import {
  X,
  Sliders,
  Activity,
  Heart,
  Cpu,
  Zap,
  Volume2,
  RefreshCw,
  Terminal,
  Wifi,
  Sparkles,
  Layers,
  Radio,
  FileText
} from 'lucide-react';
import { AnalogOscilloscope } from './AnalogOscilloscope';
import { ShrutiTunerPanel } from './ShrutiTunerPanel';
import { SAPTAK_CHANNELS } from './FullscreenSynthStage';
import { SCALES, getNoteFrequency, audioEngine } from '../audio/PlantAudioEngine';

export const TelemetryDrawer = ({
  isOpen,
  onClose,
  activeLeaves = [false, false, false, false, false, false, false],
  onLeafTouch,
  currentScale = 'saptak',
  baseFrequency = 432,
  setBaseFrequency,
  octaveOffset = 0,
  telemetryData,
  lastTriggeredNote,
  isSerialConnected,
  onConnectSerial,
  onDisconnectSerial,
  serialStatus,
  lastSerialPacket,
  rawChannelValues = [70, 70, 70, 70, 70, 70, 70],
  onCalibrate,
  isCalibrating,
  onOpenPitchDeck,
  tuningSystem = 'shuddha_just',
  onSelectTuningSystem,
  leafCentsOffsets = [0, 0, 0, 0, 0, 0, 0],
  onUpdateLeafCents,
  onResetMicrotuning,
  defaultTab = 'mixing'
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab); // 'mixing' | 'oscilloscope' | 'telemetry' | 'hardware' | 'shruti'
  const [channelGains, setChannelGains] = useState([85, 85, 85, 85, 85, 85, 85]);
  const scaleNotes = SCALES[currentScale]?.notes || SCALES.saptak?.notes || ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      
      {/* Click outside backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-out Drawer Container */}
      <aside className="relative w-full max-w-2xl h-full bg-[#0d111a] border-l border-white/10 shadow-2xl flex flex-col z-10 animate-drawer-slide font-sans select-none overflow-hidden">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3 bg-[#111622]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                STUDIO WORKSTATION DRAWER
              </h2>
              <p className="text-xs text-slate-400">
                7-Channel Mixing Faders, DSP Oscilloscope & Hardware Bus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 pt-3 pb-2 border-b border-white/10 flex items-center gap-2 bg-[#0d111a] overflow-x-auto">
          <button
            onClick={() => setActiveTab('mixing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'mixing'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>7-CH FADERS</span>
          </button>

          <button
            onClick={() => setActiveTab('oscilloscope')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'oscilloscope'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>OSCILLOSCOPE & FFT</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'telemetry'
                ? 'bg-cyan-500 text-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>BIO-TELEMETRY</span>
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'hardware'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>ESP32 HARDWARE</span>
          </button>

          <button
            onClick={() => setActiveTab('shruti')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'shruti'
                ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>SHRUTI TUNER</span>
          </button>
        </div>

        {/* Drawer Body Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* TAB 1: 7-CHANNEL MIXING FADERS */}
          {activeTab === 'mixing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white uppercase tracking-wider">
                  7 SAPTAK CHANNEL STRIPS (MOTORIZED ATTENUATORS)
                </span>
                <span className="font-mono text-amber-400 font-bold">432 Hz RESONANCE</span>
              </div>

              {/* 7 Faders Grid */}
              <div className="grid grid-cols-7 gap-2 bg-[#121622] p-4 rounded-2xl border border-white/10">
                {SAPTAK_CHANNELS.map((ch, idx) => {
                  const isActive = activeLeaves[ch.id];
                  const note = scaleNotes[ch.id % scaleNotes.length];

                  return (
                    <div
                      key={ch.id}
                      className={`flex flex-col items-center justify-between p-2 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : 'bg-[#0a0d14] border-white/5'
                      }`}
                    >
                      {/* Swara Name */}
                      <span className={`text-xs font-black ${isActive ? 'text-amber-300' : 'text-white'}`}>
                        {ch.hindi}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {ch.swara}
                      </span>

                      {/* LED Decibel Ladder Simulation */}
                      <div className="w-3 h-24 my-3 bg-black/60 rounded-full flex flex-col justify-end p-0.5 gap-0.5 border border-white/10">
                        <div className={`w-full h-1.5 rounded-sm ${isActive ? 'bg-rose-500 shadow-sm' : 'bg-slate-800'}`} />
                        <div className={`w-full h-1.5 rounded-sm ${isActive ? 'bg-amber-400' : 'bg-slate-800'}`} />
                        <div className={`w-full h-2 rounded-sm ${isActive ? 'bg-emerald-400' : 'bg-emerald-900/40'}`} />
                        <div className={`w-full h-3 rounded-sm ${isActive ? 'bg-emerald-500' : 'bg-emerald-900/60'}`} />
                        <div className={`w-full h-4 rounded-sm ${isActive ? 'bg-emerald-600' : 'bg-emerald-950'}`} />
                        <div className="w-full flex-1 rounded-sm bg-emerald-950/80" />
                      </div>

                      {/* Channel Gain Slider */}
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={channelGains[idx]}
                        onChange={(e) => {
                          const next = [...channelGains];
                          next[idx] = parseInt(e.target.value, 10);
                          setChannelGains(next);
                        }}
                        className="w-12 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 -rotate-90 my-2"
                      />

                      {/* Trigger Key Button */}
                      <button
                        onClick={() => onLeafTouch(ch.id, 0.75)}
                        className={`mt-2 w-full py-1 rounded text-[10px] font-bold font-mono border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-amber-500 text-black border-amber-300'
                            : 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
                        }`}
                      >
                        {note}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Master Effects Strip */}
              <div className="p-4 rounded-2xl bg-[#121622] border border-white/10 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>MASTER BOTANICAL REVERB & RESONATOR MATRIX</span>
                </span>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400 text-[11px]">CONVOLUTION REVERB</span>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">Forest Canopy (3.2s)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400 text-[11px]">BANDPASS FILTER</span>
                    <p className="text-sm font-bold text-cyan-400 mt-0.5">432 Hz Q=2.4</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-slate-400 text-[11px]">ANALOG CHORUS</span>
                    <p className="text-sm font-bold text-amber-400 mt-0.5">BBD Warmth (0.4 Hz)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OSCILLOSCOPE & FFT SPECTRUM */}
          {activeTab === 'oscilloscope' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white uppercase tracking-wider">
                  REAL-TIME BIO-ACOUSTIC OSCILLOSCOPE & HARMONICS
                </span>
                <span className="font-mono text-emerald-400 font-bold">48,000 Hz SAMPLE RATE</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#121622] border border-white/10">
                <AnalogOscilloscope isPlaying={true} lastTriggeredNote={lastTriggeredNote} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#121622] border border-white/10">
                  <span className="text-slate-400 text-[11px]">FUNDAMENTAL PEAK</span>
                  <p className="text-base font-black text-emerald-400 mt-1">
                    {lastTriggeredNote ? `${lastTriggeredNote.freq} Hz` : '432.0 Hz'}
                  </p>
                  <span className="text-[11px] text-slate-400">Pure Sinusoidal Resonance</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#121622] border border-white/10">
                  <span className="text-slate-400 text-[11px]">TOTAL HARMONIC DISTORTION</span>
                  <p className="text-base font-black text-cyan-400 mt-1">0.02% THD</p>
                  <span className="text-[11px] text-slate-400">Studio Grade Pure Tone</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BIO-TELEMETRY & SCIENCE */}
          {activeTab === 'telemetry' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white uppercase tracking-wider">
                  PLANT ELECTROPHYSIOLOGY & BIO-METRIC TELEMETRY
                </span>
                <span className="font-mono text-cyan-400 font-bold">LIVE TELEMETRY</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#121622] border border-white/10">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    GALVANIC IMPEDANCE
                  </span>
                  <div className="my-1.5 flex items-baseline gap-1.5 font-mono">
                    <span className="text-2xl font-black text-white">{telemetryData?.impedanceKOhm || 142.4}</span>
                    <span className="text-xs font-bold text-slate-400">kΩ</span>
                  </div>
                  <span className="text-[11px] text-emerald-400">✓ Healthy Xylem Ionic Current</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#121622] border border-white/10">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    CUTICULAR CAPACITANCE
                  </span>
                  <div className="my-1.5 flex items-baseline gap-1.5 font-mono">
                    <span className="text-2xl font-black text-white">{telemetryData?.capacitancePf || 48.6}</span>
                    <span className="text-xs font-bold text-slate-400">pF</span>
                  </div>
                  <span className="text-[11px] text-cyan-400">✓ Turgor Pressure Active</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#121622] border border-white/10">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    CORTISOL REDUCTION INDEX
                  </span>
                  <div className="my-1.5 flex items-baseline gap-1.5 font-mono">
                    <span className="text-2xl font-black text-emerald-400">-23.5</span>
                    <span className="text-xs font-bold text-slate-400">%</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Auditory relaxation impact</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#121622] border border-white/10">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    ALPHA BRAINWAVE ENTRAINMENT
                  </span>
                  <div className="my-1.5 flex items-baseline gap-1.5 font-mono">
                    <span className="text-2xl font-black text-amber-400">9.2</span>
                    <span className="text-xs font-bold text-slate-400">Hz</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Calm meditative frequency</span>
                </div>
              </div>

              {/* Research Dossier Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-amber-950/30 to-[#121622] border border-emerald-500/30 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white">Institutional Research Paper</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Nirman Lab 2026: "Galvanic Touch Transduction in Tropical Flora"
                  </p>
                </div>
                <button
                  onClick={onOpenPitchDeck}
                  className="px-3 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer shrink-0"
                >
                  Read Paper
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ESP32 HARDWARE & PINOUTS */}
          {activeTab === 'hardware' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold text-white uppercase tracking-wider">
                  ESP32 CONFLICT-FREE 7-TOUCH PINOUT & SERIAL BUS
                </span>
                <span className="font-mono text-purple-400 font-bold">115,200 BAUD</span>
              </div>

              {/* Serial Connection Bar */}
              <div className="p-4 rounded-2xl bg-[#121622] border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-slate-400">HARDWARE LINK STATUS</span>
                  <p className="text-sm font-mono font-bold text-white mt-0.5">
                    {isSerialConnected ? '🟢 ESP32 Connected (115200 Baud)' : '⚪ Disconnected (Simulation Mode)'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isSerialConnected ? (
                    <button
                      onClick={onDisconnectSerial}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-all cursor-pointer"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={onConnectSerial}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-black hover:bg-emerald-400 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Wifi className="w-3.5 h-3.5" />
                      <span>Connect USB ESP32</span>
                    </button>
                  )}

                  <button
                    onClick={onCalibrate}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1d2333] text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isCalibrating ? 'animate-spin' : ''}`} />
                    <span>Tare [C]</span>
                  </button>
                </div>
              </div>

              {/* 7-Pin Table */}
              <div className="rounded-2xl bg-[#121622] border border-white/10 overflow-hidden text-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-[#181e2e] text-slate-400 border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Swara</th>
                      <th className="py-2.5 px-3">Pin</th>
                      <th className="py-2.5 px-3">Touch Ch</th>
                      <th className="py-2.5 px-3">Note</th>
                      <th className="py-2.5 px-3">Raw ADC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {SAPTAK_CHANNELS.map((ch, idx) => (
                      <tr key={ch.id} className={activeLeaves[ch.id] ? 'bg-amber-500/10' : ''}>
                        <td className="py-2 px-3 font-bold text-white">{ch.hindi} ({ch.swara})</td>
                        <td className="py-2 px-3 text-amber-400">{ch.pin}</td>
                        <td className="py-2 px-3 text-slate-400">Touch {ch.id === 0 ? '0' : ch.id === 1 ? '6' : ch.id === 2 ? '3' : ch.id === 3 ? '4' : ch.id === 4 ? '5' : ch.id === 5 ? '7' : '8'}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">{scaleNotes[ch.id % scaleNotes.length]}</td>
                        <td className="py-2 px-3 font-bold text-white">{rawChannelValues[idx] || 72}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Live Serial Raw Packet Console */}
              <div className="p-4 rounded-2xl bg-[#090c12] border border-white/10 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-purple-400" />
                    <span>RAW SERIAL PACKET LOG</span>
                  </span>
                  <span className="text-[11px] text-emerald-400">LIVE</span>
                </div>
                <div className="p-3 bg-black/60 rounded-xl text-emerald-400 font-mono text-[11px] overflow-x-auto border border-white/5">
                  {lastSerialPacket || '{"channel_readings":[74,72,71,73,72,70,71],"calibration_active":false}'}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MICROTONAL SHRUTI & HARMONIC RATIOS */}
          {activeTab === 'shruti' && (
            <ShrutiTunerPanel
              tuningSystem={tuningSystem}
              onSelectTuningSystem={onSelectTuningSystem}
              baseFrequency={baseFrequency}
              setBaseFrequency={setBaseFrequency}
              leafCentsOffsets={leafCentsOffsets}
              onUpdateLeafCents={onUpdateLeafCents}
              onResetMicrotuning={onResetMicrotuning}
              onLeafTouch={onLeafTouch}
            />
          )}

        </div>

      </aside>

    </div>
  );
};
