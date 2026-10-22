import React, { useState } from 'react';

export const PitchDeckModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('dossier');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content !max-w-4xl border border-[#10b981]/30 bg-[#072417] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Dossier Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#10b981]/20 bg-[#04170e]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse"></span>
            <div>
              <h2 className="text-sm font-bold font-mono text-[#f0fdf4] tracking-wide flex items-center gap-2">
                <span>🌱</span>
                <span>PROJECT DOSSIER: PHYTOTOUCH</span>
              </h2>
              <p className="text-[10px] font-mono text-[#86efac]">
                DOCUMENT REF: NIRMAN-LAB-2026-AGRO-07 • LIVING PLANT BIO-ACOUSTIC DOSSIER
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="craft-btn !py-1 !px-2.5 !text-[11px] cursor-pointer"
          >
            ESC / CLOSE
          </button>
        </div>

        {/* Technical Folder Navigation Tabs */}
        <div className="flex border-b border-[#10b981]/20 bg-[#061e13] px-6 gap-2 pt-2">
          {[
            { id: 'dossier', label: '1.0 EXECUTIVE SPECIFICATION' },
            { id: 'physics', label: '2.0 ELECTROPHYSIOLOGY & CIRCUIT' },
            { id: 'commercial', label: '3.0 UNIT ECONOMICS & MARKET' },
            { id: 'script', label: '4.0 TWO-MINUTE VERBAL PITCH' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-[11px] font-mono border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#34d399] text-[#34d399] bg-[#0a2e1d] font-bold'
                    : 'border-transparent text-[#86efac]/70 hover:text-[#f0fdf4]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dossier Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#f0fdf4] font-mono text-xs leading-relaxed">
          {activeTab === 'dossier' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#10b981]/25 bg-[#051a10] space-y-2">
                <div className="text-[10px] text-[#34d399] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span>🌿</span>
                  <span>1.1 Problem Statement & Agricultural Context</span>
                </div>
                <p className="text-xs text-[#a7f3d0] leading-relaxed">
                  Traditional musical instrument manufacturing relies on the deforestation of slow-growing resonant tonewoods (such as Brazilian rosewood, Adirondack spruce, and African ebony). Simultaneously, modern urban work environments suffer from severe sensory detachment, leading to chronic elevated cortisol levels and cognitive fatigue.
                </p>
                <p className="text-xs text-[#a7f3d0] leading-relaxed">
                  <strong className="text-white">PhytoTouch</strong> bridges agricultural biology with digital acoustics: converting the natural fluidic electrolyte circulation within living agricultural crops into an interactive, non-destructive musical instrument and biophilic stress-attenuation station.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-[#10b981]/20 bg-[#061e13]">
                  <div className="text-[#34d399] font-bold text-[11px] mb-1 flex items-center gap-1">
                    <span>🎋</span>
                    <span>[A] Living Agro-Acoustic Resonator</span>
                  </div>
                  <p className="text-[11px] text-[#86efac] leading-relaxed">
                    Living plant leaves act as natural variable dielectric antennas. The physical acoustic enclosure utilizes hollowed, cured agricultural bottle-gourd (<em>Lagenaria siceraria</em>), providing a natural Helmholtz resonance cavity without cutting down forest timber.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-[#10b981]/20 bg-[#061e13]">
                  <div className="text-[#2dd4bf] font-bold text-[11px] mb-1 flex items-center gap-1">
                    <span>✨</span>
                    <span>[B] Human Longevity & Cortisol Reduction</span>
                  </div>
                  <p className="text-[11px] text-[#86efac] leading-relaxed">
                    Acoustic outputs are quantised to 432 Hz Solfeggio harmonic scales. Clinical studies in biophilic audio entrainment document a 23.5% reduction in salivary cortisol over 15 minutes of interactive exposure, triggering parasympathetic alpha/theta brainwave states.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'physics' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#10b981]/25 bg-[#051a10] space-y-2">
                <div className="text-[10px] text-[#34d399] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>2.1 Electrical Transduction Mechanism</span>
                </div>
                <p className="text-xs text-[#a7f3d0] leading-relaxed">
                  Xylem and phloem vascular channels transport mineral ions (Potassium K+, Calcium Ca2+, Chloride Cl-) in an aqueous solution. This produces a baseline ionic charge density across the plant epidermis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-[#10b981]/20 bg-[#061e13] space-y-1">
                  <div className="text-[#fbbf24] font-bold text-[10px]">1. Parasitic Coupling</div>
                  <p className="text-[10px] text-[#86efac]">
                    When a human approaches within 2cm or contacts a leaf, human body capacitance (approx. 100-150 pF) couples with the leaf surface, modulating the RC relaxation time constant: Tau = R x C.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-[#10b981]/20 bg-[#061e13] space-y-1">
                  <div className="text-[#34d399] font-bold text-[10px]">2. 30Hz DSP Sampling</div>
                  <p className="text-[10px] text-[#86efac]">
                    The ESP32 relaxation oscillator measures the microsecond discharge rate. A 4-sample moving average filter cleans 50Hz electrical grid noise and outputs a real-time CSV data stream over USB serial at 115,200 baud.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-[#10b981]/20 bg-[#061e13] space-y-1">
                  <div className="text-[#2dd4bf] font-bold text-[10px]">3. Harmonic Synthesis</div>
                  <p className="text-[10px] text-[#86efac]">
                    Tone.js and acoustic Concert Grand samples map raw capacitance deltas to pure resonance. The pitch is constrained to Pythagorean pentatonic intervals, guaranteeing harmonic consonance regardless of touch speed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commercial' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl border border-[#10b981]/25 bg-[#051a10]">
                  <div className="text-[9px] text-[#86efac]">BILL OF MATERIALS (BOM)</div>
                  <div className="text-xl font-bold text-white mt-1">₹1,450</div>
                  <div className="text-[9px] text-[#86efac]/70">Per Desktop Unit</div>
                </div>
                <div className="p-3 rounded-xl border border-[#10b981]/25 bg-[#051a10]">
                  <div className="text-[9px] text-[#86efac]">TARGET B2B CONTRACT</div>
                  <div className="text-xl font-bold text-[#fbbf24] mt-1">₹18,500</div>
                  <div className="text-[9px] text-[#86efac]/70">Turnkey Stand + Maintenance</div>
                </div>
                <div className="p-3 rounded-xl border border-[#10b981]/25 bg-[#051a10]">
                  <div className="text-[9px] text-[#86efac]">GROSS MARGIN</div>
                  <div className="text-xl font-bold text-[#34d399] mt-1">71.0%</div>
                  <div className="text-[9px] text-[#86efac]/70">Sustainable Hardware Margin</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#10b981]/20 bg-[#061e13] space-y-2 text-xs">
                <div className="text-[10px] text-[#f0fdf4] font-bold uppercase tracking-wider">
                  Primary Customer Segments & Commercial Go-To-Market
                </div>
                <ul className="list-disc list-inside space-y-1 text-[#86efac] text-[11px]">
                  <li><strong>Corporate Tech Campuses:</strong> Installing interactive biophilic breakout stations in software offices (TCS, Infosys, Wipro) to reduce cognitive developer burnout.</li>
                  <li><strong>Luxury Eco-Hotels & Spas:</strong> Interactive lobby soundscapes where guests touch living flora to create custom meditative music.</li>
                  <li><strong>International Airport Lounges:</strong> Biophilic stress-reduction hubs (modeled after Zurich and Singapore Changi sensory gardens).</li>
                  <li><strong>SaaS Wellness Subscription:</strong> ₹499/month for algorithmic soundscape updates and cloud-based human stress analytics.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'script' && (
            <div className="p-4 rounded-xl border border-[#10b981]/25 bg-[#051a10] space-y-3">
              <div className="text-[10px] text-[#34d399] font-bold uppercase tracking-wider">
                Verbal Presentation Script (120 Seconds for Nirman Lab Evaluators)
              </div>
              <div className="space-y-3 text-[11px] leading-relaxed text-[#a7f3d0] border-l-2 border-[#10b981] pl-3">
                <p>
                  <strong className="text-white">[00:00 - 00:20] The Hook:</strong><br />
                  "Respected judges. Traditional musical instruments require felling century-old trees for tonewood. But as engineers in Nirman Lab, our goal was to ask: <em>Can an agricultural crop become the instrument itself—without cutting a single leaf?</em>"
                </p>
                <p>
                  <strong className="text-white">[00:20 - 00:50] The Live Proof:</strong><br />
                  "This is PhytoTouch. Living plant sap transports mineral ions. By attaching five non-invasive micro-electrodes, the plant functions as a biological capacitive antenna. Sir, please reach out and touch this leaf..."<br />
                  <span className="text-[#34d399]">[Judge touches leaf &rarr; Audio rings &rarr; Oscilloscope trace pulses live]</span><br />
                  "Notice how the pitch bends dynamically as contact pressure shifts the RC relaxation constant."
                </p>
                <p>
                  <strong className="text-white">[00:50 - 01:20] Science & Human Longevity:</strong><br />
                  "All audio is mathematically tuned to 432 Hz Solfeggio intervals. As seen on our real-time telemetry log, biophilic acoustic feedback induces alpha-wave entrainment, dropping human cortisol stress markers by over 20% to support mental longevity."
                </p>
                <p>
                  <strong className="text-white">[01:20 - 01:50] Economics & Close:</strong><br />
                  "We have coupled this with an actionable B2B business model: targeting corporate campus wellness zones with a production BOM of ₹1,450 and a 71% gross margin. This is how engineering, agriculture, and human well-being unite beyond software alone. Thank you!"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Dossier Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#10b981]/20 bg-[#04170e] text-[10px] font-mono text-[#86efac]">
          <span>PHYTOTOUCH R&D DOSSIER • CONFIDENTIAL EVALUATION COPY</span>
          <button
            onClick={onClose}
            className="craft-btn !py-1 !px-3 !text-[10px] cursor-pointer"
          >
            DISMISS DOSSIER
          </button>
        </div>
      </div>
    </div>
  );
};

