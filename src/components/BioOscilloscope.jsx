import React, { useEffect, useRef, useState } from 'react';
import { Waves, BarChart2, Activity } from 'lucide-react';
import { audioEngine } from '../audio/PlantAudioEngine';

export function BioOscilloscope({ currentSpecimenName = 'Monstera Deliciosa', activePitchText = '432 Hz' }) {
  const canvasRef = useRef(null);
  const [displayMode, setDisplayMode] = useState('waveform'); // 'waveform' | 'spectrum'
  const [rmsText, setRmsText] = useState('-18.4 dBFS');
  const [peakText, setPeakText] = useState('1.84 mV pp');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let phase = 0;

    const render = () => {
      phase += 0.04;
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      // 1. Phosphor persistence decay (dark bioluminescent green-black)
      ctx.fillStyle = 'rgba(7, 14, 10, 0.32)';
      ctx.fillRect(0, 0, width, height);

      // 2. Graticule Reticle Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(71, 243, 187, 0.12)';

      const cols = 10;
      const rows = 6;
      const colWidth = width / cols;
      const rowHeight = height / rows;

      for (let i = 1; i < cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * colWidth, 0);
        ctx.lineTo(i * colWidth, height);
        ctx.stroke();
      }
      for (let j = 1; j < rows; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * rowHeight);
        ctx.lineTo(width, j * rowHeight);
        ctx.stroke();
      }

      // Center crosshairs
      ctx.strokeStyle = 'rgba(71, 243, 187, 0.28)';
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Axis ticks
      ctx.fillStyle = 'rgba(71, 243, 187, 0.45)';
      for (let x = 0; x < width; x += 16) {
        ctx.fillRect(x, midY - 2, 1, 4);
      }
      for (let y = 0; y < height; y += 16) {
        ctx.fillRect(width / 2 - 2, y, 4, 1);
      }

      // 3. Render Mode
      if (displayMode === 'waveform') {
        const rawWaveform = audioEngine.getWaveform();
        const hasAudio = rawWaveform && rawWaveform.some((v) => Math.abs(v) > 0.01);

        ctx.lineWidth = 2.2;
        ctx.strokeStyle = '#47f3bb';
        ctx.shadowColor = '#06d6a0';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        const sliceWidth = width / (rawWaveform.length || 256);

        let maxAmp = 0;
        for (let i = 0; i < (rawWaveform.length || 256); i++) {
          let v = rawWaveform[i] || 0;
          // If silent, inject gentle cellular resting potential drift
          if (!hasAudio) {
            v = Math.sin(phase + i * 0.08) * 0.05 + Math.sin(phase * 0.5 + i * 0.03) * 0.02;
          }
          if (Math.abs(v) > maxAmp) maxAmp = Math.abs(v);

          const y = midY - v * (height * 0.42);
          const x = i * sliceWidth;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Trace glow second pass for high contrast
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#c4ffec';
        ctx.stroke();

        // Calculate peak readouts
        if (hasAudio) {
          const db = Math.max(-60, 20 * Math.log10(maxAmp));
          setRmsText(`${db.toFixed(1)} dBFS`);
          setPeakText(`${(maxAmp * 3.3).toFixed(2)} mV pp`);
        } else {
          setRmsText('-42.0 dBFS');
          setPeakText('0.18 mV (Idle)');
        }
      } else {
        // FFT Frequency Spectrum Bars
        const fft = audioEngine.getFft();
        const barCount = 48;
        const barWidth = (width / barCount) - 3;
        let maxEnergy = 0;

        ctx.shadowColor = '#47f3bb';
        ctx.shadowBlur = 8;

        for (let i = 0; i < barCount; i++) {
          let dbVal = fft ? fft[i] : -100;
          // Normalized value between 0 and 1
          let norm = Math.max(0, (dbVal + 90) / 90);
          if (norm < 0.05) {
            norm = 0.03 + Math.sin(phase + i * 0.3) * 0.02;
          }
          if (norm > maxEnergy) maxEnergy = norm;

          const barHeight = norm * (height * 0.85);
          const x = i * (barWidth + 3) + 2;
          const y = height - barHeight - 4;

          // Gradient color: gold for high frequencies, emerald for roots
          const isGold = i % 4 === 0;
          ctx.fillStyle = isGold ? '#f0c04d' : '#47f3bb';
          ctx.fillRect(x, y, barWidth, barHeight);
        }
        ctx.shadowBlur = 0;

        setRmsText(`${(-60 + maxEnergy * 55).toFixed(1)} dB`);
        setPeakText(`${(maxEnergy * 2.8).toFixed(2)} mV pp`);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [displayMode]);

  return (
    <div className="bg-[#171d1a] border border-[#47f3bb]/20 rounded-xl p-4 shadow-xl flex flex-col gap-2.5 relative overflow-hidden">
      {/* Scope Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-[#47f3bb]" />
          <span className="font-['Syne'] text-base font-bold text-[#dde4de]">
            Live Bio-Acoustic Scope &amp; Spectrum
          </span>
        </div>
        
        {/* Toggle Mode: Waveform vs FFT Spectrum */}
        <div className="flex items-center gap-1.5 bg-[#09100c] p-1 rounded-lg border border-[#3b4a43]/30">
          <button
            onClick={() => setDisplayMode('waveform')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-['JetBrains_Mono'] font-bold transition-all cursor-pointer ${
              displayMode === 'waveform'
                ? 'bg-[#06d6a0] text-[#003827] shadow-[0_0_10px_rgba(6,214,160,0.4)]'
                : 'text-[#bacac1] hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>P31 WAVEFORM</span>
          </button>
          <button
            onClick={() => setDisplayMode('spectrum')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-['JetBrains_Mono'] font-bold transition-all cursor-pointer ${
              displayMode === 'spectrum'
                ? 'bg-[#06d6a0] text-[#003827] shadow-[0_0_10px_rgba(6,214,160,0.4)]'
                : 'text-[#bacac1] hover:text-white'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>64-CH FFT</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-44 bg-[#070e0a] rounded-xl overflow-hidden flex items-center justify-center border border-[#3b4a43]/40 shadow-inner">
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full h-full block"
        />

        {/* Top Left HUD Overlays */}
        <div className="absolute top-2.5 left-3 font-['JetBrains_Mono'] text-[9px] text-[#47f3bb] flex items-center gap-2 bg-[#09100c]/80 backdrop-blur-sm px-2 py-1 rounded border border-[#3b4a43]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#47f3bb] animate-ping"></span>
          <span>INPUT: {currentSpecimenName.toUpperCase()}</span>
          <span className="text-[#3b4a43]">|</span>
          <span className="text-[#f0c04d]">{displayMode === 'waveform' ? 'TIME-DOMAIN' : 'FREQ-DOMAIN'}</span>
        </div>

        {/* Top Right HUD Overlays */}
        <div className="absolute top-2.5 right-3 font-['JetBrains_Mono'] text-[9px] text-[#ffdf9d] flex items-center gap-2 bg-[#09100c]/80 backdrop-blur-sm px-2 py-1 rounded border border-[#3b4a43]/30">
          <span>RMS: {rmsText}</span>
          <span className="text-[#3b4a43]">|</span>
          <span className="text-[#64f1b4]">PEAK: {peakText}</span>
        </div>

        {/* Bottom Left Status */}
        <div className="absolute bottom-2 left-3 font-['JetBrains_Mono'] text-[9px] text-[#bacac1] bg-[#09100c]/80 px-2 py-0.5 rounded">
          <span>SAMPLING: 96 kHz • CALIBRATED 432 Hz SAPTAK</span>
        </div>

        {/* Bottom Right Pitch readout */}
        <div className="absolute bottom-2 right-3 font-['JetBrains_Mono'] text-[10px] text-[#47f3bb] font-bold bg-[#09100c]/80 px-2 py-0.5 rounded border border-[#47f3bb]/20">
          {activePitchText}
        </div>
      </div>
    </div>
  );
}
