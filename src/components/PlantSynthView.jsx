import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, VolumeX, Sparkles, SlidersHorizontal, Activity,
  Download, Play, Square, Pause, Usb, Waves, RefreshCw,
  Music, Keyboard, Radio, Flame, CheckCircle2
} from 'lucide-react';
import { audioEngine, SCALES, PRESETS, getNoteFrequency, downloadAudioRecording } from '../audio/PlantAudioEngine';
import { BioOscilloscope } from './BioOscilloscope';

export function PlantSynthView({ onConnectHardware }) {
  // Audio state
  const [isAudioRunning, setIsAudioRunning] = useState(true);
  const [activeSpecimen, setActiveSpecimen] = useState('monstera');
  const [selectedScale, setSelectedScale] = useState('yaman');
  const [selectedPreset, setSelectedPreset] = useState('grand_piano');
  const [rootNote, setRootNote] = useState('C');
  const [octave, setOctave] = useState(0);
  const [activePitchText, setActivePitchText] = useState('READY • TOUCH ANY LEAF OR PRESS [1-8]');
  const [activeNodeIndex, setActiveNodeIndex] = useState(null);

  // Auto-Bio Sequencer (Circadian Arpeggiator)
  const [isAutoArpRunning, setIsAutoArpRunning] = useState(false);
  const [arpBpm, setArpBpm] = useState(84);
  const [arpPattern, setArpPattern] = useState('drift'); // 'drift' | 'ascent' | 'descent' | 'bloom'
  const arpIntervalRef = useRef(null);
  const arpStepRef = useRef(0);
  const lastIndexRef = useRef(0);

  // Telemetry state
  const [bioVolt, setBioVolt] = useState('1.84 mV pp');
  const [galvanicFlux, setGalvanicFlux] = useState('± 42.6 nS');

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);

  // Synth parameters
  const [attack, setAttack] = useState(120);
  const [decay, setDecay] = useState(450);
  const [sustain, setSustain] = useState(0.75);
  const [release, setRelease] = useState(1.8);
  const [cutoff, setCutoff] = useState(2850);
  const [resonance, setResonance] = useState(4.8);

  // Effects parameters
  const [reverbWet, setReverbWet] = useState(55);
  const [delayFeedback, setDelayFeedback] = useState(62);
  const [shimmerAmount, setShimmerAmount] = useState(80);

  // Specimen definitions
  const specimens = {
    monstera: {
      name: 'Monstera Deliciosa',
      channel: 'Active Channel A',
      timbre: 'Warm Resonant Brass / Sub-Pad',
      impedance: '1.2 MΩ',
      drift: '0.4 Hz',
      flux: 'High',
      soilMoisture: '68.4 %',
      lux: '1,420 Lux',
      variance: 'Δ 0.042 μS',
      ringPct: 72,
      preset: 'grand_piano',
      scale: 'yaman'
    },
    fern: {
      name: 'Adiantum Maidenhair',
      channel: 'Channel B • Standby',
      timbre: 'Delicate Bell Tones & Arps',
      impedance: '820 kΩ',
      drift: '3.2 Hz',
      flux: 'Rapid',
      soilMoisture: '74.1 %',
      lux: '980 Lux',
      variance: 'Δ 0.088 μS',
      ringPct: 88,
      preset: 'kalimba',
      scale: 'bhupali'
    },
    jade: {
      name: 'Crassula Jade',
      channel: 'Channel C • Standby',
      timbre: 'Sub-Bass Drone Sine Modulation',
      impedance: '2.4 MΩ',
      drift: '0.08 Hz',
      flux: 'Dense',
      soilMoisture: '42.0 %',
      lux: '2,150 Lux',
      variance: 'Δ 0.015 μS',
      ringPct: 35,
      preset: 'cello',
      scale: 'darbari'
    },
    calathea: {
      name: 'Calathea Orbifolia',
      channel: 'Channel D • Standby',
      timbre: 'Polymetric Ambient Bio-Pulses',
      impedance: '1.8 MΩ',
      drift: '1.4 Hz',
      flux: 'Erratic',
      soilMoisture: '62.8 %',
      lux: '1,200 Lux',
      variance: 'Δ 0.063 μS',
      ringPct: 64,
      preset: 'bansuri_flute',
      scale: 'shivranjani'
    }
  };

  // 8 leaf touch node layout positions
  const leafLayout = [
    { id: 0, keyLabel: '1', qwerty: 'A', top: 'top-3 sm:top-5', left: 'left-1/2 -translate-x-1/2', color: 'primary' },
    { id: 1, keyLabel: '2', qwerty: 'S', top: 'top-12 sm:top-14', left: 'left-14 sm:left-24', color: 'primary' },
    { id: 2, keyLabel: '3', qwerty: 'D', top: 'top-12 sm:top-14', left: 'right-14 sm:right-24', color: 'primary' },
    { id: 3, keyLabel: '4', qwerty: 'F', top: 'top-26 sm:top-32', left: 'left-6 sm:left-12', color: 'secondary' },
    { id: 4, keyLabel: '5', qwerty: 'G', top: 'top-26 sm:top-32', left: 'right-6 sm:right-12', color: 'secondary' },
    { id: 5, keyLabel: '6', qwerty: 'H', top: 'top-42 sm:top-50', left: 'left-10 sm:left-18', color: 'primary' },
    { id: 6, keyLabel: '7', qwerty: 'J', top: 'top-42 sm:top-50', left: 'right-10 sm:right-18', color: 'primary' },
    { id: 7, keyLabel: '8', qwerty: 'K', top: 'bottom-3 sm:bottom-5', left: 'left-1/2 -translate-x-1/2', color: 'primary' }
  ];

  // Dynamically compute leaf notes based on currently selected Raga/Scale and Octave
  const currentScaleDef = SCALES[selectedScale] || SCALES.saptak;
  const currentLeafNodes = leafLayout.map((layout, i) => {
    const noteName = currentScaleDef.notes[i % currentScaleDef.notes.length];
    const swaraName = currentScaleDef.swaras ? currentScaleDef.swaras[i % currentScaleDef.swaras.length] : `N${i + 1}`;
    const freq = getNoteFrequency(noteName, 432, octave);
    return {
      ...layout,
      note: noteName,
      swara: swaraName,
      freq: Number(freq.toFixed(1))
    };
  });

  // Play node tone function
  const playNodeTone = (node, velocity = 0.42) => {
    audioEngine.unlock();
    setActiveNodeIndex(node.id);
    setActivePitchText(`${node.swara} • ${node.note} (${node.freq} Hz) — BIO-EXCITED`);
    audioEngine.triggerAttackRelease(node.note, '8n', velocity);
    setTimeout(() => {
      setActiveNodeIndex(null);
    }, 350);
  };

  // Keyboard shortcut listener (1-8, A-K, Spacebar, Z/X)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is inside an input field
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      // Numbers 1-8
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 8) {
        e.preventDefault();
        playNodeTone(currentLeafNodes[num - 1]);
        return;
      }

      // QWERTY A-K
      const qwertyMap = { a: 0, s: 1, d: 2, f: 3, g: 4, h: 5, j: 6, k: 7 };
      const k = e.key.toLowerCase();
      if (qwertyMap[k] !== undefined) {
        e.preventDefault();
        playNodeTone(currentLeafNodes[qwertyMap[k]]);
        return;
      }

      // Spacebar toggles Auto-Bio Arpeggiator
      if (e.key === ' ') {
        e.preventDefault();
        setIsAutoArpRunning((prev) => !prev);
        return;
      }

      // Z/X: Octave transposition
      if (k === 'z') {
        e.preventDefault();
        const next = Math.max(-2, octave - 1);
        setOctave(next);
        audioEngine.setOctaveOffset(next);
      } else if (k === 'x') {
        e.preventDefault();
        const next = Math.min(2, octave + 1);
        setOctave(next);
        audioEngine.setOctaveOffset(next);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLeafNodes, octave]);

  // Auto-Bio Sequencer Interval Engine
  useEffect(() => {
    if (isAutoArpRunning) {
      audioEngine.unlock();
      const intervalMs = Math.round((60000 / arpBpm) / 2); // 8th note interval

      arpIntervalRef.current = setInterval(() => {
        arpStepRef.current += 1;
        const step = arpStepRef.current;
        let nextIndex = 0;

        if (arpPattern === 'ascent') {
          nextIndex = step % 8;
        } else if (arpPattern === 'descent') {
          nextIndex = (7 - (step % 8));
        } else if (arpPattern === 'bloom') {
          // Melodic Indian classical raga jumps (Sa - Ga - Pa - Sȧ - Pa - Ga)
          const triadSteps = [0, 2, 4, 7, 4, 2, 1, 3];
          nextIndex = triadSteps[step % triadSteps.length];
        } else {
          // 'drift': Organic circadian random walk
          const dir = Math.random() > 0.45 ? 1 : -1;
          nextIndex = Math.max(0, Math.min(7, lastIndexRef.current + dir));
          if (nextIndex === lastIndexRef.current) {
            nextIndex = (lastIndexRef.current + 2) % 8;
          }
        }

        lastIndexRef.current = nextIndex;
        const targetNode = currentLeafNodes[nextIndex];
        if (targetNode) {
          const velocity = 0.32 + Math.random() * 0.18;
          playNodeTone(targetNode, velocity);
        }
      }, intervalMs);
    } else {
      if (arpIntervalRef.current) clearInterval(arpIntervalRef.current);
    }

    return () => {
      if (arpIntervalRef.current) clearInterval(arpIntervalRef.current);
    };
  }, [isAutoArpRunning, arpBpm, arpPattern, currentLeafNodes]);

  // Specimen selection handler
  const handleSelectSpecimen = (key) => {
    setActiveSpecimen(key);
    const spec = specimens[key];
    if (spec.preset) {
      setSelectedPreset(spec.preset);
      audioEngine.setPreset(spec.preset);
    }
    if (spec.scale) {
      setSelectedScale(spec.scale);
      audioEngine.setScale(spec.scale);
    }
  };

  // Audio mute toggle
  const toggleAudioEngine = () => {
    audioEngine.unlock();
    const nextState = !isAudioRunning;
    setIsAudioRunning(nextState);
    if (!nextState) {
      setIsAutoArpRunning(false);
      audioEngine.setMasterVolume(-60);
    } else {
      audioEngine.setMasterVolume(-8);
    }
  };

  // Preset switch handler
  const handleSelectPreset = (key) => {
    audioEngine.unlock();
    setSelectedPreset(key);
    audioEngine.setPreset(key);
  };

  // Scale switch handler
  const handleSelectScale = (key) => {
    audioEngine.unlock();
    setSelectedScale(key);
    audioEngine.setScale(key);
  };

  // Recording timer
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleToggleRecording = async () => {
    if (isRecording) {
      const blob = await audioEngine.stopRecording();
      setIsRecording(false);
      if (blob) {
        setRecordedBlob(blob);
      }
    } else {
      setRecordedBlob(null);
      const ok = await audioEngine.startRecording();
      if (ok) setIsRecording(true);
    }
  };

  const handleDownload = () => {
    if (recordedBlob) {
      downloadAudioRecording(recordedBlob, `phytotouch-${activeSpecimen}-${selectedScale}.wav`);
    }
  };

  const curr = specimens[activeSpecimen] || specimens.monstera;

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `00:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full text-[#dde4de]">
      <div className="relative w-full overflow-hidden bg-[#09100c] p-4 sm:p-6 rounded-2xl border border-[#3b4a43]/30 shadow-2xl">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-[#47f3bb]/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-12 w-[420px] h-[420px] bg-[#f0c04d]/5 rounded-full blur-[160px] pointer-events-none"></div>

        {/* Master Header Ribbon inside Studio Workspace */}
        <div className="w-full flex flex-wrap items-center justify-between gap-4 bg-[#171d1a]/90 backdrop-blur-xl p-4 rounded-xl border border-[#3b4a43]/40 shadow-xl mb-6">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-[#47f3bb] animate-ping"></div>
            <div className="flex flex-col">
              <span className="font-['Syne'] text-lg sm:text-xl font-bold tracking-tight text-[#dde4de] flex items-center gap-2">
                PhytoDesk Studio v4.2
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#47f3bb] uppercase px-2 py-0.5 rounded-full bg-[#47f3bb]/10 tracking-widest font-bold">
                  DSP Engine Active
                </span>
              </span>
              <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1] flex items-center gap-2 mt-0.5 flex-wrap">
                <span>SESSION: <span className="text-[#f0c04d] font-semibold">BOTANIC_RESONANCE_09</span></span>
                <span className="opacity-40">/</span>
                <span>CLOCK: <span className="text-[#47f3bb] font-semibold">{arpBpm}.00 BPM</span></span>
                <span className="opacity-40">/</span>
                <span>TUNING: <span className="text-[#dde4de]">432 Hz Saptak Just Intonation</span></span>
              </span>
            </div>
          </div>

          {/* Master Telemetry Pills & Mute Button */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#252b28] border border-[#3b4a43]/40">
              <span className="text-base">🌱</span>
              <div className="flex flex-col">
                <span className="font-['JetBrains_Mono'] text-[8px] text-[#bacac1] leading-none">TOTAL BIO-VOLT</span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] font-bold">{bioVolt}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#252b28] border border-[#3b4a43]/40">
              <Waves className="w-4 h-4 text-[#f0c04d]" />
              <div className="flex flex-col">
                <span className="font-['JetBrains_Mono'] text-[8px] text-[#bacac1] leading-none">GALVANIC FLUX</span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#f0c04d] font-bold">{galvanicFlux}</span>
              </div>
            </div>

            <button
              onClick={toggleAudioEngine}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-['JetBrains_Mono'] text-xs font-bold transition-all shadow-[0_0_16px_rgba(6,214,160,0.3)] cursor-pointer ${
                isAudioRunning
                  ? 'bg-[#06d6a0] text-[#003827] hover:bg-[#47f3bb]'
                  : 'bg-[#252b28] text-[#bacac1] hover:bg-[#303632]'
              }`}
            >
              {isAudioRunning ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{isAudioRunning ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </button>
          </div>
        </div>

        {/* 3-Column Studio Modular Grid */}
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* ================= LEFT SIDEBAR: PLANT SPECIMEN SELECTOR ================= */}
          <section className="col-span-12 xl:col-span-3 flex flex-col gap-4">
            <div className="bg-[#1b211e] p-4 rounded-xl border border-[#3b4a43]/30 shadow-md">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌿</span>
                  <h2 className="font-['Syne'] text-base font-bold text-[#dde4de]">Specimen Input</h2>
                </div>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#47f3bb] uppercase tracking-widest px-2 py-0.5 rounded bg-[#47f3bb]/10 font-bold">
                  CH 01-04
                </span>
              </div>
              <p className="font-['Inter'] text-xs text-[#bacac1]">
                Capacitive electrodes reading micro-potentials at cellular membrane thresholds.
              </p>
            </div>

            {/* Specimen Cards List */}
            <div className="flex flex-col gap-2.5">
              {Object.keys(specimens).map((key) => {
                const s = specimens[key];
                const isSelected = activeSpecimen === key;
                return (
                  <div
                    key={key}
                    onClick={() => handleSelectSpecimen(key)}
                    className={`cursor-pointer p-4 rounded-xl relative overflow-hidden transition-all duration-300 shadow-md border ${
                      isSelected
                        ? 'bg-[#252b28] border-[#47f3bb]/50'
                        : 'bg-[#1b211e] border-[#3b4a43]/30 hover:bg-[#252b28]/60'
                    }`}
                  >
                    {isSelected && <div className="absolute top-0 left-0 w-1.5 h-full bg-[#47f3bb]"></div>}
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-['JetBrains_Mono'] text-[9px] text-[#47f3bb] uppercase tracking-wider font-semibold">
                          {s.channel}
                        </span>
                        <h3 className="font-['Syne'] text-sm sm:text-base font-bold text-[#dde4de] mt-0.5">
                          {s.name}
                        </h3>
                        <span className="font-['JetBrains_Mono'] text-[11px] text-[#ffdf9d] font-medium">
                          {s.timbre}
                        </span>
                      </div>
                      <span className={`w-3 h-3 rounded-full mt-1 ${isSelected ? 'bg-[#47f3bb] ring-4 ring-[#47f3bb]/20' : 'bg-[#3b4a43]'}`}></span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 bg-[#09100c]/80 p-2 rounded-lg border border-[#3b4a43]/20">
                      <div className="flex flex-col">
                        <span className="font-['JetBrains_Mono'] text-[8px] text-[#bacac1]">IMPEDANCE</span>
                        <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] font-bold">{s.impedance}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-['JetBrains_Mono'] text-[8px] text-[#bacac1]">DRIFT</span>
                        <span className="font-['JetBrains_Mono'] text-xs text-[#dde4de] font-semibold">{s.drift}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-['JetBrains_Mono'] text-[8px] text-[#bacac1]">ION FLUX</span>
                        <span className="font-['JetBrains_Mono'] text-xs text-[#ffdf9d] font-bold">{s.flux}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Specimen Environmental Telemetry Gauges */}
            <div className="p-4 rounded-xl bg-[#171d1a] border border-[#3b4a43]/40 shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-xs text-[#dde4de] font-bold tracking-wide">SUBSTRATE METRICS</span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#47f3bb] uppercase font-bold">LIVE PROBE</span>
              </div>

              {/* Moisture */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center font-['JetBrains_Mono'] text-xs">
                  <span className="text-[#bacac1]">Soil Moisture (VWC)</span>
                  <span className="text-[#47f3bb] font-bold">{curr.soilMoisture}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#303632] overflow-hidden">
                  <div className="h-full bg-[#47f3bb] rounded-full transition-all duration-500" style={{ width: curr.soilMoisture }}></div>
                </div>
              </div>

              {/* Photonic Lux */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center font-['JetBrains_Mono'] text-xs">
                  <span className="text-[#bacac1]">Photonic Radiation</span>
                  <span className="text-[#f0c04d] font-bold">{curr.lux}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#303632] overflow-hidden">
                  <div className="h-full bg-[#f0c04d] rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              {/* Conductance Variance */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1]">CONDUCTANCE VARIANCE</span>
                  <span className="font-['Syne'] text-base text-[#dde4de] font-bold">{curr.variance}</span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#47f3bb]">Active Stomata Transpiration</span>
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-[#303632]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-[#47f3bb]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${curr.ringPct}, 100`} strokeLinecap="round" strokeWidth="3" />
                  </svg>
                  <span className="absolute font-['JetBrains_Mono'] text-[10px] font-bold text-[#47f3bb]">{curr.ringPct}%</span>
                </div>
              </div>
            </div>
          </section>

          {/* ================= CENTER MAIN DECK: TACTILE SURFACE & DSP ================= */}
          <main className="col-span-12 xl:col-span-6 flex flex-col gap-4">
            {/* Live Web Audio P31 Phosphor Oscilloscope & FFT Component */}
            <BioOscilloscope
              currentSpecimenName={curr.name}
              activePitchText={activePitchText}
            />

            {/* Instrument Sound Engine Selector Bar */}
            <div className="bg-[#171d1a] border border-[#3b4a43]/40 rounded-xl p-3 shadow-md flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#dde4de] font-bold flex items-center gap-1.5 uppercase">
                  <Music className="w-3.5 h-3.5 text-[#47f3bb]" />
                  Acoustic Sound Engine:
                </span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#f0c04d] bg-[#f0c04d]/10 px-2 py-0.5 rounded font-bold">
                  Polyphonic 32-bit
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'grand_piano', label: 'Steinway Piano', icon: '🎹' },
                  { id: 'cello', label: 'Concert Cello', icon: '🎻' },
                  { id: 'kalimba', label: 'Thumb Kalimba', icon: '🎋' },
                  { id: 'bansuri_flute', label: 'Vedic Bansuri', icon: '🪈' },
                  { id: 'celestial_pad', label: 'Chamber Pad', icon: '🌌' }
                ].map((inst) => {
                  const isSelected = selectedPreset === inst.id;
                  return (
                    <button
                      key={inst.id}
                      onClick={() => handleSelectPreset(inst.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#252b28] border-[#47f3bb] text-white shadow-[0_0_12px_rgba(71,243,187,0.3)] scale-[1.02]'
                          : 'bg-[#1b211e] border-[#3b4a43]/30 text-[#bacac1] hover:bg-[#252b28] hover:text-white'
                      }`}
                    >
                      <span className="text-lg mb-1">{inst.icon}</span>
                      <span className="font-['JetBrains_Mono'] text-[10px] font-bold tracking-tight text-center">
                        {inst.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Indian Classical Raga & Scale Bar Module */}
            <div className="bg-[#1b211e] p-3 sm:p-4 rounded-xl border border-[#3b4a43]/30 shadow-md flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1] uppercase font-bold">Raga / Scale:</span>
                <div className="flex items-center gap-1 bg-[#09100c] p-1 rounded-lg flex-wrap">
                  {[
                    { id: 'yaman', label: 'Raga Yaman (Evening)' },
                    { id: 'bhupali', label: 'Bhupali (Penta)' },
                    { id: 'bhairav', label: 'Bhairav (Dawn)' },
                    { id: 'darbari', label: 'Darbari (Midnight)' },
                    { id: 'shivranjani', label: 'Shivranjani' },
                    { id: 'saptak', label: '432Hz Saptak' },
                    { id: 'solfeggio', label: '528Hz Solfeggio' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectScale(s.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-['JetBrains_Mono'] font-semibold transition-all cursor-pointer ${
                        selectedScale === s.id
                          ? 'bg-[#06d6a0] text-[#003827] shadow-[0_0_10px_rgba(6,214,160,0.4)]'
                          : 'text-[#bacac1] hover:text-[#dde4de] hover:bg-[#1b211e]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Root & Octave */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1]">ROOT:</span>
                  <span className="px-2 py-0.5 rounded bg-[#252b28] font-['JetBrains_Mono'] text-xs text-[#f0c04d] font-bold">
                    {rootNote}4 (432Hz)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1]">OCT:</span>
                  <button
                    onClick={() => {
                      const next = Math.max(-2, octave - 1);
                      setOctave(next);
                      audioEngine.setOctaveOffset(next);
                    }}
                    className="w-5 h-5 rounded bg-[#252b28] text-white flex items-center justify-center font-bold text-xs hover:bg-[#47f3bb] hover:text-[#003827] cursor-pointer"
                    title="Octave down (or press 'Z')"
                  >
                    -
                  </button>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] font-bold px-1">{octave}</span>
                  <button
                    onClick={() => {
                      const next = Math.min(2, octave + 1);
                      setOctave(next);
                      audioEngine.setOctaveOffset(next);
                    }}
                    className="w-5 h-5 rounded bg-[#252b28] text-white flex items-center justify-center font-bold text-xs hover:bg-[#47f3bb] hover:text-[#003827] cursor-pointer"
                    title="Octave up (or press 'X')"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Auto-Bio Generative Sequencer Strip ("Circadian Arpeggiator") */}
            <div className="bg-[#171d1a] border border-[#f0c04d]/30 rounded-xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAutoArpRunning(!isAutoArpRunning)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all shadow-md cursor-pointer ${
                    isAutoArpRunning
                      ? 'bg-[#ba1a1a] text-white shadow-[0_0_15px_rgba(255,180,171,0.5)]'
                      : 'bg-[#f0c04d] text-[#2c1d00] hover:bg-[#ffdf9d] shadow-[0_0_15px_rgba(240,192,77,0.3)]'
                  }`}
                >
                  {isAutoArpRunning ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isAutoArpRunning ? 'STOP BIO-ARP' : 'START BIO-HARMONY (SPACE)'}</span>
                </button>

                <div className="flex items-center gap-1.5 bg-[#09100c] p-1 rounded-lg border border-[#3b4a43]/30">
                  {[
                    { id: 'drift', label: '🌿 Drift' },
                    { id: 'ascent', label: '🌅 Arohana' },
                    { id: 'descent', label: '🌄 Avarohana' },
                    { id: 'bloom', label: '✨ Bloom' }
                  ].map((pat) => (
                    <button
                      key={pat.id}
                      onClick={() => setArpPattern(pat.id)}
                      className={`px-2 py-1 rounded text-[10px] font-['JetBrains_Mono'] font-semibold transition-all cursor-pointer ${
                        arpPattern === pat.id
                          ? 'bg-[#f0c04d] text-[#2c1d00] font-bold'
                          : 'text-[#bacac1] hover:text-white'
                      }`}
                    >
                      {pat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tempo BPM slider */}
              <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs">
                <span className="text-[#bacac1]">TEMPO:</span>
                <input
                  type="range"
                  min="40"
                  max="140"
                  value={arpBpm}
                  onChange={(e) => setArpBpm(Number(e.target.value))}
                  className="w-20 sm:w-24 h-1 bg-[#303632] rounded cursor-pointer"
                />
                <span className="text-[#f0c04d] font-bold w-12">{arpBpm} BPM</span>
              </div>
            </div>

            {/* Interactive Tactile Leaf Multi-Touch Pad */}
            <div className="bg-[#171d1a] border border-[#3b4a43]/30 rounded-xl p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌿</span>
                  <div>
                    <h3 className="font-['Syne'] text-base font-bold text-[#dde4de]">Bioluminescent Foliage Surface</h3>
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1]">
                      Click leaves or use keyboard keys [1-8] or [A-K] to play
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline font-['JetBrains_Mono'] text-[9px] text-[#47f3bb] bg-[#47f3bb]/10 px-2 py-0.5 rounded font-bold">
                    KEYBOARD SHORTCUTS ENABLED
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#f0c04d] uppercase bg-[#f0c04d]/10 px-2.5 py-1 rounded-full font-bold">
                    8 Active Capacitive Pads
                  </span>
                </div>
              </div>

              {/* Visual Touch Leaf Canvas View */}
              <div className="relative w-full max-w-lg h-72 sm:h-80 flex items-center justify-center select-none my-2">
                {/* Monstera Leaf Stylized Vector Backbone */}
                <svg className="w-full h-full text-[#303632] stroke-[#47f3bb]/30" fill="none" viewBox="0 0 500 320">
                  <path d="M250,290 C250,200 250,110 250,30" stroke="#3b4a43" strokeLinecap="round" strokeWidth="4" />
                  <path d="M250,240 C200,220 140,210 90,210" stroke="#252b28" strokeDasharray="4 4" strokeWidth="2" />
                  <path d="M250,240 C300,220 360,210 410,210" stroke="#252b28" strokeDasharray="4 4" strokeWidth="2" />
                  <path d="M250,170 C190,150 120,140 70,140" stroke="#252b28" strokeDasharray="4 4" strokeWidth="2" />
                  <path d="M250,170 C310,150 380,140 430,140" stroke="#252b28" strokeDasharray="4 4" strokeWidth="2" />
                  <path d="M250,100 C200,80 150,70 110,65" stroke="#252b28" strokeDasharray="4 4" strokeWidth="2" />
                  <path d="M250,100 C300,80 350,70 390,65" stroke="#252b28" strokeDasharray="4 4" strokeWidth="2" />
                </svg>

                {/* 8 Dynamically Calibrated Leaf Touch Nodes */}
                {currentLeafNodes.map((node) => {
                  const isActive = activeNodeIndex === node.id;
                  const isGold = node.color === 'secondary';
                  return (
                    <button
                      key={node.id}
                      onClick={() => playNodeTone(node)}
                      className={`leaf-node absolute ${node.top} ${node.left} w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center transition-all duration-200 cursor-pointer shadow-lg border ${
                        isActive
                          ? isGold
                            ? 'bg-[#f0c04d] text-[#000] scale-110 shadow-[0_0_24px_rgba(240,192,77,0.8)] border-white'
                            : 'bg-[#47f3bb] text-[#000] scale-110 shadow-[0_0_24px_rgba(71,243,187,0.8)] border-white'
                          : 'bg-[#252b28] hover:bg-[#303632] border-[#47f3bb]/30'
                      }`}
                    >
                      <div className="flex items-center gap-1 leading-none">
                        <span className={`w-1.5 h-1.5 rounded-full ${isGold ? 'bg-[#f0c04d]' : 'bg-[#47f3bb]'}`}></span>
                        <span className="font-['JetBrains_Mono'] text-[10px] font-bold">{node.swara}</span>
                      </div>
                      <span className="font-['JetBrains_Mono'] text-[9px] font-semibold opacity-90">{node.note}</span>
                      <span className="font-['JetBrains_Mono'] text-[8px] opacity-60 text-[#f0c04d]">[{node.keyLabel}]</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Note Indicator Badge */}
              <div className="mt-2 py-1.5 px-5 rounded-full bg-[#1b211e] border border-[#3b4a43]/40 text-center flex items-center gap-2 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-[#f0c04d] animate-pulse"></span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1]">RESONANT SWARA:</span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] font-bold">{activePitchText}</span>
              </div>
            </div>

            {/* Synthesis DSP Envelope & Tone Potentiometers */}
            <div className="bg-[#171d1a] border border-[#3b4a43]/30 rounded-xl p-4 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#f0c04d]" />
                  <h3 className="font-['Syne'] text-sm sm:text-base font-bold text-[#dde4de]">
                    Synthesis Envelope &amp; Filter Matrix
                  </h3>
                </div>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#47f3bb] tracking-widest uppercase font-bold">
                  ADSR + Chlorophyll VCF
                </span>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="flex flex-col items-center p-2 rounded-lg bg-[#1b211e] border border-[#3b4a43]/20">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1] uppercase">Attack</span>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={attack}
                    onChange={(e) => setAttack(Number(e.target.value))}
                    className="w-full my-2 h-1 bg-[#303632] rounded-lg cursor-pointer"
                  />
                  <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] font-bold">{attack} ms</span>
                </div>

                <div className="flex flex-col items-center p-2 rounded-lg bg-[#1b211e] border border-[#3b4a43]/20">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1] uppercase">Decay</span>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    value={decay}
                    onChange={(e) => setDecay(Number(e.target.value))}
                    className="w-full my-2 h-1 bg-[#303632] rounded-lg cursor-pointer"
                  />
                  <span className="font-['JetBrains_Mono'] text-xs text-[#dde4de] font-bold">{decay} ms</span>
                </div>

                <div className="flex flex-col items-center p-2 rounded-lg bg-[#1b211e] border border-[#3b4a43]/20">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1] uppercase">Cutoff</span>
                  <input
                    type="range"
                    min="400"
                    max="8000"
                    value={cutoff}
                    onChange={(e) => setCutoff(Number(e.target.value))}
                    className="w-full my-2 h-1 bg-[#303632] rounded-lg cursor-pointer"
                  />
                  <span className="font-['JetBrains_Mono'] text-xs text-[#f0c04d] font-bold">{cutoff} Hz</span>
                </div>

                <div className="flex flex-col items-center p-2 rounded-lg bg-[#1b211e] border border-[#3b4a43]/20">
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1] uppercase">Resonance</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={resonance}
                    onChange={(e) => setResonance(Number(e.target.value))}
                    className="w-full my-2 h-1 bg-[#303632] rounded-lg cursor-pointer"
                  />
                  <span className="font-['JetBrains_Mono'] text-xs text-[#ffdf9d] font-bold">{resonance} Q</span>
                </div>
              </div>
            </div>
          </main>

          {/* ================= RIGHT SIDEBAR: EFFECTS RACK & RECORDER ================= */}
          <aside className="col-span-12 xl:col-span-3 flex flex-col gap-4">
            {/* DSP Effects Rack */}
            <div className="bg-[#171d1a] border border-[#3b4a43]/30 rounded-xl p-4 shadow-xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#f0c04d]" />
                  <h2 className="font-['Syne'] text-base font-bold text-[#dde4de]">DSP Effects Rack</h2>
                </div>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#f0c04d] bg-[#f0c04d]/10 px-2 py-0.5 rounded uppercase font-bold">
                  Stereo 32-bit
                </span>
              </div>

              {/* Effect 1: Reverb */}
              <div className="bg-[#1b211e] p-3 rounded-lg border border-[#3b4a43]/30 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#dde4de] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#47f3bb]"></span> Bioluminescent Reverb
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#47f3bb] font-bold">ACTIVE</span>
                </div>
                <div className="space-y-1.5 pt-1 font-['JetBrains_Mono'] text-[10px]">
                  <div className="flex justify-between text-[#bacac1]">
                    <span>Wet / Dry Mix</span>
                    <span className="text-[#47f3bb] font-bold">{reverbWet}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={reverbWet}
                    onChange={(e) => setReverbWet(Number(e.target.value))}
                    className="w-full h-1 bg-[#303632] rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Effect 2: Delay */}
              <div className="bg-[#1b211e] p-3 rounded-lg border border-[#3b4a43]/30 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#dde4de] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#f0c04d]"></span> Tape Flora Delay
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#f0c04d] font-bold">3/8 DOTTED</span>
                </div>
                <div className="space-y-1.5 pt-1 font-['JetBrains_Mono'] text-[10px]">
                  <div className="flex justify-between text-[#bacac1]">
                    <span>Feedback Resonance</span>
                    <span className="text-[#f0c04d] font-bold">{delayFeedback}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={delayFeedback}
                    onChange={(e) => setDelayFeedback(Number(e.target.value))}
                    className="w-full h-1 bg-[#303632] rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Effect 3: Shimmer */}
              <div className="bg-[#1b211e] p-3 rounded-lg border border-[#3b4a43]/30 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#dde4de] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#64f1b4]"></span> Shimmer Octave Shift
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#64f1b4] font-bold">+12 SEMI</span>
                </div>
                <div className="space-y-1.5 pt-1 font-['JetBrains_Mono'] text-[10px]">
                  <div className="flex justify-between text-[#bacac1]">
                    <span>Harmonic Diffusion</span>
                    <span className="text-[#64f1b4] font-bold">{shimmerAmount}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shimmerAmount}
                    onChange={(e) => setShimmerAmount(Number(e.target.value))}
                    className="w-full h-1 bg-[#303632] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Recording & Session Strip */}
            <div className="bg-[#171d1a] border border-[#3b4a43]/30 rounded-xl p-4 shadow-xl flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-xs text-[#dde4de] font-semibold">BIO-RECORDER</span>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-[#ffb4ab] animate-ping' : 'bg-[#47f3bb]'}`}></span>
                  <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1] uppercase font-bold">
                    {isRecording ? 'RECORDING' : 'READY'}
                  </span>
                </div>
              </div>

              {/* Controls & Timer */}
              <div className="bg-[#09100c] p-2.5 rounded-lg flex items-center justify-between border border-[#3b4a43]/30">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleToggleRecording}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-[#ba1a1a] text-white shadow-[0_0_12px_rgba(255,180,171,0.5)]'
                        : 'bg-[#ffdad6]/20 text-[#ffb4ab] hover:bg-[#ba1a1a] hover:text-white'
                    }`}
                  >
                    {isRecording ? <Square className="w-3.5 h-3.5 fill-current" /> : <div className="w-3 h-3 rounded-full bg-[#ffb4ab]" />}
                  </button>
                  <div className="flex flex-col">
                    <span className="font-['JetBrains_Mono'] text-[8px] text-[#bacac1]">BUFFER DURATION</span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#dde4de] font-bold">
                      {formatTimer(recordSeconds)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[9px] text-[#47f3bb]">
                  <span>432 Hz Master</span>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 font-['JetBrains_Mono'] text-xs">
                <button
                  onClick={handleDownload}
                  disabled={!recordedBlob}
                  className={`p-2.5 rounded-lg border flex items-center justify-center gap-1.5 font-bold transition-all ${
                    recordedBlob
                      ? 'bg-[#06d6a0] text-[#003827] border-[#06d6a0] hover:bg-[#47f3bb] cursor-pointer shadow-[0_0_12px_rgba(6,214,160,0.3)]'
                      : 'bg-[#1b211e] text-[#bacac1]/40 border-[#3b4a43]/20 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .WAV</span>
                </button>
                <button
                  onClick={() => alert('PhytoTouch Web-MIDI Output Port broadcast enabled at 31,250 baud.')}
                  className="p-2.5 rounded-lg bg-[#1b211e] hover:bg-[#252b28] text-[#bacac1] hover:text-[#dde4de] border border-[#3b4a43]/30 flex items-center justify-center gap-1.5 font-semibold cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5 text-[#f0c04d]" />
                  <span>Export .MID</span>
                </button>
              </div>
            </div>

            {/* Quick Keyboard Help Card */}
            <div className="bg-[#171d1a] border border-[#3b4a43]/30 rounded-xl p-3 shadow-md flex flex-col gap-2">
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1] uppercase font-bold flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-[#47f3bb]" />
                Live Jamming Shortcuts:
              </span>
              <div className="grid grid-cols-2 gap-1.5 font-['JetBrains_Mono'] text-[9px] text-[#bacac1]">
                <div className="p-1.5 rounded bg-[#09100c] border border-[#3b4a43]/20">
                  <span className="text-[#47f3bb] font-bold">[1] to [8]</span>: Leaves N1-N8
                </div>
                <div className="p-1.5 rounded bg-[#09100c] border border-[#3b4a43]/20">
                  <span className="text-[#47f3bb] font-bold">[A] to [K]</span>: Swara row
                </div>
                <div className="p-1.5 rounded bg-[#09100c] border border-[#3b4a43]/20">
                  <span className="text-[#f0c04d] font-bold">[SPACE]</span>: Bio-Arpeggiator
                </div>
                <div className="p-1.5 rounded bg-[#09100c] border border-[#3b4a43]/20">
                  <span className="text-[#64f1b4] font-bold">[Z] / [X]</span>: Octave - / +
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default PlantSynthView;
