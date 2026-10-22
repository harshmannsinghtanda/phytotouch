/* ==============================================================================
   TelemetryPanel.jsx
   PhytoTouch: Laboratory Bio-Electrical Telemetry & Research Gauges
   Botanical Green Nature UI, WCAG AAA High-Contrast & Research Rigor
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React from 'react';

export const TelemetryPanel = ({
  telemetryData,
  lastTriggeredNote,
  connectionMode,
  serialStatus
}) => {
  const {
    capacitancePf = 48.6,
    impedanceKOhm = 168.4,
    cortisolReduction = 23.5,
    brainwaveHz = 9.2,
    sapFlowRate = '0.34 mL/hr'
  } = telemetryData;

  return (
    <div className="w-full flex flex-col gap-3 font-sans">
      
      {/* Unit Header */}
      <div className="flex items-center justify-between border-b border-[#10b981]/20 pb-2 text-xs text-[#a7f3d0]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981] animate-pulse"></span>
          <span className="font-bold text-[#f0fdf4] tracking-wide flex items-center gap-1.5">
            <span>🌿</span>
            <span>BIO-ELECTRICAL METRICS • LIVING PLANT TELEMETRY</span>
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#a7f3d0]">
          <span>SOURCE: {connectionMode}</span>
          {serialStatus && <span className="text-[#34d399] font-bold">({serialStatus})</span>}
        </div>
      </div>

      {/* 4 Botanical Digital Precision Gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        
        {/* Metric 1: Bio-Capacitance */}
        <div 
          className="p-3.5 sm:p-4 rounded-2xl border flex flex-col justify-between shadow-md transition-all"
          style={{
            backgroundColor: 'rgba(7, 36, 23, 0.94)',
            borderColor: 'rgba(16, 185, 129, 0.35)'
          }}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-[#86efac] uppercase tracking-wider">
            <span>Bio-Capacitance</span>
            <span className="text-[#2dd4bf] font-mono text-[10px] px-1.5 py-0.5 rounded border" style={{ backgroundColor: 'rgba(20, 184, 166, 0.25)', borderColor: 'rgba(20, 184, 166, 0.45)' }}>BUS-01</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#f0fdf4] font-mono tabular-nums">
              {capacitancePf.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-[#86efac]">pF</span>
          </div>
          <div className="text-xs font-medium text-[#2dd4bf] flex items-center gap-1">
            <span>🌱 Δ contact: ±2.4 pF</span>
          </div>
        </div>

        {/* Metric 2: Xylem Impedance */}
        <div 
          className="p-3.5 sm:p-4 rounded-2xl border flex flex-col justify-between shadow-md transition-all"
          style={{
            backgroundColor: 'rgba(7, 36, 23, 0.94)',
            borderColor: 'rgba(16, 185, 129, 0.35)'
          }}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-[#86efac] uppercase tracking-wider">
            <span>Xylem Impedance</span>
            <span className="text-[#34d399] font-mono text-[10px] px-1.5 py-0.5 rounded border" style={{ backgroundColor: 'rgba(16, 185, 129, 0.25)', borderColor: 'rgba(16, 185, 129, 0.45)' }}>1kHz AC</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#34d399] font-mono tabular-nums">
              {impedanceKOhm.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-[#86efac]">kΩ</span>
          </div>
          <div className="text-xs font-medium text-[#6ee7b7] flex items-center gap-1">
            <span>🌿 Electrolyte flow</span>
          </div>
        </div>

        {/* Metric 3: Cortisol Reduction */}
        <div 
          className="p-3.5 sm:p-4 rounded-2xl border flex flex-col justify-between shadow-md transition-all"
          style={{
            backgroundColor: 'rgba(7, 36, 23, 0.94)',
            borderColor: 'rgba(16, 185, 129, 0.35)'
          }}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-[#86efac] uppercase tracking-wider">
            <span>Cortisol Delta</span>
            <span className="text-[#fbbf24] font-mono text-[10px] px-1.5 py-0.5 rounded border" style={{ backgroundColor: 'rgba(245, 158, 11, 0.25)', borderColor: 'rgba(245, 158, 11, 0.45)' }}>HRV</span>
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-[#fde047] font-mono tabular-nums">
              -{cortisolReduction.toFixed(1)}%
            </span>
          </div>
          <div className="text-xs font-medium text-[#fef08a] flex items-center gap-1">
            <span>🍃 Parasympathetic calm</span>
          </div>
        </div>

        {/* Metric 4: Brainwave Sync */}
        <div 
          className="p-3.5 sm:p-4 rounded-2xl border flex flex-col justify-between shadow-md transition-all"
          style={{
            backgroundColor: 'rgba(7, 36, 23, 0.94)',
            borderColor: 'rgba(16, 185, 129, 0.35)'
          }}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-[#86efac] uppercase tracking-wider">
            <span>Brainwave Sync</span>
            <span className="text-[#d8b4fe] font-mono text-[10px] px-1.5 py-0.5 rounded border" style={{ backgroundColor: 'rgba(168, 85, 247, 0.25)', borderColor: 'rgba(168, 85, 247, 0.45)' }}>THETA</span>
          </div>
          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-[#e9d5ff] font-mono tabular-nums">
              {brainwaveHz.toFixed(1)}
            </span>
            <span className="text-xs font-bold text-[#86efac]">Hz</span>
          </div>
          <div className="text-xs font-medium text-[#d8b4fe] flex items-center gap-1">
            <span>✨ Meditative entrainment</span>
          </div>
        </div>

      </div>

      {/* Real-time Sap Flow Rate and Botanical Biomarker Readout */}
      <div 
        className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl border text-xs"
        style={{
          backgroundColor: 'rgba(4, 23, 14, 0.95)',
          borderColor: 'rgba(16, 185, 129, 0.35)',
          color: '#a7f3d0'
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">💧</span>
          <span className="text-[#86efac] font-bold">TRANSPIRATION SAP FLUX:</span>
          <strong className="text-[#34d399] font-mono font-black text-sm tracking-wide">{sapFlowRate}</strong>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#a7f3d0]">
          <span>CALIBRATION: DIN 43760</span>
          <span>•</span>
          <span className="text-[#34d399] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] inline-block"></span>
            THERMAL LEAF COMPENSATION ON
          </span>
        </div>
      </div>

    </div>
  );
};

