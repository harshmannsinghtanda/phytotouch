import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Radio, Volume2, Globe, Heart, Download, Share2, Sparkles, Activity, Music, Waves, VolumeX, RotateCcw, RotateCw, Flame } from 'lucide-react';
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
      id: 'interstellar-cornfield',
      title: 'Interstellar: Cornfield Chase (The Iconic Theme)',
      plant: 'Tillandsia Usneoides (Zero-G Air Plant)',
      duration: '02:07',
      scale: 'Fast Galloping Pipe Organ Arpeggios',
      author: 'Hans Zimmer × Temple Church Organ',
      preset: 'interstellar',
      audioFile: '/audio/cornfield_chase.mp3',
      notes: ['E4', 'F4', 'E4', 'D4', 'C4', 'B3'],
      intervalMs: 250,
      badge: 'ICONIC THEME'
    },
    {
      id: 'interstellar-docking',
      title: 'Interstellar: No Time for Caution (The Docking Climax)',
      plant: 'Gargantua Gravity Relay Specimen',
      duration: '04:06',
      scale: 'Accelerando Ostinato & Massive Organ Drop',
      author: 'Hans Zimmer × London Organ Suite',
      preset: 'interstellar',
      audioFile: '/audio/no_time_for_caution.mp3',
      notes: ['A2', 'E4', 'A4', 'C5', 'B4', 'E5'],
      intervalMs: 350,
      badge: '💥 THE MASSIVE DROP'
    },
    {
      id: 'interstellar-dayone',
      title: 'Interstellar: Day One (Official Title Track)',
      plant: 'Calathea Bio-Acoustic Sensor',
      duration: '03:19',
      scale: '2-Note Solitude Piano & Swelling Organ',
      author: 'Hans Zimmer × Abbey Road Studios',
      preset: 'interstellar',
      audioFile: '/audio/day_one_theme.mp3',
      notes: ['A2', 'E4', 'F4', 'C4'],
      intervalMs: 700,
      badge: 'ORIGINAL MOTIF'
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

  // Scrubber timeline state (in seconds)
  const audioRef = useRef(null);
  const [playMode, setPlayMode] = useState('studio'); // 'studio' | 'synth'
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(127);
  const playbackTimeRef = useRef(0);

  const isInterstellarItem = (item) => {
    return item && (item.id === 'interstellar' || String(item.id).startsWith('interstellar'));
  };

  const totalDuration = (isInterstellarItem(activeItem) && playMode === 'studio')
    ? (audioDuration || 127)
    : 200; // 3 minutes 20 seconds cinematic arc

  useEffect(() => {
    playbackTimeRef.current = playbackTime;
  }, [playbackTime]);

  // Format MM:SS helper
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Compute Hans Zimmer Interstellar Dramatic Phase
  const getInterstellarPhase = (sec) => {
    if (activeItem?.id === 'interstellar-docking') {
      if (sec < 60) {
        return {
          phase: 1,
          title: 'Phase 1: Ticking Clock',
          badge: 'TICKING CLOCK',
          badgeColor: 'text-[#38bdf8] bg-[#38bdf8]/15 border-[#38bdf8]/30',
          desc: '1.25s mechanical clock ticks as the Endurance spins in deep space.'
        };
      } else if (sec < 110) {
        return {
          phase: 2,
          title: 'Phase 2: Ostinato Climb',
          badge: 'OSTINATO SWELL',
          badgeColor: 'text-[#47f3bb] bg-[#47f3bb]/15 border-[#47f3bb]/30',
          desc: 'Accelerating organ ostinato climbs in octaves Am → F → C → G.'
        };
      } else if (sec < 130) {
        return {
          phase: 3,
          title: 'Phase 3: "It\'s Necessary"',
          badge: '⚡ MOUNTING TENSION',
          badgeColor: 'text-[#f0c04d] bg-[#f0c04d]/20 border-[#f0c04d]/40',
          desc: 'RPM matching sequence. Roaring brass and massive filter opening!'
        };
      } else if (sec < 195) {
        return {
          phase: 4,
          title: 'Phase 4: The Monumental Drop',
          badge: '💥 THE MASSIVE DROP',
          badgeColor: 'text-[#ff5449] bg-[#ba1a1a]/30 border-[#ff5449]/50 animate-pulse',
          desc: 'Loudest cathedral pipe organ blast in movie history! Full lock achieved!'
        };
      } else {
        return {
          phase: 5,
          title: 'Phase 5: Docking Resolution',
          badge: 'HEROIC OUTRO',
          badgeColor: 'text-[#c084fc] bg-[#c084fc]/15 border-[#c084fc]/30',
          desc: 'Spins stabilized, heroic harmonic resolution fading into orbit.'
        };
      }
    }

    if (activeItem?.id === 'interstellar-dayone') {
      if (sec < 70) {
        return {
          phase: 1,
          title: 'Phase 1: Solitude Motif',
          badge: '2-NOTE PIANO (E-F)',
          badgeColor: 'text-[#38bdf8] bg-[#38bdf8]/15 border-[#38bdf8]/30',
          desc: 'Tender 2-note Zimmer piano melody evoking human solitude.'
        };
      } else if (sec < 135) {
        return {
          phase: 2,
          title: 'Phase 2: Temple Organ Swell',
          badge: 'CHURCH ORGAN SWELL',
          badgeColor: 'text-[#f0c04d] bg-[#f0c04d]/20 border-[#f0c04d]/40',
          desc: 'London Temple Church pipe organ envelopes the melody in acoustics.'
        };
      } else {
        return {
          phase: 3,
          title: 'Phase 3: Grand Theme',
          badge: 'COSMIC RESOLUTION',
          badgeColor: 'text-[#47f3bb] bg-[#47f3bb]/15 border-[#47f3bb]/30',
          desc: 'Warm cosmic chords drifting toward the stars.'
        };
      }
    }

    // Default: Cornfield Chase (The World-Famous Theme)
    if (sec < 35) {
      return {
        phase: 1,
        title: 'Phase 1: Organ Flutter',
        badge: 'GALLOPING ARPEGGIO',
        badgeColor: 'text-[#38bdf8] bg-[#38bdf8]/15 border-[#38bdf8]/30',
        desc: 'Rapid breathless pipe organ arpeggios dancing across the keys.'
      };
    } else if (sec < 65) {
      return {
        phase: 2,
        title: 'Phase 2: Accelerating Chase',
        badge: 'ORCHESTRAL MOMENTUM',
        badgeColor: 'text-[#47f3bb] bg-[#47f3bb]/15 border-[#47f3bb]/30',
        desc: 'Strings and winds surge forward chasing the surveillance drone!'
      };
    } else if (sec < 100) {
      return {
        phase: 3,
        title: 'Phase 3: The Epic Crescendo',
        badge: '💥 THE FULL CRESCENDO',
        badgeColor: 'text-[#ff5449] bg-[#ba1a1a]/30 border-[#ff5449]/50 animate-pulse',
        desc: 'Massive full cathedral organ and brass blast in pure exhilaration!'
      };
    } else {
      return {
        phase: 4,
        title: 'Phase 4: Heroic Climax',
        badge: 'HEROIC FINALE',
        badgeColor: 'text-[#c084fc] bg-[#c084fc]/15 border-[#c084fc]/30',
        desc: 'The truck emerges from the cornfield into triumphant open skies.'
      };
    }
  };

  // Adaptive Quick Jump points
  const getJumpPoints = () => {
    if (activeItem?.id === 'interstellar-docking') {
      return [
        { time: 0, label: '0:00 Ticking Clock' },
        { time: 60, label: '1:00 Ostinato' },
        { time: 110, label: '1:50 "It\'s Necessary"' },
        { time: 130, label: '2:10 THE DROP', isDrop: true },
        { time: 200, label: '3:20 Climax' }
      ];
    }
    if (activeItem?.id === 'interstellar-dayone') {
      return [
        { time: 0, label: '0:00 2-Note Piano' },
        { time: 70, label: '1:10 Organ Swell', isDrop: true },
        { time: 135, label: '2:15 Grand Theme' }
      ];
    }
    // Default: Cornfield Chase
    return [
      { time: 0, label: '0:00 Organ Intro' },
      { time: 35, label: '0:35 Rising Chase' },
      { time: 65, label: '1:05 THE CRESCENDO', isDrop: true },
      { time: 100, label: '1:40 Heroic Climax' }
    ];
  };

  // Quick switch between Interstellar tracks
  const selectInterstellarTrack = (trackId) => {
    const target = tracks.find((t) => t.id === trackId);
    if (!target) return;
    setActiveItem({
      type: 'track',
      id: target.id,
      title: target.title,
      plant: target.plant,
      audioFile: target.audioFile
    });
    setPlaybackTime(0);
    playbackTimeRef.current = 0;
    setIsPlaying(true);
    if (playMode === 'studio' && audioRef.current) {
      audioRef.current.src = target.audioFile;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else {
      audioEngine.unlock();
    }
  };

  // Seek helper
  const seekTo = (sec) => {
    const clamped = Math.max(0, Math.min(totalDuration, sec));
    setPlaybackTime(clamped);
    playbackTimeRef.current = clamped;

    if (isInterstellarItem(activeItem) && playMode === 'studio' && audioRef.current) {
      audioRef.current.currentTime = clamped;
      if (!isPlaying) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    audioEngine.unlock();
    if (!activeItem) {
      setActiveItem(tracks[0]);
      setIsPlaying(true);
    } else if (!isPlaying) {
      setIsPlaying(true);
    }

    // Instant acoustic feedback on seek
    if (clamped >= 115 && clamped < 170) {
      audioEngine.setFilterCutoff(5800);
      audioEngine.triggerAttackRelease(['A1', 'A2'], '1m', 0.32);
      audioEngine.triggerAttackRelease('E5', '2n', 0.30);
    } else if (clamped >= 75) {
      audioEngine.setFilterCutoff(3600);
      audioEngine.triggerAttackRelease('D2', '2n', 0.24);
    } else if (clamped >= 30) {
      audioEngine.setFilterCutoff(2400);
      audioEngine.triggerAttackRelease('A2', '2n', 0.22);
    } else {
      audioEngine.setFilterCutoff(1200);
      audioEngine.triggerAttackRelease('A2', '2n', 0.20);
      audioEngine.triggerAttackRelease('E4', '2n', 0.22);
    }
  };

  const seekOffset = (delta) => {
    seekTo(playbackTime + delta);
  };

  // Continuous Generative Ambient Audio Loop & Dynamic Interstellar Engine
  useEffect(() => {
    if (!activeItem || !isPlaying) return;

    // In studio mode for Interstellar, use high-fidelity audio element
    if (isInterstellarItem(activeItem) && playMode === 'studio') {
      if (audioRef.current) {
        const targetSrc = activeItem.audioFile || '/audio/cornfield_chase.mp3';
        if (!audioRef.current.src.endsWith(targetSrc)) {
          audioRef.current.src = targetSrc;
        }
        audioRef.current.currentTime = playbackTimeRef.current;
        audioRef.current.play().catch((e) => console.log('Audio play error:', e));
      }
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    }

    audioEngine.unlock();

    // Hans Zimmer Interstellar 5-Phase Cinematic Dynamic Engine (Bio-Synth mode)
    if (activeItem.type === 'track' && activeItem.id === 'interstellar') {
      audioEngine.setPreset('interstellar');

      // 1. Advance timeline seconds clock
      const clockTimer = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= totalDuration) return 0;
          return prev + 1;
        });
      }, 1000);

      let ostinatoStep = 0;
      let lastPhase1Second = -1;

      // 2. High-performance Musical Note Scheduler
      const audioTicker = setInterval(() => {
        const sec = playbackTimeRef.current;

        // Phase 1: Cosmic Solitude (0 - 30s) - Quiet 2-Note Theme
        if (sec < 30) {
          audioEngine.setFilterCutoff(1200);
          if (sec !== lastPhase1Second) {
            lastPhase1Second = sec;
            if (sec % 8 === 0) {
              audioEngine.triggerAttackRelease('A2', '2n', 0.22);
              setTimeout(() => audioEngine.triggerAttackRelease('E4', '2n', 0.24), 100);
            } else if (sec % 8 === 4) {
              audioEngine.triggerAttackRelease('F4', '2n', 0.22);
            }
          }
        }
        // Phase 2: Clockwork Ostinato (30 - 75s) - Am -> F -> C -> G
        else if (sec >= 30 && sec < 75) {
          audioEngine.setFilterCutoff(2400);
          ostinatoStep++;

          const chordIndex = Math.floor((sec - 30) / 11.25) % 4;
          const chords = [
            { bass: 'A2', arp: ['E4', 'A4', 'C5', 'B4', 'E5', 'B4', 'C5', 'A4'] },
            { bass: 'F2', arp: ['F4', 'A4', 'C5', 'E5', 'F5', 'E5', 'C5', 'A4'] },
            { bass: 'C3', arp: ['G4', 'C5', 'E5', 'G5', 'E5', 'C5', 'G4', 'E4'] },
            { bass: 'G2', arp: ['D4', 'G4', 'B4', 'D5', 'E5', 'D5', 'B4', 'G4'] }
          ];
          const chord = chords[chordIndex];
          const noteIdx = ostinatoStep % 8;

          if (noteIdx === 0) {
            audioEngine.triggerAttackRelease(chord.bass, '2n', 0.24);
          }
          audioEngine.triggerAttackRelease(chord.arp[noteIdx], '4n', 0.20);
        }
        // Phase 3: Gravitational Tension & Accelerando (75 - 115s)
        else if (sec >= 75 && sec < 115) {
          audioEngine.setFilterCutoff(3800);
          ostinatoStep++;

          // Sudden dead drop anticipation silence at 113s - 114s!
          if (sec >= 113 && sec < 115) {
            return;
          }

          const tensionIndex = Math.floor((sec - 75) / 10) % 4;
          const tensionChords = [
            { bass: 'D2', oct: 'D1', arp: ['D4', 'F4', 'A4', 'C5', 'D5', 'C5', 'A4', 'F4'] },
            { bass: 'F2', oct: 'F1', arp: ['F4', 'A4', 'C5', 'E5', 'F5', 'E5', 'C5', 'A4'] },
            { bass: 'G2', oct: 'G1', arp: ['G4', 'B4', 'D5', 'F5', 'G5', 'F5', 'D5', 'B4'] },
            { bass: 'E2', oct: 'E1', arp: ['E4', 'G#4', 'B4', 'D5', 'E5', 'D5', 'B4', 'G#4'] }
          ];
          const chord = tensionChords[tensionIndex];
          const noteIdx = ostinatoStep % 8;

          if (noteIdx === 0) {
            audioEngine.triggerAttackRelease([chord.oct, chord.bass], '2n', 0.26);
          }
          audioEngine.triggerAttackRelease(chord.arp[noteIdx], '4n', 0.22);
        }
        // Phase 4: 🔥 THE MONUMENTAL DROP (115 - 170s)
        else if (sec >= 115 && sec < 170) {
          audioEngine.setFilterCutoff(5800);
          ostinatoStep++;

          const dropChordIndex = Math.floor((sec - 115) / 13.75) % 4;
          const dropChords = [
            { bass: ['A1', 'A2'], lead: 'E5', arp: ['E4', 'A4', 'C5', 'E5', 'A5', 'E5', 'C5', 'A4'] },
            { bass: ['F1', 'F2'], lead: 'D5', arp: ['F4', 'A4', 'C5', 'E5', 'F5', 'E5', 'C5', 'A4'] },
            { bass: ['C2', 'C3'], lead: 'C5', arp: ['G4', 'C5', 'E5', 'G5', 'C6', 'G5', 'E5', 'C5'] },
            { bass: ['G1', 'G2'], lead: 'B4', arp: ['D4', 'G4', 'B4', 'D5', 'G5', 'D5', 'B4', 'G4'] }
          ];
          const chord = dropChords[dropChordIndex];
          const noteIdx = ostinatoStep % 8;

          if (noteIdx === 0) {
            // Thunderous sub-bass octave organ pedal
            audioEngine.triggerAttackRelease(chord.bass, '1m', 0.32);
            // Soaring Hans Zimmer climax melody
            setTimeout(() => {
              audioEngine.triggerAttackRelease(chord.lead, '2n', 0.28);
            }, 120);
          }
          audioEngine.triggerAttackRelease(chord.arp[noteIdx], '8n', 0.24);
        }
        // Phase 5: Event Horizon Resolution (170 - 200s)
        else {
          audioEngine.setFilterCutoff(1600);
          if (sec !== lastPhase1Second) {
            lastPhase1Second = sec;
            if (sec % 6 === 0) {
              audioEngine.triggerAttackRelease(['A2', 'E4', 'A4', 'C5'], '2n', 0.18);
            }
          }
        }
      }, 350);

      return () => {
        clearInterval(clockTimer);
        clearInterval(audioTicker);
      };
    }

    // Default continuous ambient loop for other botanical recordings / streams
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

    audioEngine.triggerAttackRelease(notes[0], '4n', 0.25);

    const timer = setInterval(() => {
      step++;
      const dir = Math.random() > 0.48 ? 1 : -1;
      let nextIdx = Math.max(0, Math.min(notes.length - 1, lastIdx + dir));
      if (nextIdx === lastIdx) {
        nextIdx = Math.floor(Math.random() * notes.length);
      }
      lastIdx = nextIdx;

      const note = notes[nextIdx];
      const isChordStep = step % 6 === 0;

      if (isChordStep && notes.length >= 3) {
        const c1 = notes[0];
        const c2 = notes[2 % notes.length];
        const c3 = notes[4 % notes.length];
        audioEngine.triggerAttackRelease(c1, '2n', 0.20);
        setTimeout(() => audioEngine.triggerAttackRelease(c2, '2n', 0.16), 80);
        setTimeout(() => audioEngine.triggerAttackRelease(c3, '2n', 0.14), 160);
      } else {
        const velocity = 0.18 + Math.random() * 0.08;
        const dur = (preset === 'celestial_pad' || preset === 'cello' || preset === 'interstellar') ? '2n' : '4n';
        audioEngine.triggerAttackRelease(note, dur, velocity);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeItem, isPlaying]);

  // Toggle Stream Helper
  const toggleStream = (s) => {
    if (audioRef.current) audioRef.current.pause();
    audioEngine.unlock();
    if (activeItem?.type === 'stream' && activeItem.id === s.id && isPlaying) {
      setIsPlaying(false);
    } else {
      setActiveItem({ type: 'stream', id: s.id, title: s.title, plant: s.location });
      setIsPlaying(true);
    }
  };

  // Toggle Track Helper
  const toggleTrack = (t) => {
    if (activeItem?.type === 'track' && activeItem.id === t.id && isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    } else {
      setActiveItem({
        type: 'track',
        id: t.id,
        title: t.title,
        plant: t.plant,
        audioFile: t.audioFile
      });
      setIsPlaying(true);
      if (isInterstellarItem(t) && playMode === 'studio') {
        if (audioRef.current) {
          const targetSrc = t.audioFile || '/audio/cornfield_chase.mp3';
          if (!audioRef.current.src.endsWith(targetSrc)) {
            audioRef.current.src = targetSrc;
          }
          audioRef.current.currentTime = playbackTimeRef.current;
          audioRef.current.play().catch(() => {});
        }
      } else {
        if (audioRef.current) audioRef.current.pause();
        audioEngine.unlock();
      }
    }
  };

  // Toggle Master Broadcast
  const toggleMaster = () => {
    if (audioRef.current) audioRef.current.pause();
    audioEngine.unlock();
    if (activeItem?.type === 'master' && isPlaying) {
      setIsPlaying(false);
    } else {
      setActiveItem({
        type: 'master',
        id: 'master-01',
        title: 'Root Systems & Cloud Canopy',
        plant: 'Calathea Roseopicta'
      });
      setIsPlaying(true);
    }
  };

  // Toggle Current Active Item Playback
  const handleTogglePlay = () => {
    if (!activeItem) {
      toggleMaster();
      return;
    }
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    } else {
      setIsPlaying(true);
      if (isInterstellarItem(activeItem) && playMode === 'studio') {
        if (audioRef.current) {
          const targetSrc = activeItem.audioFile || '/audio/cornfield_chase.mp3';
          if (!audioRef.current.src.endsWith(targetSrc)) {
            audioRef.current.src = targetSrc;
          }
          audioRef.current.currentTime = playbackTimeRef.current;
          audioRef.current.play().catch(() => {});
        }
      } else {
        audioEngine.unlock();
      }
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

        {/* Global Floating Master Seed Player Card & Timeline Scrubber */}
        <div className={`flex flex-col gap-3 p-4 md:p-5 rounded-2xl border transition-all shadow-xl w-full xl:w-auto xl:min-w-[550px] ${
          isPlaying
            ? isInterstellarItem(activeItem)
              ? 'bg-[#0f1f2e] border-[#38bdf8]/60 shadow-[0_0_30px_rgba(56,189,248,0.25)]'
              : 'bg-[#252b28] border-[#47f3bb]/50 shadow-[0_0_24px_rgba(6,214,160,0.2)]'
            : 'bg-[#1b211e] border-[#3b4a43]/40'
        }`}>
          {/* HTML5 Audio Tag for High-Fidelity Studio Master Recordings */}
          <audio
            ref={audioRef}
            src={activeItem?.audioFile || '/audio/cornfield_chase.mp3'}
            preload="auto"
            onLoadedMetadata={(e) => {
              if (e.target.duration && !isNaN(e.target.duration)) {
                setAudioDuration(Math.floor(e.target.duration));
              }
            }}
            onTimeUpdate={(e) => {
              if (isInterstellarItem(activeItem) && playMode === 'studio') {
                const cur = Math.floor(e.target.currentTime);
                setPlaybackTime(cur);
                playbackTimeRef.current = cur;
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
              setPlaybackTime(0);
              playbackTimeRef.current = 0;
            }}
          />

          {/* Top Row: Play/Pause button + Track Info + Dynamic Phase Badge */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePlay}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
                  isPlaying
                    ? 'bg-[#ba1a1a] text-white shadow-[0_0_15px_rgba(255,180,171,0.5)] active:scale-95'
                    : 'bg-[#06d6a0] hover:bg-[#47f3bb] text-[#003827] shadow-[0_0_15px_rgba(6,214,160,0.4)] hover:scale-105 active:scale-95'
                }`}
                title={isPlaying ? 'Pause Audio' : 'Play Audio'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-[#47f3bb] animate-ping' : 'bg-[#bacac1]'}`}></span>
                  <span className={`font-['JetBrains_Mono'] text-[9px] font-bold uppercase tracking-wider ${isPlaying ? 'text-[#47f3bb]' : 'text-[#bacac1]'}`}>
                    {isPlaying ? 'LIVE STREAMING' : 'STANDBY'}
                  </span>
                  {isInterstellarItem(activeItem) && (
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-extrabold tracking-wider uppercase font-['JetBrains_Mono'] ${getInterstellarPhase(playbackTime).badgeColor}`}>
                      {getInterstellarPhase(playbackTime).badge}
                    </span>
                  )}
                </div>
                <span className="font-['Syne'] text-sm sm:text-base font-bold text-[#dde4de]">
                  {activeItem ? activeItem.title : 'Interstellar: Cornfield Chase (The Iconic Theme)'}
                </span>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#f0c04d]">
                  {activeItem ? `Active Specimen: ${activeItem.plant}` : 'Tillandsia Usneoides • Zero-G 432 Hz Resonant Matrix'}
                </span>
              </div>
            </div>

            {/* Skip -15s / +15s controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => seekOffset(-15)}
                className="p-2 rounded-xl bg-[#171d1a] hover:bg-[#252b28] border border-[#3b4a43]/40 text-[#bacac1] hover:text-white transition-all cursor-pointer flex items-center justify-center"
                title="Rewind 15 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => seekOffset(15)}
                className="p-2 rounded-xl bg-[#171d1a] hover:bg-[#252b28] border border-[#3b4a43]/40 text-[#bacac1] hover:text-white transition-all cursor-pointer flex items-center justify-center"
                title="Fast-forward 15 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Switch between the 3 Famous Interstellar Tracks */}
          {isInterstellarItem(activeItem) && (
            <div className="flex flex-col gap-2 bg-[#09100c] p-2.5 rounded-xl border border-[#38bdf8]/30">
              <div className="flex items-center justify-between">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#38bdf8] uppercase font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#38bdf8]" /> Choose Authentic Hans Zimmer Master:
                </span>
                <span className="text-[9px] font-['JetBrains_Mono'] text-[#bacac1]">
                  Official 320kbps Master Audio
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                <button
                  onClick={() => selectInterstellarTrack('interstellar-cornfield')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] font-bold text-left transition-all cursor-pointer flex flex-col ${
                    activeItem?.id === 'interstellar-cornfield'
                      ? 'bg-[#38bdf8] text-[#082f49] shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                      : 'bg-[#171d1a] text-[#bacac1] hover:text-white hover:bg-[#252b28]'
                  }`}
                >
                  <span className="font-extrabold flex items-center gap-1">🌽 Cornfield Chase</span>
                  <span className="text-[9px] opacity-80">The Fast Iconic Theme (02:07)</span>
                </button>

                <button
                  onClick={() => selectInterstellarTrack('interstellar-docking')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] font-bold text-left transition-all cursor-pointer flex flex-col ${
                    activeItem?.id === 'interstellar-docking'
                      ? 'bg-gradient-to-r from-[#ba1a1a] to-[#ff5449] text-white shadow-[0_0_12px_rgba(255,84,73,0.5)]'
                      : 'bg-[#171d1a] text-[#bacac1] hover:text-white hover:bg-[#252b28]'
                  }`}
                >
                  <span className="font-extrabold flex items-center gap-1">💥 No Time For Caution</span>
                  <span className="text-[9px] opacity-80">Docking Climax & Massive Drop (04:06)</span>
                </button>

                <button
                  onClick={() => selectInterstellarTrack('interstellar-dayone')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] font-bold text-left transition-all cursor-pointer flex flex-col ${
                    activeItem?.id === 'interstellar-dayone'
                      ? 'bg-[#f0c04d] text-[#2d2200] shadow-[0_0_12px_rgba(240,192,77,0.4)]'
                      : 'bg-[#171d1a] text-[#bacac1] hover:text-white hover:bg-[#252b28]'
                  }`}
                >
                  <span className="font-extrabold flex items-center gap-1">🎹 Day One</span>
                  <span className="text-[9px] opacity-80">Official Title Motif (03:19)</span>
                </button>
              </div>
            </div>
          )}

          {/* Dual Engine Switcher Pill (Active on Interstellar) */}
          {isInterstellarItem(activeItem) && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#09100c] px-3 py-2 rounded-xl border border-[#3b4a43]/40">
              <div className="flex items-center gap-1.5">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1] uppercase font-bold">
                  Audio Engine:
                </span>
              </div>
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setPlayMode('studio');
                    if (isPlaying && audioRef.current) {
                      audioRef.current.currentTime = playbackTimeRef.current;
                      audioRef.current.play().catch(() => {});
                    }
                  }}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    playMode === 'studio'
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-[#082f49] shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                      : 'bg-[#171d1a] text-[#bacac1] hover:text-white hover:bg-[#252b28]'
                  }`}
                  title="Play authentic Hans Zimmer pipe organ studio master recording with real drop and tension"
                >
                  <span>🎬</span> Studio Master Audio
                </button>
                <button
                  onClick={() => {
                    setPlayMode('synth');
                    if (audioRef.current) audioRef.current.pause();
                    audioEngine.unlock();
                  }}
                  className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    playMode === 'synth'
                      ? 'bg-[#47f3bb] text-[#003827] shadow-[0_0_12px_rgba(71,243,187,0.35)]'
                      : 'bg-[#171d1a] text-[#bacac1] hover:text-white hover:bg-[#252b28]'
                  }`}
                  title="Synthesize notes in real-time modulated by live plant bio-potential (432Hz)"
                >
                  <span>🌿</span> Bio-Synth 432Hz
                </button>
              </div>
            </div>
          )}

          {/* Interactive Timeline Scrubber Slider */}
          <div className="flex items-center gap-3 w-full bg-[#09100c] px-3 py-2 rounded-xl border border-[#3b4a43]/30">
            <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#47f3bb] w-11 text-right">
              {formatTime(playbackTime)}
            </span>
            <input
              type="range"
              min="0"
              max={totalDuration}
              value={playbackTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="w-full h-2 bg-[#252b28] rounded-lg appearance-none cursor-pointer accent-[#47f3bb] hover:accent-[#38bdf8] transition-all"
            />
            <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1] w-11">
              {formatTime(totalDuration)}
            </span>
          </div>

          {/* Interstellar Quick-Jump Phase Markers */}
          {isInterstellarItem(activeItem) && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[#3b4a43]/20">
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1] uppercase font-bold mr-1">
                Jump To:
              </span>
              {getJumpPoints().map((pt, idx) => {
                const isCurrent = Math.abs(playbackTime - pt.time) < 15;
                return (
                  <button
                    key={idx}
                    onClick={() => seekTo(pt.time)}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      pt.isDrop
                        ? isCurrent
                          ? 'bg-gradient-to-r from-[#ba1a1a] to-[#ff5449] text-white shadow-[0_0_12px_rgba(255,84,73,0.5)] animate-pulse'
                          : 'bg-[#ba1a1a]/30 text-[#ffb4ab] border border-[#ba1a1a]/50 hover:bg-[#ba1a1a] hover:text-white'
                        : isCurrent
                          ? 'bg-[#38bdf8] text-[#082f49]'
                          : 'bg-[#171d1a] text-[#bacac1] hover:text-white'
                    }`}
                  >
                    {pt.isDrop && <Flame className="w-3 h-3 text-[#ff5449]" />}
                    {pt.label}
                  </button>
                );
              })}
            </div>
          )}
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
            Click Play on any track to start generative playback calibrated to the plant species, or scrub the timeline above.
          </span>
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#171d1a] border border-[#3b4a43]/30 text-xs font-['Inter'] text-[#bacac1] mt-1">
            <Sparkles className="w-4 h-4 text-[#47f3bb] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#dde4de]">Botanical Field Attribution:</strong> The <em>Researcher / Recordist</em> column credits the contributing university laboratory, field botanist, or audio artist who attached bio-electrodes to the living specimen in the field to record its action potentials.
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-[#171d1a] border border-[#3b4a43]/40 rounded-2xl">
          <table className="w-full text-left border-collapse font-['JetBrains_Mono'] text-xs">
            <thead>
              <tr className="border-b border-[#3b4a43]/40 text-[#bacac1] bg-[#1b211e]">
                <th className="py-3.5 px-4">RECORDING TITLE</th>
                <th className="py-3.5 px-4">SPECIMEN</th>
                <th className="py-3.5 px-4">SCALE MATRIX</th>
                <th className="py-3.5 px-4">DURATION</th>
                <th className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span>RESEARCHER / RECORDIST</span>
                    <span className="text-[9px] text-[#47f3bb] font-normal lowercase">(field contributor)</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">CONTINUOUS AUDIO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b4a43]/20">
              {tracks.map((t) => {
                const isPlaying = activeItem?.type === 'track' && activeItem.id === t.id;
                const isInterstellar = isInterstellarItem(t);
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
