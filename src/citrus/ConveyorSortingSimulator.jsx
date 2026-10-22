/* ==============================================================================
   ConveyorSortingSimulator.jsx
   Clean Industrial High-Speed Optical Sorter & Diverter Rig
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState, useEffect } from 'react';
import { Play, Pause, PlusCircle, RotateCcw, Sparkles } from 'lucide-react';

export function ConveyorSortingSimulator({
  activeTelemetry,
  isSerialConnected,
  onSerialSend
}) {
  const [isRunning, setIsRunning] = useState(true);
  const [autoFeed, setAutoFeed] = useState(true);
  const [feedRateMs, setFeedRateMs] = useState(2400);

  // Conveyor items
  const [beltItems, setBeltItems] = useState([
    { id: 1, x: 240, type: 'A', color: '#ffd60a', grade: 'A', hasScanned: true },
    { id: 2, x: 90, type: 'B', color: '#facc15', grade: 'B', hasScanned: false }
  ]);

  // Sorting Bins Counters
  const [binCounts, setBinCounts] = useState({
    A: 28,
    B: 21,
    C: 9,
    D: 4
  });

  const [gateAngle, setGateAngle] = useState(90);
  const [gateActiveGrade, setGateActiveGrade] = useState(null);

  const dropLemon = (forcedGrade = null) => {
    const grades = ['A', 'A', 'B', 'B', 'C', 'D'];
    const assignedGrade = forcedGrade || grades[Math.floor(Math.random() * grades.length)];
    let color = '#ffd60a';
    if (assignedGrade === 'A') color = '#ffd60a';
    else if (assignedGrade === 'B') color = '#facc15';
    else if (assignedGrade === 'C') color = '#eab308';
    else if (assignedGrade === 'D') color = '#78350f';

    const newItem = {
      id: Date.now() + Math.random(),
      x: 0,
      type: assignedGrade,
      color,
      grade: assignedGrade,
      hasScanned: false
    };

    setBeltItems((prev) => [...prev, newItem]);
  };

  const handleToggleRunning = () => {
    setIsRunning((prev) => !prev);
  };

  useEffect(() => {
    if (!isRunning || !autoFeed) return;
    const interval = setInterval(() => dropLemon(), feedRateMs);
    return () => clearInterval(interval);
  }, [isRunning, autoFeed, feedRateMs]);

  useEffect(() => {
    if (!isRunning) return;

    const beltSpeed = 2.4;
    const scanZoneX = 260;
    const diverterX = 460;

    const interval = setInterval(() => {
      setBeltItems((prevItems) => {
        const nextItems = [];

        for (const item of prevItems) {
          const newX = item.x + beltSpeed;

          if (!item.hasScanned && newX >= scanZoneX && newX < scanZoneX + 20) {
            item.hasScanned = true;

            let targetAngle = 90;
            if (item.grade === 'A') targetAngle = 45;
            else if (item.grade === 'B') targetAngle = 90;
            else if (item.grade === 'C') targetAngle = 135;
            else if (item.grade === 'D') targetAngle = 175;

            setGateAngle(targetAngle);
            setGateActiveGrade(item.grade);

            if (isSerialConnected && onSerialSend) {
              onSerialSend(`SORT:${item.grade}`);
            }
          }

          if (newX >= diverterX) {
            setBinCounts((counts) => ({
              ...counts,
              [item.grade]: counts[item.grade] + 1
            }));

            setTimeout(() => {
              setGateAngle(90);
              setGateActiveGrade(null);
            }, 300);

            continue;
          }

          nextItems.push({ ...item, x: newX });
        }

        return nextItems;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [isRunning, isSerialConnected, onSerialSend]);

  const totalCount = binCounts.A + binCounts.B + binCounts.C + binCounts.D;
  const totalRevenueInr = (binCounts.A * 12.0) + (binCounts.B * 6.0) + (binCounts.C * 2.5) + (binCounts.D * 0.3);
  const rejectRate = totalCount > 0 ? ((binCounts.D / totalCount) * 100).toFixed(1) : 0;
  const throughputLpm = isRunning ? Math.round((60000 / feedRateMs)) : 0;

  return (
    <div className="glass-panel p-5 flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]"></span>
          <div>
            <h3 className="text-xs font-extrabold font-mono text-white tracking-wider">
              AUTOMATED OPTICAL CONVEYOR & SERVO DIVERTER RIG
            </h3>
            <p className="text-[10px] font-mono text-[#848f9d]">
              BLDC MOTOR DRIVE • PNEUMATIC SG90/MG996R SORTING GATE ACTUATOR
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleRunning}
            className={`craft-btn !py-1.5 !px-3.5 ${
              isRunning ? 'craft-btn-primary' : 'craft-btn-success'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'PAUSE MOTOR' : 'RUN MOTOR'}
          </button>

          <button
            onClick={() => dropLemon()}
            className="craft-btn !py-1.5 !px-3"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#f59e0b]" />
            FEED LEMON
          </button>

          <button
            onClick={() => setAutoFeed((p) => !p)}
            className={`craft-btn !py-1.5 !px-3 ${
              autoFeed ? '!border-[#22c55e]/50 !text-[#22c55e]' : '!text-[#64748b]'
            }`}
          >
            AUTO-HOPPER: {autoFeed ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setBinCounts({ A: 0, B: 0, C: 0, D: 0 })}
            className="craft-btn !py-1.5 !px-2.5 text-[#64748b]"
            title="Reset Batch Counters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Futuristic Visual Conveyor Stage */}
      <div className="relative w-full h-[180px] bg-[#07080b] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between p-3">
        {/* Rail Top Indicators */}
        <div className="flex items-center justify-between px-3 text-[9px] font-mono text-[#505864] select-none">
          <span>INLET HOPPER</span>
          <span className="text-[#f59e0b] flex items-center gap-1 font-bold">
            <Sparkles className="w-3 h-3 inline" />
            OPTICAL SCAN TUNNEL
          </span>
          <span>DIVERTER ACTUATOR (OUTLET)</span>
        </div>

        {/* Conveyor Belt Track */}
        <div className="relative w-full h-[64px] bg-[#141720] border-y-2 border-[#2b3140] flex items-center overflow-hidden rounded-md shadow-inner">
          {/* Animated Tread Texture */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #64748b 0px, #64748b 6px, transparent 6px, transparent 24px)',
              animation: isRunning ? 'conveyorBeltMotion 0.6s linear infinite' : 'none'
            }}
          />

          {/* Left Motor Roller */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#1f2533] border-r border-[#3b4357] flex items-center justify-center">
            <div className={`w-4 h-4 rounded-full border-2 border-[#64748b] ${isRunning ? 'animate-spin' : ''}`}></div>
          </div>

          {/* Right Exit Roller */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-[#1f2533] border-l border-[#3b4357] flex items-center justify-center">
            <div className={`w-4 h-4 rounded-full border-2 border-[#64748b] ${isRunning ? 'animate-spin' : ''}`}></div>
          </div>

          {/* Optical Scanner Tunnel Arch */}
          <div className="absolute left-[240px] top-0 bottom-0 w-[56px] bg-[#0a0c10]/90 border-x border-[#f59e0b]/60 flex flex-col items-center justify-center shadow-lg z-10 backdrop-blur-md">
            <div className="w-1.5 h-full bg-[#f59e0b] shadow-[0_0_14px_#f59e0b] animate-pulse"></div>
            <span className="absolute -top-0.5 text-[8px] font-mono text-[#f59e0b] font-bold">SCAN</span>
          </div>

          {/* Mechanical Diverter Servo Gate */}
          <div
            className="absolute left-[445px] top-1.5 bottom-1.5 w-3 bg-[#e2e8f0] border border-[#64748b] rounded-sm transition-transform duration-200 origin-top shadow-2xl z-10"
            style={{
              transform: `rotate(${gateAngle - 90}deg)`,
              backgroundColor: gateActiveGrade ? '#f59e0b' : '#cbd5e1'
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 mx-auto mt-1"></div>
          </div>

          {/* Moving Lemons */}
          {beltItems.map((item) => (
            <div
              key={item.id}
              className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-75"
              style={{ left: `${item.x}px` }}
            >
              <div
                className="w-10 h-8 rounded-full shadow-lg flex items-center justify-center border border-black/40 relative"
                style={{
                  backgroundColor: item.color,
                  boxShadow: item.hasScanned ? '0 0 14px rgba(245, 158, 11, 0.7)' : '0 2px 6px rgba(0,0,0,0.4)'
                }}
              >
                <span className="text-[10px] font-black text-black font-mono">
                  {item.grade}
                </span>
                {item.grade === 'D' && (
                  <span className="w-2.5 h-2.5 rounded-full bg-black/70 absolute -top-1 -right-1"></span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Rail Lower Details */}
        <div className="flex items-center justify-between px-3 text-[10px] font-mono text-[#848f9d]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
            <span>THROUGHPUT: <strong className="text-white">{throughputLpm} LEMONS/MIN</strong></span>
          </div>
          <div>
            SERVO DEFLECTION: <strong className="text-[#f59e0b]">{gateAngle}°</strong>
          </div>
        </div>
      </div>

      {/* 4 Illuminated Sorting Collection Bins */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Bin 1: Export */}
        <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden !border-[#22c55e]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-[#22c55e] bg-[#22c55e]/15 px-2.5 py-0.5 rounded-full">
              BIN 01: EXPORT (A)
            </span>
            <span className="text-xl font-black font-mono text-white">{binCounts.A}</span>
          </div>
          <div className="text-[11px] font-mono text-[#848f9d]">Air-Cargo • ₹12/fruit</div>
          <div className="text-xs font-mono font-bold text-[#22c55e] mt-1.5">
            +₹{(binCounts.A * 12.0).toFixed(0)} INR
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#22c55e] shadow-[0_0_10px_#22c55e]"></div>
        </div>

        {/* Bin 2: Supermarket Retail */}
        <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden !border-[#f59e0b]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-[#f59e0b] bg-[#f59e0b]/15 px-2.5 py-0.5 rounded-full">
              BIN 02: RETAIL (B)
            </span>
            <span className="text-xl font-black font-mono text-white">{binCounts.B}</span>
          </div>
          <div className="text-[11px] font-mono text-[#848f9d]">Domestic Mandi • ₹6/fruit</div>
          <div className="text-xs font-mono font-bold text-[#f59e0b] mt-1.5">
            +₹{(binCounts.B * 6.0).toFixed(0)} INR
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]"></div>
        </div>

        {/* Bin 3: Processing Juicing */}
        <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden !border-[#38bdf8]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-[#38bdf8] bg-[#38bdf8]/15 px-2.5 py-0.5 rounded-full">
              BIN 03: JUICING (C)
            </span>
            <span className="text-xl font-black font-mono text-white">{binCounts.C}</span>
          </div>
          <div className="text-[11px] font-mono text-[#848f9d]">Cold-Press • ₹2.5/fruit</div>
          <div className="text-xs font-mono font-bold text-[#38bdf8] mt-1.5">
            +₹{(binCounts.C * 2.5).toFixed(0)} INR
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]"></div>
        </div>

        {/* Bin 4: Bio-Hazard Reject */}
        <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden !border-[#ef4444]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold text-[#ef4444] bg-[#ef4444]/15 px-2.5 py-0.5 rounded-full">
              BIN 04: BIOGAS (D)
            </span>
            <span className="text-xl font-black font-mono text-white">{binCounts.D}</span>
          </div>
          <div className="text-[11px] font-mono text-[#848f9d]">Rot Quarantined</div>
          <div className="text-xs font-mono font-bold text-[#ef4444] mt-1.5">
            {binCounts.D} SPORES ISOLATED
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#ef4444] shadow-[0_0_10px_#ef4444]"></div>
        </div>
      </div>

      {/* Batch Summary Telemetry Footer */}
      <div className="bg-[#090b0e] border border-white/5 p-3 px-4 rounded-xl flex flex-wrap items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[#64748b] text-[9px] block font-bold uppercase tracking-wider">TOTAL CITRUS PROCESSED</span>
            <span className="text-white font-extrabold text-sm">{totalCount} UNITS</span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div>
            <span className="text-[#64748b] text-[9px] block font-bold uppercase tracking-wider">BATCH REALIZATION</span>
            <span className="text-[#22c55e] font-extrabold text-sm">₹{totalRevenueInr.toFixed(1)} INR</span>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          <div>
            <span className="text-[#64748b] text-[9px] block font-bold uppercase tracking-wider">PATHOGEN EJECTION RATE</span>
            <span className="text-[#ef4444] font-extrabold text-sm">{rejectRate}%</span>
          </div>
        </div>

        <div className="text-[11px] text-[#94a3b8]">
          ETHYLENE AVOIDANCE: <span className="text-[#22c55e] font-bold">~{binCounts.D * 22} HEALTHY FRUITS SAVED</span>
        </div>
      </div>
    </div>
  );
}
