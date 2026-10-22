/* ==============================================================================
   ControlsHeader.jsx
   PhytoTouch: Master Studio Control Bar & Sound Bank Palette
   Teenage Engineering OP-1 Field & Apple Pro Aesthetics
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React from 'react';
import { PRESETS, SCALES, audioEngine } from '../audio/PlantAudioEngine';

export const ControlsHeader = ({
  currentPreset,
  setPreset,
  currentScale,
  setScale,
  baseFrequency = 432,
  setBaseFrequency,
  octaveOffset = 0,
  setOctaveOffset,
  mode,
  setMode,
  isSerialConnected,
  onConnectSerial,
  onDisconnectSerial,
  isAutoPlay,
  setIsAutoPlay,
  volume,
  setVolume,
  onOpenPitchDeck,
  onOpenFirmwareGuide,
  onCalibrate,
  isCalibrating,
  lastSerialPacket
}) => {
  return (
    <header className="w-full flex flex-col gap-4 font-sans mb-3">
      
      {/* 1. Master Brand & Action Toolbar - Botanical Glass */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#10b981]/25 pb-4">
        
        {/* Instrument Identification */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#10b981]/30 to-[#059669]/30 border border-[#10b981]/40 flex items-center justify-center font-bold text-2xl text-[#34d399] shadow-lg shadow-[#10b981]/20">
            🌱
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white m-0">
                PHYTOTOUCH
              </h1>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/35 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                432Hz
              </span>
              <span className="text-xs font-mono text-[#86efac] hidden sm:inline">
                NIRMAN LAB • BOTANICAL SYNTHESIS
              </span>
            </div>
            <p className="text-xs text-[#a7f3d0] mt-0.5 font-medium">
              Living Plant Bio-Acoustic Synthesizer & Telemetry Workstation
            </p>
          </div>
        </div>

        {/* Quick Modal & Hardware Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {isSerialConnected && (
            <button
              onClick={onCalibrate}
              type="button"
              className="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.22)',
                color: '#fbbf24',
                borderColor: 'rgba(245, 158, 11, 0.45)'
              }}
              title="Tare/recalibrate plant baselines against ambient moisture [C]"
            >
              <span>{isCalibrating ? 'CALIBRATING...' : 'TARE BASELINE [C]'}</span>
            </button>
          )}

          <button
            onClick={onOpenPitchDeck}
            type="button"
            className="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            style={{
              backgroundColor: 'rgba(9, 38, 25, 0.90)',
              color: '#dcfce7',
              borderColor: 'rgba(16, 185, 129, 0.35)'
            }}
            title="Open field dossier & research dossier [D]"
          >
            <span>📋 FIELD DOSSIER & PAPERS</span>
          </button>

          <button
            onClick={onOpenFirmwareGuide}
            type="button"
            className="px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.22)',
              color: '#34d399',
              borderColor: 'rgba(16, 185, 129, 0.45)'
            }}
            title="Open ESP32 hardware rig simulation, circuit schematics, and C++ firmware [F]"
          >
            <span>⚡ HARDWARE & RIG SIM [F]</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Sound Bank Presets (Nature Botanical Herbarium Cards) */}
      <div className="w-full">
        <div className="flex items-center justify-between text-xs text-[#86efac] mb-2 px-1">
          <span className="font-bold text-white/90 uppercase tracking-wider flex items-center gap-1.5">
            <span>🌿</span> BOTANICAL BIO-ACOUSTIC TIMBRES
          </span>
          <span className="text-[11px] font-mono text-[#34d399] font-semibold">
            48kHz HIGH-FIDELITY RESONATOR
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
          {Object.entries(PRESETS).map(([key, p]) => {
            const isSelected = currentPreset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setPreset(key);
                  audioEngine.setPreset(key);
                  audioEngine.testChime();
                }}
                className={`phyto-preset-card ${
                  isSelected ? 'active' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xl">{p.icon}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: isSelected ? '#34d399' : 'rgba(52,211,153,0.3)',
                      boxShadow: isSelected ? '0 0 8px #34d399' : 'none'
                    }}
                  ></span>
                </div>
                <div className="text-sm font-bold text-white mb-0.5">
                  {p.name}
                </div>
                <div className="text-xs text-[#a7f3d0] leading-tight line-clamp-2">
                  {p.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Operational Parameter Bus (Signal Source, Circadian Auto-Pulse, Harmonic Scale, Volume) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center text-xs">
        
        {/* Signal Mode Toggle */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#082417]/85 border border-[#10b981]/25 shadow-md shadow-black/30" style={{ backgroundColor: 'rgba(8, 36, 23, 0.94)', borderColor: 'rgba(16, 185, 129, 0.35)' }}>
          <span className="text-[11px] font-bold text-[#86efac] uppercase tracking-wider">
            SIGNAL SOURCE
          </span>
          <div className="flex items-center gap-1 p-1 rounded-xl border border-[#10b981]/25" style={{ backgroundColor: '#03140a' }}>
            <button
              type="button"
              onClick={() => setMode('simulation')}
              className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
              style={{
                backgroundColor: mode === 'simulation' ? '#10b981' : 'transparent',
                color: mode === 'simulation' ? '#022312' : '#86efac',
                fontWeight: mode === 'simulation' ? 800 : 600,
                boxShadow: mode === 'simulation' ? '0 0 10px rgba(16,185,129,0.4)' : 'none'
              }}
            >
              <span>🌿</span> SIMULATION
            </button>
            <button
              type="button"
              onClick={() => setMode('hardware')}
              className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
              style={{
                backgroundColor: mode === 'hardware' ? '#f59e0b' : 'transparent',
                color: mode === 'hardware' ? '#000000' : '#86efac',
                fontWeight: mode === 'hardware' ? 800 : 600,
                boxShadow: mode === 'hardware' ? '0 0 10px rgba(245,158,11,0.4)' : 'none'
              }}
            >
              <span>⚡</span> USB SERIAL
            </button>
          </div>
        </div>

        {/* Circadian Engine / Hardware Link Toggle */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#082417]/85 border border-[#10b981]/25 shadow-md shadow-black/30" style={{ backgroundColor: 'rgba(8, 36, 23, 0.94)', borderColor: 'rgba(16, 185, 129, 0.35)' }}>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#86efac] uppercase tracking-wider">
            <span>{mode === 'hardware' ? 'ESP32 HARDWARE' : 'TRANSPIRATION PULSE'}</span>
            {isSerialConnected && lastSerialPacket && (
              <span className="font-mono text-[#34d399] text-[10px] truncate max-w-[80px]">
                {lastSerialPacket}
              </span>
            )}
          </div>
          {mode === 'hardware' ? (
            <button
              type="button"
              onClick={isSerialConnected ? onDisconnectSerial : onConnectSerial}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              style={{
                backgroundColor: isSerialConnected ? 'rgba(16, 185, 129, 0.25)' : '#03140a',
                color: isSerialConnected ? '#34d399' : '#ffffff',
                borderColor: isSerialConnected ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.3)'
              }}
            >
              <span className={`w-2 h-2 rounded-full ${isSerialConnected ? 'bg-[#10b981] shadow-[0_0_8px_#10b981]' : 'bg-[#6ee7b7]'}`}></span>
              <span>{isSerialConnected ? 'CONNECTED (115200)' : 'CONNECT USB PORT'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              style={{
                backgroundColor: isAutoPlay ? 'rgba(16, 185, 129, 0.25)' : '#03140a',
                color: isAutoPlay ? '#34d399' : '#86efac',
                borderColor: isAutoPlay ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.25)'
              }}
            >
              <span className={`w-2 h-2 rounded-full ${isAutoPlay ? 'bg-[#34d399] animate-ping' : 'bg-[#0d3822]'}`}></span>
              <span>AUTO-PULSE: {isAutoPlay ? '🌿 ACTIVE' : 'MUTED'}</span>
            </button>
          )}
        </div>

        {/* Harmonic Tuning Scale */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#082417]/85 border border-[#10b981]/25 shadow-md shadow-black/30" style={{ backgroundColor: 'rgba(8, 36, 23, 0.94)', borderColor: 'rgba(16, 185, 129, 0.35)' }}>
          <span className="text-[11px] font-bold text-[#86efac] uppercase tracking-wider">
            BIO-HARMONIC SCALE
          </span>
          <select
            value={currentScale}
            onChange={(e) => {
              setScale(e.target.value);
              audioEngine.setScale(e.target.value);
              audioEngine.testChime();
            }}
            className="w-full border rounded-xl px-3 py-2 text-xs font-medium cursor-pointer"
            style={{
              backgroundColor: '#03140a',
              color: '#ffffff',
              borderColor: 'rgba(16, 185, 129, 0.45)',
              outline: 'none'
            }}
          >
            {Object.entries(SCALES).map(([key, s]) => (
              <option key={key} value={key} style={{ backgroundColor: '#072416', color: '#ffffff' }}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Master Volume & Test Chime */}
        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#082417]/85 border border-[#10b981]/25 shadow-md shadow-black/30" style={{ backgroundColor: 'rgba(8, 36, 23, 0.94)', borderColor: 'rgba(16, 185, 129, 0.35)' }}>
          <div className="flex items-center justify-between text-[11px] font-bold text-[#86efac] uppercase tracking-wider">
            <span>MASTER GAIN</span>
            <span className="font-mono text-white font-bold">{volume} dB</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="-36"
              max="-4"
              step="1"
              value={volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                audioEngine.setMasterVolume(val);
              }}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
              style={{ backgroundColor: '#03140a' }}
            />
            <button
              type="button"
              onClick={() => audioEngine.testChime()}
              className="px-2.5 py-1 rounded-lg border text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap shadow-sm active:scale-95"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.22)',
                color: '#34d399',
                borderColor: 'rgba(16, 185, 129, 0.45)'
              }}
              title="Play Test Tone at Current Frequency"
            >
              TEST 🔔
            </button>
          </div>
        </div>

      </div>

      {/* 4. Master Botanical Harmonic Frequency & Octave Calibrator Rack */}
      <div className="w-full p-3 sm:p-4 rounded-2xl bg-[#082417]/85 border border-[#10b981]/25 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 shadow-lg shadow-black/30">
        {/* Left: Tuning Header & Big Hz Readout */}
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10b981]/30 to-[#059669]/30 border border-[#10b981]/40 flex items-center justify-center text-xl shrink-0">
            🎛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#86efac] uppercase tracking-wider">
                FREQUENCY TUNER
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/35">
                {Math.abs(baseFrequency - 432) < 0.2
                  ? '432Hz SACRED FLORA'
                  : Math.abs(baseFrequency - 440) < 0.2
                  ? '440Hz CONCERT'
                  : Math.abs(baseFrequency - 528) < 0.2
                  ? '528Hz CHLOROPHYLL REPAIR'
                  : Math.abs(baseFrequency - 415) < 0.2
                  ? '415Hz BAROQUE'
                  : `${baseFrequency.toFixed(1)}Hz CUSTOM`}
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black font-mono text-white tracking-tight">
                {baseFrequency.toFixed(1)} <span className="text-sm text-[#34d399] font-bold">Hz</span>
              </span>
              <span className="text-xs font-mono text-[#86efac]">
                ({baseFrequency >= 440 ? '+' : ''}{(1200 * Math.log2(baseFrequency / 440)).toFixed(1)} cents)
              </span>
            </div>
          </div>
        </div>

        {/* Center: Precision Slider & Sacred Preset Buttons */}
        <div className="flex-1 w-full flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-[#86efac] whitespace-nowrap">400 Hz</span>
            <input
              type="range"
              min="400"
              max="532"
              step="0.5"
              value={baseFrequency}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setBaseFrequency(val);
                audioEngine.setBaseFrequency(val);
              }}
              className="w-full h-2 bg-[#03140a] rounded-lg appearance-none cursor-pointer accent-[#10b981]"
            />
            <span className="font-mono text-[11px] text-[#86efac] whitespace-nowrap">532 Hz</span>
          </div>

          {/* Sacred Quick Preset Tunings */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { hz: 415, label: '415Hz (Baroque Nature)' },
              { hz: 432, label: '432Hz (Verdi Flora Healing)' },
              { hz: 440, label: '440Hz (Concert Std)' },
              { hz: 444, label: '444Hz (Sunlight Key)' },
              { hz: 528, label: '528Hz (Solfeggio MI)' }
            ].map((p) => {
              const isSelected = Math.abs(baseFrequency - p.hz) < 0.2;
              return (
                <button
                  key={p.hz}
                  type="button"
                  onClick={() => {
                    setBaseFrequency(p.hz);
                    audioEngine.setBaseFrequency(p.hz);
                    audioEngine.testChime();
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-all cursor-pointer whitespace-nowrap active:scale-95"
                  style={{
                    backgroundColor: isSelected ? '#10b981' : '#04170e',
                    color: isSelected ? '#022312' : '#dcfce7',
                    borderColor: isSelected ? '#6ee7b7' : 'rgba(16, 185, 129, 0.35)',
                    fontWeight: isSelected ? 900 : 600,
                    boxShadow: isSelected ? '0 0 12px rgba(16,185,129,0.5)' : 'none'
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Octave Transposition Stepper */}
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-[#10b981]/25 pt-2 md:pt-0 md:pl-4 justify-between md:justify-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#86efac] uppercase tracking-wider">
              OCTAVE
            </span>
            <span className="font-mono text-xs font-bold text-white">
              {octaveOffset > 0 ? `+${octaveOffset}` : octaveOffset} OCT
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={octaveOffset <= -2}
              onClick={() => {
                const next = Math.max(-2, octaveOffset - 1);
                setOctaveOffset(next);
                audioEngine.setOctaveOffset(next);
                audioEngine.testChime();
              }}
              className="w-8 h-8 rounded-xl border text-white font-bold text-sm flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-30"
              style={{
                backgroundColor: '#04170e',
                borderColor: 'rgba(16, 185, 129, 0.35)'
              }}
              title="Down 1 Octave"
            >
              -
            </button>
            <button
              type="button"
              disabled={octaveOffset >= 2}
              onClick={() => {
                const next = Math.min(2, octaveOffset + 1);
                setOctaveOffset(next);
                audioEngine.setOctaveOffset(next);
                audioEngine.testChime();
              }}
              className="w-8 h-8 rounded-xl border text-white font-bold text-sm flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-30"
              style={{
                backgroundColor: '#04170e',
                borderColor: 'rgba(16, 185, 129, 0.35)'
              }}
              title="Up 1 Octave"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
