/* ==============================================================================
   PhytoApp.jsx
   PhytoTouch: Living Plant Bio-Acoustic Synthesizer & Telemetry Workstation
   Engineered with world-class-clean-ui standards & high-contrast legibility
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine, PRESETS, SCALES, downloadAudioRecording } from '../audio/PlantAudioEngine';
import { serialService } from '../services/SerialService';
import { StudioHeader } from './StudioHeader';
import { FullscreenSynthStage } from './FullscreenSynthStage';
import { TelemetryDrawer } from './TelemetryDrawer';
import { PitchDeckModal } from './PitchDeckModal';
import { RagaMelodyBar } from './RagaMelodyBar';
import { Volume2 } from 'lucide-react';

export function PhytoApp() {
  // Operational mode: 'simulation' | 'hardware'
  const [mode, setMode] = useState('simulation');
  const [currentPreset, setPreset] = useState('grand_piano'); // Default to Steinway Concert Grand Piano
  const [currentScale, setScale] = useState('saptak');        // Default to Saptak 7 notes (432 Hz)
  const [baseFrequency, setBaseFrequency] = useState(432);    // Master tuning 432 Hz
  const [octaveOffset, setOctaveOffset] = useState(0);       // Octave transposition (-2 to +2)
  const [isAutoPlay, setIsAutoPlay] = useState(false);       // Default to manual mode (quiet on load)
  const [volume, setVolume] = useState(-8);                  // Studio calibrated clean gain (-8 dB)

  // Drawer, Modal & Raga Tutorial States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerDefaultTab, setDrawerDefaultTab] = useState('mixing');
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [isRagaOpen, setIsRagaOpen] = useState(false);
  const [activeTargetLeaf, setActiveTargetLeaf] = useState(null);

  // Studio Visual Theme State ('obsidian' | 'moonlight' | 'vedic' | 'lab')
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('phyto-studio-theme') || 'obsidian';
    }
    return 'obsidian';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('phyto-studio-theme', currentTheme);
    }
  }, [currentTheme]);

  // Microtonal Shruti Tuning State (7 channels)
  const [tuningSystem, setTuningSystem] = useState('shuddha_just');
  const [leafCentsOffsets, setLeafCentsOffsets] = useState([0, 0, 0, 0, 0, 0, 0]);

  // Session Audio Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [justDownloaded, setJustDownloaded] = useState(false);

  // Mobile Audio Unlock State
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(() => audioEngine.isAudioRunning());

  // Hardware serial state
  const [isSerialConnected, setIsSerialConnected] = useState(false);
  const [serialStatus, setSerialStatus] = useState('');
  const [lastSerialPacket, setLastSerialPacket] = useState('');
  const [rawChannelValues, setRawChannelValues] = useState([74, 72, 71, 73, 72, 70, 71]);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Interactive leaf states (7 channels: 0 to 6)
  const [activeLeaves, setActiveLeaves] = useState([false, false, false, false, false, false, false]);
  const [lastTriggeredNote, setLastTriggeredNote] = useState(null);

  // Telemetry bio-metrics
  const [telemetryData, setTelemetryData] = useState({
    capacitancePf: 48.6,
    impedanceKOhm: 142.4,
    cortisolReduction: 23.5,
    brainwaveHz: 9.2,
    sapFlowRate: '0.34 mL/hr'
  });

  // Mode ref for callbacks
  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Global Audio Unlock Listener (First touch anywhere awakens audio)
  useEffect(() => {
    const handleFirstTouchUnlock = () => {
      audioEngine.unlock().then((running) => {
        if (running) {
          setIsAudioUnlocked(true);
        }
      });
    };

    audioEngine.onStateChange = (running) => {
      setIsAudioUnlocked(running);
    };

    const events = ['touchstart', 'pointerdown', 'click'];
    events.forEach((evt) => {
      window.addEventListener(evt, handleFirstTouchUnlock, { passive: true });
    });

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, handleFirstTouchUnlock);
      });
    };
  }, []);

  // Trigger leaf sound and visual feedback
  const handleLeafTouch = useCallback((leafIndex, intensity = 0.70) => {
    // 1. Trigger audio note in Tone.js
    const triggerInfo = audioEngine.triggerLeaf(leafIndex, intensity);
    if (triggerInfo) {
      setLastTriggeredNote(triggerInfo);
    }

    // Broadcast touch event for Raga tutorial practice mode
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('phyto-leaf-touched', { detail: { leafIndex } }));
    }

    // 2. Flash visual leaf active
    setActiveLeaves((prev) => {
      const next = [...prev];
      next[leafIndex] = true;
      return next;
    });

    // 3. Update real-time bio-telemetry micro-fluctuations
    setTelemetryData((prev) => ({
      ...prev,
      capacitancePf: parseFloat((Math.min(85, Math.max(30, prev.capacitancePf + (Math.random() - 0.4) * 3.2))).toFixed(1)),
      impedanceKOhm: parseFloat((Math.min(220, Math.max(120, prev.impedanceKOhm + (Math.random() - 0.5) * 3.8))).toFixed(1)),
      cortisolReduction: parseFloat((Math.min(32.0, Math.max(15.0, prev.cortisolReduction + 0.12))).toFixed(1)),
      brainwaveHz: parseFloat((8.8 + Math.random() * 0.8).toFixed(1))
    }));

    // Reset leaf flash after 220ms
    setTimeout(() => {
      setActiveLeaves((prev) => {
        const next = [...prev];
        next[leafIndex] = false;
        return next;
      });
    }, 220);
  }, []);

  // Web Serial Event Listener Callbacks
  useEffect(() => {
    serialService.setCallbacks({
      onData: ({ raw, values, touches }) => {
        setLastSerialPacket(raw);

        if (values && values.length >= 7) {
          setRawChannelValues(values.slice(0, 7));

          const avgReading = values.slice(0, 7).reduce((a, b) => a + b, 0) / 7;
          const liveCapacitance = Math.min(95, Math.max(25, 2400 / (avgReading + 12)));
          const liveImpedance = Math.min(260, Math.max(90, 45 + avgReading * 1.8));

          setTelemetryData((prev) => ({
            ...prev,
            capacitancePf: parseFloat(liveCapacitance.toFixed(1)),
            impedanceKOhm: parseFloat(liveImpedance.toFixed(1)),
            sapFlowRate: `${(0.25 + (100 - avgReading) * 0.003).toFixed(2)} mL/hr`
          }));
        }

        if (modeRef.current === 'hardware' && touches && touches.length) {
          touches.forEach((touch) => {
            if (touch.triggered) {
              handleLeafTouch(touch.leafIndex, touch.intensity || 0.85);
            }
          });
        }
      },
      onConnect: () => {
        setIsSerialConnected(true);
        setMode('hardware');
        setSerialStatus('Connected to ESP32 Hardware (115200 baud)');
      },
      onDisconnect: () => {
        setIsSerialConnected(false);
        setSerialStatus('Disconnected');
      },
      onError: (err) => {
        setSerialStatus(`Serial error: ${err.message}`);
      }
    });

    return () => {
      serialService.setCallbacks({ onData: null, onConnect: null, onDisconnect: null, onError: null });
    };
  }, [handleLeafTouch]);

  // Calibration Tare Command
  const handleCalibrate = async () => {
    setIsCalibrating(true);
    try {
      await serialService.calibrate();
      setTimeout(() => setIsCalibrating(false), 600);
    } catch {
      setIsCalibrating(false);
    }
  };

  // Sync audio engine parameters
  useEffect(() => {
    audioEngine.setPreset(currentPreset);
    audioEngine.setScale(currentScale);
    audioEngine.setMasterVolume(volume);
    audioEngine.setBaseFrequency(baseFrequency);
    audioEngine.setOctaveOffset(octaveOffset);
    audioEngine.setTuningSystem(tuningSystem);
  }, [currentPreset, currentScale, volume, baseFrequency, octaveOffset, tuningSystem]);

  // Microtonal Shruti fine-tuning handlers
  const handleUpdateLeafCents = (leafIdx, cents) => {
    audioEngine.setLeafCentsOffset(leafIdx, cents);
    setLeafCentsOffsets((prev) => {
      const next = [...prev];
      next[leafIdx] = cents;
      return next;
    });
  };

  const handleResetMicrotuning = () => {
    audioEngine.resetMicrotuning();
    setLeafCentsOffsets([0, 0, 0, 0, 0, 0, 0]);
  };

  const handleOpenShrutiTuner = () => {
    setDrawerDefaultTab('shruti');
    setIsDrawerOpen(true);
  };

  // Circadian Transpiration Pulse Loop (AutoPlay across 7 channels)
  useEffect(() => {
    if (mode !== 'simulation' || !isAutoPlay) return;

    let timeoutId;
    const scheduleNextPulse = () => {
      const delay = Math.random() * 2200 + 2600;
      timeoutId = setTimeout(() => {
        const randomLeaf = Math.floor(Math.random() * 7);
        handleLeafTouch(randomLeaf, 0.45);
        scheduleNextPulse();
      }, delay);
    };

    scheduleNextPulse();
    return () => clearTimeout(timeoutId);
  }, [mode, isAutoPlay, handleLeafTouch]);

  // Keyboard shortcut listener (Keys 1-7, Space, A, C, D, S)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      const key = e.key.toLowerCase();
      if (['1', '2', '3', '4', '5', '6', '7'].includes(key)) {
        const leafIdx = parseInt(key, 10) - 1;
        audioEngine.unlock();
        handleLeafTouch(leafIdx, 0.65);
      } else if (e.code === 'Space') {
        e.preventDefault();
        audioEngine.unlock();
        handleLeafTouch(0, 0.70);
        setTimeout(() => handleLeafTouch(2, 0.60), 60);
        setTimeout(() => handleLeafTouch(4, 0.65), 120);
      } else if (key === 'a') {
        setIsAutoPlay((prev) => !prev);
      } else if (key === 'c') {
        handleCalibrate();
      } else if (key === 'd') {
        setIsPitchDeckOpen((prev) => !prev);
      } else if (key === 's') {
        setIsDrawerOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLeafTouch]);

  // Recording Timer Effect
  useEffect(() => {
    let timerId;
    if (isRecording) {
      timerId = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timerId);
  }, [isRecording]);

  // Handle 1-Click Session Audio Recording & Instant Download
  const handleToggleRecord = async () => {
    if (!isRecording) {
      const started = await audioEngine.startRecording();
      if (started) {
        setIsRecording(true);
        setRecordingSeconds(0);
      }
    } else {
      const blob = await audioEngine.stopRecording();
      setIsRecording(false);
      if (blob) {
        downloadAudioRecording(blob);
        setJustDownloaded(true);
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.15 }
          });
        } catch {}
        setTimeout(() => setJustDownloaded(false), 3000);
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between font-sans bg-[#07090e]">
      
      {/* 1. Master Studio Control Bar */}
      <StudioHeader
        currentPreset={currentPreset}
        setPreset={setPreset}
        currentScale={currentScale}
        setScale={setScale}
        baseFrequency={baseFrequency}
        setBaseFrequency={setBaseFrequency}
        volume={volume}
        setVolume={setVolume}
        isAutoPlay={isAutoPlay}
        setIsAutoPlay={setIsAutoPlay}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        isDrawerOpen={isDrawerOpen}
        isSerialConnected={isSerialConnected}
        onCalibrate={handleCalibrate}
        isCalibrating={isCalibrating}
        isRecording={isRecording}
        recordingSeconds={recordingSeconds}
        onToggleRecord={handleToggleRecord}
        justDownloaded={justDownloaded}
        isRagaOpen={isRagaOpen}
        onToggleRaga={() => setIsRagaOpen(!isRagaOpen)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
      />

      {/* Audio Unlock Banner (Mobile First-Touch Protocol) */}
      {!isAudioUnlocked && (
        <div
          onClick={() => audioEngine.unlock().then((r) => r && setIsAudioUnlocked(true))}
          className="audio-unlock-banner animate-pulse select-none"
        >
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-white shrink-0" />
            <div>
              <p className="text-xs font-black tracking-wide">
                TAP TO ACTIVATE ZERO-LATENCY PLANT AUDIO (432 Hz RESONANCE)
              </p>
            </div>
          </div>
          <button className="py-0.5 px-2.5 rounded-lg bg-white text-emerald-800 text-[11px] font-black shadow-md uppercase tracking-wider shrink-0 cursor-pointer">
            START AUDIO
          </button>
        </div>
      )}

      {/* Interactive Raga Melodies & Guided Tutorial Bar */}
      <RagaMelodyBar
        isOpen={isRagaOpen}
        onClose={() => {
          setIsRagaOpen(false);
          setActiveTargetLeaf(null);
        }}
        onLeafTouch={handleLeafTouch}
        activeTargetLeaf={activeTargetLeaf}
        setActiveTargetLeaf={setActiveTargetLeaf}
      />

      {/* 2. Fullscreen Synthesizer Stage */}
      <main className="workstation-main">
        <FullscreenSynthStage
          activeLeaves={activeLeaves}
          onLeafTouch={handleLeafTouch}
          currentScale={currentScale}
          baseFrequency={baseFrequency}
          octaveOffset={octaveOffset}
          telemetryData={telemetryData}
          lastTriggeredNote={lastTriggeredNote}
          onOpenDrawer={() => {
            setDrawerDefaultTab('mixing');
            setIsDrawerOpen(true);
          }}
          onOpenShrutiTuner={handleOpenShrutiTuner}
          activeTargetLeaf={activeTargetLeaf}
          tuningSystem={tuningSystem}
          leafCentsOffsets={leafCentsOffsets}
          currentTheme={currentTheme}
        />
      </main>

      {/* 3. Slide-Out Telemetry & Mixing Drawer */}
      <TelemetryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeLeaves={activeLeaves}
        onLeafTouch={handleLeafTouch}
        currentScale={currentScale}
        baseFrequency={baseFrequency}
        setBaseFrequency={setBaseFrequency}
        octaveOffset={octaveOffset}
        telemetryData={telemetryData}
        lastTriggeredNote={lastTriggeredNote}
        isSerialConnected={isSerialConnected}
        onConnectSerial={async () => {
          try {
            await serialService.connect();
            setIsSerialConnected(true);
            setMode('hardware');
            setSerialStatus('Connected to ESP32 Hardware (115200 baud)');
          } catch (e) {
            alert(e.message);
          }
        }}
        onDisconnectSerial={async () => {
          await serialService.disconnect();
          setIsSerialConnected(false);
          setSerialStatus('Disconnected');
        }}
        serialStatus={serialStatus}
        lastSerialPacket={lastSerialPacket}
        rawChannelValues={rawChannelValues}
        onCalibrate={handleCalibrate}
        isCalibrating={isCalibrating}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        tuningSystem={tuningSystem}
        onSelectTuningSystem={(sys) => {
          setTuningSystem(sys);
          audioEngine.setTuningSystem(sys);
        }}
        leafCentsOffsets={leafCentsOffsets}
        onUpdateLeafCents={handleUpdateLeafCents}
        onResetMicrotuning={handleResetMicrotuning}
        defaultTab={drawerDefaultTab}
      />

      {/* 4. Student Engineering Field Dossier Modal */}
      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />

    </div>
  );
}
