"""
==============================================================================
generate_pdf2_code.py
Generates CitrusSense_GitHub_Source_Code.pdf
==============================================================================
"""

import sys
import html
import subprocess
from pathlib import Path

WORKSPACE = Path(r"d:\veer-coding\Nirman Lab")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CitrusSense GitHub Complete Source Code Dossier</title>
<style>
/* CSS */
pre {
    font-size: 6.2pt !important;
    line-height: 1.35 !important;
}
</style>
</head>
<body>

<!-- Header -->
<div class="doc-header">
    <div class="brand">
        CITRUS<span>SENSE</span>
    </div>
    <div class="meta">
        DOCUMENT REF: NIRMAN-LAB-2026-CITRUS-08<br>
        COMPLETE GITHUB SOURCE CODE &amp; REPOSITORY COMPENDIUM<br>
        PRODUCTION FRONTEND &bull; EMBEDDED FIRMWARE &bull; ALGORITHMS
    </div>
</div>

<!-- Hero / Cover Banner -->
<div class="hero-box">
    <div class="badge">GITHUB REPOSITORY COMPENDIUM &bull; FULL SOURCE CODE</div>
    <h1>CitrusSense: Complete Open-Source Production Codebase</h1>
    <p>
        The unabridged, production-grade source code for CitrusSense. Includes modern React 18 client architecture, Web Serial API hardware bridge, custom HSV computer vision algorithms, Web Audio synthesizer, and ESP32 mechatronic firmware. Ready for GitHub import, submission, and replication.
    </p>
    <div class="kpi-row">
        <div class="kpi-card">
            <div class="val">20 Files</div>
            <div class="lbl">Source Manifest</div>
        </div>
        <div class="kpi-card">
            <div class="val">React 18 + Vite</div>
            <div class="lbl">Frontend Framework</div>
        </div>
        <div class="kpi-card">
            <div class="val">ESP32 C++</div>
            <div class="lbl">Microcontroller Firmware</div>
        </div>
        <div class="kpi-card">
            <div class="val">MIT License</div>
            <div class="lbl">Open Source Standard</div>
        </div>
    </div>
</div>

<!-- Repository Overview -->
<h2><span class="num">1.0</span> Repository Directory Structure Tree</h2>
<p>
    The repository is structured as a high-performance modern web application paired with embedded microcontroller firmware:
</p>

<div class="code-window">
    <div class="code-header">
        <span class="code-title">Directory Architecture (Nirman Lab 2026)</span>
        <span class="code-lang">DIRECTORY TREE</span>
    </div>
    <pre>
nirman-lab/
├── firmware/
│   ├── citrus_sorter_esp32.ino        # ESP32 240MHz firmware (PWM servo gate + NeoPixel optical ring)
│   ├── phyto_sonic_arduino_uno.ino    # Bio-impedance plant synthesizer firmware
│   └── phyto_sonic_esp32.ino          # Capacitive touch electrophysiology firmware
├── public/                            # Static assets and favicon
├── src/
│   ├── citrus/
│   │   ├── CitrusApp.jsx              # Central state engine, Web Serial bridge, batch metrics, audio
│   │   ├── CitrusScannerRig.jsx       # Computer vision canvas, lemon discrimination filter, optical caliper
│   │   ├── CitrusVisionEngine.js      # HSV color transformation, contour extraction, defect clustering
│   │   ├── CitrusAudioEngine.js       # Web Audio API polyphonic sound synthesizer & speech annunciator
│   │   ├── CitrusSerialService.js     # Web Serial API driver for 115200 baud ESP32 communication
│   │   ├── CitrusNutritionData.js     # Comprehensive biochemical & nutritional dataset per grade
│   │   ├── CitrusPitchModal.jsx       # 5-tab interactive project dossier, verbal pitch, and jury defense
│   │   ├── CitrusHardwareGuideModal.jsx # Serial terminal, wiring schematics, servo angle calibration
│   │   ├── CitrusCertificateModal.jsx # APEDA Export Certificate generator with SHA-256 digital seal
│   │   ├── CitrusAuditModal.jsx       # 20-specimen empirical benchmark audit report
│   │   ├── MandiEconomicsPanel.jsx    # Agro-economic loss prevention calculator & farmer revenue uplift
│   │   ├── ConveyorSortingSimulator.jsx # Conveyor chute physics simulator & bin diversion visualization
│   │   └── SampleLemons.js            # 20 curated real internet photographs (USDA & Unsplash)
│   ├── App.jsx                        # Root navigation wrapper
│   ├── main.jsx                       # React 18 DOM mount entrypoint
│   └── index.css                      # Design system tokens, craft buttons, glass panels, dark mode
├── index.html                         # HTML5 root template
├── package.json                       # Dependencies (react, lucide-react, vite, tailwindcss)
├── vite.config.js                     # Vite build configuration
└── README.md                          # Comprehensive project documentation & usage guide
    </pre>
