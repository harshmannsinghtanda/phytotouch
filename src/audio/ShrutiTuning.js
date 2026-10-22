/* ==============================================================================
   ShrutiTuning.js
   PhytoTouch: Microtonal Shruti & Acoustic Tuning Systems
   Indian Classical 22-Shruti Grama, Just Intonation, Pythagorean, and Solfeggio
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

export const TUNING_SYSTEMS = {
  shuddha_just: {
    id: 'shuddha_just',
    name: 'Just Intonation (Shuddha Saptak)',
    subtitle: 'Pure Harmonic Ratios (5-limit)',
    desc: 'Purest acoustic consonance based on integer overtone ratios. Eliminates harmonic beating.',
    ratios: [1.0, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8],
    cents: [0, 204, 386, 498, 702, 884, 1088],
    shrutis: ['Shadja (1/1)', 'Chatushruti Rishabh (9/8)', 'Shuddha Gandhar (5/4)', 'Shuddha Madhyam (4/3)', 'Pancham (3/2)', 'Chatushruti Dhaivat (5/3)', 'Shuddha Nishad (15/8)']
  },
  shruti_22: {
    id: 'shruti_22',
    name: 'Bharata 22-Shruti (Natyashastra)',
    subtitle: 'Ancient Vedic Grama Microtonality',
    desc: 'Ancient microtonal tuning calibrated to classical Vedic modal aesthetics and emotional Rasas.',
    ratios: [1.0, 10/9, 81/64, 45/32, 3/2, 27/16, 243/128],
    cents: [0, 182, 408, 590, 702, 906, 1110],
    shrutis: ['Shadja (Chhandovati)', 'Trishruti Re (Ranjani)', 'Antara Ga (Roudri)', 'Teevra Ma (Vajrika)', 'Pancham (Alapini)', 'Trishruti Dha (Madanti)', 'Kakali Ni (Kshobhini)']
  },
  pythagorean: {
    id: 'pythagorean',
    name: 'Pythagorean Sacred 432 Hz',
    subtitle: 'Circle of Pure 3:2 Fifths',
    desc: 'Harmonic series derived entirely from geometric stacking of pure acoustic fifths (3:2).',
    ratios: [1.0, 9/8, 81/64, 4/3, 3/2, 27/16, 243/128],
    cents: [0, 204, 408, 498, 702, 906, 1110],
    shrutis: ['1/1 Fundamental', '9/8 Major Second', '81/64 Ditone', '4/3 Diatessaron', '3/2 Diapente', '27/16 Major Sixth', '243/128 Major Seventh']
  },
  equal_temperament: {
    id: 'equal_temperament',
    name: '12-Tone Equal Temperament (12-TET)',
    subtitle: 'Modern Standard Western Tuning',
    desc: 'Mathematically divided 1200-cent octave. Consistent transposition across all keys.',
    ratios: [
      1.0,
      Math.pow(2, 2/12),
      Math.pow(2, 4/12),
      Math.pow(2, 5/12),
      Math.pow(2, 7/12),
      Math.pow(2, 9/12),
      Math.pow(2, 11/12)
    ],
    cents: [0, 200, 400, 500, 700, 900, 1100],
    shrutis: ['C4 (+0¢)', 'D4 (+0¢)', 'E4 (+0¢)', 'F4 (+0¢)', 'G4 (+0¢)', 'A4 (+0¢)', 'B4 (+0¢)']
  },
  solfeggio_matrix: {
    id: 'solfeggio_matrix',
    name: 'Solfeggio Cellular Frequencies',
    subtitle: 'Anti-Stress Cellular Matrix',
    desc: 'Ancient sacred frequencies recognized for biological cellular resonance and deep meditation.',
    absoluteHz: [396.0, 417.0, 528.0, 639.0, 741.0, 852.0, 963.0],
    ratios: [1.0, 417/396, 528/396, 639/396, 741/396, 852/396, 963/396],
    cents: [0, 89, 498, 835, 1089, 1332, 1545],
    shrutis: ['UT - 396 Hz (Liberation)', 'RE - 417 Hz (Change)', 'MI - 528 Hz (Miracle DNA)', 'FA - 639 Hz (Harmony)', 'SOL - 741 Hz (Expression)', 'LA - 852 Hz (Intuition)', 'SI - 963 Hz (Crown)']
  }
};

/**
 * Calculate the frequency in Hz for a given leaf based on tuning system, base frequency, and cents offset
 */
export function calculateLeafFrequency(
  leafIndex,
  tuningSystemKey = 'shuddha_just',
  baseFrequency = 432,
  octaveOffset = 0,
  centsOffset = 0
) {
  const system = TUNING_SYSTEMS[tuningSystemKey] || TUNING_SYSTEMS.shuddha_just;
  let freq = 432;

  if (system.absoluteHz && system.absoluteHz[leafIndex] !== undefined) {
    freq = system.absoluteHz[leafIndex];
  } else {
    const ratio = system.ratios[leafIndex % system.ratios.length] || 1.0;
    freq = baseFrequency * ratio;
  }

  // Apply octave transposition
  freq *= Math.pow(2, octaveOffset);

  // Apply fine microtonal cents offset (1 cent = 2^(1/1200))
  if (centsOffset !== 0) {
    freq *= Math.pow(2, centsOffset / 1200);
  }

  return parseFloat(freq.toFixed(2));
}
