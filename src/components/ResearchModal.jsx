import React from 'react';
import { X, BookOpen, ExternalLink, Award, Globe, Leaf } from 'lucide-react';

export function ResearchModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#171d1a] border border-[#47f3bb]/30 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col font-['Inter'] text-[#dde4de]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#3b4a43]/40 flex items-center justify-between bg-[#1b211e]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#47f3bb]" />
            <h3 className="font-['Syne'] text-base font-bold text-[#dde4de]">
              Nirman Lab Research &amp; UN SDG Alignment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#bacac1] hover:text-white hover:bg-[#252b28] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto text-xs leading-relaxed">
          <div className="flex flex-col gap-2">
            <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] font-bold uppercase tracking-wider">
              Student Engineering Initiative 2026
            </span>
            <h4 className="font-['Syne'] text-lg font-bold text-white">
              PhytoTouch: Living Plant Bio-Acoustic Synthesizer
            </h4>
            <p className="text-[#bacac1]">
              PhytoTouch investigates non-invasive botanical bio-potential monitoring as both a real-time ecological health diagnostic tool and an artistic auditory transducer. By translating fluid and ion movement across cellular membranes into micro-volt signals, PhytoTouch allows users to sonify plant physiological responses to touch, light, soil moisture, and atmospheric changes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-[#1b211e] border border-[#3b4a43]/30 flex flex-col gap-2">
              <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] font-bold">SDG 4</span>
              <h5 className="font-['Syne'] text-sm font-bold text-white">Quality Education</h5>
              <p className="text-[11px] text-[#bacac1]">
                Empowering students to explore interdisciplinary biotechnology, embedded systems, and acoustic physics.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1b211e] border border-[#3b4a43]/30 flex flex-col gap-2">
              <span className="font-['JetBrains_Mono'] text-xs text-[#f0c04d] font-bold">SDG 9</span>
              <h5 className="font-['Syne'] text-sm font-bold text-white">Industry &amp; Innovation</h5>
              <p className="text-[11px] text-[#bacac1]">
                Pioneering low-cost, open-source differential instrumentation amplifiers and browser Web Serial telemetry.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1b211e] border border-[#3b4a43]/30 flex flex-col gap-2">
              <span className="font-['JetBrains_Mono'] text-xs text-[#64f1b4] font-bold">SDG 15</span>
              <h5 className="font-['Syne'] text-sm font-bold text-white">Life on Land</h5>
              <p className="text-[11px] text-[#bacac1]">
                Promoting botanical awareness, biophilic architecture, and cellular flora conservation.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#09100c] border border-[#3b4a43]/30 flex flex-col gap-2 font-['JetBrains_Mono'] text-[11px]">
            <span className="text-[#f0c04d] font-bold uppercase">Scientific Literature Foundation:</span>
            <p className="text-[#bacac1]">
              1. Bose, J. C. (1926). <em>The Nervous Mechanism of Plants</em>. Longmans, Green &amp; Co.<br />
              2. Volkov, A. G. (2012). <em>Plant Electrophysiology: Signaling and Responses</em>. Springer Science.<br />
              3. Fromm, J., &amp; Lautner, S. (2007). Electrical signals and their physiological significance in plants. <em>Plant, Cell &amp; Environment</em>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