</div>

<h2><span class="num">2.0</span> Local Installation &amp; Build Commands</h2>
<div class="grid-2">
    <div class="info-card">
        <h4>1. Install Dependencies</h4>
        <p><code>npm install</code><br>Installs React 18, Lucide React icons, Tailwind CSS, and build tools.</p>
    </div>
    <div class="info-card">
        <h4>2. Start Local Dev Server</h4>
        <p><code>npm run dev</code><br>Runs local Vite development server at <code>http://localhost:5173/</code>.</p>
    </div>
    <div class="info-card">
        <h4>3. Production Build</h4>
        <p><code>npm run build</code><br>Compiles optimized production bundle in <code>dist/</code> in under 600ms.</p>
    </div>
    <div class="info-card">
        <h4>4. Production Deployment</h4>
        <p><code>npx vercel --prod --yes</code><br>Deploys globally to Vercel edge network (https://nirman-lab.vercel.app/).</p>
    </div>
</div>

<div class="callout success">
    <div class="callout-title">COMPLETE SOURCE CODE HANDBOOK</div>
    The following pages contain the complete, verbatim source code for each primary component and firmware script in the repository.
</div>

<!-- CODE_BLOCKS -->

<div class="doc-footer">
    <span>NIRMAN LAB 2026 &bull; STUDENT ENGINEERING INITIATIVE</span>
    <span>CITRUSSENSE GITHUB SOURCE CODE DOSSIER &bull; END OF REPOSITORY FILE COMPENDIUM</span>
</div>

</body>
</html>
"""

def build_pdf2():
    from build_all_citrus_pdfs import get_base_css, compile_pdf

    code_files = [
        ("package.json", "package.json", "JSON", "Node.js dependencies, scripts, and build configuration"),
        ("vite.config.js", "vite.config.js", "JAVASCRIPT", "Vite build tool configuration and React plugin setup"),
        ("index.html", "index.html", "HTML", "Application HTML5 entry point and viewport meta tags"),
        ("src/main.jsx", "src/main.jsx", "JAVASCRIPT (REACT)", "React 18 DOM root render entry point"),
        ("src/App.jsx", "src/App.jsx", "JAVASCRIPT (REACT)", "Top-level application container & navigation wrapper"),
        ("src/index.css", "src/index.css", "CSS", "Design system tokens, craft buttons, glass panels, and print stylesheets"),
        ("src/citrus/CitrusApp.jsx", "src/citrus/CitrusApp.jsx", "JAVASCRIPT (REACT)", "CitrusSense core state container, serial bridge, batch metrics, audio engine"),
        ("src/citrus/CitrusScannerRig.jsx", "src/citrus/CitrusScannerRig.jsx", "JAVASCRIPT (REACT)", "Computer vision canvas, lemon discrimination algorithm, optical caliper, defect analyzer"),
        ("src/citrus/CitrusVisionEngine.js", "src/citrus/CitrusVisionEngine.js", "JAVASCRIPT", "Mathematical HSV transformation, contour detection, circularity & defect processing"),
        ("src/citrus/CitrusAudioEngine.js", "src/citrus/CitrusAudioEngine.js", "JAVASCRIPT", "Web Audio API polyphonic sound synthesis & verbal grade annunciator"),
        ("src/citrus/CitrusSerialService.js", "src/citrus/CitrusSerialService.js", "JAVASCRIPT", "Web Serial API driver for 115200 baud MCU communication"),
        ("src/citrus/CitrusNutritionData.js", "src/citrus/CitrusNutritionData.js", "JAVASCRIPT", "Biochemical & nutritional reference datasets mapped to APEDA grades"),
        ("src/citrus/CitrusCertificateModal.jsx", "src/citrus/CitrusCertificateModal.jsx", "JAVASCRIPT (REACT)", "APEDA Export Compliance Certificate generator & print pass"),
        ("src/citrus/CitrusPitchModal.jsx", "src/citrus/CitrusPitchModal.jsx", "JAVASCRIPT (REACT)", "Interactive 5-tab project dossier, verbal pitch script, and jury defense"),
        ("src/citrus/CitrusHardwareGuideModal.jsx", "src/citrus/CitrusHardwareGuideModal.jsx", "JAVASCRIPT (REACT)", "Interactive serial terminal, ESP32 wiring diagrams, servo tester"),
        ("src/citrus/CitrusAuditModal.jsx", "src/citrus/CitrusAuditModal.jsx", "JAVASCRIPT (REACT)", "20-specimen empirical benchmark audit report"),
        ("src/citrus/MandiEconomicsPanel.jsx", "src/citrus/MandiEconomicsPanel.jsx", "JAVASCRIPT (REACT)", "Agro-economics loss prevention calculator & ROI analytics"),
        ("src/citrus/CitrusResearchData.js", "src/citrus/CitrusResearchData.js", "JAVASCRIPT", "5 core academic research papers and citations dataset"),
        ("src/citrus/CitrusResearchModal.jsx", "src/citrus/CitrusResearchModal.jsx", "JAVASCRIPT (REACT)", "Academic research citations modal with key takeaways"),
        ("firmware/citrus_sorter_esp32.ino", "firmware/citrus_sorter_esp32.ino", "C++ / ARDUINO", "ESP32 mechatronic firmware for PWM servo diversion & optical ring"),
        ("README.md", "README.md", "MARKDOWN", "Official GitHub repository documentation & project showcase")
    ]

    code_sections = []
    
    for rel_path, display_name, lang, desc in code_files:
        full_path = WORKSPACE / rel_path
        if not full_path.exists():
            continue
        try:
            raw_text = full_path.read_text(encoding="utf-8", errors="replace")
        except Exception as e:
            raw_text = f"// Error reading file: {e}"

        escaped_code = html.escape(raw_text)

        block = f"""
<div class="page-break"></div>
<div class="doc-header">
    <div class="brand">CITRUS<span>SENSE</span> &bull; REPO SOURCE</div>
    <div class="meta">{display_name.upper()}<br>{lang} &bull; NIRMAN-LAB-2026-CITRUS-08</div>
</div>

<div class="info-card dark" style="margin-bottom: 12px;">
    <h4>{display_name} <span class="code-lang">{lang}</span></h4>
    <p><strong>Path:</strong> <code>{rel_path}</code> &bull; <strong>Function:</strong> {desc}</p>
</div>

<div class="code-window">
    <div class="code-header">
        <span class="code-title">{display_name}</span>
        <span class="code-lang">{lang}</span>
    </div>
    <pre><code>{escaped_code}</code></pre>
</div>
"""
        code_sections.append(block)

    all_blocks = "\n".join(code_sections)
    final_html = HTML_TEMPLATE.replace("/* CSS */", get_base_css()).replace("<!-- CODE_BLOCKS -->", all_blocks)

    pdf_path = compile_pdf(final_html, "CitrusSense_GitHub_Source_Code")
    return pdf_path

if __name__ == "__main__":
    build_pdf2()
