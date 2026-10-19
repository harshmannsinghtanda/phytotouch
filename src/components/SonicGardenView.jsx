import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Radio, Volume2, Globe, Heart, Download, Share2, Sparkles, Activity, Music, Waves, VolumeX } from 'lucide-react';
import { audioEngine } from '../audio/PlantAudioEngine';

export function SonicGardenView() {
  // Global active audio source state: null or { type: 'stream' | 'track' | 'master', id: string | number, title: string, plant: string }
  const [activeItem, setActiveItem] = useState(null);

  const streams = [
    {
      id: 'kyoto',
      title: 'Zen Juniperus Chinensis',
      location: 'KYOTO • RELAY #01',
      scale: 'C Lydian 432Hz',
      voltage: '0.62 mV',
      listeners: '342 tuned in',
      desc: 'Bonsai tree biopotentials generating meditative, cyclic Lydian bells and harmonic brass.',
      preset: 'bansuri_flute',
      notes: ['C4', 'D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C5'],
      intervalMs: 850
    },
    {
      id: 'amazon',
      title: 'Amazonian Epiphytic Orchid',
      location: 'MANAUS • RELAY #04',
      scale: 'Microtonal Rainscale',
      voltage: '1.48 mV',
      listeners: '189 tuned in',
      desc: 'High-humidity sap flow triggering delicate crystalline kalimba patterns and raindrop harmonics.',
      preset: 'kalimba',
      notes: ['F4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5'],
      intervalMs: 600
    },
    {
      id: 'sequoia',
      title: 'Sequoia Sempervirens',
      location: 'CALIFORNIA • RELAY #09',
      scale: 'Deep Ground 432Hz',
      voltage: '4.12 mV',
      listeners: '512 tuned in',
      desc: 'Massive old-growth xylem fluid dynamics driving warm sub-bass acoustic cello reverberations.',
      preset: 'cello',
      notes: ['A2', 'C3', 'E3', 'A3', 'C4', 'E4', 'G4'],
      intervalMs: 1200
    }
  ];

  const tracks = [
    {
      id: 'interstellar',
      title: 'Interstellar: Cornfield Echoes & Gargantua Zero-G',
      plant: 'Tillandsia (Zero-G Air Plant)',
      duration: '31:40',
      scale: 'A Minor Celestial (Zimmer 432Hz)',
      author: 'Hans Zimmer × Phyto-Acoustics',
      preset: 'interstellar',
      notes: ['A3', 'C4', 'E4', 'A4', 'B4', 'C5', 'D5', 'E5'],
      intervalMs: 440,
      badge: 'ZIMMER SPECIAL'
    },
    {
      id: 1,
      title: 'Perforated Veins in Berlin',
      plant: 'Monstera Deliciosa',
      duration: '18:24',
      scale: 'Lydian 432 Hz',
      author: 'Dr. Elena Voss',
      preset: 'grand_piano',
      notes: ['C4', 'E4', 'F#4', 'G4', 'B4', 'C5', 'E5'],
      intervalMs: 750
    },
    {
      id: 2,
      title: 'Alpine Lichen Sleep Cycle',
      plant: 'Xanthoria Elegans',
      duration: '34:10',
      scale: 'Hirajoshi Minor',
      author: 'Julian Thorne',
      preset: 'celestial_pad',
      notes: ['C4', 'Db4', 'F4', 'Gb4', 'Bb4', 'C5'],
      intervalMs: 1100
    },
    {
      id: 3,
      title: 'Action Potentials: Flytrap',
      plant: 'Dionaea Muscipula',
      duration: '08:45',
      scale: 'Rapid Pentatonic',
      author: 'BioSound Lab',
      preset: 'kalimba',
      notes: ['G4', 'A4', 'C5', 'D5', 'E5', 'G5', 'A5'],
      intervalMs: 500
    },
    {
      id: 4,
      title: 'Redwood Sapling at Dawn',
      plant: 'Sequoia Gigantea',
      duration: '22:15',
      scale: 'Earth 432 Hz Saptak',
      author: 'Nirman Bio-Acoustics',
      preset: 'cello',
      notes: ['A2', 'C3', 'E3', 'A3', 'C4', 'E4'],
      intervalMs: 1000
    }
  ];

  // Continuous Generative Ambient Audio Loop
  useEffect(() => {
    if (!activeItem) return;
    audioEngine.unlock();

    // Special dedicated Hans Zimmer Interstellar Ethereal Soundscape Loop
    if (activeItem.type === 'track' && activeItem.id === 'interstellar') {
      audioEngine.setPreset('interstellar');

      // Iconic 4-chord progression: Am -> F -> C -> G/Em
      const chords = [
        {
          bass: 'A2',
          arpeggio: ['E4', 'A4', 'C5', 'B4', 'E5', 'B4', 'C5', 'A4'],
          soaringLead: 'E5'
        },
        {
          bass: 'F2',
          arpeggio: ['F4', 'A4', 'C5', 'E5', 'F5', 'E5', 'C5', 'A4'],
          soaringLead: 'D5'
        },
        {
          bass: 'C3',
          arpeggio: ['G4', 'C5', 'E5', 'G5', 'E5', 'C5', 'G4', 'E4'],
          soaringLead: 'C5'
        },
        {
          bass: 'G2',
          arpeggio: ['D4', 'G4', 'B4', 'D5', 'E5', 'D5', 'B4', 'G4'],
          soaringLead: 'B4'
        }
      ];

      let step = 0;
      // Trigger opening church organ pedal bass & opening harmonic note
      audioEngine.triggerAttackRelease('A2', '1m', 0.45);
      audioEngine.triggerAttackRelease('E4', '2n', 0.35);

      const timer = setInterval(() => {
        step++;
        const chordIdx = Math.floor((step % 32) / 8);
        const noteIdx = step % 8;
        const currentChord = chords[chordIdx];

        // 1. Deep church organ pedal bass on measure start
        if (noteIdx === 0) {
          audioEngine.triggerAttackRelease(currentChord.bass, '1m', 0.42);
        }

        // 2. High ethereal soaring climax note floating across the organ
        if (noteIdx === 0 && step >= 16) {
          setTimeout(() => {
            audioEngine.triggerAttackRelease(currentChord.soaringLead, '2n', 0.32);
          }, 120);
        }

        // 3. Iconic pulsating clockwork arpeggio ostinato
        const note = currentChord.arpeggio[noteIdx];
        const vel = 0.28 + (noteIdx % 2 === 0 ? 0.08 : 0);
        audioEngine.triggerAttackRelease(note, '4n', vel);
      }, 440);

      return () => clearInterval(timer);
    }

    let notes = ['C4', 'E4', 'G4', 'B4'];
    let preset = 'grand_piano';
    let intervalMs = 800;

    if (activeItem.type === 'stream') {
      const s = streams.find((item) => item.id === activeItem.id);
      if (s) {
        notes = s.notes;
        preset = s.preset;
        intervalMs = s.intervalMs;
      }
    } else if (activeItem.type === 'track') {
      const t = tracks.find((item) => item.id === activeItem.id);
      if (t) {
        notes = t.notes;
        preset = t.preset;
        intervalMs = t.intervalMs;
      }
    } else if (activeItem.type === 'master') {
      notes = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'E5'];
      preset = 'celestial_pad';
      intervalMs = 900;
    }

    audioEngine.setPreset(preset);

    let step = 0;
    let lastIdx = 0;

    // Trigger opening tone immediately
    audioEngine.triggerAttackRelease(notes[0], '4n', 0.42);

    const timer = setInterval(() => {
      step++;
      // Organic generative walk across scale notes
      const dir = Math.random() > 0.48 ? 1 : -1;
      let nextIdx = Math.max(0, Math.min(notes.length - 1, lastIdx + dir));
      if (nextIdx === lastIdx) {
        nextIdx = Math.floor(Math.random() * notes.length);
      }
      lastIdx = nextIdx;

      const note = notes[nextIdx];
      const isChordStep = step % 6 === 0;

      if (isChordStep && notes.length >= 3) {
        // Resonant acoustic chord wash
        const c1 = notes[0];
        const c2 = notes[2 % notes.length];
        const c3 = notes[4 % notes.length];
        audioEngine.triggerAttackRelease(c1, '2n', 0.28);
        setTimeout(() => audioEngine.triggerAttackRelease(c2, '2n', 0.24), 60);
        setTimeout(() => audioEngine.triggerAttackRelease(c3, '2n', 0.24), 120);
      } else {
        const velocity = 0.26 + Math.random() * 0.18;
        const dur = (preset === 'celestial_pad' || preset === 'cello' || preset === 'interstellar') ? '2n' : '4n';
        audioEngine.triggerAttackRelease(note, dur, velocity);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeItem]);

  // Toggle Stream Helper
  const toggleStream = (s) => {
    audioEngine.unlock();
    if (activeItem?.type === 'stream' && activeItem.id === s.id) {
      setActiveItem(null);
    } else {
      setActiveItem({ type: 'stream', id: s.id, title: s.title, plant: s.location });
    }
  };

  // Toggle Track Helper
  const toggleTrack = (t) => {
    audioEngine.unlock();
    if (activeItem?.type === 'track' && activeItem.id === t.id) {
      setActiveItem(null);
    } else {
      setActiveItem({ type: 'track', id: t.id, title: t.title, plant: t.plant });
    }
  };

  // Toggle Master Broadcast
  const toggleMaster = () => {
    audioEngine.unlock();
    if (activeItem?.type === 'master') {
      setActiveItem(null);
    } else {
      setActiveItem({
        type: 'master',
        id: 'master-01',
        title: 'Root Systems & Cloud Canopy',
        plant: 'Calathea Roseopicta'
      });
    }
  };

  return (
    <div className="flex flex-col w-full text-[#dde4de]">
      {/* Live Botanical Ticker & Network Radar */}
      <section className="w-full bg-[#09100c] px-4 md:px-8 py-2.5 shadow-md border-b border-[#3b4a43]/30">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full lg:w-3/4 overflow-hidden">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#47f3bb]/10 flex-shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#47f3bb] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#47f3bb]"></span>
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#47f3bb] uppercase font-bold tracking-wider">
                Bio-Net Active
              </span>
            </div>
            <div className="relative w-full overflow-hidden whitespace-nowrap">
              <div className="inline-flex items-center gap-8 animate-marquee">
                <span className="inline-flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#dde4de]">
                  <span className="text-[#47f3bb] font-bold">● LIVE:</span> Kyoto Zen Botanical Garden (Juniper Bonsai 432Hz)
                  <span className="ml-1 px-1.5 py-0.5 bg-[#252b28] rounded text-[#47f3bb] text-[10px]">342 listening</span>
                </span>
                <span className="text-[#3b4a43]">•</span>
                <span className="inline-flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#dde4de]">
                  <span className="text-[#47f3bb] font-bold">● LIVE:</span> Amazonian Glasshouse Orchid Synth (Microtonal)
                  <span className="ml-1 px-1.5 py-0.5 bg-[#252b28] rounded text-[#f0c04d] text-[10px]">189 listening</span>
                </span>
                <span className="text-[#3b4a43]">•</span>
                <span className="inline-flex items-center gap-2 font-['JetBrains_Mono'] text-xs text-[#dde4de]">
                  <span className="text-[#47f3bb] font-bold">● LIVE:</span> California Old-Growth Redwood Relay (Sub-Bass Cello)
                  <span className="ml-1 px-1.5 py-0.5 bg-[#252b28] rounded text-[#47f3bb] text-[10px]">512 listening</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 self-end lg:self-auto font-['JetBrains_Mono'] text-xs text-[#bacac1]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#171d1a] border border-[#3b4a43]/30">
              <Globe className="w-3.5 h-3.5 text-[#47f3bb]" />
              <span>Nodes: <strong className="text-[#dde4de]">1,842</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#171d1a] border border-[#3b4a43]/30">
              <Activity className="w-3.5 h-3.5 text-[#f0c04d]" />
              <span>Avg Sap Flow: <strong className="text-[#dde4de]">14.2 µL/h</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Intro Banner */}
      <section className="w-full px-4 md:px-8 pt-12 pb-8 flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative">
        <div className="max-w-3xl flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] uppercase tracking-widest font-bold">
              Botanical Audio Commons
            </span>
            <span className="text-[#3b4a43] font-['JetBrains_Mono'] text-xs">/</span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1]">Archive &amp; Continuous Ambient Streams</span>
          </div>
          <h1 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-[#dde4de] tracking-tight leading-none">
            The Sonic Garden
          </h1>
          <p className="font-['Inter'] text-sm sm:text-base text-[#bacac1] max-w-2xl mt-1 leading-relaxed">
            A collective repository of micro-volt electrical rhythms recorded directly from living flora across the world. Click any broadcast or recording below to stream continuous, non-stop ambient botanical soundscapes.
          </p>
        </div>

        {/* Global Floating Master Seed Player Card */}
        <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all shadow-xl ${
          activeItem
            ? 'bg-[#252b28] border-[#47f3bb]/50 shadow-[0_0_24px_rgba(6,214,160,0.2)]'
            : 'bg-[#1b211e] border-[#3b4a43]/40'
        }`}>
          <button
            onClick={activeItem ? () => setActiveItem(null) : toggleMaster}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
              activeItem
                ? 'bg-[#ba1a1a] text-white shadow-[0_0_15px_rgba(255,180,171,0.5)]'
                : 'bg-[#06d6a0] hover:bg-[#47f3bb] text-[#003827] shadow-[0_0_15px_rgba(6,214,160,0.4)] hover:scale-105 active:scale-95'
            }`}
          >
            {activeItem ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeItem ? 'bg-[#47f3bb] animate-ping' : 'bg-[#bacac1]'}`}></span>
              <span className={`font-['JetBrains_Mono'] text-[9px] font-bold uppercase tracking-wider ${activeItem ? 'text-[#47f3bb]' : 'text-[#bacac1]'}`}>
                {activeItem ? 'LIVE STREAMING AUDIO' : 'STANDBY • CLICK TO PLAY'}
              </span>
            </div>
            <span className="font-['Syne'] text-sm sm:text-base font-bold text-[#dde4de]">
              {activeItem ? activeItem.title : 'Root Systems & Cloud Canopy'}
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#f0c04d]">
              {activeItem ? `Active Source: ${activeItem.plant}` : 'Calathea Roseopicta • 432 Hz Resonant Matrix'}
            </span>
          </div>
        </div>
      </section>

      {/* Global Live Broadcast Hub (3 Continuous Stream Cards) */}
      <section className="w-full px-4 md:px-8 py-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#47f3bb]" />
              <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] font-semibold uppercase tracking-wider">
                Synchronous Plant Nodes
              </span>
            </div>
            <h2 className="font-['Syne'] text-2xl sm:text-3xl font-bold text-[#dde4de]">Global Live Broadcast Hub</h2>
          </div>
          <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-xs">
            <span className="text-[#bacac1]">Active feeds:</span>
            <span className="text-[#47f3bb] font-bold px-2.5 py-0.5 bg-[#1b211e] rounded-full border border-[#47f3bb]/30">
              24 Online Worldwide
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {streams.map((s) => {
            const isPlaying = activeItem?.type === 'stream' && activeItem.id === s.id;
            return (
              <div
                key={s.id}
                className={`border rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col justify-between ${
                  isPlaying
                    ? 'bg-[#252b28] border-[#47f3bb] shadow-[0_0_24px_rgba(71,243,187,0.25)]'
                    : 'bg-[#171d1a] border-[#3b4a43]/40 hover:border-[#47f3bb]/40'
                }`}
              >
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#47f3bb] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#47f3bb]/10">
                      {s.location}
                    </span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#f0c04d]">{s.listeners}</span>
                  </div>

                  <h3 className="font-['Syne'] text-xl font-bold text-[#dde4de]">{s.title}</h3>
                  <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">{s.desc}</p>

                  <div className="grid grid-cols-2 gap-2 mt-2 bg-[#09100c] p-2.5 rounded-xl border border-[#3b4a43]/30 font-['JetBrains_Mono'] text-xs">
                    <div>
                      <span className="text-[9px] text-[#bacac1] block">MICRO-POTENTIAL</span>
                      <span className="text-[#47f3bb] font-bold">{s.voltage}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#bacac1] block">SCALE</span>
                      <span className="text-[#ffdf9d] font-bold">{s.scale}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#1b211e] border-t border-[#3b4a43]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#47f3bb] animate-ping' : 'bg-[#3b4a43]'}`}></span>
                    <span className="font-['JetBrains_Mono'] text-xs text-[#dde4de]">
                      {isPlaying ? 'STREAMING CONTINUOUSLY' : 'STANDBY'}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleStream(s)}
                    className={`px-4 py-2 rounded-xl font-['JetBrains_Mono'] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isPlaying
                        ? 'bg-[#ba1a1a] text-white shadow-[0_0_12px_rgba(255,180,171,0.4)]'
                        : 'bg-[#06d6a0] hover:bg-[#47f3bb] text-[#003827]'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlaying ? 'Pause Feed' : 'Listen Live'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Curated Botanical Releases Table with Full Continuous Audio Player */}
      <section className="w-full px-4 md:px-8 py-10 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-['JetBrains_Mono'] text-xs text-[#f0c04d] uppercase tracking-widest font-semibold">
            Community Releases
          </span>
          <h2 className="font-['Syne'] text-2xl sm:text-3xl font-bold text-[#dde4de]">
            Curated Botanical Soundscapes
          </h2>
          <span className="font-['Inter'] text-xs text-[#bacac1]">
            Click Play on any track to start non-stop generative playback calibrated to the plant species.
          </span>
        </div>

        <div className="overflow-x-auto bg-[#171d1a] border border-[#3b4a43]/40 rounded-2xl">
          <table className="w-full text-left border-collapse font-['JetBrains_Mono'] text-xs">
            <thead>
              <tr className="border-b border-[#3b4a43]/40 text-[#bacac1] bg-[#1b211e]">
                <th className="py-3.5 px-4">RECORDING TITLE</th>
                <th className="py-3.5 px-4">SPECIMEN</th>
                <th className="py-3.5 px-4">SCALE MATRIX</th>
                <th className="py-3.5 px-4">DURATION</th>
                <th className="py-3.5 px-4">RESEARCHER</th>
                <th className="py-3.5 px-4 text-right">CONTINUOUS AUDIO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b4a43]/20">
              {tracks.map((t) => {
                const isPlaying = activeItem?.type === 'track' && activeItem.id === t.id;
                const isInterstellar = t.id === 'interstellar';
                return (
                  <tr
                    key={t.id}
                    className={`transition-all ${
                      isPlaying
                        ? isInterstellar
                          ? 'bg-[#0f1f2e] border-l-4 border-l-[#38bdf8] shadow-[inset_0_0_20px_rgba(56,189,248,0.15)]'
                          : 'bg-[#252b28]/80 border-l-4 border-l-[#47f3bb]'
                        : isInterstellar
                          ? 'bg-[#0c1822]/60 hover:bg-[#112332]/80 border-l-2 border-l-[#38bdf8]/40'
                          : 'hover:bg-[#1b211e]/70'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-[#dde4de]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Music className={`w-4 h-4 flex-shrink-0 ${isPlaying ? (isInterstellar ? 'text-[#38bdf8] animate-bounce' : 'text-[#47f3bb] animate-bounce') : (isInterstellar ? 'text-[#38bdf8]' : 'text-[#bacac1]')}`} />
                        <span className={isInterstellar ? 'text-white font-extrabold tracking-wide' : ''}>{t.title}</span>
                        {t.badge && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#38bdf8]/15 border border-[#38bdf8]/40 text-[#38bdf8] text-[9px] font-extrabold tracking-wider animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.25)]">
                            <Sparkles className="w-2.5 h-2.5" />
                            {t.badge}
                          </span>
                        )}
                        {isPlaying && (
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            isInterstellar ? 'bg-[#38bdf8]/20 text-[#38bdf8]' : 'bg-[#47f3bb]/20 text-[#47f3bb]'
                          }`}>
                            PLAYING NOW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`py-3.5 px-4 ${isInterstellar ? 'text-[#38bdf8] font-medium' : 'text-[#47f3bb]'}`}>{t.plant}</td>
                    <td className="py-3.5 px-4 text-[#ffdf9d]">{t.scale}</td>
                    <td className="py-3.5 px-4 text-[#bacac1]">{t.duration}</td>
                    <td className="py-3.5 px-4 text-[#dde4de]">{t.author}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleTrack(t)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ml-auto ${
                          isPlaying
                            ? 'bg-[#ba1a1a] text-white shadow-[0_0_12px_rgba(255,180,171,0.4)]'
                            : isInterstellar
                              ? 'bg-[#0284c7] hover:bg-[#38bdf8] text-white hover:text-[#082f49] shadow-[0_0_15px_rgba(56,189,248,0.35)] hover:scale-105'
                              : 'bg-[#1b211e] hover:bg-[#47f3bb] hover:text-[#003827] text-[#47f3bb] border border-[#47f3bb]/30'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                        <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default SonicGardenView;
