/* ==============================================================================
   RagaMelodyBar.jsx
   PhytoTouch: Interactive Raga Melody & Guided Tutorial HUD
   Engineered with world-class-clean-ui standards & high-contrast legibility
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  X, 
  Music2, 
  ChevronRight,
  Trophy,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RAGA_MELODIES } from '../audio/RagaRepertoire';
import { audioEngine } from '../audio/PlantAudioEngine';

export const RagaMelodyBar = ({
  isOpen,
  onClose,
  onLeafTouch,
  activeTargetLeaf,
  setActiveTargetLeaf
}) => {
  const [selectedMelodyId, setSelectedMelodyId] = useState('raga_yaman');
  const [mode, setMode] = useState('demo'); // 'demo' | 'practice'
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tempoBpm, setTempoBpm] = useState(84);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackHint, setFeedbackHint] = useState('');

  const currentMelody = RAGA_MELODIES.find((m) => m.id === selectedMelodyId) || RAGA_MELODIES[0];
  const timerRef = useRef(null);

  // Sync tempo when changing melody
  useEffect(() => {
    setTempoBpm(currentMelody.tempoBpm || 84);
    setCurrentIndex(0);
    setIsPlaying(false);
    setIsCompleted(false);
    setFeedbackHint('');
    if (mode === 'practice') {
      setActiveTargetLeaf(currentMelody.notes[0]?.leaf ?? null);
    } else {
      setActiveTargetLeaf(null);
    }
  }, [selectedMelodyId, currentMelody, mode, setActiveTargetLeaf]);

  // Handle Note Progression in Auto Demo Mode
  useEffect(() => {
    if (!isOpen || mode !== 'demo' || !isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    if (currentIndex >= currentMelody.notes.length) {
      setIsPlaying(false);
      setIsCompleted(true);
      setActiveTargetLeaf(null);
      try {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.25 } });
      } catch {}
      return;
    }

    const currentNote = currentMelody.notes[currentIndex];
    setActiveTargetLeaf(currentNote.leaf);
    
    // Trigger the leaf touch and sound
    onLeafTouch(currentNote.leaf, 0.75);

    const stepMs = (60000 / tempoBpm) * (currentNote.duration || 1.0);

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, stepMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, mode, isPlaying, currentIndex, currentMelody, tempoBpm, onLeafTouch, setActiveTargetLeaf]);

  // Handle User Input in Practice / Guide Mode
  const checkPracticeTouch = useCallback((leafIndex) => {
    if (!isOpen || mode !== 'practice' || isCompleted) return;

    const targetNote = currentMelody.notes[currentIndex];
    if (!targetNote) return;

    if (leafIndex === targetNote.leaf) {
      // Correct Leaf Touched!
      setFeedbackHint(`✓ Correct! Swara ${targetNote.swara} (${targetNote.hindi})`);
      const nextIdx = currentIndex + 1;

      if (nextIdx >= currentMelody.notes.length) {
        setIsCompleted(true);
        setActiveTargetLeaf(null);
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.25 } });
        } catch {}
      } else {
        setCurrentIndex(nextIdx);
        setActiveTargetLeaf(currentMelody.notes[nextIdx].leaf);
      }
    } else {
      // Wrong Leaf Touched - gentle guidance
      const keyNum = targetNote.leaf + 1;
      setFeedbackHint(`Target is Leaf [${keyNum}]: ${targetNote.swara} (${targetNote.hindi})`);
    }
  }, [isOpen, mode, isCompleted, currentMelody, currentIndex, setActiveTargetLeaf]);

  // Listen to leaf touches globally for practice mode
  useEffect(() => {
    if (!isOpen || mode !== 'practice') return;

    const handleWindowNote = (e) => {
      if (e.detail && typeof e.detail.leafIndex === 'number') {
        checkPracticeTouch(e.detail.leafIndex);
      }
    };

    window.addEventListener('phyto-leaf-touched', handleWindowNote);
    return () => window.removeEventListener('phyto-leaf-touched', handleWindowNote);
  }, [isOpen, mode, checkPracticeTouch]);

  // Reset current melody
  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentIndex(0);
    setIsCompleted(false);
    setIsPlaying(false);
    setFeedbackHint('');
    if (mode === 'practice') {
      setActiveTargetLeaf(currentMelody.notes[0]?.leaf ?? null);
    } else {
      setActiveTargetLeaf(null);
    }
  };

  // Toggle Play / Pause in Demo mode
  const handleTogglePlay = () => {
    audioEngine.unlock();
    if (isCompleted) {
      setCurrentIndex(0);
      setIsCompleted(false);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  if (!isOpen) return null;

  const currentTargetNote = currentMelody.notes[currentIndex] || currentMelody.notes[0];
  const progressPercent = Math.round((currentIndex / currentMelody.notes.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 my-1 select-none">
      <div className="p-2.5 sm:p-3 rounded-2xl bg-[#0e131f]/95 border border-amber-500/30 backdrop-blur-xl shadow-xl relative overflow-hidden">
        
        {/* Soft Background Accent Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-16 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
              <Music2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-white tracking-wider uppercase">
                  RAGA MELODY & TUTORIAL PLAYER
                </h3>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-300 text-[9px] font-bold border border-amber-500/30 uppercase">
                  Live Guidance
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {currentMelody.subtitle} • {currentMelody.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mode Selector Toggle */}
            <div className="flex items-center p-0.5 rounded-lg bg-black/50 border border-white/10 text-xs font-bold">
              <button
                onClick={() => {
                  setMode('demo');
                  handleReset();
                }}
                className={`py-0.5 px-2.5 rounded-md flex items-center gap-1 text-[11px] transition-all cursor-pointer ${
                  mode === 'demo'
                    ? 'bg-amber-500 text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>Auto Demo</span>
              </button>
              <button
                onClick={() => {
                  setMode('practice');
                  handleReset();
                  setActiveTargetLeaf(currentMelody.notes[0]?.leaf ?? null);
                }}
                className={`py-0.5 px-2.5 rounded-md flex items-center gap-1 text-[11px] transition-all cursor-pointer ${
                  mode === 'practice'
                    ? 'bg-emerald-500 text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Target className="w-3 h-3" />
                <span>Guide Me</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/5"
              title="Close Raga Player"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Melody Selector Pills */}
        <div className="flex items-center gap-1.5 py-1.5 overflow-x-auto no-scrollbar border-b border-white/5 text-xs">
          <span className="text-slate-400 font-bold shrink-0 text-[10px] pr-1">SELECT SONG:</span>
          {RAGA_MELODIES.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMelodyId(m.id)}
              className={`py-0.5 px-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                selectedMelodyId === m.id
                  ? 'bg-amber-400/20 text-amber-200 border border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                  : 'bg-black/30 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              <span>{m.title}</span>
            </button>
          ))}
        </div>

        {/* Main Interactive Controls & Progress HUD */}
        <div className="pt-2 flex flex-col gap-2">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Playback Action Buttons */}
            <div className="flex items-center gap-1.5">
              {mode === 'demo' ? (
                <button
                  onClick={handleTogglePlay}
                  className={`py-1.5 px-3 rounded-lg font-black text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer active:scale-95 ${
                    isPlaying
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : 'bg-emerald-500 text-black hover:bg-emerald-400'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>PAUSE DEMO</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCompleted ? 'REPLAY DEMO' : 'PLAY DEMO'}</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <Target className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>PRACTICE MODE ACTIVE: TOUCH HIGHLIGHTED LEAF</span>
                </div>
              )}

              <button
                onClick={handleReset}
                className="py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                title="Restart Song"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline text-[11px]">RESTART</span>
              </button>
            </div>

            {/* Current Target Swara Callout */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 py-0.5 px-2.5 rounded-xl bg-black/60 border border-white/10">
                <span className="text-[10px] text-slate-400 font-bold uppercase">TARGET LEAF:</span>
                <span className="text-xs font-black text-amber-300 font-mono">
                  [{currentTargetNote.leaf + 1}] {currentTargetNote.swara} ({currentTargetNote.hindi})
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  {currentTargetNote.note}
                </span>
              </div>

              {/* Progress Count */}
              <div className="text-[11px] font-mono text-slate-400">
                <strong className="text-white">{currentIndex}</strong> / {currentMelody.notes.length} ({progressPercent}%)
              </div>
            </div>
          </div>

          {/* Step-by-Step Note Progression Strip */}
          <div className="w-full flex items-center gap-1 overflow-x-auto py-1 px-1 bg-black/40 rounded-xl border border-white/5 no-scrollbar">
            {currentMelody.notes.map((step, idx) => {
              const isPast = idx < currentIndex;
              const isCurrent = idx === currentIndex && !isCompleted;

              return (
                <div
                  key={idx}
                  className={`shrink-0 flex flex-col items-center justify-center px-2 py-0.5 rounded-lg border text-center transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-black border-amber-300 font-black scale-105 shadow-[0_0_10px_#f59e0b]'
                      : isPast
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 opacity-70'
                      : 'bg-white/5 text-slate-400 border-white/5 opacity-40'
                  }`}
                >
                  <span className="text-[9px] font-mono opacity-80">#{idx + 1}</span>
                  <span className="text-xs font-black">{step.hindi}</span>
                  <span className="text-[9px] font-bold tracking-tight">{step.swara}</span>
                </div>
              );
            })}
          </div>

          {/* Feedback & Guidance Banner */}
          {feedbackHint && (
            <div className="w-full py-1.5 px-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{feedbackHint}</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">
                Press [1-7] on laptop or touch leaf
              </span>
            </div>
          )}

          {/* Victory Completion Banner */}
          {isCompleted && (
            <div className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between gap-3 shadow-xl animate-bounce">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-amber-300" />
                <div>
                  <h4 className="text-xs sm:text-sm font-black">
                    MELODY COMPLETED! 100% BIO-ACOUSTIC RESONANCE
                  </h4>
                  <p className="text-[11px] text-white/80">
                    You mastered {currentMelody.title} on the PhytoTouch synthesizer.
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="py-1 px-3.5 rounded-xl bg-white text-emerald-900 text-xs font-black shadow-md uppercase cursor-pointer"
              >
                PLAY AGAIN
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
