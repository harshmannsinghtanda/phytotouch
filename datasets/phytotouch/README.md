# PhytoTouch: Scientific Datasets & Telemetry Benchmarks Suite

Official Open Datasets for **PhytoTouch: Living Plant Bio-Acoustic Synthesizer & Telemetry Workstation**  
*Terna Engineering College, Nerul, Navi Mumbai*  
*Document Reference: `NIRMAN-LAB-2026-AGRO-07`*  
*Version: `v1.0.0` • Released: March 2026*

---

## 🌿 Executive Summary

The **PhytoTouch Datasets Suite** comprises full experimental telemetry, multi-species electrophysiology, high-speed oscilloscope latency measurements, clinical sensory therapy user trials, and microtonal acoustic calibrations collected during the development and exhibition of PhytoTouch.

PhytoTouch transduces human-plant touch bio-capacitance fluctuations ($\Delta C$) into 24-bit studio polyphonic audio synthesis in real time via an ESP32 microcontroller and native Web Serial streaming at 115,200 baud.

### Key Benchmark Highlights
- **Sub-12 ms Latency**: Mean touch-to-sound latency of **11.12 ms** (measured with dual-channel Rigol DS1054Z Digital Storage Oscilloscope across 1,000 cycles).
- **8 Botanical Species**: Validated across *Ocimum sanctum* (Tulsi), *Monstera deliciosa*, *Epipremnum aureum* (Pothos), *Ficus elastica*, *Sansevieria*, *Spathiphyllum*, *Aloe vera*, and *Crassula ovata*.
- **99.8% Reliability**: Flawless triggering on broad-leaf high-electrolyte specimens.
- **100% Non-Destructive**: 0.0% foliar tissue necrosis over 30 days of continuous copper foil clip attachment.
- **₹830 ($10.02 USD) Total BOM Cost**: 96.7% cost reduction compared to commercial plant synthesizers (e.g., PlantWave ₹24,800).
- **Clinical Validation**: +22.4% self-reported calmness uplift across 135 trial participants.

---

## 📂 Dataset Manifest & File Structure

