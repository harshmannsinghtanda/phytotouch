import React, { useState } from 'react';
import { Play, Pause, Radio, Volume2, Globe, Heart, Download, Share2, Sparkles, Activity, Music } from 'lucide-react';
import { audioEngine } from '../audio/PlantAudioEngine';

export function SonicGardenView() {
  const [playingStream, setPlayingStream] = useState(null);
  const [masterPlaying, setMasterPlaying] = useState(false);

  const streams = [
    {
      id: 'kyoto',
      title: 'Zen Juniperus Chinensis',
      location: 'KYOTO • RELAY #01',
      scale: 'C Lydian 432Hz',
      voltage: '0.62 mV',
      listeners: '342 tuned in',
      desc: 'Bonsai tree biopotentials generating meditative, cyclic Lydian bells and harmonic brass.',
      notes: ['C4', 'E4', 'G4', 'B4']
    },
    {
      id: 'amazon',
      title: 'Amazonian Epiphytic Orchid',
      location: 'MANAUS • RELAY #04',
      scale: 'Microtonal Rainscale',
      voltage: '1.48 mV',
      listeners: '189 tuned in',
      desc: 'High-humidity sap flow triggering delicate crystalline kalimba patterns and raindrop harmonics.',
      notes: ['F4', 'A4', 'C5', 'E5']
    },
    {
      id: 'sequoia',
      title: 'Sequoia Sempervirens',
      location: 'CALIFORNIA • RELAY #09',
      scale: 'Deep Ground 432Hz',
      voltage: '4.12 mV',
      listeners: '512 tuned in',
      desc: 'Massive old-growth xylem fluid dynamics driving warm sub-bass acoustic cello reverberations.',
      notes: ['A2', 'C3', 'E3', 'A3']
    }
  ];

  const tracks = [
    { id: 1, title: 'Perforated Veins in Berlin', plant: 'Monstera Deliciosa', duration: '18:24', scale: 'Lydian 432 Hz', author: 'Dr. Elena Voss' },
    { id: 2, title: 'Alpine Lichen Sleep Cycle', plant: 'Xanthoria Elegans', duration: '34:10', scale: 'Hirajoshi Minor', author: 'Julian Thorne' },
    { id: 3, title: 'Action Potentials: Flytrap', plant: 'Dionaea Muscipula', duration: '08:45', scale: 'Rapid Pentatonic', author: 'BioSound Lab' },
    { id: 4, title: 'Redwood Sapling at Dawn', plant: 'Sequoia Gigantea', duration: '22:15', scale: 'Earth 432 Hz Saptak', author: 'Nirman Bio-Acoustics' }
  ];

  const toggleStream = (stream) => {
    audioEngine.unlock();
    if (playingStream === stream.id) {
      setPlayingStream(null);
    } else {
      setPlayingStream(stream.id);
      // Play a generative motif
      stream.notes.forEach((note, idx) => {
        setTimeout(() => {
          audioEngine.triggerAttackRelease(note, '4n');
        }, idx * 250);
      });
    }
  };

  const toggleMaster = () => {
    audioEngine.unlock();
    const next = !masterPlaying;
    setMasterPlaying(next);
    if (next) {
      ['C4', 'E4', 'G4', 'C5'].forEach((note, idx) => {
        setTimeout(() => audioEngine.triggerAttackRelease(note, '2n'), idx * 300);
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
                  <span className="text-[#47f3bb] font-bold">● LIVE:</span> Reykjavik Geothermal Fern Complex (Sub-Bass)
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
            <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1]">Archive &amp; Synchronous Relays</span>
          </div>
          <h1 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-[#dde4de] tracking-tight leading-none">
            The Sonic Garden
          </h1>
          <p className="font-['Inter'] text-sm sm:text-base text-[#bacac1] max-w-2xl mt-1 leading-relaxed">
            A collective repository of micro-volt electrical rhythms recorded directly from the living tissues of flora across the world. Transduced into pure MIDI, generative ambient modules, and continuous live broadcasts.
          </p>
        </div>

        {/* Quick Audio Player Pill / Master Seed */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#1b211e] border border-[#47f3bb]/20 shadow-xl">
          <button
            onClick={toggleMaster}
            className="w-12 h-12 rounded-xl bg-[#06d6a0] hover:bg-[#47f3bb] text-[#003827] flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,214,160,0.4)] cursor-pointer flex-shrink-0"
          >
            {masterPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#47f3bb] animate-pulse"></span>
              <span className="font-['JetBrains_Mono'] text-[9px] text-[#47f3bb] font-bold uppercase tracking-wider">
                Master Broadcast
              </span>
            </div>
            <span className="font-['Syne'] text-sm sm:text-base font-bold text-[#dde4de]">
              Root Systems &amp; Cloud Canopy
            </span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1]">
              Calathea Roseopicta • 432 Hz Resonant Matrix
            </span>
          </div>
        </div>
      </section>

      {/* Global Live Broadcast Hub (3 Stream Cards) */}
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
            const isPlaying = playingStream === s.id;
            return (
              <div
                key={s.id}
                className="bg-[#171d1a] border border-[#3b4a43]/40 rounded-2xl overflow-hidden shadow-xl hover:border-[#47f3bb]/40 transition-all flex flex-col justify-between"
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
                      {isPlaying ? 'STREAMING 432 Hz' : 'STANDBY'}
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
                    <span>{isPlaying ? 'Stop Feed' : 'Listen Live'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Curated Botanical Releases Table */}
      <section className="w-full px-4 md:px-8 py-10 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-['JetBrains_Mono'] text-xs text-[#f0c04d] uppercase tracking-widest font-semibold">
            Community Releases
          </span>
          <h2 className="font-['Syne'] text-2xl sm:text-3xl font-bold text-[#dde4de]">
            Curated Botanical Soundscapes
          </h2>
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
                <th className="py-3.5 px-4 text-right">LISTEN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3b4a43]/20">
              {tracks.map((t) => (
                <tr key={t.id} className="hover:bg-[#1b211e]/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#dde4de] flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#47f3bb]" />
                    <span>{t.title}</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#47f3bb]">{t.plant}</td>
                  <td className="py-3.5 px-4 text-[#ffdf9d]">{t.scale}</td>
                  <td className="py-3.5 px-4 text-[#bacac1]">{t.duration}</td>
                  <td className="py-3.5 px-4 text-[#dde4de]">{t.author}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        audioEngine.unlock();
                        audioEngine.triggerAttackRelease('D4', '4n');
                      }}
                      className="px-3 py-1 bg-[#1b211e] hover:bg-[#47f3bb] hover:text-[#003827] text-[#47f3bb] border border-[#47f3bb]/30 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                    >
                      PLAY
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
