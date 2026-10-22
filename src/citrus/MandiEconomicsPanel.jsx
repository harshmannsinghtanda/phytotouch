/* ==============================================================================
   MandiEconomicsPanel.jsx
   Clean Agro-Economic Business Model & Post-Harvest Loss Engine
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState } from 'react';
import { DollarSign, ShieldAlert, Leaf, CheckCircle, TrendingUp } from 'lucide-react';

export function MandiEconomicsPanel() {
  const [dailyHarvestKg, setDailyHarvestKg] = useState(3000);

  const totalLemons = dailyHarvestKg * 10;

  // Scenario A: Distress Sale
  const unsortedMandiRatePerKg = 4.5;
  const unsortedGrossRevenue = dailyHarvestKg * unsortedMandiRatePerKg;
  const unsortedRotLossKg = dailyHarvestKg * 0.28;

  // Scenario B: CitrusSense Automated Sorting
  const gradeAKg = dailyHarvestKg * 0.40;
  const gradeARevenue = gradeAKg * 10 * 12.0;

  const gradeBKg = dailyHarvestKg * 0.38;
  const gradeBRevenue = gradeBKg * 10 * 6.0;

  const gradeCKg = dailyHarvestKg * 0.16;
  const gradeCRevenue = gradeCKg * 10 * 2.5;

  const gradeDKg = dailyHarvestKg * 0.06;
  const gradeDRevenue = gradeDKg * 10 * 0.3;

  const gradedTotalRevenue = gradeARevenue + gradeBRevenue + gradeCRevenue + gradeDRevenue;
  const netFarmerUplift = gradedTotalRevenue - unsortedGrossRevenue;
  const upliftPercentage = ((netFarmerUplift / unsortedGrossRevenue) * 100).toFixed(0);

  const methaneAvoidedKg = (gradeDKg * 0.14).toFixed(1);
  const co2EquivalentAvoidedKg = (methaneAvoidedKg * 28).toFixed(1);

  return (
    <div className="glass-panel p-6 flex flex-col gap-5">
      {/* Header with Slider */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e]"></span>
          <div>
            <h3 className="text-xs font-extrabold font-mono text-white tracking-wider">
              AGRO-ECONOMIC MANDI BUSINESS MODEL & REVENUE REALIZATION
            </h3>
            <p className="text-[10px] font-mono text-[#848f9d]">
              INTERDISCIPLINARY POST-HARVEST VALORIZATION FOR FARMER COOPERATIVES
            </p>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-3 bg-[#0a0c10] border border-white/10 px-3.5 py-1.5 rounded-xl">
          <span className="text-[10px] font-mono text-[#848f9d] uppercase">HARVEST BATCH:</span>
          <input
            type="range"
            min="500"
            max="10000"
            step="500"
            value={dailyHarvestKg}
            onChange={(e) => setDailyHarvestKg(Number(e.target.value))}
            className="w-28 accent-[#f59e0b] cursor-pointer"
          />
          <span className="text-xs font-bold font-mono text-[#f59e0b]">
            {dailyHarvestKg.toLocaleString()} KG
          </span>
        </div>
      </div>

      {/* National Macro Paradox Banner */}
      <div className="bg-[#101622] border-l-4 border-l-[#f59e0b] border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5 flex-1 min-w-[280px]">
          <span className="text-3xl shrink-0">🇮🇳</span>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider font-sans flex items-center gap-2">
              THE NATIONAL CITRUS EXPORT PARADOX
              <span className="text-[10px] text-[#22c55e] bg-[#22c55e]/20 px-2 py-0.5 rounded-full font-mono font-bold">
                #1 IN PRODUCTION
              </span>
            </h4>
            <p className="text-xs text-[#cbd5e1] mt-1 leading-relaxed">
              <strong>India is the world's #1 producer of lemons and limes (~3.7 Million Metric Tonnes/year)</strong>, accounting for ~17% of the global supply. Yet Indian farmers capture <strong>less than 2% of the global export market</strong> due to 28% transit spoilage and lack of automated farm-gate grading. CitrusSense bridges this billion-dollar gap.
            </p>
          </div>
        </div>
        <div className="bg-[#0b0e14] px-4 py-2 rounded-xl border border-white/10 text-center shrink-0">
          <div className="text-[10px] font-bold text-[#94a3b8] uppercase font-mono">ANNUAL HARVEST</div>
          <div className="text-base font-black text-[#f59e0b] font-mono">3.7M MT</div>
          <div className="text-[10px] text-[#ef4444] font-semibold mt-0.5">&lt; 2% EXPORT SHARE</div>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Traditional Bulk Distress Sale */}
        <div className="bg-[#0f1217] border border-[#ef4444]/25 rounded-xl p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-[#ef4444] bg-[#ef4444]/15 px-2.5 py-0.5 rounded-full">
                STATUS QUO: UNGRADED DISTRESS DUMP
              </span>
              <ShieldAlert className="w-4 h-4 text-[#ef4444]" />
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
              Farmers dump unsorted lemons to middlemen at flat distress rates. Unnoticed mold rots entire crates during 48-hr transit.
            </p>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#64748b]">Mandi Distress Price:</span>
                <span className="text-white font-bold">₹{unsortedMandiRatePerKg.toFixed(2)} / kg</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#64748b]">Transit Rot Loss (28%):</span>
                <span className="text-[#ef4444] font-bold">-{unsortedRotLossKg.toFixed(0)} kg dumped</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-[#64748b]">Grade A Export Capture:</span>
                <span className="text-[#ef4444] font-bold">0% (Lost margin)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/5">
            <span className="text-[10px] font-mono text-[#64748b] uppercase block">TOTAL DISTRESS REALIZATION</span>
            <span className="text-2xl font-black font-mono text-[#ef4444]">
              ₹{unsortedGrossRevenue.toLocaleString()} INR
            </span>
          </div>
        </div>

        {/* Card 2: CitrusSense Optical Precision Sorter */}
        <div className="bg-[#0f1217] border border-[#22c55e]/40 rounded-xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-[#22c55e] to-[#16a34a] text-black text-[9px] font-black font-mono px-3.5 py-1 rounded-bl-lg shadow-md">
            +{upliftPercentage}% SURPLUS
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold text-[#22c55e] bg-[#22c55e]/15 px-2.5 py-0.5 rounded-full">
                CITRUSSENSE AI OPTICAL GRADING
              </span>
              <CheckCircle className="w-4 h-4 text-[#22c55e]" />
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
              4-tier optical sorting captures premium export prices, routes cosmetic scuffs to juice extractors, and isolates rot.
            </p>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between py-0.5">
                <span className="text-[#22c55e]">Grade A Export (40%):</span>
                <span className="text-white font-bold">₹{gradeARevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#f59e0b]">Grade B Retail (38%):</span>
                <span className="text-white font-bold">₹{gradeBRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#38bdf8]">Grade C Juicing (16%):</span>
                <span className="text-white font-bold">₹{gradeCRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#ef4444]">Grade D Bio-Compost (6%):</span>
                <span className="text-white font-bold">₹{gradeDRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#22c55e] uppercase block font-bold">TOTAL NET REALIZATION</span>
              <span className="text-2xl font-black font-mono text-[#22c55e]">
                ₹{gradedTotalRevenue.toLocaleString()} INR
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#848f9d] uppercase block">DAILY NET GAIN</span>
              <span className="text-base font-bold font-mono text-[#f59e0b]">
                +₹{netFarmerUplift.toLocaleString()} INR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Insets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="bg-[#0b0d11] border border-white/5 p-4 rounded-xl font-mono">
          <div className="flex items-center gap-2 text-[#f59e0b] mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-[11px] font-bold">ZERO-CAPEX SOFTWARE ROI</span>
          </div>
          <div className="text-xl font-black text-white">Instant / Day 1</div>
          <p className="text-[10px] text-[#64748b] mt-1">
            100% in-browser on phone/webcam. Daily farmer surplus is +₹{netFarmerUplift.toLocaleString()} with zero hardware costs.
          </p>
        </div>

        <div className="bg-[#0b0d11] border border-white/5 p-4 rounded-xl font-mono">
          <div className="flex items-center gap-2 text-[#38bdf8] mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[11px] font-bold">ETHYLENE CROSS-SPOILAGE</span>
          </div>
          <div className="text-xl font-black text-white">{(totalLemons * 0.28).toLocaleString()} Fruits</div>
          <p className="text-[10px] text-[#64748b] mt-1">
            Removing 1 rotting lemon in a 20kg box prevents autocatalytic ethylene senescence of adjacent fruit.
          </p>
        </div>

        <div className="bg-[#0b0d11] border border-white/5 p-4 rounded-xl font-mono">
          <div className="flex items-center gap-2 text-[#22c55e] mb-1">
            <Leaf className="w-4 h-4" />
            <span className="text-[11px] font-bold">ESG CARBON OFFSET</span>
          </div>
          <div className="text-xl font-black text-white">{co2EquivalentAvoidedKg} kg CO₂e</div>
          <p className="text-[10px] text-[#64748b] mt-1">
            Diverting cull lemons to anaerobic digesters instead of open landfills eliminates potent methane emissions.
          </p>
        </div>
      </div>
    </div>
  );
}
