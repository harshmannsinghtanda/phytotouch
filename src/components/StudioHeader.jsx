/* ==============================================================================
   StudioHeader.jsx
   PhytoTouch: Master Studio Control Bar & Navigation
   Engineered with world-class-clean-ui standards & high-contrast legibility
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sliders,
  Play,
  Pause,
  FileText,
  Activity,
  Cpu,
  Sparkles,
  Music,
  Wind,
  Disc,
  Waves,
  RefreshCw,
  Maximize2,
  Palette,
  Check
} from 'lucide-react';
import { PRESETS, SCALES } from '../audio/PlantAudioEngine';
import { STUDIO_THEMES } from '../theme/StudioThemes';

export const StudioHeader = ({
  currentPreset,
  setPreset,
  currentScale,
  setScale,
  baseFrequency = 432,
  setBaseFrequency,
  volume,
  setVolume,
  isAutoPlay,
  setIsAutoPlay,
  onOpenPitchDeck,
  onToggleDrawer,
  isDrawerOpen,
  isSerialConnected,
  onCalibrate,
  isCalibrating,
  isRecording = false,
  recordingSeconds = 0,
  onToggleRecord,
  justDownloaded = false,
  isRagaOpen = false,
  onToggleRaga,
  currentTheme = 'obsidian',
  onSelectTheme
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const isMuted = volume <= -40;

  const formatRecordTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const PRESET_ICONS = {
    grand_piano: <Music className="w-4 h-4 text-emerald-400" />,
    cello: <Activity className="w-4 h-4 text-amber-400" />,
    kalimba: <Disc className="w-4 h-4 text-cyan-400" />,
    bansuri_flute: <Wind className="w-4 h-4 text-rose-400" />,
    celestial_pad: <Waves className="w-4 h-4 text-purple-400" />
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="w-full bg-[#0a0d14]/95 backdrop-blur-xl border-b border-white/10 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 select-none">
      
      {/* 1. Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-amber-500/10 to-transparent border border-emerald-500/30 flex items-center justify-center p-1 shadow-md shrink-0">
          <img src="/phytotouch_logo.svg" alt="PhytoTouch Logo" className="w-8 h-8 object-contain drop-shadow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-black text-white tracking-wide">
              PHYTOTOUCH
            </h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              432 Hz SAPTAK
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden md:block">
            Nirman Lab 2026 • Living Plant Bio-Acoustic Synthesizer
          </p>
        </div>
      </div>

      {/* 2. Sound Bank Palette (Pills with Icons) */}
      <div className="hidden lg:flex items-center gap-1.5 bg-[#121622] p-1 rounded-2xl border border-white/10">
        {Object.entries(PRESETS).map(([key, item]) => {
          const isSelected = currentPreset === key;
          return (
            <button
              key={key}
              onClick={() => setPreset(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-white text-black shadow-md font-bold scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {PRESET_ICONS[key] || <Music className="w-3.5 h-3.5" />}
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Controls & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Tuning Frequency Pill */}
        <div className="flex items-center gap-2 bg-[#121622] px-3 py-1.5 rounded-xl border border-white/10 text-xs">
          <span className="text-slate-400 font-semibold hidden sm:inline">TUNING:</span>
          <span className="font-mono font-bold text-amber-400">{baseFrequency} Hz</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setBaseFrequency(432)}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                baseFrequency === 432 ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
              title="Sacred 432 Hz Saptak Tuning"
            >
              432
            </button>
            <button
              onClick={() => setBaseFrequency(440)}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                baseFrequency === 440 ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
              title="Standard 440 Hz Concert Pitch"
            >
              440
            </button>
          </div>
        </div>

        {/* Master Volume Slider */}
        <div className="hidden sm:flex items-center gap-2 bg-[#121622] px-3 py-1.5 rounded-xl border border-white/10">
          <button
            onClick={() => setVolume(isMuted ? -8 : -50)}
            className="text-slate-300 hover:text-white cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
          <input
            type="range"
            min="-30"
            max="0"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            title={`Master Volume: ${volume} dB`}
          />
        </div>

        {/* AutoPlay / Manual Mode Toggle */}
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
            isAutoPlay
              ? 'bg-emerald-500 text-black border-emerald-400 font-black shadow-[0_0_12px_rgba(16,185,129,0.45)]'
              : 'bg-[#121622] text-slate-300 border-white/10 hover:border-emerald-500/40 hover:text-white'
          }`}
          title={isAutoPlay ? 'Auto-play is ON (Press [A] or click to turn OFF automatic playing)' : 'Auto-play is OFF (Press [A] or click to turn ON ambient automatic playing)'}
        >
          {isAutoPlay ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
          )}
          <span className="font-mono text-[11px] font-bold">
            {isAutoPlay ? 'AUTO: ON' : 'AUTO: OFF'}
          </span>
        </button>

        {/* 1-Click Session Audio Recorder (WAV Download) */}
        {justDownloaded ? (
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm flex items-center gap-1.5 animate-bounce">
            <span>✓</span>
            <span className="font-mono">WAV SAVED!</span>
          </div>
        ) : isRecording ? (
          <button
            onClick={onToggleRecord}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white border border-rose-400/80 shadow-[0_0_18px_rgba(244,63,94,0.5)] animate-pulse flex items-center gap-2 cursor-pointer active:scale-95"
            title="Click to stop recording and download your high-fidelity WAV audio session"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
            <span className="font-mono tracking-tight">{formatRecordTime(recordingSeconds)}</span>
            <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline">STOP & SAVE</span>
          </button>
        ) : (
          <button
            onClick={onToggleRecord}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#121622] text-slate-200 border border-white/10 hover:border-rose-500/50 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 group"
            title="Start 1-click live WAV recording of your plant bio-acoustic session"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] group-hover:scale-125 transition-transform"></span>
            <span className="hidden sm:inline">REC WAV</span>
          </button>
        )}

        {/* Raga Melodies / Interactive Song Tutorial Trigger */}
        <button
          onClick={onToggleRaga}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
            isRagaOpen
              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
              : 'bg-[#121622] text-amber-300 border border-amber-500/30 hover:bg-amber-500/10'
          }`}
          title="Learn and play classical Ragas on the living plant"
        >
          <Music className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold">RAGA SONGS</span>
          <span className="hidden xl:inline text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
            TUTORIAL
          </span>
        </button>

        {/* Field Dossier / Pitch Deck Modal Trigger */}
        <button
          onClick={onOpenPitchDeck}
          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#121622] text-slate-200 border border-white/10 hover:border-white/25 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Open student engineering dossier & research paper"
        >
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">DOSSIER</span>
        </button>

        {/* Studio Visual Theme Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#121622] text-slate-200 border border-white/10 hover:border-cyan-400/50 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Change studio visual theme (Obsidian, Moonlight, Vedic, Lab)"
          >
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">THEME</span>
            <span className="text-[10px] text-slate-400">{STUDIO_THEMES[currentTheme]?.icon || '🌑'}</span>
          </button>

          {/* Theme Dropdown Popover */}
          {isThemeMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsThemeMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#0e131f]/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl p-2 z-50 flex flex-col gap-1 animate-fade-in">
                <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                  <span className="text-xs font-black text-white uppercase tracking-wider">STUDIO THEMES</span>
                  <span className="text-[10px] text-slate-400 font-mono">4 PALETTES</span>
                </div>
                {Object.entries(STUDIO_THEMES).map(([key, thm]) => {
                  const isSelected = currentTheme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        onSelectTheme(key);
                        setIsThemeMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white/10 text-white font-bold border border-white/20 shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{thm.icon}</span>
                        <div>
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            <span>{thm.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-slate-300 font-mono border border-white/10">
                              {thm.badge}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">{thm.subtitle}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={handleToggleFullscreen}
          className="p-2 rounded-xl bg-[#121622] text-slate-300 hover:text-white border border-white/10 cursor-pointer hidden md:flex items-center justify-center"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Slide-out Telemetry & Mixing Console Drawer Trigger */}
        <button
          onClick={onToggleDrawer}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
            isDrawerOpen
              ? 'bg-amber-500 text-black shadow-amber-500/30'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20 border border-emerald-400/30'
          }`}
          title="Open studio mixing faders and real-time telemetry drawer"
        >
          <Sliders className="w-4 h-4" />
          <span>MIXING & TELEMETRY</span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
        </button>

      </div>

    </header>
  );
};
