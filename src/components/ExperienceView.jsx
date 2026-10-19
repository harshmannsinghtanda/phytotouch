import React, { useState, useEffect } from 'react';
import { Activity, Waves, Sparkles, ArrowRight, Play, Volume2, ShieldCheck, Microscope, Cpu, Radio } from 'lucide-react';
import { audioEngine } from '../audio/PlantAudioEngine';

export function ExperienceView({ onLaunchSynth, onExploreKits }) {
  const [activeNote, setActiveNote] = useState({ note: 'C#4', freq: 277.18, mv: 1.76 });
  const [activeNodeId, setActiveNodeId] = useState(3);
  const [impedance, setImpedance] = useState('4.82 MΩ');
  const [voltage, setVoltage] = useState('0.72 mV');

  // Trigger Tone when user clicks leaf electrode node
  const handleNodeClick = (id, note, freq, mv) => {
    setActiveNodeId(id);
    setActiveNote({ note, freq, mv });
    audioEngine.unlock();
    audioEngine.triggerAttackRelease(note, '8n');
  };

  // Subtle telemetry variance
  useEffect(() => {
    const timer = setInterval(() => {
      setVoltage((0.68 + Math.random() * 0.12).toFixed(2) + ' mV');
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full text-[#dde4de]">
      {/* Dynamic Botanical Interactive Stage (Hero Area) */}
      <section className="relative w-full overflow-hidden bg-[#09100c] px-4 md:px-8 py-12 md:py-16">
        {/* Ambient Bio-Luminescent Backing Blur */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#47f3bb]/10 rounded-full blur-[140px]"></div>
        <div className="pointer-events-none absolute bottom-10 right-10 w-[450px] h-[350px] bg-[#f0c04d]/10 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Contextual Typography & Real-time Readouts */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#252b28] w-fit border border-[#47f3bb]/20">
              <span className="w-2 h-2 rounded-full bg-[#47f3bb] animate-pulse"></span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#47f3bb] uppercase tracking-widest font-semibold">
                Cellular Membrane Telemetry Active
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-['JetBrains_Mono'] text-xs text-[#ffdf9d] tracking-wider uppercase font-semibold">
                Flora Capacitance Engine
              </span>
              <h1 className="font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#dde4de] leading-[1.1]">
                Hear The Inner Resonance of Living Foliage.
              </h1>
            </div>

            <p className="font-['Inter'] text-sm sm:text-base text-[#bacac1] max-w-lg leading-relaxed">
              PhytoTouch bridges botanical micro-voltages and analog modular synthesis. High-impedance galvanic sensors transform touch conductance and circadian sap flow into expressive, multi-timbral acoustic soundscapes.
            </p>

            {/* CTA Action Hub */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onLaunchSynth}
                className="px-6 py-3 rounded-full bg-[#47f3bb] text-[#003827] font-['JetBrains_Mono'] text-xs font-bold hover:bg-[#54fdc4] transition-all shadow-[0_0_24px_rgba(6,214,160,0.35)] flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Waves className="w-4 h-4" />
                <span>Launch Virtual Synth</span>
              </button>
              <button
                onClick={onExploreKits}
                className="px-6 py-3 rounded-full bg-[#1b211e] hover:bg-[#252b28] text-[#ffdf9d] border border-[#f0c04d]/30 font-['JetBrains_Mono'] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Cpu className="w-4 h-4 text-[#f0c04d]" />
                <span>Explore Hardware Kits</span>
              </button>
            </div>

            {/* Realtime System Stats Ribbon */}
            <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-[#171d1a] border border-[#3b4a43]/30 mt-2">
              <div className="flex flex-col p-2.5 rounded-lg bg-[#1b211e]">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1]">IMPEDANCE</span>
                <span className="font-['JetBrains_Mono'] text-sm text-[#47f3bb] font-bold">{impedance}</span>
              </div>
              <div className="flex flex-col p-2.5 rounded-lg bg-[#1b211e]">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1]">MEMBRANE V</span>
                <span className="font-['JetBrains_Mono'] text-sm text-[#f0c04d] font-bold">{voltage}</span>
              </div>
              <div className="flex flex-col p-2.5 rounded-lg bg-[#1b211e]">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1]">FLORA TEMP</span>
                <span className="font-['JetBrains_Mono'] text-sm text-[#64f1b4] font-bold">22.4°C</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Botanical Stage + Oscilloscope Display */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative bg-[#171d1a] border border-[#47f3bb]/20 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-2xl">
              {/* Header Bar of Rack Module */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#3b4a43]/40">
                <div className="flex items-center gap-2">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#dde4de] font-semibold uppercase">
                    Channel 01: Monstera Deliciosa
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#06d6a0]/20 text-[#47f3bb] font-['JetBrains_Mono'] text-[10px] font-bold">
                    POLY-CV ENGAGED
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1]">TOUCH SENSITIVITY: 94%</span>
                  <div className="w-2 h-2 rounded-full bg-[#f0c04d] animate-ping"></div>
                </div>
              </div>

              {/* Botanical Interactive Graphic Viewport */}
              <div className="relative h-[340px] sm:h-[380px] w-full rounded-xl bg-[#09100c] overflow-hidden flex items-center justify-center border border-[#3b4a43]/30">
                {/* Circuit Grid Background */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="circ-pattern-exp" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f0c04d" strokeWidth="0.5" />
                    <circle cx="20" cy="20" r="1.5" fill="#47f3bb" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#circ-pattern-exp)" />
                </svg>

                {/* Stylized Plant Silhouette with Interactive Nodes */}
                <svg className="relative z-10 w-full h-full max-w-[460px] max-h-[360px]" viewBox="0 0 500 400" fill="none">
                  {/* Central Stem Roots & Fronds */}
                  <path d="M250 380 C240 280, 220 180, 160 110 C210 160, 245 220, 250 380 Z" fill="#003827" fillOpacity="0.6" />
                  <path d="M250 380 C255 260, 290 190, 360 120 C320 170, 270 240, 250 380 Z" fill="#00513b" fillOpacity="0.5" />
                  <path d="M250 380 C248 240, 252 140, 250 40 C254 130, 256 250, 250 380 Z" fill="#006c4f" fillOpacity="0.7" />

                  {/* Monstera Leaves */}
                  <path d="M160 110 C120 70, 60 90, 70 160 C75 210, 140 220, 190 170 C190 140, 180 120, 160 110 Z" fill="#0E1A14" stroke="#47f3bb" strokeDasharray="3 3" strokeWidth="1.5" />
                  <path d="M360 120 C410 80, 460 120, 440 180 C420 230, 350 220, 320 170 C330 140, 350 130, 360 120 Z" fill="#0E1A14" stroke="#f0c04d" strokeDasharray="3 3" strokeWidth="1.5" />
                  <path d="M250 40 C210 10, 190 60, 210 100 C230 130, 270 130, 290 90 C300 50, 280 20, 250 40 Z" fill="#0E1A14" stroke="#6ffbbe" strokeDasharray="3 3" strokeWidth="1.5" />
                  <path d="M190 230 C130 220, 110 270, 140 310 C170 340, 220 310, 220 270 Z" fill="#0E1A14" stroke="#54fdc4" strokeDasharray="3 3" strokeWidth="1.5" />

                  {/* Interactive Nodes */}
                  {/* Node 1 */}
                  <g onClick={() => handleNodeClick(1, 'F#3', 185.00, 1.24)} className="cursor-pointer group">
                    <circle cx="120" cy="150" r="15" fill="#09100c" stroke="#47f3bb" strokeWidth={activeNodeId === 1 ? 3 : 2} />
                    <circle cx="120" cy="150" r={activeNodeId === 1 ? 8 : 6} fill="#47f3bb" className="transition-all" />
                    <text x="120" y="185" fill="#dde4de" textAnchor="middle" className="font-['JetBrains_Mono'] text-[10px] tracking-widest">
                      NODE 1: F#3
                    </text>
                  </g>

                  {/* Node 2 */}
                  <g onClick={() => handleNodeClick(2, 'A3', 220.00, 0.88)} className="cursor-pointer group">
                    <circle cx="390" cy="160" r="15" fill="#09100c" stroke="#f0c04d" strokeWidth={activeNodeId === 2 ? 3 : 2} />
                    <circle cx="390" cy="160" r={activeNodeId === 2 ? 8 : 6} fill="#f0c04d" className="transition-all" />
                    <text x="390" y="195" fill="#dde4de" textAnchor="middle" className="font-['JetBrains_Mono'] text-[10px] tracking-widest">
                      NODE 2: A3
                    </text>
                  </g>

                  {/* Node 3 */}
                  <g onClick={() => handleNodeClick(3, 'C#4', 277.18, 1.76)} className="cursor-pointer group">
                    <circle cx="250" cy="70" r="15" fill="#09100c" stroke="#6ffbbe" strokeWidth={activeNodeId === 3 ? 3 : 2} />
                    <circle cx="250" cy="70" r={activeNodeId === 3 ? 8 : 6} fill="#6ffbbe" className="transition-all" />
                    <text x="250" y="42" fill="#dde4de" textAnchor="middle" className="font-['JetBrains_Mono'] text-[10px] tracking-widest">
                      NODE 3: C#4
                    </text>
                  </g>

                  {/* Node 4 */}
                  <g onClick={() => handleNodeClick(4, 'E4', 329.63, 0.45)} className="cursor-pointer group">
                    <circle cx="160" cy="270" r="15" fill="#09100c" stroke="#54fdc4" strokeWidth={activeNodeId === 4 ? 3 : 2} />
                    <circle cx="160" cy="270" r={activeNodeId === 4 ? 8 : 6} fill="#54fdc4" className="transition-all" />
                    <text x="160" y="305" fill="#dde4de" textAnchor="middle" className="font-['JetBrains_Mono'] text-[10px] tracking-widest">
                      NODE 4: E4
                    </text>
                  </g>
                </svg>

                {/* Instructions Pill */}
                <div className="absolute bottom-3 left-3 bg-[#1b211e]/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 border border-[#3b4a43]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#47f3bb]"></span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#dde4de]">
                    Click any leaf electrode to stimulate resonant pitch
                  </span>
                </div>

                {/* Active Trigger Readout Badge */}
                <div className="absolute top-3 right-3 bg-[#1b211e]/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 border border-[#47f3bb]/30">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1]">CURRENT NOTE:</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] font-bold">
                    {activeNote.note} ({activeNote.freq} Hz)
                  </span>
                </div>
              </div>

              {/* Live Waveform Oscilloscope Visualizer Box */}
              <div className="mt-3 bg-[#1b211e] p-3 rounded-xl flex flex-col gap-1 border border-[#3b4a43]/30">
                <div className="flex items-center justify-between">
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1] uppercase">
                    Biopotential Oscilloscope — Micro-Current Fluctuation
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#f0c04d] font-semibold">
                    SWEEP: 50 ms/div
                  </span>
                </div>
                <div className="relative w-full h-14 bg-[#09100c] rounded-lg overflow-hidden flex items-center px-2">
                  <svg className="w-full h-full" viewBox="0 0 600 64" preserveAspectRatio="none">
                    <path
                      d="M 0 32 Q 50 10, 100 32 T 200 32 T 300 32 T 400 32 T 500 32 T 600 32"
                      fill="none"
                      stroke="#47f3bb"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Bio-Acoustics Works: 3-Step Scientific Process */}
      <section className="w-full bg-[#0e1512] py-16 px-4 md:px-8 border-t border-[#3b4a43]/20">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="flex flex-col gap-1 max-w-xl">
              <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] uppercase tracking-widest font-semibold">
                Scientific Architecture
              </span>
              <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold text-[#dde4de]">
                How Botanical Micro-Voltages Become Expressive Sound.
              </h2>
            </div>
            <p className="font-['Inter'] text-sm text-[#bacac1] max-w-md leading-relaxed">
              Plants generate non-neural bio-electric action potentials through vascular fluid transport and stomatal transpiration. Here is how PhytoTouch digitizes this living impulse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#171d1a] border border-[#3b4a43]/40 flex flex-col gap-4 relative overflow-hidden group hover:border-[#47f3bb]/40 transition-colors">
              <span className="font-['JetBrains_Mono'] text-3xl font-extrabold text-[#47f3bb]/30 group-hover:text-[#47f3bb]/70 transition-colors">
                01
              </span>
              <div className="flex items-center gap-2">
                <Microscope className="w-5 h-5 text-[#47f3bb]" />
                <h3 className="font-['Syne'] text-lg font-bold text-[#dde4de]">Micro-Voltage Sensing</h3>
              </div>
              <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">
                Silver/silver-chloride micro-electrodes clamp gently to the leaf lamina. Differential instrumentation pre-amplifiers capture fluctuations between 50 µV and 5 mV without damaging living cellular walls.
              </p>
              <div className="mt-auto pt-2 border-t border-[#3b4a43]/30 flex items-center justify-between font-['JetBrains_Mono'] text-[10px] text-[#47f3bb]">
                <span>CMRR: &gt; 110 dB</span>
                <span>INPUT Z: 10 GΩ</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#171d1a] border border-[#3b4a43]/40 flex flex-col gap-4 relative overflow-hidden group hover:border-[#f0c04d]/40 transition-colors">
              <span className="font-['JetBrains_Mono'] text-3xl font-extrabold text-[#f0c04d]/30 group-hover:text-[#f0c04d]/70 transition-colors">
                02
              </span>
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#f0c04d]" />
                <h3 className="font-['Syne'] text-lg font-bold text-[#dde4de]">Neural Processing (ADC)</h3>
              </div>
              <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">
                A 24-bit delta-sigma converter samples ion-channel flux at 96 kHz. On-board ESP32 DSP filters mains hum (50/60Hz notch filter) and isolates authentic vegetative slow-wave potentials.
              </p>
              <div className="mt-auto pt-2 border-t border-[#3b4a43]/30 flex items-center justify-between font-['JetBrains_Mono'] text-[10px] text-[#f0c04d]">
                <span>SAMPLE: 24-BIT / 96kHz</span>
                <span>LATENCY: &lt; 1.2ms</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#171d1a] border border-[#3b4a43]/40 flex flex-col gap-4 relative overflow-hidden group hover:border-[#64f1b4]/40 transition-colors">
              <span className="font-['JetBrains_Mono'] text-3xl font-extrabold text-[#64f1b4]/30 group-hover:text-[#64f1b4]/70 transition-colors">
                03
              </span>
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-[#64f1b4]" />
                <h3 className="font-['Syne'] text-lg font-bold text-[#dde4de]">Polyphonic Synthesis</h3>
              </div>
              <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">
                Fluctuations modulate pitch, resonance filters, and harmonic overtones. Scaled to natural 432 Hz Pythagorean ratios and Indian Classical Saptak microtones, the plant generates evolving ambient acoustics.
              </p>
              <div className="mt-auto pt-2 border-t border-[#3b4a43]/30 flex items-center justify-between font-['JetBrains_Mono'] text-[10px] text-[#64f1b4]">
                <span>TUNING: 432 Hz SAPTAK</span>
                <span>OUT: MIDI &amp; 1V/OCT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Botanical Species Conductance Matrix */}
      <section className="w-full bg-[#09100c] py-16 px-4 md:px-8 border-t border-[#3b4a43]/20">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <span className="font-['JetBrains_Mono'] text-xs text-[#f0c04d] uppercase tracking-widest font-semibold">
              Flora Spectrum
            </span>
            <h2 className="font-['Syne'] text-3xl font-bold text-[#dde4de]">
              Frequency &amp; Conductance Array
            </h2>
            <p className="font-['Inter'] text-xs sm:text-sm text-[#bacac1]">
              Different botanical specimen structures produce distinct acoustic envelopes and modulation characteristics.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-['JetBrains_Mono'] text-xs">
              <thead>
                <tr className="border-b border-[#3b4a43]/50 text-[#bacac1] bg-[#171d1a]/50">
                  <th className="py-3 px-4">SPECIMEN</th>
                  <th className="py-3 px-4">CELLULAR IMPEDANCE</th>
                  <th className="py-3 px-4">CIRCADIAN DRIFT</th>
                  <th className="py-3 px-4">RECOMMENDED SCALE</th>
                  <th className="py-3 px-4">ACOUSTIC CHARACTER</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3b4a43]/20">
                <tr className="hover:bg-[#171d1a]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#47f3bb]">Monstera Deliciosa</td>
                  <td className="py-3.5 px-4 text-[#dde4de]">1.2 MΩ</td>
                  <td className="py-3.5 px-4 text-[#dde4de]">0.4 Hz</td>
                  <td className="py-3.5 px-4 text-[#ffdf9d]">Lydian 432 Hz</td>
                  <td className="py-3.5 px-4 text-[#bacac1]">Warm resonant brass, lush harmonic sub-pad</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={onLaunchSynth}
                      className="px-3 py-1 rounded-md bg-[#47f3bb]/20 hover:bg-[#47f3bb] text-[#47f3bb] hover:text-[#003827] font-bold text-[10px] transition-all cursor-pointer"
                    >
                      LOAD
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[#171d1a]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#47f3bb]">Adiantum Maidenhair</td>
                  <td className="py-3.5 px-4 text-[#dde4de]">820 kΩ</td>
                  <td className="py-3.5 px-4 text-[#dde4de]">3.2 Hz</td>
                  <td className="py-3.5 px-4 text-[#ffdf9d]">Penta Major / Zen</td>
                  <td className="py-3.5 px-4 text-[#bacac1]">Delicate bell chimes, crystalline arpeggios</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={onLaunchSynth}
                      className="px-3 py-1 rounded-md bg-[#47f3bb]/20 hover:bg-[#47f3bb] text-[#47f3bb] hover:text-[#003827] font-bold text-[10px] transition-all cursor-pointer"
                    >
                      LOAD
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[#171d1a]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#47f3bb]">Crassula Jade</td>
                  <td className="py-3.5 px-4 text-[#dde4de]">2.4 MΩ</td>
                  <td className="py-3.5 px-4 text-[#dde4de]">0.08 Hz</td>
                  <td className="py-3.5 px-4 text-[#ffdf9d]">Darbari Minor Roots</td>
                  <td className="py-3.5 px-4 text-[#bacac1]">Deep grounded sub-bass drone, slow pulse</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={onLaunchSynth}
                      className="px-3 py-1 rounded-md bg-[#47f3bb]/20 hover:bg-[#47f3bb] text-[#47f3bb] hover:text-[#003827] font-bold text-[10px] transition-all cursor-pointer"
                    >
                      LOAD
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-[#171d1a]/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#47f3bb]">Calathea Orbifolia</td>
                  <td className="py-3.5 px-4 text-[#dde4de]">1.8 MΩ</td>
                  <td className="py-3.5 px-4 text-[#dde4de]">1.4 Hz</td>
                  <td className="py-3.5 px-4 text-[#ffdf9d]">528 Hz Solfeggio</td>
                  <td className="py-3.5 px-4 text-[#bacac1]">Polymetric rhythmic pulses, responsive leaves</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={onLaunchSynth}
                      className="px-3 py-1 rounded-md bg-[#47f3bb]/20 hover:bg-[#47f3bb] text-[#47f3bb] hover:text-[#003827] font-bold text-[10px] transition-all cursor-pointer"
                    >
                      LOAD
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="w-full bg-gradient-to-t from-[#0e1512] to-[#171d1a] py-16 px-4 md:px-8 border-t border-[#3b4a43]/30 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-5">
          <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] uppercase tracking-widest font-bold">
            Interactive Flora Synthesizer
          </span>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-extrabold text-[#dde4de]">
            Ready To Experience The Living Soundscape?
          </h2>
          <p className="font-['Inter'] text-sm text-[#bacac1] max-w-xl">
            Switch directly to our full-featured Plant Synth studio to play real microtonal scales, adjust ADSR filters, and export your recordings.
          </p>
          <button
            onClick={onLaunchSynth}
            className="px-8 py-4 rounded-full bg-[#06d6a0] hover:bg-[#47f3bb] text-[#003827] font-['JetBrains_Mono'] text-sm font-extrabold transition-all shadow-[0_0_24px_rgba(6,214,160,0.4)] flex items-center gap-2 cursor-pointer active:scale-95 mt-2"
          >
            <Waves className="w-5 h-5" />
            <span>Launch Plant Synth Studio Now</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </section>
    </div>
  );
}