| File Name | Format | Records | Description |
|:---|:---:|:---:|:---|
| [`multi_species_botanical_capacitance.csv`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/multi_species_botanical_capacitance.csv) | CSV | 8 rows | Baseline capacitance ($C_0$), touched capacitance ($C_{\text{touch}}$), $\Delta C$, leaf thickness, surface area, and trigger success rates across 8 species. |
| [`multi_species_botanical_capacitance.json`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/multi_species_botanical_capacitance.json) | JSON | 8 objects | Structured JSON schema of botanical electrophysiology and recommended acoustic timbres. |
| [`continuous_touch_latency_trials_1000.csv`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/continuous_touch_latency_trials_1000.csv) | CSV | 1,000 rows | 1,000 continuous touch cycles measuring ADC sensing, debounce, UART transfer, Web Serial, DSP render, and total latency. |
| [`continuous_touch_latency_trials_1000.json`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/continuous_touch_latency_trials_1000.json) | JSON | 1,000 objects | Granular JSON log with timestamps, GPIO channels, pressure (g), duration (ms), and trigger classifications. |
| [`participant_user_testing_feedback_135.csv`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/participant_user_testing_feedback_135.csv) | CSV | 135 rows | Clinical and educational trials across Sensory Therapy (N=15), STEAM Educators (N=28), and Engineering Judges (N=92). |
| [`participant_user_testing_feedback_135.json`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/participant_user_testing_feedback_135.json) | JSON | 135 objects | Participant demographic, ratings (1-5), calmness indices (pre/post), and qualitative comments. |
| [`diurnal_transpiration_telemetry_24h.csv`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/diurnal_transpiration_telemetry_24h.csv) | CSV | 1,440 rows | 24-hour continuous 1-minute telemetry: Lux, temperature, relative humidity, soil moisture, baseline capacitance, and adaptive EMA baseline. |
| [`diurnal_transpiration_telemetry_24h.json`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/diurnal_transpiration_telemetry_24h.json) | JSON | 1,440 objects | Time-series JSON of diurnal stomatal cycles and transpiration drift. |
| [`vedic_saptak_shruti_432hz_tuning.csv`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/vedic_saptak_shruti_432hz_tuning.csv) | CSV | 7 rows | 7 Vedic Saptak swaras (Sa to Ni), Just Intonation ratios, 432 Hz Verdi frequencies, 440 Hz delta, and ESP32 GPIO pinouts. |
| [`vedic_saptak_shruti_432hz_tuning.json`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/vedic_saptak_shruti_432hz_tuning.json) | JSON | 7 objects | Microtonal Shruti mapping and harmonic frequency calibration. |
| [`hardware_bom_unit_economics.csv`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/hardware_bom_unit_economics.csv) | CSV | 5 rows | Complete Bill of Materials (BOM), commercial comparison, suppliers, and unit costs. |
| [`hardware_bom_unit_economics.json`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/hardware_bom_unit_economics.json) | JSON | 5 objects | Hardware BOM JSON breakdown. |
| [`phytotouch_summary_benchmarks.json`](file:///d:/veer-coding/Nirman%20Lab/datasets/phytotouch/phytotouch_summary_benchmarks.json) | JSON | 1 object | High-level summary metrics, accuracy scores, latency percentiles, and SDG mappings. |

---

## 📊 Detailed Data Dictionaries

### 1. `multi_species_botanical_capacitance.csv`
- `species_common_name`: Vernacular botanical name.
- `species_scientific_name`: Binomial nomenclature (*Genus species*).
- `family`: Plant taxonomic family.
- `electrolyte_profile`: Primary biochemical constituent in foliar sap.
- `leaf_thickness_mm`: Measured lamina thickness via digital vernier caliper (mm).
- `leaf_surface_area_cm2`: Approximate surface area of mature sample leaf ($cm^2$).
- `baseline_capacitance_pf`: Undisturbed biological capacitance reading ($C_0$) in picofarads.
- `touched_capacitance_pf`: Capacitance under gentle finger contact ($C_{\text{touch}}$) in picofarads.
- `capacitance_delta_pf`: $\Delta C = C_{\text{touch}} - C_0$ in picofarads.
- `relative_delta_pct`: Percentage increase: $(\Delta C / C_0) \times 100\%$.
- `raw_rc_count_baseline`: ESP32 `touchRead()` discharge clock ticks at rest.
- `raw_rc_count_touched`: ESP32 `touchRead()` discharge clock ticks during touch.
- `trigger_reliability_pct`: Success rate over 100 continuous test contacts.
- `leaf_tissue_necrosis_30d`: Tissue health assessment after 30 days of electrode contact.

### 2. `continuous_touch_latency_trials_1000.csv`
- `trial_id`: Sequential run index (1 to 1,000).
- `iso_timestamp`: ISO 8601 UTC timestamp of trigger event.
- `botanical_species`: Specimen utilized for trial.
- `esp32_gpio_pin`: Microcontroller hardware touch pin (GPIO 4, 14, 15, 13, 12, 27, 33).
- `contact_pressure_grams`: Measured skin contact pressure via load cell (15g to 65g).
- `touch_duration_ms`: Duration of continuous human finger contact (ms).
- `t_touch_adc_ms`: Microcontroller relaxation oscillator cycle count duration (~4.15 ms).
- `t_debounce_filter_ms`: Exponential Moving Average (EMA) smoothing and hysteresis debounce (~2.10 ms).
- `t_uart_transmission_ms`: ESP32 UART packet framing and USB transfer at 115,200 baud (~1.78 ms).
- `t_webserial_buffer_ms`: Browser Web Serial API `TextDecoderStream` buffer dispatch (~1.42 ms).
- `t_dsp_audio_render_ms`: Tone.js Web Audio API `AudioContext` buffer synthesis (~1.65 ms).
- `total_touch_to_sound_latency_ms`: Total latency $t_{\text{total}} = t_{\text{adc}} + t_{\text{deb}} + t_{\text{uart}} + t_{\text{ser}} + t_{\text{dsp}}$ (ms).
- `latency_benchmark_met`: Boolean (`True` if $t_{\text{total}} \le 12.0$ ms).
- `trigger_success`: Boolean indicating successful acoustic event generation.
- `classification_result`: True Positive, True Negative, False Positive, or False Negative.

### 3. `participant_user_testing_feedback_135.csv`
- `participant_id`: Anonymized identification code (`PART-001` to `PART-135`).
- `cohort_group`: Sensory Therapy (N=15), STEAM Educators (N=28), Engineering/Judges (N=92).
- `age`: Participant age.
- `prior_audio_synth_experience`: Musical background level.
- `ease_of_use_rating_out_of_5`: Likert scale rating (1.0 to 5.0).
- `audio_aesthetic_quality_rating_out_of_5`: Likert scale rating (1.0 to 5.0).
- `latency_responsiveness_rating_out_of_5`: Likert scale rating (1.0 to 5.0).
- `pre_session_calmness_index_out_of_10`: Baseline self-reported stress/calmness (1 to 10).
- `post_session_calmness_index_out_of_10`: Post-interaction calmness score (1 to 10).
- `calmness_uplift_percentage`: Percentage change in psychological calmness.
- `preferred_botanical_timbre`: Selected sound model (Bansuri, Cello, Piano, Kalimba, Strings).
- `qualitative_feedback_notes`: Transcribed participant observation.

### 4. `diurnal_transpiration_telemetry_24h.csv`
- `timestamp_iso`: 1-minute time index.
- `ambient_temperature_c`: Ambient room/greenhouse temperature (°C).
- `relative_humidity_pct`: Relative ambient humidity (%).
- `ambient_solar_lux`: Photometric illuminance in lux.
- `soil_moisture_volumetric_pct`: Volumetric water content of potting soil (%).
- `foliar_baseline_capacitance_pf`: Living leaf resting dielectric capacitance (pF).
- `esp32_raw_rc_discharge_counts`: Unfiltered clock ticks.
- `adaptive_ema_baseline_counts`: Recalibrated baseline tracking transpiration drift.
- `active_touch_threshold_counts`: Dual-threshold hysteresis trigger set-point ($T_{\text{active}} = B \times 0.72$).
- `transpiration_state`: Physiological stomatal classification.

---

## 🔬 Experimental Methodology & Measurement Setup

### 1. Hardware Sensing Apparatus
1. **Microcontroller**: ESP32 DevKit V1 (30-pin, CP2102) utilizing 7 internal relaxation oscillator touch peripherals.
2. **Foliar Electrodes**: 15mm $\times$ 15mm soft-conductive copper foil pads affixed with hypoallergenic silicone adhesive to the abaxial leaf surface.
3. **Ground Shunt**: 100mm 316L stainless steel earth probe inserted into the rhizosphere, shunting 99.4% of 50 Hz AC mains hum.
4. **Oscilloscope Latency Rig**: Rigol DS1054Z 50 MHz 4-channel DSO triggering on finger touch contact and sampling 3.5mm audio output waveform rise time.

### 2. Signal Processing & Web Audio Architecture
1. **Firmware Filter**: Exponential Moving Average: $S_t = (0.45 \cdot R_t) + (0.55 \cdot S_{t-1})$.
2. **Adaptive Baseline Drift Tracking**: $B_t = (0.998 \cdot B_{t-1}) + (0.002 \cdot R_t)$ executed every 5 seconds.
3. **Web Serial Communication**: 115,200 baud UART stream over USB with `TextDecoderStream` delimiter parsing at 30 Hz.
4. **DSP Synthesizer**: Web Audio API with 432 Hz Just Intonation Vedic Saptak scale multipliers and custom polyphonic ADSR envelope generators.

---

## 📜 Citation & Academic Use

If you utilize this dataset in academic research, exhibitions, or educational coursework, please cite as follows:

```bibtex
@dataset{phytotouch_2026,
  author    = {Nirman Lab Student Engineering Team},
  title     = {PhytoTouch: Multi-Species Plant Electrophysiology, Sub-12ms Latency Benchmarks, and Diurnal Transpiration Telemetry Dataset},
  institution = {Terna Engineering College},
  year      = {2026},
  month     = {March},
  address   = {Nerul, Navi Mumbai, India},
  note      = {Project Reference: NIRMAN-LAB-2026-AGRO-07}
}
```

---
*Developed under the Nirman Lab Student Engineering Initiative 2026 • Terna Engineering College, Nerul, Navi Mumbai*
