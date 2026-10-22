/* ==============================================================================
   RagaRepertoire.js
   PhytoTouch: Classical Ragas & Melodic Tutorial Repertoire
   Calibrated for 7-Swara Saptak: Sa (0), Re (1), Ga (2), Ma (3), Pa (4), Dha (5), Ni (6)
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

export const RAGA_MELODIES = [
  {
    id: 'raga_yaman',
    title: 'Raga Yaman',
    subtitle: 'Kalyan Thaat • Evening Contemplation',
    tempoBpm: 84,
    description: 'Hindustani classical evening raga evoking serenity, devotion, and twilight calm.',
    notes: [
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.0 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 3, swara: 'Ma', hindi: 'म', note: 'F4', duration: 1.0 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 4, swara: 'Pa', hindi: 'प', note: 'G4', duration: 1.2 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.0 },
      { leaf: 0, swara: 'Sa', hindi: 'सा', note: 'C4', duration: 1.5 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.0 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 4, swara: 'Pa', hindi: 'प', note: 'G4', duration: 1.2 },
      { leaf: 3, swara: 'Ma', hindi: 'म', note: 'F4', duration: 1.0 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.2 },
      { leaf: 0, swara: 'Sa', hindi: 'सा', note: 'C4', duration: 2.0 }
    ]
  },
  {
    id: 'raga_bhupali',
    title: 'Raga Bhupali',
    subtitle: 'Audav-Audav • Dawn Serenity',
    tempoBpm: 92,
    description: 'Ancient 5-note pentatonic dawn raga celebrating universal harmony and balance.',
    notes: [
      { leaf: 0, swara: 'Sa', hindi: 'सा', note: 'C4', duration: 1.0 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.0 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.2 },
      { leaf: 4, swara: 'Pa', hindi: 'प', note: 'G4', duration: 1.2 },
      { leaf: 5, swara: 'Dha', hindi: 'ध', note: 'A4', duration: 1.0 },
      { leaf: 4, swara: 'Pa', hindi: 'प', note: 'G4', duration: 1.2 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.0 },
      { leaf: 0, swara: 'Sa', hindi: 'सा', note: 'C4', duration: 1.8 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.0 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 4, swara: 'Pa', hindi: 'प', note: 'G4', duration: 1.2 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.2 },
      { leaf: 0, swara: 'Sa', hindi: 'सा', note: 'C4', duration: 2.0 }
    ]
  },
  {
    id: 'saptak_scale',
    title: 'Saptak Octave (Aaroh & Avroh)',
    subtitle: '7-Swara Classical Octave Run',
    tempoBpm: 100,
    description: 'Ascending and descending demonstration of the full 7-swara bio-acoustic spectrum.',
    notes: [
      { leaf: 0, swara: 'Sa', hindi: 'सा', note: 'C4', duration: 1.0 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.0 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 3, swara: 'Ma', hindi: 'म', note: 'F4', duration: 1.0 },
      { leaf: 4, swara: 'Pa', hindi: 'प', note: 'G4', duration: 1.0 },
      { leaf: 5, swara: 'Dha', hindi: 'ध', note: 'A4', duration: 1.0 },
      { leaf: 6, swara: 'Ni', hindi: 'नी', note: 'B4', duration: 1.5 },
      { leaf: 6, swara: 'Ni', hindi: 'नी', note: 'B4', duration: 1.0 },
      { leaf: 5, swara: 'Dha', hindi: 'ध', note: 'A4', duration: 1.0 },
      { leaf: 4, swara: 'Pa', hindi: 'प', note: 'G4', duration: 1.0 },
      { leaf: 3, swara: 'Ma', hindi: 'म', note: 'F4', duration: 1.0 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.0 },
      { leaf: 0, swara: 'Sa', hindi: 'सा', note: 'C4', duration: 2.0 }
    ]
  },
  {
    id: 'ode_to_joy',
    title: 'Ode to Joy (Beethoven Symphony)',
    subtitle: 'Universal Classical Anthem',
    tempoBpm: 110,
    description: 'Inspiring classical melody ideal for demonstrating plant touch keyboard response.',
    notes: [
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 3, swara: 'Ma', hindi: 'म', note: 'F4', duration: 1.0 },
      { leaf: 4, swara: 'Pa', hindi: 'प', note: 'G4', duration: 1.0 },
      { leaf: 4, swara: 'Pa', hindi: 'प', note: 'G4', duration: 1.0 },
      { leaf: 3, swara: 'Ma', hindi: 'म', note: 'F4', duration: 1.0 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.0 },
      { leaf: 0, swara: 'Sa', hindi: 'सा', note: 'C4', duration: 1.0 },
      { leaf: 0, swara: 'Sa', hindi: 'सा', note: 'C4', duration: 1.0 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.0 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.2 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.0 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 0.8 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 2.0 }
    ]
  },
  {
    id: 'bansuri_forest',
    title: 'Bansuri Forest Meditation',
    subtitle: 'Deep Biophilic Ambience',
    tempoBpm: 68,
    description: 'Slow meditative flute raga with lingering room acoustic reverberation.',
    notes: [
      { leaf: 0, swara: 'Sa', hindi: 'सा', note: 'C4', duration: 1.5 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.5 },
      { leaf: 4, swara: 'Pa', hindi: 'प', note: 'G4', duration: 2.0 },
      { leaf: 3, swara: 'Ma', hindi: 'म', note: 'F4', duration: 1.2 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.2 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.5 },
      { leaf: 0, swara: 'Sa', hindi: 'सा', note: 'C4', duration: 2.2 },
      { leaf: 4, swara: 'Pa', hindi: 'प', note: 'G4', duration: 1.5 },
      { leaf: 5, swara: 'Dha', hindi: 'ध', note: 'A4', duration: 1.5 },
      { leaf: 4, swara: 'Pa', hindi: 'प', note: 'G4', duration: 2.0 },
      { leaf: 2, swara: 'Ga', hindi: 'ग', note: 'E4', duration: 1.2 },
      { leaf: 1, swara: 'Re', hindi: 'रे', note: 'D4', duration: 1.5 },
      { leaf: 0, swara: 'Sa', hindi: 'सा', note: 'C4', duration: 3.0 }
    ]
  }
];
