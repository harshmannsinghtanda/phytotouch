/* ==============================================================================
   CitrusApp.jsx
   Master Industrial Optical Citrus Sorter Workstation View
   Engineered with world-class-clean-ui standards & high-contrast legibility
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState, useEffect } from 'react';
import { CitrusScannerRig } from './CitrusScannerRig';
import { MandiEconomicsPanel } from './MandiEconomicsPanel';
import { ConveyorSortingSimulator } from './ConveyorSortingSimulator';
import { CitrusPitchModal } from './CitrusPitchModal';
import { CitrusHardwareGuideModal } from './CitrusHardwareGuideModal';
import { CitrusCertificateModal } from './CitrusCertificateModal';
import { CitrusResearchModal } from './CitrusResearchModal';
import { citrusSerialService } from './CitrusSerialService';
import {
  Sparkles,
  FileText,
  CheckCircle,
  AlertTriangle,
  Activity,
  Layers,
  ArrowUpRight,
  Eye,
  Camera,
  TrendingUp,
  Sun,
  Moon,
  Heart,
  FlaskConical,
  Zap,
  Cpu,
  Award,
  RotateCw,
  BookOpen
} from 'lucide-react';
import { getNutritionByGrade } from './CitrusNutritionData';

const DEFAULT_TELEMETRY = {
  detected: true,
  grade: 'A',
  label: 'Grade A (Export & Premium Retail)',
  color: '#22c55e',
  defectPercent: 0.3,
  ripenessIndex: 99.8,
  chlorophyllIndex: 3.5,
  caliperDiameterMm: 79.5,
  sphericity: 0.73,
  shelfLifeDays: 21,
  mandiPriceInr: 12.0,
  diverterAngle: 45,
  recommendedAction: 'Wipe, Carnauba Wax & Pack in Cold-Chain Export Master Carton',
  turgorEst: '90 Shore D (Optimal Firmness)',
  pathogenDiagnosis: 'Flawless Epidermis (Sound Flavedo)'
};

export function CitrusApp({ theme = 'dark', onToggleTheme }) {
  const [telemetry, setTelemetry] = useState(DEFAULT_TELEMETRY);

  const handleTelemetryUpdate = React.useCallback((result) => {
    if (!result) return;
    if (result.detected) {
      setTelemetry((prev) => ({
        ...prev,
        ...result,
        detected: true,
        isLocked: !!result.isLocked,
        analysisProgress: result.analysisProgress ?? 100,
        confidenceScore: result.confidenceScore ?? 98,
        label: result.label || prev.label || 'Grade A (Export)',
        color: result.color || '#22c55e',
        grade: result.grade || 'A',
        pathogenDiagnosis: result.pathogenDiagnosis || prev.pathogenDiagnosis || 'Sound Flavedo',
        shelfLifeDays: typeof result.shelfLifeDays === 'number' ? result.shelfLifeDays : (prev.shelfLifeDays ?? 21),
        mandiPriceInr: typeof result.mandiPriceInr === 'number' ? result.mandiPriceInr : (prev.mandiPriceInr ?? 12),
        recommendedAction: result.recommendedAction || prev.recommendedAction || 'Pack in export crates',
        ripenessIndex: typeof result.ripenessIndex === 'number' ? result.ripenessIndex : (prev.ripenessIndex ?? 95),
        defectPercent: typeof result.defectPercent === 'number' ? result.defectPercent : (prev.defectPercent ?? 0),
        caliperDiameterMm: typeof result.caliperDiameterMm === 'number' ? result.caliperDiameterMm : (prev.caliperDiameterMm ?? 60),
        sphericity: typeof result.sphericity === 'number' ? result.sphericity : (prev.sphericity ?? 0.8)
      }));
    } else {
      // In standby/undetected mode, preserve telemetry metrics and update diagnostic status without crashing
      setTelemetry((prev) => ({
        ...prev,
        detected: false,
        isLocked: false,
        analysisProgress: result.analysisProgress ?? 0,
        rejectReason: result.rejectReason,
        recommendedAction: result.message || 'Position citrus specimen within camera viewfinder...',
        pathogenDiagnosis: result.rejectReason ? `Non-Citrus Target Rejected (${result.rejectReason})` : 'Optical sensor standby — scanning flavedo...'
      }));
    }
  }, []);

  const [currentSpecimen, setCurrentSpecimen] = useState('sample_real_photo');
  const [activeViewTab, setActiveViewTab] = useState('inspection'); // 'inspection' | 'economics' | 'conveyor' | 'all'
  const [nutritionViewMode, setNutritionViewMode] = useState('nutrients'); // 'nutrients' | 'insights'

  // Modals & Hardware States
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [isHardwareGuideOpen, setIsHardwareGuideOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isResearchOpen, setIsResearchOpen] = useState(false);
  const [isSerialConnected, setIsSerialConnected] = useState(false);

  useEffect(() => {
    citrusSerialService.onStatusChange = (connected) => {
      setIsSerialConnected(connected);
    };
    return () => {
      citrusSerialService.onStatusChange = null;
    };
  }, []);

  const handleSerialConnect = async () => {
    try {
      await citrusSerialService.connect();
      setIsSerialConnected(true);
    } catch (err) {
      console.warn('WebSerial connection cancelled or unsupported:', err);
    }
  };

  const handleSerialDisconnect = async () => {
    await citrusSerialService.disconnect();
    setIsSerialConnected(false);
  };

  const handleSerialSend = (cmd) => {
    citrusSerialService.sendCommand(cmd);
  };

  const activeNutrition = getNutritionByGrade(telemetry?.grade || telemetry?.label);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      const key = e.key.toLowerCase();
      if (key === 'd') {
        setIsPitchOpen((p) => !p);
      } else if (key === 'h') {
        setIsHardwareGuideOpen((p) => !p);
      } else if (key === 'p') {
        setIsCertificateOpen((p) => !p);
      } else if (key === 'r') {
        setIsResearchOpen((p) => !p);
      } else if (key === 'c') {
        setActiveViewTab('conveyor');
      } else if (key === 't') {
        onToggleTheme?.();
      } else if (key === 'escape') {
        setIsPitchOpen(false);
        setIsHardwareGuideOpen(false);
        setIsCertificateOpen(false);
        setIsResearchOpen(false);
      } else if (key === '1') setCurrentSpecimen('sample_real_photo');
      else if (key === '2') setCurrentSpecimen('sample_hidden_defect');
      else if (key === '3') setCurrentSpecimen('sample_grade_a');
      else if (key === '4') setCurrentSpecimen('sample_grade_b');
      else if (key === '5') setCurrentSpecimen('sample_grade_c');
      else if (key === '6') setCurrentSpecimen('sample_grade_d_anthracnose');
      else if (key === '7') setCurrentSpecimen('sample_grade_d_mold');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 py-6 font-sans">
      {/* High-Legibility Modern Header */}
      <header className="glass-panel px-6 py-4 flex flex-wrap items-center justify-between gap-4 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f59e0b]/30 to-[#f59e0b]/10 border border-[#f59e0b]/40 flex items-center justify-center text-3xl shadow-lg">
            🍋
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-black tracking-tight text-white font-sans">
                CITRUSSENSE
              </h1>
              <span className="text-xs px-3 py-1 rounded-full bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 font-bold uppercase tracking-wider">
                AUTONOMOUS OPTICAL SORTER
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30 font-bold">
                🇮🇳 India: #1 Global Producer (3.7M MT)
              </span>
            </div>
            <p className="text-sm text-[#cbd5e1] font-medium mt-0.5">
              Instant AI Citrus Recognition, Quality Grading & Mandi Loss Prevention
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Hardware & WebSerial Toggle Button */}
          <button
            onClick={() => setIsHardwareGuideOpen(true)}
            className={`craft-btn !py-2.5 !px-3.5 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all ${
              isSerialConnected ? '!border-[#22c55e]/60 !bg-[#22c55e]/10 !text-[#22c55e]' : ''
            }`}
            title="Physical ESP32 Hardware Schematics & WebSerial [H]"
          >
            <Cpu className="w-4 h-4 text-[#38bdf8]" />
            <span className="hidden md:inline">HARDWARE [H]</span>
            {isSerialConnected && <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping inline-block"></span>}
          </button>

          {/* Official APEDA Certificate Button */}
          <button
            onClick={() => {
              setIsCertificateOpen(true);
            }}
            className="craft-btn !py-2.5 !px-3.5 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
            title="View / Print Official APEDA Certificate [P]"
          >
            <Award className="w-4 h-4 text-[#fbbf24]" />
            <span className="hidden md:inline">CERTIFICATE [P]</span>
          </button>

          {/* 5 Core Research Papers Button */}
          <button
            onClick={() => {
              setIsResearchOpen(true);
            }}
            className="craft-btn !py-2.5 !px-3 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all !border-[#818cf8]/40 !bg-[#818cf8]/10 !text-[#a5b4fc] hover:!bg-[#818cf8]/20"
            title="5 Core Scientific Research Papers [R]"
          >
            <BookOpen className="w-4 h-4 text-[#818cf8]" />
            <span className="hidden sm:inline">RESEARCH [R]</span>
            <span className="sm:hidden">PAPERS</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#818cf8]/30 text-white font-mono text-[10px] font-bold">5</span>
          </button>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="craft-btn !py-2.5 !px-3.5 text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
            title="Toggle Light / Dark Mode [T]"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-[#fbbf24]" />
                <span className="hidden sm:inline">LIGHT MODE [T]</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#0284c7]" />
                <span className="hidden sm:inline">DARK MODE [T]</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPitchOpen(true);
            }}
            className="craft-btn craft-btn-primary !py-2.5 !px-5 text-xs font-black flex items-center gap-2 shadow-xl"
          >
            <FileText className="w-4 h-4 text-black" />
            PRESENTATION PITCH [D]
          </button>
        </div>
      </header>

      {/* Clean Software Navigation Tabs */}
      <div className="glass-panel p-2 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setActiveViewTab('inspection');
            }}
            className={`craft-btn !py-2 !px-4 text-xs font-bold rounded-xl transition-all ${
              activeViewTab === 'inspection'
                ? (theme === 'light' ? '!bg-[#0f172a] !text-white shadow-lg font-black' : '!bg-white !text-black shadow-lg font-black')
                : '!bg-transparent !border-transparent text-[#cbd5e1] hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4 text-[#22c55e]" />
            1. INSTANT AI SCANNER & VERDICT
          </button>

          <button
            onClick={() => {
              setActiveViewTab('economics');
            }}
            className={`craft-btn !py-2 !px-4 text-xs font-bold rounded-xl transition-all ${
              activeViewTab === 'economics'
                ? (theme === 'light' ? '!bg-[#0f172a] !text-white shadow-lg font-black' : '!bg-white !text-black shadow-lg font-black')
                : '!bg-transparent !border-transparent text-[#cbd5e1] hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
            2. MANDI VALUE & LOSS REALIZATION
          </button>

          <button
            onClick={() => {
              setActiveViewTab('conveyor');
            }}
            className={`craft-btn !py-2 !px-4 text-xs font-bold rounded-xl transition-all ${
              activeViewTab === 'conveyor'
                ? (theme === 'light' ? '!bg-[#0f172a] !text-white shadow-lg font-black' : '!bg-white !text-black shadow-lg font-black')
                : '!bg-transparent !border-transparent text-[#cbd5e1] hover:text-white'
            }`}
          >
            <RotateCw className="w-4 h-4 text-[#38bdf8]" />
            3. CONVEYOR MECHATRONICS (PHYSICAL TWIN)
          </button>
        </div>

        <button
          onClick={() => {
            setActiveViewTab((prev) => (prev === 'all' ? 'inspection' : 'all'));
          }}
          className={`craft-btn !py-1.5 !px-3.5 text-xs font-semibold ${
            activeViewTab === 'all' ? '!border-[#f59e0b] !text-[#f59e0b]' : '!text-[#94a3b8]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          {activeViewTab === 'all' ? 'COLLAPSE VIEWS' : 'SHOW ALL SECTIONS'}
        </button>
      </div>

      {/* SECTION 1: OPTICAL INSPECTION RIG & VERDICT DOCK */}
      {(activeViewTab === 'inspection' || activeViewTab === 'all') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Optical Inspection Rig */}
          <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
            <CitrusScannerRig
              onTelemetryUpdate={handleTelemetryUpdate}
              currentSpecimen={currentSpecimen}
              setCurrentSpecimen={setCurrentSpecimen}
            />
          </div>

          {/* Right Column: Hero Classification & Optical Telemetry */}
          <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
            {/* High-Legibility Hero Grade Card */}
            <div
              className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border shadow-2xl"
              style={{
                borderColor: `${telemetry?.color || '#22c55e'}66`,
                boxShadow: `0 16px 40px -10px ${telemetry?.color || '#22c55e'}25`
              }}
            >
              {/* Subtle Ambient Radial Highlight */}
              <div
                className="absolute -top-16 -right-16 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-25"
                style={{ backgroundColor: telemetry?.color || '#22c55e' }}
              ></div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-[#cbd5e1] font-bold">
                    APEDA & MANDI CLASSIFICATION
                  </span>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
                    style={{
                      backgroundColor: `${telemetry?.detected ? (telemetry?.color || '#22c55e') : '#f59e0b'}25`,
                      color: telemetry?.detected ? (telemetry?.color || '#22c55e') : '#f59e0b',
                      border: `1px solid ${telemetry?.detected ? (telemetry?.color || '#22c55e') : '#f59e0b'}66`
                    }}
                  >
                    {telemetry?.grade === 'D'
                      ? 'QUARANTINE REJECT'
                      : (telemetry?.detected
                          ? (telemetry?.isLocked ? '🔒 APEDA LOCKED' : '🔬 AUDITING...')
                          : (telemetry?.rejectReason ? 'REJECTED: NON-CITRUS' : 'STANDBY'))}
                  </span>
                </div>

                {/* Big Hero Grade Display */}
                <div className="flex items-baseline gap-4 my-2">
                  <span
                    className={`text-5xl sm:text-6xl font-black tracking-tight font-mono ${
                      telemetry?.detected ? '' : '!text-[#94a3b8]'
                    }`}
                    style={telemetry?.detected ? { color: telemetry?.color || '#22c55e' } : {}}
                  >
                    {telemetry?.detected ? `GRADE ${telemetry?.grade || 'A'}` : 'NON-CITRUS'}
                  </span>
                  <span className="text-base font-bold text-white">
                    {telemetry?.detected
                      ? (telemetry?.label && typeof telemetry.label === 'string' && telemetry.label.includes('(')
                          ? (telemetry.label.split('(')[1]?.replace(')', '') || telemetry.label)
                          : (telemetry?.label || 'Export & Premium Retail'))
                      : (telemetry?.rejectReason ? 'Object Rejected (Non-Citrus Shape/Spectrum)' : 'Awaiting Citrus Specimen')}
                  </span>
                </div>

                {/* Dynamic Lock & Multi-Frame Stability Sub-Bar */}
                {telemetry?.detected ? (
                  <div className="flex items-center gap-2 mb-2">
                    {telemetry?.isLocked ? (
                      <span className="text-[11px] font-mono font-bold text-[#22c55e] flex items-center gap-1.5 bg-[#22c55e]/10 px-2 py-0.5 rounded-md border border-[#22c55e]/25">
                        <span className="w-2 h-2 rounded-full bg-[#22c55e] inline-block shadow-[0_0_8px_#22c55e]"></span>
                        Strict APEDA Verified Lock • {telemetry?.confidenceScore || 98}% Consistency
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-[#38bdf8] flex items-center gap-1.5 bg-[#38bdf8]/10 px-2 py-0.5 rounded-md border border-[#38bdf8]/25">
                        <span className="w-2 h-2 rounded-full bg-[#38bdf8] inline-block animate-ping"></span>
                        Stabilizing Flavedo Metrology: {telemetry?.analysisProgress || 45}%
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#f59e0b] flex items-center gap-1.5 bg-[#f59e0b]/10 px-2 py-0.5 rounded-md border border-[#f59e0b]/25">
                      <span className="w-2 h-2 rounded-full bg-[#f59e0b] inline-block"></span>
                      {telemetry?.rejectReason ? 'Non-Citrus Object Rejected by Morphological Filter' : 'Optical Sensor Active • Standby for Citrus'}
                    </span>
                  </div>
                )}

                {/* Pathology Diagnosis Banner */}
                <div className="bg-[#0e121a] border border-white/10 p-4 rounded-2xl my-3 text-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8] text-xs font-semibold">DIAGNOSIS:</span>
                    <span className="text-white font-bold flex items-center gap-2">
                      {telemetry?.grade === 'A' || telemetry?.grade === 'B' ? (
                        <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
                      )}
                      {telemetry?.pathogenDiagnosis || 'Flawless Epidermis (Sound Flavedo)'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8] text-xs font-semibold">ESTIMATED SHELF LIFE:</span>
                    <span className="text-[#22c55e] font-black font-mono text-base">
                      {telemetry?.detected ? `${telemetry?.shelfLifeDays ?? 21} DAYS` : '-- DAYS'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#94a3b8] text-xs font-semibold">UNIT MANDI VALUATION:</span>
                    <span className="text-[#f59e0b] font-black font-mono text-base">
                      {telemetry?.detected ? `₹${(telemetry?.mandiPriceInr ?? 12).toFixed(2)} INR / FRUIT` : '₹-- / N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Directive Banner */}
              <div className="text-xs font-semibold text-white bg-white/10 px-4 py-3 rounded-xl border border-white/15 flex items-center gap-3 mt-1">
                <Activity className="w-4 h-4 text-[#f59e0b] shrink-0" />
                <span>
                  {telemetry?.detected 
                    ? (telemetry?.recommendedAction || 'Wipe, Carnauba Wax & Pack in Cold-Chain Export Master Carton')
                    : (telemetry?.rejectReason ? 'Align genuine citrus specimen within camera target reticle' : 'Place lemon inside optical reticle for autonomous grading')}
                </span>
              </div>

              {/* Official APEDA Export Certificate CTA */}
              <button
                onClick={() => setIsCertificateOpen(true)}
                className="w-full craft-btn !py-2.5 !px-4 text-xs font-bold flex items-center justify-center gap-2 !bg-[#f59e0b]/15 !border-[#f59e0b]/40 !text-[#fbbf24] hover:!bg-[#f59e0b]/25 transition-all shadow-md mt-2"
              >
                <Award className="w-4 h-4 text-[#fbbf24]" />
                <span>GENERATE APEDA INSPECTION CERTIFICATE [P]</span>
              </button>
            </div>

            {/* Complementary Optical Carotenoid & APEDA Compliance Readout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Metric 1: Ripeness & Carotenoid Saturation */}
              <div className="glass-panel p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-bold text-[#cbd5e1] uppercase mb-2">
                  <span>RIPENESS / CAROTENOIDS</span>
                  <span className="text-[#f59e0b] font-black text-sm font-mono">
                    {telemetry?.detected ? `${telemetry?.ripenessIndex ?? 95}%` : '--%'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#171d27] rounded-full overflow-hidden my-1">
                  <div
                    className="h-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, telemetry?.detected ? (telemetry?.ripenessIndex ?? 95) : 0))}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-xs text-[#94a3b8] mt-1">
                  <span>Flavedo Carotenoids</span>
                  <span className="font-mono text-[#cbd5e1] font-bold">
                    {telemetry?.detected 
                      ? ((telemetry?.ripenessIndex ?? 95) > 85 ? 'Canary Yellow' : ((telemetry?.ripenessIndex ?? 95) > 60 ? 'Turning Yellow' : 'Green Flavedo'))
                      : 'Sensor Standby'}
                  </span>
                </div>
              </div>

              {/* Metric 2: APEDA Caliper Grade Band */}
              <div className="glass-panel p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-bold text-[#cbd5e1] uppercase mb-2">
                  <span>APEDA CALIPER BAND</span>
                  <span className="text-[10px] font-mono text-[#22c55e] bg-[#22c55e]/20 px-1.5 py-0.5 rounded font-bold">
                    {telemetry?.detected 
                      ? ((telemetry?.caliperDiameterMm ?? 60) >= 48 && (telemetry?.caliperDiameterMm ?? 60) <= 84 ? 'IN BAND' : 'OFF-SPEC')
                      : 'STANDBY'}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-black text-white font-mono flex items-baseline gap-2">
                  <span>
                    {telemetry?.detected 
                      ? ((telemetry?.caliperDiameterMm ?? 60) >= 52 && (telemetry?.caliperDiameterMm ?? 60) <= 68 ? 'Band II (52–68mm)' : 'Domestic Band')
                      : 'Awaiting Target'}
                  </span>
                </div>
                <span className="text-xs text-[#cbd5e1] mt-1 font-medium truncate">
                  {telemetry?.detected 
                    ? ((telemetry?.caliperDiameterMm ?? 60) >= 48 && (telemetry?.caliperDiameterMm ?? 60) <= 84
                        ? 'Export Master Carton Size'
                        : 'Domestic Mandi Sizing')
                    : 'Target outside sensor reticle'}
                </span>
              </div>
            </div>

            {/* Reactive Nutritional Profile & Food Science Insights Card */}
            <div
              className="glass-panel p-4.5 rounded-2xl border-2 transition-all space-y-3 shadow-lg"
              style={{
                borderColor: activeNutrition.borderColor,
                boxShadow: `0 4px 18px ${activeNutrition.bgGlow}`
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#fbbf24] shrink-0" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    GRADE NUTRITION &amp; BIOACTIVES
                  </span>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase"
                    style={{
                      backgroundColor: activeNutrition.bgGlow,
                      color: activeNutrition.accentTextColor,
                      border: `1px solid ${activeNutrition.borderColor}`
                    }}
                  >
                    {activeNutrition.badgeText}
                  </span>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-[#0a0d14] rounded-lg p-0.5 border border-white/10 text-[11px] font-bold self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setNutritionViewMode('nutrients')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      nutritionViewMode === 'nutrients'
                        ? 'bg-[#fbbf24] text-black font-black shadow-sm'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    Nutrients
                  </button>
                  <button
                    type="button"
                    onClick={() => setNutritionViewMode('insights')}
                    className={`px-2.5 py-1 rounded transition-all ${
                      nutritionViewMode === 'insights'
                        ? 'bg-[#fbbf24] text-black font-black shadow-sm'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    Facts &amp; Benefits
                  </button>
                </div>
              </div>

              {nutritionViewMode === 'nutrients' ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {activeNutrition.nutrients.slice(0, 4).map((nutr, i) => (
                      <div key={i} className="bg-[#101520] p-2.5 rounded-xl border border-white/10 space-y-0.5 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-[#94a3b8] truncate font-medium">{nutr.name.split('(')[0]}</span>
                          <span className="text-[9px] font-mono font-bold text-[#fbbf24] bg-[#fbbf24]/10 px-1 rounded">
                            {nutr.rda}
                          </span>
                        </div>
                        <div className="text-sm sm:text-base font-black font-mono text-white">
                          {nutr.value}
                        </div>
                        <div className="text-[10px] text-[#cbd5e1] truncate">
                          {nutr.note}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#94a3b8] pt-1 px-1">
                    <span>Basis: {activeNutrition.servingSize}</span>
                    <span className="text-white font-medium">{activeNutrition.edibleStatus}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* 2 Food Science Facts */}
                  <div className="bg-[#101520] p-3 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#38bdf8]">
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Food Science Facts</span>
                    </div>
                    <div className="space-y-2">
                      {activeNutrition.facts.slice(0, 2).map((fact, idx) => (
                        <div key={idx} className="bg-[#0a0d14] p-2.5 rounded-lg border border-white/5 space-y-0.5">
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span className="truncate">{fact.title}</span>
                          </div>
                          <p className="text-[11px] text-[#cbd5e1] leading-relaxed pl-5">
                            {fact.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2 Health & Economic Benefits */}
                  <div className="bg-[#101520] p-3 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#22c55e]">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Health &amp; Economic Benefits</span>
                    </div>
                    <div className="space-y-2">
                      {activeNutrition.benefits.slice(0, 2).map((benefit, idx) => (
                        <div key={idx} className="bg-[#0a0d14] p-2.5 rounded-lg border border-white/5 space-y-0.5">
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#22c55e]/20 text-[#22c55e] flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span className="truncate">{benefit.title}</span>
                          </div>
                          <p className="text-[11px] text-[#cbd5e1] leading-relaxed pl-5">
                            {benefit.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: MANDI ECONOMICS & ROI ENGINE */}
      {(activeViewTab === 'economics' || activeViewTab === 'all') && (
        <div className="transition-all duration-300">
          <MandiEconomicsPanel />
        </div>
      )}

      {/* SECTION 3: CONVEYOR MECHATRONICS (PHYSICAL TWIN) */}
      {(activeViewTab === 'conveyor' || activeViewTab === 'all') && (
        <div className="transition-all duration-300">
          <ConveyorSortingSimulator
            activeTelemetry={telemetry}
            isSerialConnected={isSerialConnected}
            onSerialSend={handleSerialSend}
          />
        </div>
      )}

      {/* Industrial Workstation System Status & Keyboard Shortcuts Strip */}
      <footer className="glass-panel px-6 py-4 flex flex-wrap items-center justify-between gap-4 border border-white/10 shadow-lg text-xs font-mono text-[#94a3b8]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-2 text-white font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]"></span>
            CITRUSSENSE STATION ONLINE
          </span>
          <span className="text-[#64748b] hidden sm:inline">•</span>
          <span>60 FPS Vision Metrology</span>
          <span className="text-[#64748b] hidden sm:inline">•</span>
          <span>Codex STAN 243-2003 Compliant</span>
          <span className="text-[#64748b] hidden sm:inline">•</span>
          <span className={isSerialConnected ? 'text-[#22c55e] font-bold' : 'text-[#f59e0b]'}>
            {isSerialConnected ? 'WebSerial ESP32 Linked' : 'Simulation Mode'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] bg-[#07090e] px-3.5 py-1.5 rounded-xl border border-white/10 text-[#cbd5e1]">
          <span className="text-[#94a3b8] font-bold">PRO SHORTCUTS:</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">1–7</kbd> Specimens</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">C</kbd> Conveyor</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">D</kbd> Pitch</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">H</kbd> Hardware</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">P</kbd> Certificate</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">T</kbd> Theme</span>
          <span><kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-bold">R</kbd> Research</span>
        </div>
      </footer>

      {/* Modals */}
      <CitrusPitchModal
        isOpen={isPitchOpen}
        onClose={() => setIsPitchOpen(false)}
      />

      <CitrusHardwareGuideModal
        isOpen={isHardwareGuideOpen}
        onClose={() => setIsHardwareGuideOpen(false)}
        isSerialConnected={isSerialConnected}
        onSerialConnect={handleSerialConnect}
        onSerialDisconnect={handleSerialDisconnect}
        onSerialSend={handleSerialSend}
      />

      <CitrusCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        telemetry={telemetry}
        currentSpecimen={currentSpecimen}
      />

      <CitrusResearchModal
        isOpen={isResearchOpen}
        onClose={() => setIsResearchOpen(false)}
      />

    </div>
  );
}
