/* ==============================================================================
   PlantAudioEngine.js
   PhytoTouch: Acoustic Studio Bio-Acoustic Synthesizer Engine
   Featuring: Steinway Grand Piano, Concert Cello, Wooden Kalimba & Bansuri
   Calibrated for natural room acoustics and 432 Hz Saptak resonance
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import * as Tone from 'tone';
import { TUNING_SYSTEMS, calculateLeafFrequency } from './ShrutiTuning';

export { TUNING_SYSTEMS, calculateLeafFrequency };

// Musical scale definitions calibrated for anti-stress biophilic harmony & Indian Classical Saptak
export const SCALES = {
  saptak: {
    name: 'Indian Classical Saptak (Sa Re Ga Ma Pa Dha Ni)',
    swaras: ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni', 'Sȧ'],
    desc: 'The complete 7-Swara classical scale in natural 432 Hz Pythagorean / Shuddha tuning.',
    notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
  },
  yaman: {
    name: 'Raga Yaman (Kalyan / Teevra Ma)',
    swaras: ['Sa', 'Re', 'Ga', 'Má', 'Pa', 'Dha', 'Ni', 'Sȧ'],
    desc: 'Bright, meditative evening raga evoking twilight stillness and profound peace.',
    notes: ['C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5']
  },
  bhupali: {
    name: 'Raga Bhupali (Audav Pentatonic)',
    swaras: ['Sa', 'Re', 'Ga', 'Pa', 'Dha', 'Sȧ', 'Rė', 'Gȧ'],
    desc: 'Ancient 5-swara dawn raga (Sa, Re, Ga, Pa, Dha). Naturally soothing & consonant.',
    notes: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5']
  },
  bhairav: {
    name: 'Raga Bhairav (Dawn Awakening)',
    swaras: ['Sa', 'Re̱', 'Ga', 'Ma', 'Pa', 'Dha̱', 'Ni', 'Sȧ'],
    desc: 'Awe-inspiring morning raga with Komal Rishabh and Komal Dhaivat microtonal oscillation.',
    notes: ['C4', 'Db4', 'E4', 'F4', 'G4', 'Ab4', 'B4', 'C5']
  },
  darbari: {
    name: 'Raga Darbari Kanhada (Midnight Majesty)',
    swaras: ['Sa', 'Re', 'Ga̱', 'Ma', 'Pa', 'Dha̱', 'Ni̱', 'Sȧ'],
    desc: 'Deep royal raga with grave, resonant Komal Gandhar and microtonal andolan.',
    notes: ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5']
  },
  shivranjani: {
    name: 'Raga Shivranjani (Emotional Healing)',
    swaras: ['Sa', 'Re', 'Ga̱', 'Pa', 'Dha', 'Sȧ', 'Rė', 'Gȧ̱'],
    desc: 'Pentatonic melody with Komal Gandhar, famous for therapeutic deep grief and solace.',
    notes: ['C4', 'D4', 'Eb4', 'G4', 'A4', 'C5', 'D5', 'Eb5']
  },
  solfeggio: {
    name: '528 Hz Solfeggio & Miracles',
    swaras: ['Ut', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si', 'Uṫ'],
    desc: 'Resonant cellular regeneration frequency aligned with biological water resonance.',
    notes: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'G5']
  },
  interstellar: {
    name: 'Interstellar Ethereal (Hans Zimmer)',
    swaras: ['A3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C5'],
    desc: 'Hans Zimmer cosmic cinematic motif in natural 432 Hz Pythagorean A-minor.',
    notes: ['A3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'C5']
  }
};


export const PRESETS = {
  grand_piano: {
    name: 'Steinway Grand Piano',
    icon: '🎹',
    desc: 'Studio-sampled acoustic grand piano with natural wooden hammer resonance',
    type: 'piano',
    color: '#38bdf8'
  },
  cello: {
    name: 'Concert Cello',
    icon: '🎻',
    desc: 'Warm wooden acoustic cello with natural bow friction & deep chamber resonance',
    type: 'cello',
    color: '#f59e0b'
  },
  kalimba: {
    name: 'Wooden Kalimba',
    icon: '🎋',
    desc: 'Handcrafted African thumb piano with organic wooden tine pluck & acoustic decay',
    type: 'kalimba',
    color: '#10b981'
  },
  bansuri_flute: {
    name: 'Vedic Bansuri',
    icon: '🪈',
    desc: 'Acoustic bamboo flute with organic air breath & 432 Hz resonance',
    type: 'flute',
    color: '#f59e0b'
  },
  celestial_pad: {
    name: 'Chamber Strings',
    icon: '🌌',
    desc: 'Lush natural wooden acoustic chamber with shimmering harmonic overtones',
    type: 'pad',
    color: '#818cf8'
  },
  interstellar: {
    name: 'Interstellar Organ',
    icon: '✨',
    desc: 'Ethereal celestial church organ and glass harmonics inspired by Hans Zimmer',
    type: 'organ',
    color: '#38bdf8'
  }
};

// Calculate exact frequency in Hz given standard note name (e.g. 'C4'), master base frequency (e.g. 432 Hz), and octave shift
export function getNoteFrequency(noteName, baseFrequency = 432, octaveOffset = 0) {
  try {
    const stdFreq = Tone.Frequency(noteName).toFrequency();
    return stdFreq * (baseFrequency / 440) * Math.pow(2, octaveOffset);
  } catch {
    return 432;
  }
}

class PlantAudioEngine {
  constructor() {
    this.isInitialized = false;
    this.isUnlocked = false;
    this.isPianoLoaded = false;
    this.currentScale = 'saptak';
    this.currentPreset = 'grand_piano'; // Default to Steinway Grand Piano
    this.baseFrequency = 432;          // Master base frequency (Hz)
    this.octaveOffset = 0;             // Octave transposition (-2 to +2)
    this.volume = -8;                  // Studio calibrated master gain (-8 dB clean headroom)
    this.reverbWet = 0.18;             // Natural room acoustic reverb
    this.delayWet = 0.08;
    this.onStateChange = null;
    this._silentAudioEl = null;

    // Microtonal Shruti tuning state (7 channels)
    this.currentTuningSystem = 'shuddha_just';
    this.leafCentsOffsets = [0, 0, 0, 0, 0, 0, 0];

    // Build audio graph immediately
    this.initGraph();
  }

  initGraph() {
    if (this.isInitialized) return;

    try {
      // 1. Master Output Destination via Calibrated Volume Bus (-8 dB default)
      this.masterVolume = new Tone.Volume(this.volume).toDestination();

      // 2. Transparent Soft-Knee Bus Compressor
      this.masterCompressor = new Tone.Compressor({
        threshold: -8,
        ratio: 2.0,
        attack: 0.05,
        release: 0.35,
        knee: 14
      }).connect(this.masterVolume);

      // 3. Clean Sub-Bass High-Pass Filter at 60 Hz
      this.highpassFilter = new Tone.Filter({
        frequency: 60,
        type: 'highpass',
        rolloff: -12
      }).connect(this.masterCompressor);

      // 4. Air Filter at 14,000 Hz
      this.warmthFilter = new Tone.Filter({
        frequency: 14000,
        type: 'lowpass',
        rolloff: -12,
        Q: 0.7
      }).connect(this.highpassFilter);

      // 5. Clean Master Mix Bus
      this.masterBus = new Tone.Gain(0.85).connect(this.warmthFilter);

      // 6. Natural Acoustic Room Reverb & Delay
      this.synthBus = new Tone.Gain(0.72).connect(this.masterBus);

      this.delayReturn = new Tone.Gain(this.delayWet).connect(this.masterBus);
      this.delay = new Tone.PingPongDelay({
        delayTime: '8n.',
        feedback: 0.12,
        wet: 1.0
      }).connect(this.delayReturn);

      this.reverbReturn = new Tone.Gain(this.reverbWet).connect(this.masterBus);
      this.reverb = new Tone.Freeverb({
        roomSize: 0.45,
        dampening: 4200,
        wet: 1.0
      }).connect(this.reverbReturn);

      // 7. Analysers for oscilloscope & spectrum display
      this.waveformAnalyser = new Tone.Analyser('waveform', 256);
      this.fftAnalyser = new Tone.Analyser('fft', 64);
      this.masterBus.connect(this.waveformAnalyser);
      this.masterBus.connect(this.fftAnalyser);

      // 8. Session Audio Recorder (Lossless master tap)
      try {
        this.recorder = new Tone.Recorder();
        this.masterBus.connect(this.recorder);
      } catch (e) {
        console.warn('Audio recorder initialization warning:', e);
      }

      // 8. Acoustic Instruments
      
      // Preset 0: Steinway Concert Grand Piano
      try {
        this.pianoSampler = new Tone.Sampler({
          urls: {
            C3: '/audio/piano/C3.mp3',
            C4: '/audio/piano/C4.mp3',
            A4: '/audio/piano/A4.mp3',
            C5: '/audio/piano/C5.mp3',
            C6: '/audio/piano/C6.mp3'
          },
          onload: () => {
            this.isPianoLoaded = true;
          }
        });
        this.pianoSampler.volume.value = -3;
        this.pianoSampler.connect(this.synthBus);
        this.pianoSampler.connect(this.reverb);
      } catch (e) {
        console.warn('Piano sampler error:', e);
      }

      // Piano Fallback Synth (Rich Triangle Hammer)
      this.pianoFallbackSynth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 12,
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 2.4, sustain: 0.02, release: 1.4 }
      });
      this.pianoFallbackSynth.volume.value = -5;
      this.pianoFallbackSynth.set({ detune: -31.77 });
      this.pianoFallbackSynth.connect(this.synthBus);
      this.pianoFallbackSynth.connect(this.reverb);

      // Preset 1: Concert Cello & Wooden Strings (Deep Bowed Resonance)
      this.celloSynth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 8,
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.08, decay: 1.8, sustain: 0.45, release: 1.5 }
      });
      this.celloSynth.volume.value = -7;
      this.celloSynth.set({ detune: -31.77 });
      this.celloFilter = new Tone.Filter(850, 'lowpass').connect(this.synthBus);
      this.celloSynth.connect(this.celloFilter);
      this.celloSynth.connect(this.reverb);

      // Preset 2: Wooden Kalimba (Thumb Piano with Organic Tine Decay)
      this.kalimbaSynth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 12,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.008, decay: 0.9, sustain: 0.0, release: 0.7 }
      });
      this.kalimbaSynth.volume.value = -6;
      this.kalimbaSynth.set({ detune: -31.77 });
      this.kalimbaSynth.connect(this.synthBus);
      this.kalimbaSynth.connect(this.reverb);

      // Preset 3: Vedic Bansuri Bamboo Flute (Air Vibrato)
      this.bansuriSynth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 8,
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.06, decay: 1.4, sustain: 0.35, release: 1.2 }
      });
      this.bansuriSynth.volume.value = -6;
      this.bansuriSynth.set({ detune: -31.77 });
      this.bansuriFilter = new Tone.Filter(1800, 'lowpass').connect(this.synthBus);
      this.bansuriSynth.connect(this.bansuriFilter);
      this.bansuriSynth.connect(this.reverb);

      // Preset 4: Chamber Acoustic Pad
      this.padSynth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 8,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.25, decay: 1.8, sustain: 0.35, release: 1.8 }
      });
      this.padSynth.volume.value = -8;
      this.padSynth.set({ detune: -31.77 });
      this.padSynth.connect(this.synthBus);
      this.padSynth.connect(this.reverb);

      // Preset 5: Ethereal Interstellar Celestial Organ & Shimmer Chimes
      this.interstellarSynth = new Tone.PolySynth(Tone.Synth, {
        maxPolyphony: 12,
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.12, decay: 3.2, sustain: 0.65, release: 3.2 }
      });
      this.interstellarSynth.volume.value = -6;
      this.interstellarSynth.set({ detune: -31.77 });
      this.interstellarFilter = new Tone.Filter(3200, 'lowpass').connect(this.synthBus);
      this.interstellarSynth.connect(this.interstellarFilter);
      this.interstellarSynth.connect(this.reverb);
      this.interstellarSynth.connect(this.delay);

      this.isInitialized = true;
    } catch (e) {
      console.warn('Audio graph initialization warning:', e);
    }
  }

  // Universal Mobile Audio Unlock (iOS Safari + Android Chrome)
  async unlock() {
    this.initGraph();

    const rawCtx = Tone.context?.rawContext || (Tone.getContext && Tone.getContext()?.rawContext);
    if (rawCtx && rawCtx.state === 'suspended') {
      try {
        rawCtx.resume();
      } catch {}
    }

    try {
      if (!this._silentAudioEl) {
        this._silentAudioEl = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
        this._silentAudioEl.setAttribute('playsinline', '');
        this._silentAudioEl.setAttribute('webkit-playsinline', '');
      }
      this._silentAudioEl.volume = 0.01;
      this._silentAudioEl.play().catch(() => {});
    } catch {}

    try {
      await Tone.start();

      if (rawCtx && rawCtx.state === 'suspended') {
        await rawCtx.resume();
      }

      try {
        if (rawCtx) {
          const buffer = rawCtx.createBuffer(1, 1, 22050);
          const source = rawCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(rawCtx.destination);
          source.start(0);
        }
      } catch {}

      const isRunning = Tone.context && Tone.context.state === 'running';
      this.isUnlocked = isRunning;
      if (this.onStateChange) this.onStateChange(isRunning);
      return isRunning;
    } catch (e) {
      console.warn('Audio unlock warning:', e);
      return false;
    }
  }

  isAudioRunning() {
    return Tone.context && Tone.context.state === 'running';
  }

  getActiveSynth() {
    switch (this.currentPreset) {
      case 'grand_piano':
        return (this.isPianoLoaded && this.pianoSampler) ? this.pianoSampler : this.pianoFallbackSynth;
      case 'cello':
        return this.celloSynth;
      case 'kalimba':
        return this.kalimbaSynth;
      case 'bansuri_flute':
        return this.bansuriSynth;
      case 'celestial_pad':
        return this.padSynth;
      case 'interstellar':
      case 'interstellar_organ':
        return this.interstellarSynth;
      default:
        return this.padSynth;
    }
  }

  setTuningSystem(systemKey) {
    if (TUNING_SYSTEMS[systemKey]) {
      this.currentTuningSystem = systemKey;
    }
  }

  setLeafCentsOffset(leafIndex, cents) {
    if (leafIndex >= 0 && leafIndex < 7) {
      this.leafCentsOffsets[leafIndex] = Math.max(-100, Math.min(100, cents));
    }
  }

  resetMicrotuning() {
    this.leafCentsOffsets = [0, 0, 0, 0, 0, 0, 0];
  }

  getLeafFrequency(leafIndex) {
    return calculateLeafFrequency(
      leafIndex,
      this.currentTuningSystem,
      this.baseFrequency,
      this.octaveOffset,
      this.leafCentsOffsets[leafIndex] || 0
    );
  }

  // Trigger a leaf note based on leaf index (0 to 6) and intensity (0.1 to 1.0)
  triggerLeaf(leafIndex, intensity = 0.70) {
    if (!this.isAudioRunning()) {
      this.unlock();
    }

    const scale = SCALES[this.currentScale] || SCALES.saptak;
    const baseNote = scale.notes[leafIndex % scale.notes.length];
    const actualFreq = this.getLeafFrequency(leafIndex);
    const synth = this.getActiveSynth();
    if (!synth) return null;

    // Velocity scaling (0.20 to 0.48) - natural acoustic touch sensitivity
    const velocity = Math.min(Math.max(intensity * 0.48, 0.20), 0.48);
    const duration = (this.currentPreset === 'celestial_pad' || this.currentPreset === 'cello' || this.currentPreset === 'interstellar') ? '2n' : '4n';

    try {
      synth.triggerAttackRelease(actualFreq, duration, undefined, velocity);
    } catch (e) {
      console.warn('Note trigger error:', e);
    }

    const swaraNames = ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'];
    return {
      note: baseNote,
      swara: swaraNames[leafIndex % 7],
      freq: actualFreq.toFixed(1),
      freqFormatted: `${actualFreq.toFixed(1)} Hz`,
      centsOffset: this.leafCentsOffsets[leafIndex] || 0,
      velocity,
      timestamp: Date.now()
    };
  }

  // Trigger chord sweep (for multiple leaves or ambient spacebar)
  triggerChord(leafIndices = [0, 2, 4], velocity = 0.40) {
    if (!this.isAudioRunning()) {
      this.unlock();
    }

    const scale = SCALES[this.currentScale] || SCALES.saptak;
    const notes = leafIndices.map(idx => scale.notes[idx % scale.notes.length]);
    const freqs = notes.map(n => getNoteFrequency(n, this.baseFrequency, this.octaveOffset));
    const synth = this.getActiveSynth();
    if (!synth) return;

    const perNoteVelocity = Math.min((velocity || 0.40) / Math.sqrt(freqs.length), 0.28);

    try {
      synth.triggerAttackRelease(freqs, '2n', undefined, perNoteVelocity);
    } catch (e) {
      console.warn('Chord trigger error:', e);
    }
  }

  testChime() {
    this.unlock().then(() => {
      this.triggerLeaf(0, 0.65);
    });
  }

  triggerAttackRelease(noteOrFreq, duration = '4n', velocity = 0.4) {
    if (!this.isAudioRunning()) {
      this.unlock();
    }
    const synth = this.getActiveSynth();
    if (!synth) return;
    try {
      synth.triggerAttackRelease(noteOrFreq, duration, undefined, velocity);
    } catch (e) {
      console.warn('triggerAttackRelease error:', e);
    }
  }

  setPreset(presetKey) {
    if (PRESETS[presetKey]) {
      this.currentPreset = presetKey;
    }
  }

  setScale(scaleKey) {
    if (SCALES[scaleKey]) {
      this.currentScale = scaleKey;
    }
  }

  setBaseFrequency(hz) {
    this.baseFrequency = Math.min(Math.max(hz, 380), 540);
  }

  setOctaveOffset(oct) {
    this.octaveOffset = Math.min(Math.max(oct, -2), 2);
  }

  setMasterVolume(valDb) {
    const safeDb = Math.min(Math.max(valDb, -40), -4);
    this.volume = safeDb;
    if (this.masterVolume) {
      this.masterVolume.volume.rampTo(safeDb, 0.05);
    }
  }

  getWaveform() {
    if (!this.waveformAnalyser) return new Float32Array(256);
    return this.waveformAnalyser.getValue();
  }

  getFft() {
    if (!this.fftAnalyser) return new Float32Array(64);
    return this.fftAnalyser.getValue();
  }

  // Session Audio Recorder methods
  async startRecording() {
    await this.unlock();
    if (this.recorder && this.recorder.state !== 'started') {
      this.recorder.start();
      return true;
    }
    return false;
  }

  async stopRecording() {
    if (this.recorder && this.recorder.state === 'started') {
      const recordingBlob = await this.recorder.stop();
      return recordingBlob;
    }
    return null;
  }

  isRecording() {
    return this.recorder && this.recorder.state === 'started';
  }
}

export function downloadAudioRecording(blob, filename) {
  if (!blob) return;
  const name = filename || `phytotouch-session-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.wav`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

export const audioEngine = new PlantAudioEngine();
