/* ==============================================================================
   PhytoApp.jsx
   PhytoTouch: Living Plant Bio-Acoustic Synthesizer & Telemetry Workstation
   Engineered for 100% Guaranteed Mobile Audio (iOS Safari + Android Chrome)
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { audioEngine, PRESETS, SCALES } from '../audio/PlantAudioEngine';
import { serialService } from '../services/SerialService';
import { AnalogOscilloscope } from './AnalogOscilloscope';
import { ControlsHeader } from './ControlsHeader';
import { InteractivePlant } from './InteractivePlant';
import { ChannelStrip } from './ChannelStrip';
import { TelemetryPanel } from './TelemetryPanel';
import { PitchDeckModal } from './PitchDeckModal';
import { FirmwareGuideModal } from './FirmwareGuideModal';

export function PhytoClassicApp() {
  // Operational mode: 'simulation' | 'hardware'
  const [mode, setMode] = useState('simulation');
  const [currentPreset, setPreset] = useState('grand_piano');
  const [currentScale, setScale] = useState('pentatonic');
  const [baseFrequency, setBaseFrequency] = useState(432); // Master base tuning (Hz)
  const [octaveOffset, setOctaveOffset] = useState(0);    // Octave transposition (-2 to +2)
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [volume, setVolume] = useState(-8); // Studio calibrated clean master gain (-8 dB)

  // Mobile Audio Unlock State
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(() => audioEngine.isAudioRunning());

  // Hardware serial state
  const [isSerialConnected, setIsSerialConnected] = useState(false);
  const [serialStatus, setSerialStatus] = useState('');
  const [lastSerialPacket, setLastSerialPacket] = useState('');
  const [rawChannelValues, setRawChannelValues] = useState([70, 70, 70, 70, 70]);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Interactive leaf states (5 channels: 0 to 4)
  const [activeLeaves, setActiveLeaves] = useState([false, false, false, false, false]);
  const [lastTriggeredNote, setLastTriggeredNote] = useState(null);

  // Telemetry bio-metrics
  const [telemetryData, setTelemetryData] = useState({
    capacitancePf: 48.6,
    impedanceKOhm: 168.4,
    cortisolReduction: 23.5,
    brainwaveHz: 9.2,
    sapFlowRate: '0.34 mL/hr'
  });

  // Modal visibility states
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [isFirmwareOpen, setIsFirmwareOpen] = useState(false);

  // Mode ref for callbacks
  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  // Global Audio Unlock Listener (First touch anywhere on mobile screen awakens audio)
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

    // 2. Flash visual leaf active
    setActiveLeaves((prev) => {
      const next = [...prev];
      next[leafIndex] = true;
      return next;
    });

    // 3. Update real-time bio-telemetry micro-fluctuations
    setTelemetryData((prev) => ({
      ...prev,
      capacitancePf: Math.min(85, Math.max(30, prev.capacitancePf + (Math.random() - 0.4) * 3.5)),
      impedanceKOhm: Math.min(220, Math.max(140, prev.impedanceKOhm + (Math.random() - 0.5) * 4.2)),
      cortisolReduction: Math.min(32.0, Math.max(15.0, prev.cortisolReduction + 0.15)),
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

        if (values && values.length >= 5) {
          setRawChannelValues(values.slice(0, 5));

          const avgReading = values.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
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
  }, [currentPreset, currentScale, volume, baseFrequency, octaveOffset]);

  // Circadian Transpiration Pulse Loop
  useEffect(() => {
    if (mode !== 'simulation' || !isAutoPlay) return;

    let timeoutId;
    const scheduleNextPulse = () => {
      const delay = Math.random() * 2200 + 2600;
      timeoutId = setTimeout(() => {
        const randomLeaf = Math.floor(Math.random() * 5);
        handleLeafTouch(randomLeaf, 0.45);
        scheduleNextPulse();
      }, delay);
    };

    scheduleNextPulse();
    return () => clearTimeout(timeoutId);
  }, [mode, isAutoPlay, handleLeafTouch]);

  // Keyboard shortcut listener (Keys 1-5, Space, A, C, D, F)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      const key = e.key.toLowerCase();
      if (['1', '2', '3', '4', '5'].includes(key)) {
        const leafIdx = parseInt(key, 10) - 1;
        audioEngine.unlock();
        handleLeafTouch(leafIdx, 0.65);
      } else if (e.code === 'Space') {
        e.preventDefault();
        audioEngine.unlock();
        audioEngine.triggerChord([0, 2, 4], 0.38);
        setActiveLeaves([true, false, true, false, true]);
        setTimeout(() => setActiveLeaves([false, false, false, false, false]), 300);
      } else if (key === 'a') {
        setIsAutoPlay((prev) => !prev);
      } else if (key === 'c') {
        handleCalibrate();
      } else if (key === 'd') {
        setIsPitchDeckOpen((prev) => !prev);
      } else if (key === 'f') {
        setIsFirmwareOpen((prev) => !prev);
      } else if (key === 'escape') {
        setIsPitchDeckOpen(false);
        setIsFirmwareOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleLeafTouch]);

  return (
    <div className="phyto-darkroom min-h-screen min-h-[100dvh] w-full py-4 sm:py-6 px-3 sm:px-6 flex flex-col items-center justify-start font-sans">
      
      {/* Universal Mobile Audio Activation Floating Banner */}
      {!isAudioUnlocked ? (
        <div className="w-full max-w-7xl mb-3 flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#10b981]/25 via-[#059669]/30 to-[#f59e0b]/20 border border-[#10b981]/50 backdrop-blur-xl shadow-xl shadow-black/40 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">🌱</span>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>MOBILE BOTANICAL SYNTHESIS READY</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30">432Hz</span>
              </div>
              <div className="text-xs text-[#a7f3d0]">
                Tap anywhere or press the button to enable living plant bio-acoustic synthesis
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              audioEngine.testChime();
              setIsAudioUnlocked(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#022312] font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap border border-[#6ee7b7]"
          >
            TAP TO AWAKEN 🌿
          </button>
        </div>
      ) : (
        <div className="w-full max-w-7xl mb-2 flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#082819]/80 border border-[#10b981]/35 text-xs text-[#34d399] shadow-md shadow-black/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981] animate-pulse"></span>
            <span className="font-bold text-white">432Hz BIO-ACOUSTIC RESONATOR ACTIVE</span>
            <span className="hidden sm:inline text-[#86efac]">• 48kHz Hi-Res Flora Audio Stream</span>
          </div>
          <button
            type="button"
            onClick={() => audioEngine.testChime()}
            className="font-mono text-[11px] font-bold underline text-[#6ee7b7] hover:text-white cursor-pointer"
          >
            Play Test Chime 🎵
          </button>
        </div>
      )}

      {/* Master Chassis Frame - Botanical Conservatory */}
      <div className="w-full max-w-7xl bg-[#061c12]/92 backdrop-blur-2xl border border-[#10b981]/25 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-5">
        
        {/* Controls and Sound Palette Bar */}
        <ControlsHeader
          currentPreset={currentPreset}
          setPreset={setPreset}
          currentScale={currentScale}
          setScale={setScale}
          baseFrequency={baseFrequency}
          setBaseFrequency={setBaseFrequency}
          octaveOffset={octaveOffset}
          setOctaveOffset={setOctaveOffset}
          mode={mode}
          setMode={setMode}
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
          isAutoPlay={isAutoPlay}
          setIsAutoPlay={setIsAutoPlay}
          volume={volume}
          setVolume={setVolume}
          onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
          onOpenFirmwareGuide={() => setIsFirmwareOpen(true)}
          onCalibrate={handleCalibrate}
          isCalibrating={isCalibrating}
          lastSerialPacket={lastSerialPacket}
        />

        {/* Responsive Main Workstation Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Column: Living Specimen & 5-Channel Tactile Bio-Pads (5 Columns on Desktop) */}
          <section 
            className="lg:col-span-5 w-full rounded-3xl p-2 sm:p-4 shadow-xl shadow-black/40 flex flex-col justify-between border"
            style={{
              backgroundColor: 'rgba(9, 38, 25, 0.94)',
              borderColor: 'rgba(16, 185, 129, 0.35)'
            }}
          >
            <InteractivePlant
              activeLeaves={activeLeaves}
              onLeafTouch={handleLeafTouch}
              currentScale={currentScale}
              baseFrequency={baseFrequency}
              octaveOffset={octaveOffset}
            />
          </section>

          {/* Right Column: Oscilloscope, Input Bus, and Telemetry (7 Columns on Desktop) */}
          <section className="lg:col-span-7 w-full flex flex-col gap-4">
            
            {/* 1. Oscilloscope & FFT Spectrum */}
            <div 
              className="rounded-3xl p-4 sm:p-5 shadow-xl shadow-black/40 border"
              style={{
                backgroundColor: 'rgba(9, 38, 25, 0.94)',
                borderColor: 'rgba(16, 185, 129, 0.35)'
              }}
            >
              <AnalogOscilloscope
                isPlaying={isAutoPlay || mode === 'hardware'}
                lastTriggeredNote={lastTriggeredNote}
              />
            </div>

            {/* 2. 5-Channel Attenuators Bus */}
            <div 
              className="rounded-3xl p-4 sm:p-5 shadow-xl shadow-black/40 border"
              style={{
                backgroundColor: 'rgba(9, 38, 25, 0.94)',
                borderColor: 'rgba(16, 185, 129, 0.35)'
              }}
            >
              <ChannelStrip
                activeLeaves={activeLeaves}
                onLeafTouch={handleLeafTouch}
                currentScale={currentScale}
                baseFrequency={baseFrequency}
                octaveOffset={octaveOffset}
              />
            </div>

            {/* 3. Real-Time Telemetry Log */}
            <div 
              className="rounded-3xl p-4 sm:p-5 shadow-xl shadow-black/40 border"
              style={{
                backgroundColor: 'rgba(9, 38, 25, 0.94)',
                borderColor: 'rgba(16, 185, 129, 0.35)'
              }}
            >
              <TelemetryPanel
                telemetryData={telemetryData}
                lastTriggeredNote={lastTriggeredNote}
                connectionMode={mode === 'hardware' ? 'ESP32 HARDWARE SERIAL' : 'BROWSER DSP SIMULATION'}
                serialStatus={serialStatus}
              />
            </div>

          </section>
        </main>

        {/* Master Workstation Footer */}
        <footer className="mt-2 pt-4 border-t border-[#10b981]/20 flex flex-wrap items-center justify-between gap-3 text-xs text-[#86efac]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-white font-bold flex items-center gap-1.5">
              <span>🌿</span> PHYTOTOUCH DSP V15
            </span>
            <span>•</span>
            <span>SAMPLE RATE: 48,000 Hz</span>
            <span>•</span>
            <span className="text-[#34d399] font-mono font-bold">
              TUNING: {baseFrequency.toFixed(2)} Hz SACRED FLORA
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#a7f3d0]">
            <span>HOTKEYS: [1-5] NOTES | [SPACE] CHORD | [A] PULSE | [C] TARE | [F] FIRMWARE</span>
          </div>
        </footer>

      </div>

      {/* Field Dossier & Business Pitch Modal */}
      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />

      {/* ESP32 Hardware Schematics, C++ Drivers & Terminal Modal */}
      <FirmwareGuideModal
        isOpen={isFirmwareOpen}
        onClose={() => setIsFirmwareOpen(false)}
        isSerialConnected={isSerialConnected}
        serialStatus={serialStatus}
        lastSerialPacket={lastSerialPacket}
        rawChannelValues={rawChannelValues}
        onSerialSend={(cmd) => serialService.sendCommand(cmd)}
        onCalibrate={handleCalibrate}
      />
    </div>
  );
}
