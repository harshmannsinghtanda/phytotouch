/* ==============================================================================
   CitrusResearchModal.jsx
   5 Core Peer-Reviewed Academic Research Papers Grounding CitrusSense
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  X,
  ExternalLink,
  Award,
  Sparkles,
  CheckCircle2,
  Cpu,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  FlaskConical,
  Filter
} from 'lucide-react';
import { CITRUS_RESEARCH_PAPERS } from './CitrusResearchData';

export function CitrusResearchModal({ isOpen, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const filteredPapers = selectedCategory === 'all'
    ? CITRUS_RESEARCH_PAPERS
    : CITRUS_RESEARCH_PAPERS.filter((p) => p.category === selectedCategory);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      {/* Persistent Floating Close Pill (Top-Right on Viewport) */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[60] craft-btn !py-2 !px-4 !text-xs font-black !bg-[#ef4444] hover:!bg-[#dc2626] !text-white flex items-center gap-1.5 shadow-2xl cursor-pointer active:scale-95 border-2 border-white/20"
        title="Close Research Papers (ESC)"
      >
        <X className="w-4 h-4 text-white" />
        <span>CLOSE [ESC]</span>
      </button>

      <div
        className="glass-panel w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-[#0a0d14]/98 text-white relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (shrink-0) */}
        <div className="p-4 sm:p-5 px-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#0f172a] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#818cf8]/15 border border-[#818cf8]/30 flex items-center justify-center text-[#818cf8] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white font-sans">
                  5 CORE SCIENTIFIC RESEARCH PAPERS
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#818cf8]/20 text-[#a5b4fc] border border-[#818cf8]/40">
                  PEER-REVIEWED CITATIONS
                </span>
              </div>
              <p className="text-xs text-[#94a3b8] font-sans mt-0.5">
                The academic and empirical research foundations that shaped CitrusSense algorithms, optics &amp; hardware
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="craft-btn !py-2 !px-3.5 !text-xs font-black !bg-white/10 hover:!bg-white/20 !text-white border border-white/25 flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 shrink-0"
            title="Close Research Modal (ESC)"
          >
            <X className="w-4 h-4 text-white" />
            <span>CLOSE</span>
          </button>
        </div>

        {/* Category Filter Bar (shrink-0) */}
        <div className="shrink-0 flex items-center gap-2 p-3 px-6 border-b border-white/10 bg-[#0c1017] overflow-x-auto scrollbar-thin text-xs">
          <span className="text-[#94a3b8] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#38bdf8]" />
            DOMAIN:
          </span>
          {[
            { id: 'all', label: 'All 5 Papers' },
            { id: 'pathology', label: 'Fungal Pathology' },
            { id: 'cv', label: 'Computer Vision & Optics' },
            { id: 'economics', label: 'Mandi Supply Chain' },
            { id: 'mechatronics', label: 'Conveyor Mechatronics' },
            { id: 'nutrition', label: 'Biochemical Nutrition' }
          ].map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#818cf8] text-black shadow-md font-black'
                    : 'bg-white/5 text-[#94a3b8] hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Scrollable Content (flex-1 overflow-y-auto) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {filteredPapers.map((paper, idx) => (
            <div
              key={paper.id}
              className="bg-[#0f1420] border border-white/15 rounded-2xl p-5 hover:border-white/30 transition-all shadow-lg space-y-4"
            >
              {/* Paper Header Strip */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase"
                      style={{
                        backgroundColor: `${paper.categoryColor}20`,
                        color: paper.categoryColor,
                        border: `1px solid ${paper.categoryColor}50`
                      }}
                    >
                      {paper.categoryLabel}
                    </span>
                    <span className="text-[10px] font-mono text-[#94a3b8] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                      {paper.year}
                    </span>
                    <span className="text-[10px] font-mono text-[#f59e0b] font-bold px-2 py-0.5 rounded-md bg-[#f59e0b]/15 border border-[#f59e0b]/30">
                      {paper.impactFactor}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {paper.title}
                  </h3>

                  <p className="text-xs text-[#94a3b8]">
                    <strong className="text-[#cbd5e1]">{paper.authors}</strong> &bull;{' '}
                    <span className="italic text-[#38bdf8]">{paper.journal}</span> ({paper.volume})
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="craft-btn !py-1.5 !px-3 !text-xs font-bold !bg-white/10 hover:!bg-white/20 !text-white border border-white/20 flex items-center gap-1.5 transition-all"
                  >
                    <span>DOI: {paper.doi}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#38bdf8]" />
                  </a>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#0a0d14] p-3 rounded-xl border border-white/10 text-xs text-[#cbd5e1] leading-relaxed">
                <span className="font-bold text-white block mb-0.5">Abstract Finding:</span>
                {paper.summary}
              </div>

              {/* Key Points That Helped Us (Highlight Box) */}
              <div className="bg-gradient-to-r from-[#172033] to-[#111726] p-4 rounded-xl border border-[#38bdf8]/30 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#38bdf8] uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-[#fbbf24]" />
                  <span>How This Paper Directly Shaped CitrusSense</span>
                </div>

                <ul className="space-y-2 pl-1">
                  {paper.keyPointsHelpedUs.map((pt, pIdx) => {
                    const [head, ...rest] = pt.split(': ');
                    return (
                      <li key={pIdx} className="text-xs sm:text-[13px] text-[#cbd5e1] leading-relaxed flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white font-bold">{head}:</strong> {rest.join(': ')}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer (shrink-0) */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#0d111a] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-[#94a3b8]">
            <Award className="w-4 h-4 text-[#fbbf24]" />
            <span>Nirman Lab 2026 &bull; Empirical Scientific Foundation</span>
          </div>

          <button
            onClick={onClose}
            className="craft-btn !py-2.5 !px-6 !text-xs !bg-white hover:!bg-white/90 !text-black font-black cursor-pointer shadow-2xl active:scale-95 flex items-center gap-2"
          >
            <X className="w-4 h-4 text-black" />
            <span>CLOSE RESEARCH PAPERS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
