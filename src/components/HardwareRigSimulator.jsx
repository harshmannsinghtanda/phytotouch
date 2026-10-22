/* ==============================================================================
   HardwareRigSimulator.jsx
   PhytoTouch: Interactive ESP32 Hardware Rig & Circuit Schematic Simulator
   Features:
   - Full Visual ESP32 DevKit V1 Board with Animated GPIO Status LED & Pins
   - Solderless Breadboard with Colored DuPont Jumper Wires & Particle Current Flow
   - Living Plant Specimen with 7 Foliar Touch Electrodes & 316L Soil Ground Probe
   - Interactive Circuit Schematic & Mathematical RC Relaxation Model
   - 50Hz Mains Hum Noise Simulation & Ground Shunt Analysis
   - Transpiration Drift Simulation & Adaptive EMA Filter Demonstration
   - Dry Soil Failure Mode (<15% VWC) Viva Test Bench
   - Tone.js 432Hz Saptak Bio-Acoustic Audio Integration
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Cpu, 
  Layers, 
  Activity, 
  Zap, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  Terminal, 
  Radio, 
  Info, 
  CheckCircle2, 
  Sliders, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { audioEngine } from '../audio/PlantAudioEngine';

// 7 Foliar Bio-Acoustic Channels mapped to Indian Classical Saptak (432 Hz)
export const RIG_CHANNELS = [
  {
    index: 0,
    swara: 'Sa',
    note: 'C4',
    freq: 432.0,
    pin: 'GPIO 4',
    touchId: 'T0',
    color: '#ef4444', // Red
    colorName: 'Red Lead',
    leafRole: 'Apex Solo Sprout',
    baseCycles: 74,
    touchedCycles: 22,
    baselinePf: 35.2,
    touchedPf: 149.4
  },
  {
    index: 1,
    swara: 'Re',
    note: 'D4',
    freq: 486.0,
    pin: 'GPIO 14',
    touchId: 'T6',
    color: '#f97316', // Orange
    colorName: 'Orange Lead',
    leafRole: 'Upper Foliage Blade',
    baseCycles: 76,
    touchedCycles: 24,
    baselinePf: 34.0,
    touchedPf: 148.0
  },
  {
    index: 2,
    swara: 'Ga',
    note: 'E4',
    freq: 540.0,
    pin: 'GPIO 15',
    touchId: 'T3',
    color: '#22c55e', // Green
    colorName: 'Green Lead',
    leafRole: 'Mid-Canopy Center',
    baseCycles: 72,
    touchedCycles: 21,
    baselinePf: 36.5,
    touchedPf: 152.1
  },
  {
    index: 3,
    swara: 'Ma',
    note: 'F4',
    freq: 576.0,
    pin: 'GPIO 13',
    touchId: 'T4',
    color: '#06b6d4', // Cyan
    colorName: 'Cyan Lead',
    leafRole: 'Central Leaf Blade',
    baseCycles: 75,
    touchedCycles: 23,
    baselinePf: 34.8,
    touchedPf: 150.3
  },
  {
    index: 4,
    swara: 'Pa',
    note: 'G4',
    freq: 648.0,
    pin: 'GPIO 12',
    touchId: 'T5',
    color: '#a855f7', // Purple
    colorName: 'Purple Lead',
    leafRole: 'Basal Petiole Lead',
    baseCycles: 71,
    touchedCycles: 20,
    baselinePf: 37.0,
    touchedPf: 154.5
  },
  {
    index: 5,
    swara: 'Dha',
    note: 'A4',
    freq: 729.0,
    pin: 'GPIO 27',
    touchId: 'T7',
    color: '#eab308', // Yellow
    colorName: 'Yellow Lead',
    leafRole: 'Lower Foliage Shrub',
    baseCycles: 78,
    touchedCycles: 25,
    baselinePf: 33.5,
    touchedPf: 146.2
  },
  {
    index: 6,
    swara: 'Ni',
    note: 'B4',
    freq: 810.0,
    pin: 'GPIO 33',
    touchId: 'T8',
    color: '#ec4899', // Pink
    colorName: 'Pink Lead',
    leafRole: 'Rhizome Node Collar',
    baseCycles: 73,
    touchedCycles: 22,
    baselinePf: 36.0,
    touchedPf: 151.0
  }
];

export function HardwareRigSimulator({ onOpenFirmwareModal, compact = false }) {
  // Simulator View Mode: 'rig' | 'schematic' | 'physics'
  const [viewMode, setViewMode] = useState('rig');

  // Channel Active Touch States (0 to 6)
  const [activeChannels, setActiveChannels] = useState([false, false, false, false, false, false, false]);
  const [lastTouchedChannel, setLastTouchedChannel] = useState(0);

  // Failure Mode & Environment Toggles
  const [isMainsHumEnabled, setIsMainsHumEnabled] = useState(false);       // 50Hz floating noise
  const [isTranspirationDrift, setIsTranspirationDrift] = useState(false); // Stomatal baseline drift
  const [isDrySoilFailure, setIsDrySoilFailure] = useState(false);         // Disconnects ground shunt
  const [isAutoSequence, setIsAutoSequence] = useState(false);             // Arpeggiator sequence
  const [isMuted, setIsMuted] = useState(false);

  // Live Telemetry Readouts
  const [telemetry, setTelemetry] = useState({
    clockCycles: 74,
    baselineCycles: 74,
    deltaPf: 0.0,
    totalPf: 35.2,
    snrDb: 46.8,
    sampleRateHz: 30,
    statusLed: false,
    rxBlink: false,
    txBlink: false,
    driftOffset: 0.0
  });

  // Serial Packet Console Logs
  const [serialLogs, setSerialLogs] = useState([
    '[ESP32] Booting Xtensa Dual-Core LX6 @ 240MHz...',
    '[INIT] Touch peripheral calibrated. Baseline = 74 clock counts.',
    '[UART] 115200 Baud streaming active (30Hz sample rate).',
    '[GROUND] 316L Stainless Steel Earth Reference Shunt OK (SNR 46.8 dB).'
  ]);

  const seqTimerRef = useRef(null);
  const driftRef = useRef(0);
  const terminalEndRef = useRef(null);

  // Trigger Leaf Touch in Simulator & Audio Engine
  const triggerTouch = useCallback((channelIndex, forceIntensity = 0.75) => {
    if (isDrySoilFailure) {
      // Dry soil failure: contact cannot complete ground return loop!
      setSerialLogs((prev) => [
        ...prev.slice(-25),
        `[WARN] CH${channelIndex} touch dropped! Soil moisture <15% VWC. High Z (>2.4MΩ) prevents ground return.`
      ]);
      return;
    }

    setLastTouchedChannel(channelIndex);
    setActiveChannels((prev) => {
      const next = [...prev];
      next[channelIndex] = true;
      return next;
    });

    // Play real audio note if unmuted
    if (!isMuted) {
      audioEngine.unlock();
      audioEngine.triggerLeaf(channelIndex, forceIntensity);
    }

    const ch = RIG_CHANNELS[channelIndex];
    const cycles = ch.touchedCycles + (isMainsHumEnabled ? Math.floor(Math.random() * 12 - 6) : 0);
    const dPf = +(ch.touchedPf - ch.baselinePf).toFixed(1);

    setTelemetry((prev) => ({
      ...prev,
      clockCycles: cycles,
      deltaPf: dPf,
      totalPf: ch.touchedPf,
      statusLed: true,
      txBlink: true
    }));

    // Send simulated JSON UART packet
    const packet = `$BIO:CH${channelIndex}:${ch.swara}=${cycles},BL=${ch.baseCycles},dC=+${dPf}pF,V=0.84mV*OK`;
    setSerialLogs((prev) => [...prev.slice(-25), packet]);

    // Auto-release touch after 260ms
    setTimeout(() => {
      setActiveChannels((prev) => {
        const next = [...prev];
        next[channelIndex] = false;
        return next;
      });
      setTelemetry((prev) => ({
        ...prev,
        clockCycles: ch.baseCycles + Math.floor(driftRef.current),
        deltaPf: 0.0,
        totalPf: ch.baselinePf,
        statusLed: false,
        txBlink: false
      }));
    }, 260);
  }, [isDrySoilFailure, isMainsHumEnabled, isMuted]);

  // Transpiration Baseline Drift Loop
  useEffect(() => {
    let interval = null;
    if (isTranspirationDrift) {
      let t = 0;
      interval = setInterval(() => {
        t += 0.2;
        const drift = Math.sin(t) * 4.5;
        driftRef.current = drift;
        setTelemetry((prev) => ({
          ...prev,
          driftOffset: +drift.toFixed(2),
          baselineCycles: Math.round(74 + drift)
        }));
      }, 150);
    } else {
      driftRef.current = 0;
      setTelemetry((prev) => ({ ...prev, driftOffset: 0.0, baselineCycles: 74 }));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTranspirationDrift]);

  // Auto-Sequence / Arpeggiator Demo
  useEffect(() => {
    if (isAutoSequence) {
      let step = 0;
      const melody = [0, 2, 4, 2, 5, 4, 1, 0, 3, 2, 6, 4];
      seqTimerRef.current = setInterval(() => {
        const ch = melody[step % melody.length];
        triggerTouch(ch, 0.65);
        step++;
      }, 340);
    } else {
      if (seqTimerRef.current) clearInterval(seqTimerRef.current);
    }
    return () => {
      if (seqTimerRef.current) clearInterval(seqTimerRef.current);
    };
  }, [isAutoSequence, triggerTouch]);

  // Status LED 1Hz Heartbeat Blink when idle
  useEffect(() => {
    const heartbeat = setInterval(() => {
      setTelemetry((prev) => {
        if (!prev.statusLed && activeChannels.every((c) => !c)) {
          return { ...prev, rxBlink: !prev.rxBlink };
        }
        return prev;
      });
    }, 800);
    return () => clearInterval(heartbeat);
  }, [activeChannels]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [serialLogs]);

  // Keyboard hotkeys (1 to 7)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 7) {
        triggerTouch(num - 1, 0.8);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [triggerTouch]);

  const activeCh = RIG_CHANNELS[lastTouchedChannel];

  return (
    <div className="w-full flex flex-col bg-[#070d0a] border border-[#10b981]/30 rounded-3xl overflow-hidden shadow-2xl text-[#dde4de] font-['Inter']">
      
      {/* 1. Simulator Master Header Bar */}
      <div className="px-5 py-4 bg-gradient-to-r from-[#04150c] via-[#081e13] to-[#04150c] border-b border-[#10b981]/25 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#47f3bb] shadow-[0_0_15px_rgba(6,214,160,0.25)]">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-['Syne'] text-base font-extrabold text-[#f0fdf4] tracking-tight">
                PhytoTouch Hardware Rig &amp; Circuit Simulator
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#10b981]/20 text-[#47f3bb] border border-[#10b981]/30 font-['JetBrains_Mono'] text-[9px] font-bold">
                ESP32 DEVKIT V1
              </span>
            </div>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#86efac]">
              LIVE RELAXATION OSCILLATOR TELEMETRY • BREADBOARD • BOTANICAL ELECTRODES
            </span>
          </div>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#131d18] border border-[#3b4a43]/40 rounded-xl">
          {[
            { id: 'rig', label: '1. Hardware Rig', icon: Layers },
            { id: 'schematic', label: '2. Circuit Schematic', icon: Zap },
            { id: 'physics', label: '3. Physics & Failure Bench', icon: Sliders }
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#06d6a0] text-[#003827] shadow-[0_0_12px_rgba(6,214,160,0.3)]'
                    : 'text-[#bacac1] hover:text-white hover:bg-[#1b2620]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Controls Quick Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoSequence((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-['JetBrains_Mono'] text-xs font-bold border transition-all cursor-pointer ${
              isAutoSequence
                ? 'bg-[#f0c04d] text-black border-[#f0c04d] shadow-[0_0_12px_rgba(240,192,77,0.4)]'
                : 'bg-[#171d1a] text-[#f0c04d] border-[#f0c04d]/40 hover:bg-[#252b28]'
            }`}
            title="Auto-play Saptak melody across the plant"
          >
            {isAutoSequence ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoSequence ? 'PAUSE RIG' : 'AUTO RIG DEMO'}</span>
          </button>

          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className="p-2 rounded-xl bg-[#171d1a] border border-[#3b4a43]/40 hover:border-[#47f3bb]/40 text-[#bacac1] hover:text-white transition-all cursor-pointer"
            title={isMuted ? 'Unmute Audio Synthesis' : 'Mute Audio Synthesis'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#ff8373]" /> : <Volume2 className="w-4 h-4 text-[#47f3bb]" />}
          </button>

          {onOpenFirmwareModal && (
            <button
              onClick={onOpenFirmwareModal}
              className="px-3 py-1.5 rounded-xl bg-[#171d1a] border border-[#10b981]/40 hover:border-[#47f3bb] text-[#47f3bb] font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer"
            >
              FIRMWARE CODE
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Workstation Area */}
      <div className="p-4 md:p-6 flex flex-col gap-6">

        {/* =========================================================================
            MODE 1: PHYSICAL HARDWARE RIG (ESP32 + BREADBOARD + PLANT)
           ========================================================================= */}
        {viewMode === 'rig' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
            
            {/* Left & Center: Interactive Vector Hardware Rig Canvas */}
            <div className="xl:col-span-8 bg-[#0b120e] border border-[#10b981]/20 rounded-2xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-inner">
              
              {/* Telemetry Micro-Pill Overlay */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 font-['JetBrains_Mono'] text-xs z-10">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#141e18] border border-[#10b981]/30">
                  <span className={`w-2 h-2 rounded-full ${telemetry.statusLed ? 'bg-[#47f3bb] shadow-[0_0_8px_#47f3bb]' : 'bg-[#252b28]'}`}></span>
                  <span className="text-[#86efac] font-bold">STATUS LED: GPIO 2</span>
                  <span className="text-[#47f3bb]">{telemetry.statusLed ? 'TOUCH ACTIVE' : 'IDLE HEARTBEAT'}</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-[#bacac1]">
                  <span>VCC: <strong className="text-white">3.30 V</strong></span>
                  <span>CLOCK: <strong className="text-white">8 MHz OSC</strong></span>
                  <span>GROUND: <strong className={isDrySoilFailure ? 'text-[#ff8373]' : 'text-[#47f3bb]'}>
                    {isDrySoilFailure ? 'HIGH-Z FAULT' : '316L EARTH SHUNT'}
                  </strong></span>
                </div>
              </div>

              {/* The Rig: ESP32 + Jumpers + Plant SVG */}
              <div className="relative w-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center bg-gradient-to-b from-[#09100c] to-[#0d1612] rounded-xl border border-white/5 p-2 overflow-x-auto">
                
                <svg viewBox="0 0 920 460" className="w-full max-w-[920px] h-auto drop-shadow-2xl select-none">
                  <defs>
                    {/* Gradients */}
                    <linearGradient id="espPcbGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e2621" />
                      <stop offset="100%" stopColor="#111613" />
                    </linearGradient>
                    <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4a5550" />
                      <stop offset="50%" stopColor="#2e3833" />
                      <stop offset="100%" stopColor="#1f2622" />
                    </linearGradient>
                    <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8d4b32" />
                      <stop offset="50%" stopColor="#ba6947" />
                      <stop offset="100%" stopColor="#753923" />
                    </linearGradient>
                    <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3d281a" />
                      <stop offset="100%" stopColor="#22160d" />
                    </linearGradient>
                    <radialGradient id="ledGlow">
                      <stop offset="0%" stopColor="#47f3bb" stopOpacity="1" />
                      <stop offset="100%" stopColor="#47f3bb" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="leafGlow">
                      <stop offset="0%" stopColor="#06d6a0" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#06d6a0" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* -----------------------------------------------------------------
                      SECTION A: ESP32 DevKit V1 (Left Section, x: 40 to 220)
                     ----------------------------------------------------------------- */}
                  <g id="esp32-board" transform="translate(50, 45)">
                    {/* PCB Outline */}
                    <rect x="0" y="0" width="160" height="340" rx="10" fill="url(#espPcbGrad)" stroke="#3b4a43" strokeWidth="2.5" />
                    
                    {/* Mounting holes */}
                    <circle cx="15" cy="15" r="5" fill="#09100c" stroke="#f0c04d" strokeWidth="1" />
                    <circle cx="145" cy="15" r="5" fill="#09100c" stroke="#f0c04d" strokeWidth="1" />
                    <circle cx="15" cy="325" r="5" fill="#09100c" stroke="#f0c04d" strokeWidth="1" />
                    <circle cx="145" cy="325" r="5" fill="#09100c" stroke="#f0c04d" strokeWidth="1" />

                    {/* Silkscreen Brand & Version */}
                    <text x="80" y="32" fill="#bacac1" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                      DOIT ESP32 DEVKIT V1
                    </text>
                    <text x="80" y="44" fill="#47f3bb" fontSize="7.5" fontFamily="JetBrains Mono" textAnchor="middle">
                      PHYTO-TOUCH BIO-CORE
                    </text>

                    {/* ESP-WROOM-32 RF Shield Can */}
                    <rect x="25" y="55" width="110" height="130" rx="5" fill="url(#shieldGrad)" stroke="#677a71" strokeWidth="1" />
                    
                    {/* Antenna ZigZag Meander */}
                    <path d="M 40,65 L 50,65 L 50,75 L 60,75 L 60,65 L 70,65 L 70,75 L 80,75 L 80,65 L 90,65 L 90,75 L 100,75 L 100,65 L 110,65 L 110,75 L 120,75" 
                          fill="none" stroke="#f0c04d" strokeWidth="2" strokeLinecap="round" />

                    <text x="80" y="115" fill="#e2e8f0" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                      ESP-WROOM-32
                    </text>
                    <text x="80" y="130" fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">
                      FCC ID: 2AC7Z-ESPWROOM32
                    </text>
                    <text x="80" y="142" fill="#94a3b8" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">
                      2.4GHz Wi-Fi + BLE 4.2
                    </text>

                    {/* CP2102 USB-to-UART Silicon IC */}
                    <rect x="62" y="210" width="36" height="36" rx="2" fill="#0d1410" stroke="#47f3bb" strokeWidth="0.8" />
                    <text x="80" y="232" fill="#86efac" fontSize="7" fontFamily="JetBrains Mono" textAnchor="middle">
                      CP2102
                    </text>

                    {/* Micro-USB Port at bottom */}
                    <rect x="58" y="325" width="44" height="20" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                    <rect x="68" y="335" width="24" height="8" rx="1" fill="#1e293b" />
                    <text x="80" y="358" fill="#47f3bb" fontSize="7.5" fontFamily="JetBrains Mono" textAnchor="middle">
                      USB UART (115200)
                    </text>

                    {/* Tactile Buttons: EN & BOOT */}
                    <rect x="18" y="285" width="16" height="16" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                    <circle cx="26" cy="293" r="4" fill="#0f172a" />
                    <text x="26" y="312" fill="#94a3b8" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">EN</text>

                    <rect x="126" y="285" width="16" height="16" rx="3" fill="#334155" stroke="#94a3b8" strokeWidth="1" />
                    <circle cx="134" cy="293" r="4" fill="#0f172a" />
                    <text x="134" y="312" fill="#94a3b8" fontSize="6.5" fontFamily="JetBrains Mono" textAnchor="middle">BOOT</text>

                    {/* Status LED (GPIO 2) */}
                    <g transform="translate(48, 255)">
                      <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill="#1f2937" stroke="#4b5563" strokeWidth="0.5" />
                      <circle cx="0" cy="0" r="3" fill={telemetry.statusLed ? '#47f3bb' : '#10b981'} />
                      {telemetry.statusLed && (
                        <circle cx="0" cy="0" r="14" fill="url(#ledGlow)" opacity="0.9" />
                      )}
                      <text x="0" y="14" fill="#86efac" fontSize="6" fontFamily="JetBrains Mono" textAnchor="middle">LED2</text>
                    </g>

                    {/* Power LED (3V3 - Red) */}
                    <g transform="translate(112, 255)">
                      <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill="#1f2937" stroke="#4b5563" strokeWidth="0.5" />
                      <circle cx="0" cy="0" r="3" fill="#ef4444" />
                      <text x="0" y="14" fill="#fca5a5" fontSize="6" fontFamily="JetBrains Mono" textAnchor="middle">PWR</text>
                    </g>

                    {/* Pin Headers: Left Row (3V3, GND, G15, G2, G4...) */}
                    {/* Pin G4 [Touch 0] at y: 130 */}
                    <circle cx="8" cy="130" r="4" fill="#ef4444" stroke="#fecaca" strokeWidth="1" />
                    <text x="16" y="133" fill="#ef4444" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold">G4 (T0)</text>

                    {/* Pin G15 [Touch 3] at y: 155 */}
                    <circle cx="8" cy="155" r="4" fill="#22c55e" stroke="#bbf7d0" strokeWidth="1" />
                    <text x="16" y="158" fill="#22c55e" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold">G15 (T3)</text>

                    {/* Pin Headers: Right Row (GND, G13, G12, G14, G27, G33...) */}
                    {/* Pin GND at y: 90 */}
                    <circle cx="152" cy="90" r="4" fill="#000000" stroke="#94a3b8" strokeWidth="1.5" />
                    <text x="144" y="93" fill="#94a3b8" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="end">GND</text>

                    {/* Pin G14 [Touch 6] at y: 120 */}
                    <circle cx="152" cy="120" r="4" fill="#f97316" stroke="#fed7aa" strokeWidth="1" />
                    <text x="144" y="123" fill="#f97316" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="end">G14 (T6)</text>

                    {/* Pin G13 [Touch 4] at y: 145 */}
                    <circle cx="152" cy="145" r="4" fill="#06b6d4" stroke="#a5f3fc" strokeWidth="1" />
                    <text x="144" y="148" fill="#06b6d4" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="end">G13 (T4)</text>

                    {/* Pin G12 [Touch 5] at y: 170 */}
                    <circle cx="152" cy="170" r="4" fill="#a855f7" stroke="#e9d5ff" strokeWidth="1" />
                    <text x="144" y="173" fill="#a855f7" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="end">G12 (T5)</text>

                    {/* Pin G27 [Touch 7] at y: 195 */}
                    <circle cx="152" cy="195" r="4" fill="#eab308" stroke="#fef08a" strokeWidth="1" />
                    <text x="144" y="198" fill="#eab308" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="end">G27 (T7)</text>

                    {/* Pin G33 [Touch 8] at y: 220 */}
                    <circle cx="152" cy="220" r="4" fill="#ec4899" stroke="#fbcfe8" strokeWidth="1" />
                    <text x="144" y="223" fill="#ec4899" fontSize="7" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="end">G33 (T8)</text>
                  </g>

                  {/* -----------------------------------------------------------------
                      SECTION B: Solderless Breadboard Hub (Center, x: 280 to 450)
                     ----------------------------------------------------------------- */}
                  <g id="breadboard" transform="translate(260, 80)">
                    <rect x="0" y="0" width="180" height="280" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
                    {/* Power rails +/- */}
                    <line x1="12" y1="15" x2="12" y2="265" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" />
                    <line x1="22" y1="15" x2="22" y2="265" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
                    <line x1="158" y1="15" x2="158" y2="265" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,2" />
                    <line x1="168" y1="15" x2="168" y2="265" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2" />

                    {/* Breadboard Silkscreen Coordinates */}
                    <text x="90" y="25" fill="#64748b" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                      400-TIE EXPERIMENTER BOARD
                    </text>

                    {/* Tie points grid (Visual representation) */}
                    {[50, 75, 100, 125, 150, 175, 200, 225, 250].map((y, rIdx) => (
                      <g key={rIdx}>
                        {[40, 52, 64, 76, 88, 104, 116, 128, 140].map((x, cIdx) => (
                          <circle key={cIdx} cx={x} cy={y} r="2.2" fill="#0f172a" />
                        ))}
                      </g>
                    ))}
                    {/* Center divider trough */}
                    <rect x="94" y="40" width="4" height="220" fill="#e2e8f0" />
                  </g>

                  {/* -----------------------------------------------------------------
                      SECTION C: Botanical Plant & Terracotta Pot (Right, x: 540 to 880)
                     ----------------------------------------------------------------- */}
                  <g id="botanical-plant" transform="translate(560, 40)">
                    
                    {/* Terracotta Pot */}
                    <polygon points="60,340 180,340 160,420 80,420" fill="url(#potGrad)" stroke="#5c2c1b" strokeWidth="2" />
                    {/* Pot Rim */}
                    <rect x="50" y="325" width="140" height="20" rx="3" fill="#a05236" stroke="#5c2c1b" strokeWidth="2" />
                    {/* Soil Substrate */}
                    <ellipse cx="120" cy="335" rx="55" ry="10" fill="url(#soilGrad)" />

                    {/* Soil Status Indicator */}
                    <text x="120" y="405" fill="#f8fafc" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                      {isDrySoilFailure ? 'SOIL: DRY (<15%)' : 'SOIL: MOIST (48%)'}
                    </text>

                    {/* 316L Stainless Steel Soil Ground Probe (Plunged into soil) */}
                    <g id="soil-probe">
                      <rect x="117" y="295" width="6" height="60" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                      {/* Alligator Clip at top of probe */}
                      <rect x="113" y="285" width="14" height="14" rx="2" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                      <circle cx="120" cy="292" r="3" fill="#000000" />
                      <text x="135" y="295" fill="#94a3b8" fontSize="7.5" fontFamily="JetBrains Mono" fontWeight="bold">
                        316L PROBE (GND)
                      </text>
                    </g>

                    {/* Plant Stems (Curved natural stems) */}
                    <path d="M 120,335 Q 120,240 110,180 Q 100,120 110,50" fill="none" stroke="#2d6a4f" strokeWidth="7" strokeLinecap="round" />
                    <path d="M 115,250 Q 80,210 50,180" fill="none" stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round" />
                    <path d="M 112,200 Q 150,170 190,140" fill="none" stroke="#2d6a4f" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M 108,150 Q 60,110 30,90" fill="none" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 109,110 Q 160,80 195,60" fill="none" stroke="#2d6a4f" strokeWidth="3.5" strokeLinecap="round" />
                    <path d="M 118,280 Q 170,260 210,240" fill="none" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 118,300 Q 60,290 20,280" fill="none" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" />

                    {/* 7 Interactive Foliar Leaves / Touch Electrodes */}

                    {/* LEAF 0: Apex Sprout (Sa / 432Hz / Red) */}
                    <g id="leaf-0" 
                       onClick={() => triggerTouch(0)} 
                       className="cursor-pointer group"
                       transform="translate(110, 40)">
                      {activeChannels[0] && <circle cx="0" cy="0" r="32" fill="url(#leafGlow)" />}
                      <path d="M 0,0 C -25,-25 0,-60 20,-30 C 35,-10 15,15 0,0 Z" 
                            fill={activeChannels[0] ? '#47f3bb' : '#1b4332'} 
                            stroke={activeChannels[0] ? '#ef4444' : '#52b788'} 
                            strokeWidth={activeChannels[0] ? '3' : '1.5'} 
                            className="transition-all duration-150 group-hover:scale-110" />
                      {/* Alligator clip */}
                      <rect x="-4" y="-3" width="8" height="8" rx="1.5" fill="#ef4444" stroke="#ffffff" strokeWidth="0.8" />
                      <text x="25" y="-35" fill="#f87171" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                        1: Sa (432Hz)
                      </text>
                    </g>

                    {/* LEAF 1: Upper Foliage Blade (Re / 486Hz / Orange) */}
                    <g id="leaf-1" 
                       onClick={() => triggerTouch(1)} 
                       className="cursor-pointer group"
                       transform="translate(195, 60)">
                      {activeChannels[1] && <circle cx="0" cy="0" r="32" fill="url(#leafGlow)" />}
                      <path d="M 0,0 C 25,-20 50,0 35,25 C 20,40 -10,15 0,0 Z" 
                            fill={activeChannels[1] ? '#47f3bb' : '#2d6a4f'} 
                            stroke={activeChannels[1] ? '#f97316' : '#74c69d'} 
                            strokeWidth={activeChannels[1] ? '3' : '1.5'} 
                            className="transition-all duration-150 group-hover:scale-110" />
                      <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill="#f97316" stroke="#ffffff" strokeWidth="0.8" />
                      <text x="40" y="5" fill="#fb923c" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                        2: Re (486Hz)
                      </text>
                    </g>

                    {/* LEAF 2: Mid Canopy Center (Ga / 540Hz / Green) */}
                    <g id="leaf-2" 
                       onClick={() => triggerTouch(2)} 
                       className="cursor-pointer group"
                       transform="translate(30, 90)">
                      {activeChannels[2] && <circle cx="0" cy="0" r="32" fill="url(#leafGlow)" />}
                      <path d="M 0,0 C -30,-15 -45,15 -25,35 C -5,45 15,20 0,0 Z" 
                            fill={activeChannels[2] ? '#47f3bb' : '#1b4332'} 
                            stroke={activeChannels[2] ? '#22c55e' : '#52b788'} 
                            strokeWidth={activeChannels[2] ? '3' : '1.5'} 
                            className="transition-all duration-150 group-hover:scale-110" />
                      <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill="#22c55e" stroke="#ffffff" strokeWidth="0.8" />
                      <text x="-75" y="20" fill="#4ade80" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                        3: Ga (540Hz)
                      </text>
                    </g>

                    {/* LEAF 3: Central Leaf Blade (Ma / 576Hz / Cyan) */}
                    <g id="leaf-3" 
                       onClick={() => triggerTouch(3)} 
                       className="cursor-pointer group"
                       transform="translate(190, 140)">
                      {activeChannels[3] && <circle cx="0" cy="0" r="34" fill="url(#leafGlow)" />}
                      <path d="M 0,0 C 35,-15 55,20 30,45 C 10,60 -15,30 0,0 Z" 
                            fill={activeChannels[3] ? '#47f3bb' : '#2d6a4f'} 
                            stroke={activeChannels[3] ? '#06b6d4' : '#74c69d'} 
                            strokeWidth={activeChannels[3] ? '3' : '1.5'} 
                            className="transition-all duration-150 group-hover:scale-110" />
                      <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="0.8" />
                      <text x="45" y="30" fill="#38bdf8" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                        4: Ma (576Hz)
                      </text>
                    </g>

                    {/* LEAF 4: Basal Petiole Lead (Pa / 648Hz / Purple) */}
                    <g id="leaf-4" 
                       onClick={() => triggerTouch(4)} 
                       className="cursor-pointer group"
                       transform="translate(50, 180)">
                      {activeChannels[4] && <circle cx="0" cy="0" r="34" fill="url(#leafGlow)" />}
                      <path d="M 0,0 C -35,-10 -55,25 -30,50 C -10,65 15,35 0,0 Z" 
                            fill={activeChannels[4] ? '#47f3bb' : '#1b4332'} 
                            stroke={activeChannels[4] ? '#a855f7' : '#52b788'} 
                            strokeWidth={activeChannels[4] ? '3' : '1.5'} 
                            className="transition-all duration-150 group-hover:scale-110" />
                      <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill="#a855f7" stroke="#ffffff" strokeWidth="0.8" />
                      <text x="-80" y="45" fill="#c084fc" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                        5: Pa (648Hz)
                      </text>
                    </g>

                    {/* LEAF 5: Lower Foliage Shrub (Dha / 729Hz / Yellow) */}
                    <g id="leaf-5" 
                       onClick={() => triggerTouch(5)} 
                       className="cursor-pointer group"
                       transform="translate(210, 240)">
                      {activeChannels[5] && <circle cx="0" cy="0" r="32" fill="url(#leafGlow)" />}
                      <path d="M 0,0 C 30,-5 45,25 20,45 C 0,55 -20,25 0,0 Z" 
                            fill={activeChannels[5] ? '#47f3bb' : '#2d6a4f'} 
                            stroke={activeChannels[5] ? '#eab308' : '#74c69d'} 
                            strokeWidth={activeChannels[5] ? '3' : '1.5'} 
                            className="transition-all duration-150 group-hover:scale-110" />
                      <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill="#eab308" stroke="#ffffff" strokeWidth="0.8" />
                      <text x="35" y="35" fill="#fde047" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                        6: Dha (729Hz)
                      </text>
                    </g>

                    {/* LEAF 6: Rhizome Node Collar (Ni / 810Hz / Pink) */}
                    <g id="leaf-6" 
                       onClick={() => triggerTouch(6)} 
                       className="cursor-pointer group"
                       transform="translate(20, 280)">
                      {activeChannels[6] && <circle cx="0" cy="0" r="30" fill="url(#leafGlow)" />}
                      <path d="M 0,0 C -25,-5 -35,20 -15,35 C 0,45 15,20 0,0 Z" 
                            fill={activeChannels[6] ? '#47f3bb' : '#1b4332'} 
                            stroke={activeChannels[6] ? '#ec4899' : '#52b788'} 
                            strokeWidth={activeChannels[6] ? '3' : '1.5'} 
                            className="transition-all duration-150 group-hover:scale-110" />
                      <rect x="-4" y="-4" width="8" height="8" rx="1.5" fill="#ec4899" stroke="#ffffff" strokeWidth="0.8" />
                      <text x="-75" y="25" fill="#f472b6" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                        7: Ni (810Hz)
                      </text>
                    </g>
                  </g>

                  {/* -----------------------------------------------------------------
                      SECTION D: Dynamic Colored DuPont Jumper Wires with Current Glow
                     ----------------------------------------------------------------- */}
                  {/* Wire GND (Black/Slate): ESP32 GND (202, 135) -> Breadboard -> Soil Probe (680, 325) */}
                  <path d="M 202,135 C 240,110 320,110 380,130 C 440,150 560,320 680,325" 
                        fill="none" 
                        stroke="#0f172a" 
                        strokeWidth="4" 
                        strokeLinecap="round" />
                  <path d="M 202,135 C 240,110 320,110 380,130 C 440,150 560,320 680,325" 
                        fill="none" 
                        stroke="#64748b" 
                        strokeWidth="1.5" 
                        strokeDasharray="4,4" />

                  {/* Wire 0 (Red): ESP32 G4 (58, 175) -> Breadboard -> Leaf 0 (670, 80) */}
                  <path d="M 58,175 C 10,210 20,380 180,410 C 350,440 500,80 670,80" 
                        fill="none" 
                        stroke={activeChannels[0] ? '#ef4444' : 'rgba(239,68,68,0.5)'} 
                        strokeWidth={activeChannels[0] ? '3.5' : '2'} 
                        strokeLinecap="round" />

                  {/* Wire 1 (Orange): ESP32 G14 (202, 165) -> Leaf 1 (755, 100) */}
                  <path d="M 202,165 C 250,150 320,170 420,180 C 530,190 620,90 755,100" 
                        fill="none" 
                        stroke={activeChannels[1] ? '#f97316' : 'rgba(249,115,22,0.5)'} 
                        strokeWidth={activeChannels[1] ? '3.5' : '2'} 
                        strokeLinecap="round" />

                  {/* Wire 2 (Green): ESP32 G15 (58, 200) -> Leaf 2 (590, 130) */}
                  <path d="M 58,200 C 20,230 40,360 200,390 C 360,410 460,140 590,130" 
                        fill="none" 
                        stroke={activeChannels[2] ? '#22c55e' : 'rgba(34,197,94,0.5)'} 
                        strokeWidth={activeChannels[2] ? '3.5' : '2'} 
                        strokeLinecap="round" />

                  {/* Wire 3 (Cyan): ESP32 G13 (202, 190) -> Leaf 3 (750, 180) */}
                  <path d="M 202,190 C 260,180 340,210 450,220 C 560,230 650,170 750,180" 
                        fill="none" 
                        stroke={activeChannels[3] ? '#06b6d4' : 'rgba(6,182,212,0.5)'} 
                        strokeWidth={activeChannels[3] ? '3.5' : '2'} 
                        strokeLinecap="round" />

                  {/* Wire 4 (Purple): ESP32 G12 (202, 215) -> Leaf 4 (610, 220) */}
                  <path d="M 202,215 C 260,220 340,240 430,250 C 500,260 550,210 610,220" 
                        fill="none" 
                        stroke={activeChannels[4] ? '#a855f7' : 'rgba(168,85,247,0.5)'} 
                        strokeWidth={activeChannels[4] ? '3.5' : '2'} 
                        strokeLinecap="round" />

                  {/* Wire 5 (Yellow): ESP32 G27 (202, 240) -> Leaf 5 (770, 280) */}
                  <path d="M 202,240 C 280,260 360,280 470,290 C 580,300 680,270 770,280" 
                        fill="none" 
                        stroke={activeChannels[5] ? '#eab308' : 'rgba(234,179,8,0.5)'} 
                        strokeWidth={activeChannels[5] ? '3.5' : '2'} 
                        strokeLinecap="round" />

                  {/* Wire 6 (Pink): ESP32 G33 (202, 265) -> Leaf 6 (580, 320) */}
                  <path d="M 202,265 C 280,290 350,320 440,330 C 500,340 530,310 580,320" 
                        fill="none" 
                        stroke={activeChannels[6] ? '#ec4899' : 'rgba(236,72,153,0.5)'} 
                        strokeWidth={activeChannels[6] ? '3.5' : '2'} 
                        strokeLinecap="round" />
                </svg>

                {/* Interactive Instruction Toast */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#09100c]/85 border border-white/10 backdrop-blur-md text-[11px] font-['JetBrains_Mono'] text-[#bacac1]">
                  <span>👆 <strong>TOUCH LEAVES / PRESS 1-7:</strong> Triggers 432Hz Saptak notes &amp; sends UART packet</span>
                  <span className="hidden sm:inline text-[#47f3bb]">100% Client-Side WebAudio DSP</span>
                </div>
              </div>

              {/* Quick Tactile Foliar Swara Touch Pads (Buttons) */}
              <div className="grid grid-cols-7 gap-2 mt-4">
                {RIG_CHANNELS.map((ch) => {
                  const isTouched = activeChannels[ch.index];
                  return (
                    <button
                      key={ch.index}
                      onClick={() => triggerTouch(ch.index)}
                      className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border active:scale-95 ${
                        isTouched
                          ? 'bg-[#06d6a0] text-[#003827] border-[#06d6a0] shadow-[0_0_15px_rgba(6,214,160,0.5)]'
                          : 'bg-[#131d18] text-[#dde4de] border-[#3b4a43]/40 hover:border-[#10b981]'
                      }`}
                    >
                      <span className="font-['Syne'] text-xs font-black">{ch.swara}</span>
                      <span className="font-['JetBrains_Mono'] text-[9px] opacity-80">{ch.freq}Hz</span>
                      <span className="font-['JetBrains_Mono'] text-[8px] font-bold" style={{ color: isTouched ? '#003827' : ch.color }}>
                        [{ch.pin.replace('GPIO ', 'G')}]
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Real-Time Oscilloscope & Live UART Telemetry */}
            <div className="xl:col-span-4 flex flex-col gap-4">
              
              {/* Telemetry Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0e1612] border border-[#10b981]/25 flex flex-col gap-1">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#86efac] uppercase tracking-wider font-bold">
                    RELAXATION OSCILLATOR
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-['Syne'] text-2xl font-black text-white">
                      {telemetry.clockCycles}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1]">cycles / 33ms</span>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1]">
                    Baseline: {telemetry.baselineCycles} | {telemetry.deltaPf > 0 ? `ΔC: +${telemetry.deltaPf}pF` : 'Resting'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e1612] border border-[#10b981]/25 flex flex-col gap-1">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#f0c04d] uppercase tracking-wider font-bold">
                    BIO-IMPEDANCE Z
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-['Syne'] text-2xl font-black text-[#f0c04d]">
                      {isDrySoilFailure ? '2.4 MΩ' : '168 kΩ'}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1]">differential</span>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1]">
                    SNR: {isMainsHumEnabled ? '14.2 dB (NOISY)' : '46.8 dB (CLEAN)'}
                  </span>
                </div>
              </div>

              {/* Simulated Oscilloscope Waveform Canvas */}
              <div className="p-4 rounded-xl bg-[#09100c] border border-[#10b981]/30 flex flex-col gap-2">
                <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#47f3bb]" />
                    <span className="text-[#47f3bb] font-bold">RC DISCHARGE WAVEFORM</span>
                  </div>
                  <span className="text-[10px] text-[#bacac1]">
                    {activeChannels.some(Boolean) ? 'CHG RAMP: SLOW (TOUCHED)' : 'CHG RAMP: FAST (IDLE)'}
                  </span>
                </div>

                {/* Vector Waveform Graphic */}
                <div className="h-28 w-full bg-[#050907] rounded-lg border border-white/5 relative flex items-center justify-center overflow-hidden p-2">
                  {/* Grid lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:16px_16px]" />
                  
                  <svg viewBox="0 0 300 80" className="w-full h-full">
                    {/* Idle Sawtooth vs Touched Slow-Ramp Sawtooth */}
                    {activeChannels.some(Boolean) ? (
                      /* Flattened slow ramp due to +120pF human capacitance */
                      <path d="M 0,70 L 60,10 L 62,70 L 120,10 L 122,70 L 180,10 L 182,70 L 240,10 L 242,70 L 300,10" 
                            fill="none" stroke="#47f3bb" strokeWidth="2.5" />
                    ) : isMainsHumEnabled ? (
                      /* Corrupted by 50Hz mains hum sine wave */
                      <path d="M 0,40 Q 25,10 50,40 T 100,40 T 150,40 T 200,40 T 250,40 T 300,40" 
                            fill="none" stroke="#ff8373" strokeWidth="2" strokeDasharray="2,2" />
                    ) : (
                      /* Pristine fast idle sawtooth: 74 cycles per window */
                      <path d="M 0,70 L 20,15 L 21,70 L 40,15 L 41,70 L 60,15 L 61,70 L 80,15 L 81,70 L 100,15 L 101,70 L 120,15 L 121,70 L 140,15 L 141,70 L 160,15 L 161,70 L 180,15 L 181,70 L 200,15 L 201,70 L 220,15 L 221,70 L 240,15 L 241,70 L 260,15 L 261,70 L 280,15 L 281,70 L 300,15" 
                            fill="none" stroke="#06d6a0" strokeWidth="1.8" />
                    )}
                  </svg>

                  {/* Threshold annotation */}
                  <div className="absolute right-2 top-2 font-['JetBrains_Mono'] text-[9px] text-[#86efac] bg-black/60 px-1.5 py-0.5 rounded">
                    Vth = 2.45V
                  </div>
                </div>
              </div>

              {/* Live WebSerial 115200 Baud Terminal */}
              <div className="p-4 rounded-xl bg-[#09100c] border border-[#10b981]/30 flex flex-col gap-2 flex-1 min-h-[180px]">
                <div className="flex items-center justify-between font-['JetBrains_Mono'] text-xs">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#f0c04d]" />
                    <span className="text-[#f0c04d] font-bold">UART STREAM (115200 BAUD)</span>
                  </div>
                  <span className="text-[10px] text-[#47f3bb]">30 Hz PACKETS</span>
                </div>

                <div className="bg-[#050907] p-2.5 rounded-lg border border-white/5 font-['JetBrains_Mono'] text-[10px] text-[#86efac] flex-1 overflow-y-auto max-h-[140px] space-y-1">
                  {serialLogs.map((log, i) => (
                    <div key={i} className="leading-tight break-all font-mono">
                      {log}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 2: CIRCUIT SCHEMATIC & EE MATHEMATICAL MODEL
           ========================================================================= */}
        {viewMode === 'schematic' && (
          <div className="flex flex-col gap-6">
            
            {/* Architectural Concept Banner */}
            <div className="p-4 rounded-xl bg-[#0e1612] border border-[#10b981]/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#47f3bb]">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Syne'] text-sm font-bold text-white">
                    Differential RC Relaxation Oscillator &amp; Biological Dielectric Interface
                  </h3>
                  <p className="font-['Inter'] text-xs text-[#bacac1] mt-0.5">
                    The ESP32 internal touch peripheral counts how many charge/discharge cycles fit within a 33ms window.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs shrink-0">
                <span className="px-3 py-1 rounded-full bg-[#1b2520] border border-[#10b981]/30 text-[#86efac]">
                  SAMPLE WINDOW: 33ms (30Hz)
                </span>
              </div>
            </div>

            {/* Interactive Vector Circuit Schematic */}
            <div className="bg-[#09100c] border border-[#10b981]/30 rounded-2xl p-6 overflow-x-auto">
              <svg viewBox="0 0 900 360" className="w-full min-w-[850px] h-auto select-none">
                
                {/* 1. ESP32 Internal Silicon Block (Left) */}
                <g transform="translate(40, 30)">
                  <rect x="0" y="0" width="260" height="290" rx="8" fill="#0e1713" stroke="#47f3bb" strokeWidth="2" strokeDasharray="6,3" />
                  <text x="130" y="24" fill="#47f3bb" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                    ESP32 SILICON (TOUCH HW)
                  </text>

                  {/* 8MHz Internal Clock */}
                  <rect x="25" y="45" width="90" height="36" rx="4" fill="#1b2520" stroke="#3b4a43" strokeWidth="1" />
                  <text x="70" y="67" fill="#f0c04d" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">8MHz CLK</text>

                  {/* Constant Current Charge Source I_chg */}
                  <circle cx="70" cy="130" r="18" fill="#1b2520" stroke="#47f3bb" strokeWidth="1.5" />
                  <path d="M 70,120 L 70,140 M 65,130 L 70,140 L 75,130" stroke="#47f3bb" strokeWidth="1.5" fill="none" />
                  <text x="105" y="133" fill="#86efac" fontSize="9" fontFamily="JetBrains Mono">Ichg ~10µA</text>

                  {/* Threshold Comparator */}
                  <polygon points="170,110 230,130 170,150" fill="#1b2520" stroke="#f0c04d" strokeWidth="1.5" />
                  <text x="185" y="133" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono">+</text>
                  <text x="185" y="145" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono">-</text>
                  <text x="185" y="170" fill="#f0c04d" fontSize="8" fontFamily="JetBrains Mono">Vth=2.45V</text>

                  {/* Cycle Counter Register */}
                  <rect x="140" y="210" width="100" height="40" rx="4" fill="#1b2520" stroke="#47f3bb" strokeWidth="1" />
                  <text x="190" y="228" fill="#47f3bb" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                    CYCLE COUNTER
                  </text>
                  <text x="190" y="242" fill="#86efac" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                    N: 74 → 22 ticks
                  </text>

                  {/* GPIO 4 Touch Pad Terminal */}
                  <circle cx="260" cy="130" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                  <text x="250" y="115" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="end">
                    GPIO 4 [T0]
                  </text>
                </g>

                {/* Connection Line: GPIO 4 to Foliar Model */}
                <line x1="300" y1="160" x2="380" y2="160" stroke="#ef4444" strokeWidth="3" />
                <text x="340" y="150" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                  RED LEAD
                </text>

                {/* 2. Foliar Dielectric Interface Block (Center) */}
                <g transform="translate(380, 50)">
                  <rect x="0" y="0" width="260" height="250" rx="8" fill="#121b16" stroke="#22c55e" strokeWidth="2" />
                  <text x="130" y="24" fill="#86efac" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                    LIVING LEAF DIELECTRIC
                  </text>

                  {/* R_xylem (45k Ohm) */}
                  <rect x="40" y="60" width="50" height="24" fill="#1b2520" stroke="#ffffff" strokeWidth="1" />
                  <text x="65" y="75" fill="#ffffff" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">Rxylem</text>
                  <text x="65" y="100" fill="#bacac1" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">45 kΩ</text>

                  {/* Parallel C_leaf (35 pF) */}
                  <line x1="150" y1="50" x2="150" y2="90" stroke="#47f3bb" strokeWidth="2" />
                  <line x1="160" y1="50" x2="160" y2="90" stroke="#47f3bb" strokeWidth="2" />
                  <text x="180" y="75" fill="#47f3bb" fontSize="9" fontFamily="JetBrains Mono">Cleaf ~35pF</text>

                  {/* Finger Contact Switch (Human Body Capacitance) */}
                  <g transform="translate(40, 130)">
                    <circle cx="15" cy="20" r="4" fill="#f0c04d" />
                    <line x1="15" y1="20" x2="45" y2="10" stroke="#f0c04d" strokeWidth="2" strokeDasharray="3,1" />
                    <circle cx="55" cy="20" r="4" fill="#f0c04d" />
                    <text x="75" y="18" fill="#f0c04d" fontSize="9" fontFamily="JetBrains Mono">HUMAN TOUCH</text>
                    
                    {/* C_human (120 pF) in parallel */}
                    <line x1="145" y1="10" x2="145" y2="35" stroke="#f0c04d" strokeWidth="2" />
                    <line x1="155" y1="10" x2="155" y2="35" stroke="#f0c04d" strokeWidth="2" />
                    <text x="175" y="26" fill="#f0c04d" fontSize="9" fontFamily="JetBrains Mono">Chuman ~120pF</text>
                  </g>

                  {/* Dielectric formula in leaf */}
                  <text x="130" y="210" fill="#86efac" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
                    C_total = C_leaf + C_human
                  </text>
                  <text x="130" y="228" fill="#bacac1" fontSize="8.5" fontFamily="JetBrains Mono" textAnchor="middle">
                    35pF → 155pF (ΔC = +120pF)
                  </text>
                </g>

                {/* Connection to Ground Shunt */}
                <line x1="640" y1="160" x2="720" y2="160" stroke="#94a3b8" strokeWidth="2.5" />

                {/* 3. 316L Stainless Steel Earth Shunt Block (Right) */}
                <g transform="translate(720, 70)">
                  <rect x="0" y="0" width="150" height="210" rx="8" fill="#0f1712" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="75" y="24" fill="#94a3b8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">
                    316L SOIL SHUNT
                  </text>

                  {/* Soil Resistance R_soil */}
                  <rect x="50" y="50" width="50" height="22" fill="#1e293b" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="75" y="65" fill="#cbd5e1" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">R_soil</text>
                  <text x="75" y="90" fill="#94a3b8" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">280 Ω (Moist)</text>

                  {/* Earth Ground Symbol */}
                  <g transform="translate(75, 130)">
                    <line x1="0" y1="0" x2="0" y2="20" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="-15" y1="20" x2="15" y2="20" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="-10" y1="25" x2="10" y2="25" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="-5" y1="30" x2="5" y2="30" stroke="#94a3b8" strokeWidth="2" />
                    <text x="0" y="45" fill="#47f3bb" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                      COMMON 0V
                    </text>
                  </g>
                </g>
              </svg>
            </div>

            {/* Viva Mathematical Derivation Callout Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#09100c] border border-white/10 flex flex-col gap-2">
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#47f3bb] uppercase">
                  1. Tau Time Constant
                </span>
                <p className="font-['JetBrains_Mono'] text-xs text-[#86efac] leading-relaxed">
                  τ = R · C_total
                </p>
                <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">
                  When human fingertip touches leaf, C_total increases from 35 pF to 155 pF (+340%), lengthening charge time.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#09100c] border border-white/10 flex flex-col gap-2">
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#f0c04d] uppercase">
                  2. Oscillator Frequency
                </span>
                <p className="font-['JetBrains_Mono'] text-xs text-[#ffdf9d] leading-relaxed">
                  f_osc = 1 / (ln(2) · R · C)
                </p>
                <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">
                  The oscillation frequency drops in inverse proportion to the added bodily capacitance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#09100c] border border-white/10 flex flex-col gap-2">
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#38bdf8] uppercase">
                  3. Discrete Clock Counts
                </span>
                <p className="font-['JetBrains_Mono'] text-xs text-[#7dd3fc] leading-relaxed">
                  Counts = f_osc · Δt_sample
                </p>
                <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">
                  In 33ms window, idle cycles count 74. Touched cycles count 22. Drop &gt; 28% activates note trigger!
                </p>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            MODE 3: REAL-WORLD PHYSICS & FAILURE BENCH (VIVA TEST BENCH)
           ========================================================================= */}
        {viewMode === 'physics' && (
          <div className="flex flex-col gap-6">
            
            <div className="p-4 rounded-xl bg-[#0e1612] border border-[#10b981]/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-['Syne'] text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#f0c04d]" />
                  Real-World Physics &amp; Failure Mode Laboratory
                </h3>
                <p className="font-['Inter'] text-xs text-[#bacac1] mt-0.5">
                  Test the three physical environmental challenges required to demonstrate viva mastery.
                </p>
              </div>
            </div>

            {/* Failure Mode Toggles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Test 1: 50Hz Mains Hum Noise */}
              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                isMainsHumEnabled 
                  ? 'bg-[#1e1313] border-[#ef4444]/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                  : 'bg-[#0f1712] border-[#10b981]/30'
              }`}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-[#fca5a5]">
                      TEST 01: UNGROUNDED GRID HUM
                    </span>
                    <AlertTriangle className={`w-4 h-4 ${isMainsHumEnabled ? 'text-[#ef4444]' : 'text-gray-500'}`} />
                  </div>
                  <h4 className="font-['Syne'] text-base font-bold text-white">50 Hz AC Mains Induction</h4>
                  <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">
                    Simulates removing the 316L soil ground probe. Ambient building wiring couples 480mVpp mains noise into plant leaves, corrupting touch readings.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-white/10 font-['JetBrains_Mono'] text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#bacac1]">SNR:</span>
                    <span className={isMainsHumEnabled ? 'text-[#ef4444] font-bold' : 'text-[#47f3bb] font-bold'}>
                      {isMainsHumEnabled ? '14.2 dB (DEGRADED)' : '46.8 dB (CLEAN)'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMainsHumEnabled((prev) => !prev)}
                    className={`w-full py-2.5 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer ${
                      isMainsHumEnabled
                        ? 'bg-[#ef4444] text-white'
                        : 'bg-[#1b2520] hover:bg-[#25332b] text-[#47f3bb] border border-[#10b981]/40'
                    }`}
                  >
                    {isMainsHumEnabled ? 'RESTORE GROUND SHUNT' : 'SIMULATE 50Hz HUM NOISE'}
                  </button>
                </div>
              </div>

              {/* Test 2: Transpiration Baseline Drift */}
              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                isTranspirationDrift 
                  ? 'bg-[#1c1a11] border-[#f0c04d]/60 shadow-[0_0_20px_rgba(240,192,77,0.2)]' 
                  : 'bg-[#0f1712] border-[#10b981]/30'
              }`}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-[#fde047]">
                      TEST 02: CIRCADIAN WATER FLUX
                    </span>
                    <Activity className={`w-4 h-4 ${isTranspirationDrift ? 'text-[#f0c04d]' : 'text-gray-500'}`} />
                  </div>
                  <h4 className="font-['Syne'] text-base font-bold text-white">Transpiration Baseline Drift</h4>
                  <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">
                    Simulates stomatal aperture changes during daytime heating. Demonstrates the ESP32 Exponential Moving Average (EMA: α = 0.002) autocalibration.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-white/10 font-['JetBrains_Mono'] text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#bacac1]">BASELINE OFFSET:</span>
                    <span className="text-[#f0c04d] font-bold">
                      {isTranspirationDrift ? `${telemetry.driftOffset > 0 ? '+' : ''}${telemetry.driftOffset} counts` : '0.0 counts'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsTranspirationDrift((prev) => !prev)}
                    className={`w-full py-2.5 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer ${
                      isTranspirationDrift
                        ? 'bg-[#f0c04d] text-black'
                        : 'bg-[#1b2520] hover:bg-[#25332b] text-[#f0c04d] border border-[#f0c04d]/40'
                    }`}
                  >
                    {isTranspirationDrift ? 'FREEZE BASELINE' : 'ENABLE TRANSPIRATION DRIFT'}
                  </button>
                </div>
              </div>

              {/* Test 3: Dry Soil Failure Mode (<15% VWC) */}
              <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                isDrySoilFailure 
                  ? 'bg-[#1e1313] border-[#ff8373]/60 shadow-[0_0_20px_rgba(255,131,115,0.2)]' 
                  : 'bg-[#0f1712] border-[#10b981]/30'
              }`}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-['JetBrains_Mono'] text-[10px] uppercase font-bold text-[#fca5a5]">
                      TEST 03: VIVA FAILURE MODE
                    </span>
                    <ShieldCheck className={`w-4 h-4 ${isDrySoilFailure ? 'text-[#ff8373]' : 'text-[#47f3bb]'}`} />
                  </div>
                  <h4 className="font-['Syne'] text-base font-bold text-white">Dry Soil Substrate (&lt;15% VWC)</h4>
                  <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">
                    When soil moisture dries out, soil impedance shoots up past 2.4 MΩ. Human contact cannot complete the ground return loop, dropping all touches.
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-3 border-t border-white/10 font-['JetBrains_Mono'] text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#bacac1]">GROUND STATUS:</span>
                    <span className={isDrySoilFailure ? 'text-[#ff8373] font-bold' : 'text-[#47f3bb] font-bold'}>
                      {isDrySoilFailure ? 'DISCONNECTED (FAULT)' : '0V REFERENCE OK'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsDrySoilFailure((prev) => !prev)}
                    className={`w-full py-2.5 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer ${
                      isDrySoilFailure
                        ? 'bg-[#ff8373] text-black font-extrabold'
                        : 'bg-[#1b2520] hover:bg-[#25332b] text-[#ff8373] border border-[#ff8373]/40'
                    }`}
                  >
                    {isDrySoilFailure ? 'WATER SOIL (RESTORE)' : 'DRY OUT SOIL (<15%)'}
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default HardwareRigSimulator;
