import React, { useEffect, useRef } from 'react';
import { audioEngine, PRESETS } from '../audio/PlantAudioEngine';

export const BioluminescentVisualizer = ({ activeTouches, currentPreset, isPlaying }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const ripplesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Initialize bio-photonic particle field
    if (particlesRef.current.length === 0) {
      const numParticles = 45;
      for (let i = 0; i < numParticles; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.clientWidth,
          y: Math.random() * canvas.clientHeight,
          radius: Math.random() * 2.2 + 0.8,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4 - 0.2, // Slow upward drift
          alpha: Math.random() * 0.6 + 0.2,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    let animationFrameId;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const presetColor = PRESETS[currentPreset]?.color || '#10b981';

      // 1. Draw subtle background radial bio-glow
      const radialGrad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, Math.max(width, height) / 1.5);
      radialGrad.addColorStop(0, `${presetColor}18`);
      radialGrad.addColorStop(0.5, `${presetColor}05`);
      radialGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Fetch live audio waveform & FFT from Tone.js
      const waveform = audioEngine.getWaveform();
      const fft = audioEngine.getFft();

      // Calculate audio energy
      let energy = 0;
      for (let i = 0; i < 32; i++) {
        energy += Math.abs(waveform[i] || 0);
      }
      energy = Math.min(1.0, energy / 12);

      // 3. Render and expand touch ripples
      ripplesRef.current.forEach((rip, idx) => {
        rip.radius += rip.speed;
        rip.alpha *= 0.96;

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${presetColor}${Math.floor(rip.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        if (rip.alpha < 0.02) {
          ripplesRef.current.splice(idx, 1);
        }
      });

      // 4. Draw Radial Oscilloscope Ring
      ctx.save();
      ctx.translate(centerX, centerY);

      const baseRadius = 85 + energy * 40;
      ctx.beginPath();

      const numPoints = 128;
      for (let i = 0; i <= numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const waveIdx = Math.floor((i / numPoints) * waveform.length);
        const waveVal = waveform[waveIdx] !== undefined ? waveform[waveIdx] : 0;
        const r = baseRadius + waveVal * (35 + energy * 30);

        const px = Math.cos(angle) * r;
        const py = Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `${presetColor}99`;
      ctx.lineWidth = 2 + energy * 2;
      ctx.shadowColor = presetColor;
      ctx.shadowBlur = 12 + energy * 20;
      ctx.stroke();

      // Inner bio-halo
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(10, baseRadius - 15), 0, Math.PI * 2);
      ctx.strokeStyle = `${presetColor}33`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 5. Draw Horizontal Waveform Scope across bottom
      ctx.save();
      ctx.beginPath();
      const scopeHeight = 60;
      const scopeBaseY = height - 40;
      const sliceWidth = width / (waveform.length || 1);

      for (let i = 0; i < waveform.length; i++) {
        const v = waveform[i];
        const y = scopeBaseY + v * scopeHeight;
        const x = i * sliceWidth;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `${presetColor}55`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();

      // 6. Update and render floating bio-luminescent particles
      particlesRef.current.forEach(p => {
        p.x += p.vx + (Math.sin(p.pulse) * 0.2);
        p.y += p.vy;
        p.pulse += 0.03;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${presetColor}${Math.floor(currentAlpha * 255).toString(16).padStart(2, '0')}`;
        ctx.shadowColor = presetColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentPreset]);

  // Spawn ripples when touch events are triggered
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    activeTouches.forEach(touch => {
      if (touch.triggered) {
        ripplesRef.current.push({
          x: width / 2 + (Math.random() - 0.5) * 60,
          y: height / 2 + (Math.random() - 0.5) * 60,
          radius: 20,
          speed: 4 + (touch.intensity || 0.5) * 5,
          alpha: 0.9
        });
      }
    });
  }, [activeTouches]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
