import React from 'react';
import { Radio, Activity, Cpu, BookOpen, Usb, Music, Sparkles } from 'lucide-react';

export function Header({
  activeTab,
  setActiveTab,
  onOpenSerial,
  onOpenFirmware,
  onOpenResearch,
  sensorOnline = true,
  sensorVoltage = '0.84 mV',
  tuning = '432 Hz Earth / Lydian'
}) {
  const navItems = [
    { id: 'experience', label: 'Experience' },
    { id: 'plant-synth', label: 'Plant Synth' },
    { id: 'hardware-and-kits', label: 'Hardware & Kits' },
    { id: 'sonic-garden', label: 'Sonic Garden' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09100c]/90 backdrop-blur-xl border-b border-[#47f3bb]/15 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="h-20 w-full px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <button
            onClick={() => setActiveTab('experience')}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06d6a0] to-[#10b981] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(6,214,160,0.3)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#09100c] rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🌿</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-['Syne'] text-xl font-bold tracking-tight text-[#dde4de] leading-none group-hover:text-[#47f3bb] transition-colors">
                PhytoTouch
              </span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#47f3bb] uppercase tracking-widest mt-1">
                Musical Plants / Bio-Synthesizer
              </span>
            </div>
          </button>

          {/* Navigation Pill */}
          <nav className="hidden xl:flex items-center gap-1 p-1 bg-[#171d1a] border border-[#3b4a43]/40 rounded-xl">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`font-['JetBrains_Mono'] text-xs font-semibold px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#06d6a0] text-[#003827] shadow-[0_0_12px_rgba(6,214,160,0.3)]'
                      : 'text-[#bacac1] hover:text-[#dde4de] hover:bg-[#1b211e]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Telemetry & Actions */}
        <div className="flex items-center gap-3">
          {/* Live Sensor Link */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171d1a] border border-[#47f3bb]/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#47f3bb] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#47f3bb]"></span>
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1]">Sensor Link:</span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] font-bold">{sensorVoltage}</span>
            <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1] uppercase">(Online)</span>
          </div>

          {/* Harmonic Readout */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171d1a] border border-[#f0c04d]/20">
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#f0c04d] uppercase tracking-wider">Harmonic</span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#dde4de] font-semibold">{tuning}</span>
          </div>

          {/* Connect Hardware (Serial) */}
          <button
            onClick={onOpenSerial}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1b211e] border border-[#47f3bb]/40 hover:border-[#47f3bb] text-[#47f3bb] hover:bg-[#47f3bb] hover:text-[#003827] transition-all shadow-[0_0_12px_rgba(6,214,160,0.15)] cursor-pointer text-xs font-['JetBrains_Mono'] font-bold uppercase tracking-wider"
            title="Connect physical ESP32 via Web Serial or test Virtual Rig Simulator"
          >
            <Usb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Connect / Simulate Rig</span>
          </button>

          {/* Firmware / Guide */}
          <button
            onClick={onOpenFirmware}
            className="p-2 rounded-full bg-[#171d1a] hover:bg-[#252b28] text-[#bacac1] hover:text-white transition-colors cursor-pointer border border-[#3b4a43]/30"
            title="ESP32 Firmware Code & Pinout Guide"
          >
            <Cpu className="w-4 h-4 text-[#f0c04d]" />
          </button>

          {/* Research / Pitch */}
          <button
            onClick={onOpenResearch}
            className="p-2 rounded-full bg-[#171d1a] hover:bg-[#252b28] text-[#bacac1] hover:text-white transition-colors cursor-pointer border border-[#3b4a43]/30"
            title="Nirman Lab Research & UN SDG Alignment"
          >
            <BookOpen className="w-4 h-4 text-[#47f3bb]" />
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="xl:hidden flex items-center justify-around bg-[#0e1512] border-t border-[#3b4a43]/30 px-2 py-1.5 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`font-['JetBrains_Mono'] text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-[#06d6a0] text-[#003827]'
                : 'text-[#bacac1] hover:text-[#dde4de]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
