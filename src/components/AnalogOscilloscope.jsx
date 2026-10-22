/* ==============================================================================
   AnalogOscilloscope.jsx
   PhytoTouch: Dual-Mode P31 Phosphor Oscilloscope & FFT Spectrum Analyser
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useEffect, useRef, useState } from 'react';
import { audioEngine } from '../audio/PlantAudioEngine';

export const AnalogOscilloscope = ({ isPlaying, lastTriggeredNote }) => {
  const canvasRef = useRef(null);
  const [displayMode, setDisplayMode] = useState('waveform'); // 'waveform' | 'spectrum'

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. CRT Botanical Phosphor persistence decay
      ctx.fillStyle = 'rgba(2, 18, 8, 0.28)';
      ctx.fillRect(0, 0, width, height);

      // 2. Graticule Reticle Lines - Botanical Emerald
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.14)';

      const cols = 10;
      const rows = 8;
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
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
      const midX = width / 2;
      const midY = height / 2;
      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, height);
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Millimeter division ticks on axes
      ctx.fillStyle = 'rgba(52, 211, 153, 0.6)';
      for (let x = 0; x < width; x += 12) {
        ctx.fillRect(x, midY - 2, 1, 4);
      }
      for (let y = 0; y < height; y += 12) {
        ctx.fillRect(midX - 2, y, 4, 1);
      }

      // 3. Render either Waveform or FFT Spectrum
      if (displayMode === 'waveform') {
        const waveform = audioEngine.getWaveform();
        ctx.lineWidth = 2.4;
        ctx.strokeStyle = '#34d399';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 14;

        ctx.beginPath();
        const sliceWidth = width / (waveform.length || 1);
        for (let i = 0; i < waveform.length; i++) {
          const v = waveform[i];
          const y = midY + v * (height * 0.44);
          const x = i * sliceWidth;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        // FFT Frequency Spectrum Bars - Living Green Stems
        const fft = audioEngine.getFft();
        const barCount = 48;
        const barWidth = (width / barCount) - 2;

        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;

        for (let i = 0; i < barCount; i++) {
          const rawDb = fft[i] || -100;
          const norm = Math.max(0, Math.min(1, (rawDb + 100) / 90));
          const barHeight = norm * (height * 0.75);
          const x = i * (barWidth + 2) + 4;
          const y = height - barHeight - 12;

          const grad = ctx.createLinearGradient(0, y, 0, height);
          grad.addColorStop(0, '#fef08a');   // Solar bloom tip
          grad.addColorStop(0.3, '#34d399'); // Radiant foliage
          grad.addColorStop(1, '#047857');   // Root chlorophyll

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);
        }
        ctx.shadowBlur = 0;
      }

      // 4. On-Screen Display (OSD Readouts)
      ctx.font = '11px monospace';
      ctx.fillStyle = '#6ee7b7';
      ctx.fillText('CH1: 50mV/DIV', 14, 20);
      ctx.fillText('TIMEBASE: 2.5ms', 125, 20);
      ctx.fillText('FLORA: 432Hz PASS', 245, 20);

      ctx.fillStyle = '#a7f3d0';
      ctx.fillText(displayMode === 'waveform' ? 'MODE: BIO-WAVEFORM' : 'MODE: 48-BAND BOTANICAL FFT', width - 185, 20);

      if (lastTriggeredNote) {
        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`TRIGGERED NOTE: ${lastTriggeredNote.note} (VEL: ${(lastTriggeredNote.velocity * 100).toFixed(0)}%)`, 14, height - 12);
      } else {
        ctx.fillStyle = '#34d399';
        ctx.font = '11px monospace';
        ctx.fillText('STATUS: MONITORING PLANT TRANSPIRATION...', 14, height - 12);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [displayMode, isPlaying, lastTriggeredNote]);

  return (
    <div className="w-full flex flex-col font-sans">
      {/* Scope Header Toolbar */}
      <div className="flex items-center justify-between text-xs text-[#86efac] pb-2 px-1 border-b border-[#10b981]/25 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981] animate-pulse"></span>
          <span className="font-bold text-white tracking-wide flex items-center gap-1.5">
            <span>🌿</span> P31 PHOSPHOR BIO-ELECTRIC SCOPE
          </span>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#03140a] p-1 rounded-xl border border-[#10b981]/25">
          <button
            type="button"
            onClick={() => setDisplayMode('waveform')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              displayMode === 'waveform'
                ? 'bg-[#10b981] text-[#022312] shadow'
                : 'text-[#86efac] hover:text-white'
            }`}
          >
            WAVEFORM
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('spectrum')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              displayMode === 'spectrum'
                ? 'bg-[#34d399] text-[#022312] shadow font-black'
                : 'text-[#86efac] hover:text-white'
            }`}
          >
            RTA SPECTRUM
          </button>
        </div>
      </div>

      {/* CRT Canvas Screen with Scanline Overlay */}
      <div className="crt-screen rounded-2xl w-full aspect-[2/1] sm:aspect-[2.4/1] max-h-[220px] overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          width={640}
          height={260}
          className="w-full h-full block"
        />
      </div>
    </div>
  );
};
