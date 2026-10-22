# Nirman Lab 2026: Interdisciplinary Agro-Engineering Exhibition Hub

Welcome to the **Nirman Lab 2026 Student Engineering Initiative** repository. This workspace contains two complete, production-grade cyber-physical agro-engineering systems developed for exhibition, live demonstrations, and commercial deployment:

---

## 🍋 CitrusSense
**Autonomous Optical Citrus Quality Sorter & Mandi Post-Harvest Loss Prevention Rig**
*Document Ref: `NIRMAN-LAB-2026-CITRUS-08`*

> *"When life gives you lemons, you first check if they're good or not!"*

### The Problem
In India, over **32% of harvested citrus spoils** before reaching consumers due to manual sorting under poor illumination. A single lemon infected with *Penicillium digitatum* (green mold) or Anthracnose packed into a 20kg crate produces autocatalytic ethylene gas ($C_2H_4$), causing systemic soft-rot across adjacent healthy fruit within 48 hours. Farmers are forced into distress sales at flat rates of ₹4.50/kg, losing export margins.

### The Engineering Solution
CitrusSense is an automated optical sorting and pathology grading station:
1. **Real-Time Computer Vision Pipeline ([CitrusVisionEngine.js](file:///d:/veer-coding/Nirman%20Lab/src/citrus/CitrusVisionEngine.js))**:
   - Converts RGB to cylindrical **HSV color space** to neutralize ambient lighting and shadow variations.
   - Segments yellow flavedo carotenoids (Hue 36°–68°), chlorophyll retention (Hue 68°–145°), and necrotic fungal lesions.
   - Measures equatorial caliper diameter in millimeters ($\varnothing$) and sphericity aspect ratio.
   - Detects and clusters defect hotspots with contour bounding boxes and live reticle tracking.
2. **4-Tier Mandi & APEDA Classification Standard**:
   - **Grade A (Export / Air-Cargo)**: Defect < 3.2%, Diameter 50–70mm, Sphericity > 0.78. Shelf life: 21 days. Value: ₹12.00 / fruit.
   - **Grade B (Domestic Supermarket)**: Defect 3.2%–8.5%. Shelf life: 12 days. Value: ₹6.00 / fruit.
   - **Grade C (Industrial Juicing & Pectin)**: Defect 8.5%–15.0%, sound pulp. Shelf life: 4 days. Value: ₹2.50 / fruit.
   - **Grade D (Pathological Hazard / Quarantine)**: Defect > 15% or fungal mycelium. Immediately ejected to prevent ethylene cross-contamination. Diverted to biogas digesters.
3. **Mechatronic Sorting Rig ([firmware/citrus_sorter_esp32.ino](file:///d:/veer-coding/Nirman%20Lab/firmware/citrus_sorter_esp32.ino))**:
   - ESP32 microcontroller with Web Serial UART connection at 115,200 baud.
   - Actuates SG90 / MG996R servo diverter gate (45° Export, 90° Retail, 135° Juicing, 175° Reject).
   - WS2812B 12-NeoPixel shadowless optical illumination ring.
   - Hardware Bill of Materials (BOM): **₹1,180 total cost** ($14 USD), paying for itself in less than 4 hours of farm operation.
4. **Agro-Economic Business Model & Mandi Calculator ([MandiEconomicsPanel.jsx](file:///d:/veer-coding/Nirman%20Lab/src/citrus/MandiEconomicsPanel.jsx))**:
   - Compares bulk distress sales vs graded sales for a 3-ton daily harvest.
   - Demonstrates a **+₹62,000/day net farmer revenue uplift** (+297% profit gain).
   - Tracks ESG carbon credits by diverting decaying citrus from open dumps to anaerobic bio-digesters.

---

## 🌱 Lab 01: PhytoSonic Model-01
**Living Plant Bio-Acoustic Synthesizer & Telemetry Deck**
*Document Ref: `NIRMAN-LAB-2026-AGRO-07`*

1. **Electrophysiological Sensing**: Translates bio-capacitance micro-fluctuations (pF) and leaf impedance ($k\Omega$) into harmonic 432 Hz Solfeggio soundscapes.
2. **Tone.js Web Audio Engine ([PlantAudioEngine.js](file:///d:/veer-coding/Nirman%20Lab/src/audio/PlantAudioEngine.js))**: Multi-scale polyphonic synthesis with selectable botanical sound banks (Bamboo Harp, Rain-Forest Drone, Cactus Glass).
3. **Cathode Ray Oscilloscope ([AnalogOscilloscope.jsx](file:///d:/veer-coding/Nirman%20Lab/src/components/AnalogOscilloscope.jsx))**: Simulated P31 green phosphor CRT oscilloscope with realistic phosphor decay.
4. **Firmware & Circuit ([firmware/phyto_sonic_esp32.ino](file:///d:/veer-coding/Nirman%20Lab/firmware/phyto_sonic_esp32.ino))**: ESP32 capacitive touch pin firmware with RC discharge timing.

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Open in your browser
http://localhost:5173/
```

### Keyboard Shortcuts
- **`Tab` or Top Bar**: Switch between `🍋 LAB 02: CITRUSSENSE` and `🌱 LAB 01: PHYTOSONIC`
- **`1` to `6`**: Quick load calibrated citrus specimens (Export Eureka, Supermarket Meyer, Juicing, Anthracnose Rot, Penicillium Mold, Unripe Green)
- **`D`**: Open 2-Minute Exhibition Pitch Script & Project Dossier Modal
- **`F`**: Open Hardware Schematics, Pinout & BOM Guide Modal
- **`M`**: Mute / Unmute industrial acoustic feedback
- **`Spacebar`**: Trigger sample scan or ambient chord
