import React, { Component, useState } from 'react';
import { Header } from './components/Header';
import { ExperienceView } from './components/ExperienceView';
import { PlantSynthView } from './components/PlantSynthView';
import { HardwareKitsView } from './components/HardwareKitsView';
import { SonicGardenView } from './components/SonicGardenView';
import { SerialConnectModal } from './components/SerialConnectModal';
import { FirmwareModal } from './components/FirmwareModal';
import { ResearchModal } from './components/ResearchModal';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PhytoTouch Studio Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0e1512] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="p-8 max-w-md bg-[#171d1a] border border-[#47f3bb]/30 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <span className="text-4xl animate-bounce">🌿</span>
            <h2 className="text-lg font-black text-white font-['Syne']">STUDIO RECOVERY</h2>
            <p className="text-xs text-[#bacac1] leading-relaxed">
              The workstation encountered a temporary condition. Tapping reload will reinitialize the audio context and shaders.
            </p>
            {this.state.error?.message && (
              <pre className="text-[11px] font-mono text-[#ffb4ab] bg-black/60 p-3 rounded-xl max-w-full overflow-x-auto text-left">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="py-2.5 px-6 rounded-xl bg-[#06d6a0] hover:bg-[#47f3bb] text-[#003827] text-xs font-bold shadow-lg mt-2 cursor-pointer transition-all active:scale-95"
            >
              RELOAD STUDIO
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  const [activeTab, setActiveTab] = useState('plant-synth'); // default to flagship studio view or experience
  const [isSerialOpen, setIsSerialOpen] = useState(false);
  const [isFirmwareOpen, setIsFirmwareOpen] = useState(false);
  const [isResearchOpen, setIsResearchOpen] = useState(false);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#0e1512] text-[#dde4de] font-['Inter'] selection:bg-[#06d6a0] selection:text-[#003827]">
        {/* Navigation Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSerial={() => setIsSerialOpen(true)}
          onOpenFirmware={() => setIsFirmwareOpen(true)}
          onOpenResearch={() => setIsResearchOpen(true)}
        />

        {/* View Routing with top padding for fixed header */}
        <main className="w-full pt-20 flex-1 flex flex-col">
          {activeTab === 'experience' && (
            <ExperienceView
              onLaunchSynth={() => setActiveTab('plant-synth')}
              onExploreKits={() => setActiveTab('hardware-and-kits')}
            />
          )}

          {activeTab === 'plant-synth' && (
            <PlantSynthView
              onConnectHardware={() => setIsSerialOpen(true)}
            />
          )}

          {activeTab === 'hardware-and-kits' && (
            <HardwareKitsView
              onOpenFirmware={() => setIsFirmwareOpen(true)}
            />
          )}

          {activeTab === 'sonic-garden' && (
            <SonicGardenView />
          )}
        </main>

        {/* Global Footer */}
        <footer className="w-full bg-[#09100c] border-t border-[#47f3bb]/15 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="font-['Syne'] text-base font-bold text-[#dde4de]">
                PhytoTouch Modular Acoustics
              </span>
              <span className="font-['Inter'] text-xs text-[#bacac1]">
                Bio-Potential Signal Processing &amp; Botanical Micro-Voltage Synthesis. Nirman Lab 2026.
              </span>
            </div>
            <div className="flex items-center gap-4 text-center md:text-right font-['JetBrains_Mono'] text-xs text-[#bacac1] flex-wrap justify-center">
              <span>EURORACK &amp; MIDI BLE COMPLIANT</span>
              <span className="text-[#47f3bb] font-bold">SYSTEM FREQ: 432 HZ</span>
              <span>&copy; 2026 PhytoTouch Labs</span>
            </div>
          </div>
        </footer>

        {/* Modals */}
        <SerialConnectModal
          isOpen={isSerialOpen}
          onClose={() => setIsSerialOpen(false)}
        />

        <FirmwareModal
          isOpen={isFirmwareOpen}
          onClose={() => setIsFirmwareOpen(false)}
        />

        <ResearchModal
          isOpen={isResearchOpen}
          onClose={() => setIsResearchOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
