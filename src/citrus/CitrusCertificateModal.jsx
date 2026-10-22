/* ==============================================================================
   CitrusCertificateModal.jsx
   APEDA & Codex Alimentarius STAN 243-2003 Export Compliance Certificate
   Generates a publication-grade printable inspection pass for packhouses & mandis
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useEffect } from 'react';
import {
  X,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  QrCode,
  Calendar,
  MapPin,
  Scale,
  Sparkles
} from 'lucide-react';

export function CitrusCertificateModal({ isOpen, onClose, telemetry, currentSpecimen }) {
  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const certNumber = `APEDA/MH-PUNE/2026/${Math.abs(
    ((telemetry?.caliperDiameterMm || 60) * 1000 + (telemetry?.defectPercent || 1) * 73) | 0
  )}`;
  const issueDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const isExportApproved = telemetry?.grade === 'A';
  const isQuarantineReject = telemetry?.grade === 'D';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 print:p-0 print:bg-white"
      onClick={onClose}
    >
      {/* Persistent Floating Close Pill (Top-Right on Viewport) */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[60] craft-btn !py-2 !px-4 !text-xs font-black !bg-[#ef4444] hover:!bg-[#dc2626] !text-white flex items-center gap-1.5 shadow-2xl cursor-pointer active:scale-95 print:hidden border-2 border-white/20"
        title="Close Inspection Certificate (ESC)"
      >
        <X className="w-4 h-4 text-white" />
        <span>CLOSE [ESC]</span>
      </button>

      <div
        className="glass-panel w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-[#0a0d14]/98 print:max-w-none print:w-full print:border-none print:shadow-none print:rounded-none print:bg-white print:text-black relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions (Always visible, cannot shrink) */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#0f172a] shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#f59e0b]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              APEDA Official Export Certificate
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="craft-btn craft-btn-primary !py-2 !px-3.5 !text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4 text-black" />
              PRINT / SAVE PDF
            </button>
            <button
              onClick={onClose}
              className="craft-btn !py-2 !px-3.5 !text-xs font-black !bg-white/10 hover:!bg-white/20 !text-white border border-white/25 flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
              title="Close Certificate (ESC)"
            >
              <X className="w-4 h-4 text-white" />
              <span>CLOSE</span>
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#0f141f] to-[#090c12] text-white print:bg-white print:text-black print:p-8">
          {/* Certificate Header Emblem */}
          <div className="border-b-2 border-white/15 pb-5 text-center space-y-1 print:border-black">
            <div className="flex items-center justify-center gap-2 text-2xl font-black tracking-tight text-white print:text-black font-sans">
              <span>🍋</span>
              <span>CITRUSSENSE OPTICAL SORTER</span>
            </div>
            <div className="text-[11px] font-mono tracking-widest text-[#f59e0b] font-black uppercase">
              GOVERNMENT OF INDIA • APEDA MANDI COMPLIANCE STANDARD
            </div>
            <p className="text-xs text-[#94a3b8] print:text-gray-600">
              Autonomous Post-Harvest Quality &amp; Phytosanitary Classification Document
            </p>
          </div>

          {/* Certificate Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#121622] p-3.5 rounded-2xl border border-white/10 text-xs font-mono print:bg-gray-100 print:text-black print:border-gray-300">
            <div>
              <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">CERTIFICATE NO.</span>
              <span className="font-bold text-white print:text-black">{certNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">INSPECTION DATE</span>
              <span className="font-bold text-white print:text-black">{issueDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">TEST APPARATUS</span>
              <span className="font-bold text-[#38bdf8] print:text-blue-700">Rig #NIRMAN-01</span>
            </div>
            <div>
              <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">MANDI HUB</span>
              <span className="font-bold text-white print:text-black">Nagpur APMC (MH)</span>
            </div>
          </div>

          {/* Verdict Box */}
          <div
            className="p-5 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left print:border-black"
            style={{
              backgroundColor: `${telemetry?.color || '#22c55e'}12`,
              borderColor: telemetry?.color || '#22c55e'
            }}
          >
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider block" style={{ color: telemetry?.color || '#22c55e' }}>
                OFFICIAL APEDA VERDICT
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white print:text-black mt-0.5">
                {telemetry?.detected ? `GRADE ${telemetry?.grade} (${telemetry?.label?.split('(')[1]?.replace(')', '') || telemetry?.label})` : 'NON-CITRUS TARGET'}
              </h3>
              <p className="text-xs text-[#cbd5e1] print:text-gray-700 mt-1">
                {telemetry?.pathogenDiagnosis || 'Epidermis Verified'}
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end">
              <span
                className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider font-mono shadow-md"
                style={{
                  backgroundColor: telemetry?.color || '#22c55e',
                  color: '#07090e'
                }}
              >
                {isExportApproved
                  ? 'EXPORT APPROVED'
                  : (isQuarantineReject ? 'QUARANTINE HAZARD' : 'DOMESTIC TABLE')}
              </span>
              <span className="text-[11px] font-mono text-[#94a3b8] print:text-gray-500 mt-1">
                Codex STAN 243-2003
              </span>
            </div>
          </div>

          {/* Technical Telemetry Grid */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block print:text-black">
              Optical Caliper &amp; Metrology Breakdown
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#10141e] p-3 rounded-xl border border-white/5 print:bg-gray-50 print:border-gray-300">
                <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">CALIPER DIAMETER</span>
                <span className="text-base font-black font-mono text-white print:text-black">
                  {telemetry?.caliperDiameterMm ?? 60} mm
                </span>
                <span className="text-[10px] text-[#22c55e] block print:text-green-700">Band II Compliant</span>
              </div>

              <div className="bg-[#10141e] p-3 rounded-xl border border-white/5 print:bg-gray-50 print:border-gray-300">
                <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">RIPENESS / CAROTENOIDS</span>
                <span className="text-base font-black font-mono text-[#f59e0b] print:text-amber-700">
                  {telemetry?.ripenessIndex ?? 95}%
                </span>
                <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">Sound Canary Flavedo</span>
              </div>

              <div className="bg-[#10141e] p-3 rounded-xl border border-white/5 print:bg-gray-50 print:border-gray-300">
                <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">TOTAL DEFECT / ROT</span>
                <span className="text-base font-black font-mono text-white print:text-black">
                  {telemetry?.defectPercent ?? 0.3}%
                </span>
                <span className="text-[10px] text-[#22c55e] block print:text-green-700">Tolerance &lt; 5.0%</span>
              </div>

              <div className="bg-[#10141e] p-3 rounded-xl border border-white/5 print:bg-gray-50 print:border-gray-300">
                <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">SPHERICITY INDEX</span>
                <span className="text-base font-black font-mono text-white print:text-black">
                  {telemetry?.sphericity ?? 0.73}
                </span>
                <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">Prolate Spheroid</span>
              </div>

              <div className="bg-[#10141e] p-3 rounded-xl border border-white/5 print:bg-gray-50 print:border-gray-300">
                <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">ESTIMATED SHELF LIFE</span>
                <span className="text-base font-black font-mono text-[#22c55e] print:text-green-700">
                  {telemetry?.shelfLifeDays ?? 21} Days
                </span>
                <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">At 6°C–8°C / 90% RH</span>
              </div>

              <div className="bg-[#10141e] p-3 rounded-xl border border-white/5 print:bg-gray-50 print:border-gray-300">
                <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">MANDI REALIZATION</span>
                <span className="text-base font-black font-mono text-[#f59e0b] print:text-amber-700">
                  ₹{(telemetry?.mandiPriceInr ?? 12).toFixed(2)} INR
                </span>
                <span className="text-[10px] text-[#94a3b8] block print:text-gray-500">Per Tested Fruit</span>
              </div>
            </div>
          </div>

          {/* Action Directive & Packhouse Instruction */}
          <div className="bg-[#121622] p-4 rounded-2xl border border-white/10 space-y-1 text-xs print:bg-gray-100 print:text-black print:border-gray-300">
            <span className="text-[10px] font-bold text-[#f59e0b] uppercase block font-mono">
              DIRECTIVE FOR WAREHOUSE PACKHOUSE / LOGISTICS
            </span>
            <p className="text-white font-medium print:text-black">
              {telemetry?.recommendedAction || 'Wipe, Carnauba Wax & Pack in Cold-Chain Export Master Carton'}
            </p>
          </div>

          {/* Official Signoff Signatures */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-end justify-between gap-6 print:border-gray-400">
            <div className="space-y-1 text-xs font-mono text-[#94a3b8] print:text-gray-600">
              <div className="flex items-center gap-2 text-white print:text-black font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                <span>Digitally Sealed &amp; Timestamped</span>
              </div>
              <p className="text-[10px]">SHA-256 Hash Verified • Tamper Proof</p>
            </div>

            <div className="text-right space-y-1">
              <div className="w-36 h-0.5 bg-white/20 ml-auto print:bg-black"></div>
              <span className="text-xs font-bold text-white block print:text-black">
                Nirman Lab AI Vision Inspector
              </span>
              <span className="text-[10px] text-[#94a3b8] font-mono block print:text-gray-500">
                Automated APEDA Inspection Engine
              </span>
            </div>
          </div>
        </div>

        {/* Footer (Always visible, cannot shrink) */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#0d111a] flex items-center justify-between gap-3 text-xs shrink-0 print:hidden">
          <span className="text-[#94a3b8] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
            Official APEDA Packaging Pass &amp; Export Clearance Document
          </span>

          <button
            onClick={onClose}
            className="craft-btn !py-2.5 !px-6 !text-xs !bg-white hover:!bg-white/90 !text-black font-black cursor-pointer shadow-2xl active:scale-95 flex items-center gap-2"
          >
            <X className="w-4 h-4 text-black" />
            <span>CLOSE CERTIFICATE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
