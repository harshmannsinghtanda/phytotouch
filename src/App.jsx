/* ==============================================================================
   App.jsx
   Nirman Lab 2026: Student Engineering Initiative
   PhytoTouch: Living Plant Bio-Acoustic Synthesizer & Telemetry Workstation
   Engineered with world-class-clean-ui standards & high-contrast legibility
   ============================================================================== */

import React, { Component } from 'react';
import { PhytoClassicApp } from './components/PhytoClassicApp';
import './App.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Nirman Lab UI Caught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="p-8 max-w-md bg-[#10141f] border border-white/20 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
            <span className="text-4xl animate-bounce">🌱</span>
            <h2 className="text-lg font-black text-white">WORKSTATION RECOVERY</h2>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              The workstation encountered a temporary condition. Tapping restart will reinitialize the workstation.
            </p>
            {this.state.error?.message && (
              <pre className="text-[11px] font-mono text-[#ef4444] bg-[#000]/60 p-3 rounded-xl max-w-full overflow-x-auto text-left">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold shadow-lg mt-2 cursor-pointer transition-all active:scale-95"
            >
              RESTART WORKSTATION
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen min-h-[100dvh] flex flex-col bg-[#07090e] text-white font-sans selection:bg-amber-500/30">
        <PhytoClassicApp />
      </div>
    </ErrorBoundary>
  );
}

export default App;

