# 🌿 PhytoTouch: Living Plant Bio-Acoustic Synthesizer & Telemetry Workstation

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Latency: Sub-12ms](https://img.shields.io/badge/Latency-11.12ms%20(Sub--12ms)-cyan.svg)](datasets/phytotouch)
[![Hardware Cost](https://img.shields.io/badge/BOM%20Cost-%E2%82%B9830%20($10.02)-green.svg)](datasets/phytotouch)
[![Tuning](https://img.shields.io/badge/Tuning-432Hz%20Vedic%20Saptak-gold.svg)](datasets/phytotouch)
[![Institution](https://img.shields.io/badge/Nirman%20Lab-Terna%20Engineering%20College-blue.svg)](https://ternaengg.ac.in)

> **Document Reference**: `NIRMAN-LAB-2026-AGRO-07`  
> **Student Engineering Initiative 2026** • Terna Engineering College, Nerul, Navi Mumbai  
> *Transforming living plant electrophysiology into expressive 24-bit harmonic soundscapes and sensory therapy telemetry.*

---

## 📖 Overview

Modern urban environments suffer from acute sensory detachment and chronic stress, while conventional laboratory electrophysiology equipment costs between ₹60,000 and ₹2,50,000 and relies on invasive needle probes that destroy plant tissue.

**PhytoTouch** is an end-to-end cyber-physical bio-acoustic workstation bridging plant leaf capacitance fluctuations to client-side Web Audio DSP polyphonic synthesis via an ESP32 microcontroller and native Web Serial UART streaming at 115,200 baud. When human skin touches a leaf, parallel biological capacitance (~120 pF) modulates relaxation oscillator counts, triggering harmonic synthesis across the **7 Vedic Saptak swaras (Sa to Ni)** tuned to the **natural 432 Hz Verdi scale**.

---

## ⚡ Scientific Benchmarks & Highlights

- **Sub-12 ms Latency**: Total touch-to-sound latency of **11.12 ms** (DSO verified across 1,000 continuous stress cycles).
- **8 Botanical Species Tested**: *Ocimum sanctum* (Tulsi), *Monstera deliciosa*, *Epipremnum aureum* (Pothos), *Ficus elastica*, *Sansevieria*, *Spathiphyllum*, *Aloe vera*, and *Crassula ovata*.
- **99.8% Reliability**: Flawless triggering on broad-leaf high-electrolyte specimens.
- **100% Non-Destructive**: 0.0% foliar tissue necrosis over 30 days of continuous surface contact.
- **₹830 ($10.02 USD) Total BOM Cost**: 96.7% cost reduction compared to commercial plant synthesizers (e.g., PlantWave ₹24,800).
- **Clinical Validation**: +22.4% self-reported calmness gain across 135 trial participants (Therapists, STEAM Educators, Engineers).

---

## 📂 Open Datasets Suite

The complete scientific dataset suite is published in [`datasets/phytotouch/`](datasets/phytotouch/):

| Dataset File | Format | Records | Description |
|:---|:---:|:---:|:---|
| [`multi_species_botanical_capacitance.csv`](datasets/phytotouch/multi_species_botanical_capacitance.csv) | CSV / JSON | 8 species | Baseline capacitance ($C_0$), touched capacitance ($C_{\text{touch}}$), $\Delta C$, thickness, area, and trigger reliability. |
| [`continuous_touch_latency_trials_1000.csv`](datasets/phytotouch/continuous_touch_latency_trials_1000.csv) | CSV / JSON | 1,000 trials | 1,000-cycle latency breakdown: ADC (4.15ms), Debounce (2.10ms), UART (1.78ms), Web Serial (1.42ms), DSP (1.65ms). |
| [`participant_user_testing_feedback_135.csv`](datasets/phytotouch/participant_user_testing_feedback_135.csv) | CSV / JSON | 135 rows | Clinical and educational trials across Sensory Therapy ($N=15$), STEAM ($N=28$), and Engineering Judges ($N=92$). |
| [`diurnal_transpiration_telemetry_24h.csv`](datasets/phytotouch/diurnal_transpiration_telemetry_24h.csv) | CSV / JSON | 1,440 min | 24-hour 1-min telemetry: Lux, temperature, humidity, soil moisture, and adaptive baseline tracking. |
| [`vedic_saptak_shruti_432hz_tuning.csv`](datasets/phytotouch/vedic_saptak_shruti_432hz_tuning.csv) | CSV / JSON | 7 swaras | 7 Vedic Saptak swaras (Sa to Ni), Just Intonation ratios, 432 Hz frequencies, and ESP32 GPIO pinout. |
| [`hardware_bom_unit_economics.csv`](datasets/phytotouch/hardware_bom_unit_economics.csv) | CSV / JSON | 5 parts | Bill of materials, component specs, supplier sourcing, and unit economics. |
| [`phytotouch_summary_benchmarks.json`](datasets/phytotouch/phytotouch_summary_benchmarks.json) | JSON | 1 object | Machine-readable benchmark KPIs and accuracy metrics. |

---

## 🛠️ Cyber-Physical Architecture

```
[Living Leaf Specimen] 
       │ (Dielectric Capacitance Delta: +114.2 pF)
       ▼
[Soft Copper Foil Clips] ──── (316L Stainless Steel Earth Reference Shunt)
       │
       ▼
[ESP32 DevKit V1 Microcontroller]
       ├─ Hardware Relaxation Oscillator ADC (GPIO 4, 14, 15, 13, 12, 27, 33)
       ├─ Exponential Moving Average (EMA Alpha = 0.45)
       └─ High-Speed UART Transmission @ 115,200 Baud
       │
       ▼ (USB-C Data Cable)
[Browser Web Serial API Client]
       ├─ TextDecoderStream Line Buffer
       ├─ P31 Phosphor CRT Oscilloscope Visualizer
       └─ Tone.js / Web Audio API DSP Synthesis Engine (432 Hz Just Intonation)
```

---

## 🚀 Running the Web Workstation Locally

```bash
# 1. Clone repository
git clone git@github.com:harshmannsinghtanda/phytotouch.git
cd phytotouch

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173/
```

### Hardware Setup
1. Flash [`firmware/phyto_sonic_esp32.ino`](firmware/phyto_sonic_esp32.ino) to an ESP32 using Arduino IDE.
2. Connect GPIO 4, 14, 15, 13, 12 to leaf electrodes using alligator clips.
3. Insert ground probe into moist soil.
4. Click **CONNECT SENSOR** in the web workstation and select the ESP32 serial port.

---

## 📜 Academic Citation

```bibtex
@dataset{phytotouch_2026,
  author       = {Tanda, Harshmann Singh and Nirman Lab Student Engineering Team},
  title        = {PhytoTouch: Multi-Species Plant Electrophysiology, Sub-12ms Latency Benchmarks, and Diurnal Transpiration Telemetry Dataset},
  institution  = {Terna Engineering College},
  year         = {2026},
  month        = {March},
  address      = {Nerul, Navi Mumbai, India},
  note         = {Project Reference: NIRMAN-LAB-2026-AGRO-07}
}
```

---
*Developed under the Nirman Lab Student Engineering Initiative 2026 • Terna Engineering College, Nerul, Navi Mumbai*
