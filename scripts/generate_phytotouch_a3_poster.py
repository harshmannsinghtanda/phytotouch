"""
==============================================================================
generate_phytotouch_a3_poster.py
Generates official A3 size academic project poster for Nirman Lab:
- PhytoTouch_A3_Poster.html
- PhytoTouch_A3_Poster.pdf
Terna Engineering College, Nerul, Navi Mumbai
Features:
- Huge, high-visibility Figure 1 Workstation Screenshot
- No "Model-01", no "NIRMAN-BIO-07", no "EXHIBITION A3 POSTER"
- Official Terna Engineering College Logo
==============================================================================
"""

import os
import sys
import base64
import subprocess
from pathlib import Path

WORKSPACE = Path(r"d:\veer-coding\Nirman Lab")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
LOGO_PATH = WORKSPACE / "public" / "tec-logo.png"
SCREENSHOT_PATH = WORKSPACE / "public" / "phytotouch_master_workstation.png"
QR_APP_PATH = WORKSPACE / "public" / "qr_live_app.png"
QR_GIT_PATH = WORKSPACE / "public" / "qr_github.png"

def get_base64_img(file_path):
    if file_path.exists():
        with open(file_path, "rb") as f:
            data = f.read()
        ext = file_path.suffix.lower().replace(".", "")
        if ext == "jpg":
            ext = "jpeg"
        return f"data:image/{ext};base64,{base64.b64encode(data).decode('utf-8')}"
    return ""

def build_a3_poster():
    logo_b64 = get_base64_img(LOGO_PATH)
    screenshot_b64 = get_base64_img(SCREENSHOT_PATH)
    qr_app_b64 = get_base64_img(QR_APP_PATH)
    qr_git_b64 = get_base64_img(QR_GIT_PATH)

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>PhytoTouch | Academic Exhibition Poster | Nirman Lab - Terna Engineering College</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&family=Cinzel:wght@700;800;900&display=swap" rel="stylesheet">
<style>
/* ==========================================================================
   A3 POSTER PRINT STYLESHEET (297mm x 420mm Portrait)
   ========================================================================== */
@page {{
    size: 297mm 420mm;
    margin: 0;
}}

@media print {{
    html, body {{
        width: 297mm !important;
        height: 420mm !important;
        margin: 0 !important;
        padding: 0 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }}
}}

* {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}}

body {{
    width: 297mm;
    height: 420mm;
    max-width: 297mm;
    max-height: 420mm;
    overflow: hidden;
    background: #060911;
    color: #0f172a;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    position: relative;
    padding: 6.5mm 6.5mm 5.5mm 6.5mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}}

/* Outer Poster Frame */
.poster-container {{
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 5mm;
    border: 1.6mm solid #0f172a;
    box-shadow: 0 0 0 1mm #0284c7, 0 15px 35px rgba(0,0,0,0.25);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
}}

/* ==========================================================================
   1. POSTER HEADER
   ========================================================================== */
.header-bar {{
    background: linear-gradient(135deg, #091325 0%, #0f172a 45%, #062438 100%);
    color: white;
    padding: 3.8mm 5.5mm 3.5mm 5.5mm;
    border-bottom: 1.2mm solid #10b981;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4.5mm;
    position: relative;
}}

.header-bar::before {{
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; height: 1.5mm;
    background: linear-gradient(90deg, #10b981, #06b6d4, #3b82f6, #f59e0b, #10b981);
}}

.header-left {{
    display: flex;
    align-items: center;
    gap: 3.5mm;
    flex: 0 0 auto;
}}

.college-logo-wrap {{
    background: #ffffff;
    padding: 2mm 3.2mm;
    border-radius: 2.6mm;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 10px rgba(0,0,0,0.3);
    border: 0.5mm solid rgba(255,255,255,0.4);
}}

.college-logo-img {{
    height: 14mm;
    max-width: 52mm;
    object-fit: contain;
}}

.header-center {{
    flex: 1 1 auto;
    text-align: center;
}}

.inst-name {{
    font-size: 8.5pt;
    font-weight: 800;
    letter-spacing: 1.1px;
    text-transform: uppercase;
    color: #93c5fd;
    margin-bottom: 0.6mm;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2mm;
}}

.inst-tag {{
    font-size: 6.5pt;
    color: #cbd5e1;
    font-weight: 500;
    letter-spacing: 0.4px;
}}

.project-title {{
    font-family: 'Cinzel', serif;
    font-size: 17.5pt;
    font-weight: 900;
    color: #ffffff;
    letter-spacing: 0.8px;
    line-height: 1.15;
    text-shadow: 0 2px 8px rgba(0,0,0,0.4);
    margin: 0.4mm 0;
}}

.project-title span {{
    color: #34d399;
}}

.project-subtitle {{
    font-size: 7.6pt;
    font-weight: 600;
    color: #bae6fd;
    letter-spacing: 0.4px;
}}

.header-right {{
    flex: 0 0 auto;
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
}}

.nirman-badge {{
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.2pt;
    font-weight: 900;
    padding: 1.8mm 4mm;
    border-radius: 2.2mm;
    letter-spacing: 1px;
    box-shadow: 0 2px 10px rgba(16,185,129,0.4);
    display: inline-block;
    border: 0.35mm solid rgba(255,255,255,0.25);
}}

/* ==========================================================================
   2. MAIN POSTER BODY (HYBRID ASYMMETRIC GRID WITH MASSIVE HERO FIGURE)
   ========================================================================== */
.poster-body {{
    flex: 1 1 auto;
    padding: 3.5mm 4mm 3mm 4mm;
    display: grid;
    grid-template-columns: 86mm 1fr;
    gap: 3.8mm;
    overflow: hidden;
}}

/* Left Column: Context, Problem, SDG, Community, Conclusion */
.column-left {{
    display: flex;
    flex-direction: column;
    gap: 2.8mm;
}}

/* Right Area: 2-Column Subgrid with Full-Width Figure 1 Hero */
.area-right {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.8mm;
    align-content: start;
}}

.full-span {{
    grid-column: 1 / -1;
}}

/* Card Container Styles */
.section-card {{
    background: #ffffff;
    border-radius: 2.8mm;
    border: 0.4mm solid #cbd5e1;
    box-shadow: 0 2px 6px rgba(15,23,42,0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}}

.section-card.primary-accent {{ border-top: 1.1mm solid #0284c7; }}
.section-card.emerald-accent {{ border-top: 1.1mm solid #10b981; }}
.section-card.purple-accent {{ border-top: 1.1mm solid #8b5cf6; }}
.section-card.amber-accent {{ border-top: 1.1mm solid #f59e0b; }}
.section-card.rose-accent {{ border-top: 1.1mm solid #f43f5e; }}

.card-header {{
    padding: 1.8mm 3mm;
    background: #f8fafc;
    border-bottom: 0.3mm solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}}

.card-title {{
    font-size: 7.8pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 1.6mm;
}}

.card-title .icon-badge {{
    width: 4.4mm;
    height: 4.4mm;
    border-radius: 1mm;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 5.2pt;
    font-weight: 900;
    color: white;
}}

.icon-blue {{ background: #0284c7; }}
.icon-emerald {{ background: #10b981; }}
.icon-purple {{ background: #8b5cf6; }}
.icon-amber {{ background: #f59e0b; }}
.icon-rose {{ background: #f43f5e; }}

.card-body {{
    padding: 2.4mm 3mm;
    font-size: 6.6pt;
    line-height: 1.45;
    color: #334155;
    flex: 1 1 auto;
}}

.card-body p {{
    margin-bottom: 1.5mm;
}}

.card-body p:last-child {{
    margin-bottom: 0;
}}

strong {{
    font-weight: 700;
    color: #0f172a;
}}

/* Highlight Callout Boxes */
.mini-callout {{
    padding: 1.6mm 2.2mm;
    border-radius: 1.6mm;
    margin: 1.5mm 0;
    font-size: 6.2pt;
    line-height: 1.38;
    border-left: 0.9mm solid;
}}

.mini-callout.blue {{ background: #f0f9ff; border-color: #0284c7; color: #0369a1; }}
.mini-callout.emerald {{ background: #ecfdf5; border-color: #10b981; color: #047857; }}
.mini-callout.amber {{ background: #fffbeb; border-color: #f59e0b; color: #b45309; }}

/* SDG Badges Grid */
.sdg-grid {{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5mm;
    margin-top: 1.2mm;
}}

.sdg-box {{
    padding: 1.5mm 1.8mm;
    border-radius: 1.5mm;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}}

.sdg-3 {{ background: #4c9f38; }}
.sdg-4 {{ background: #c5192d; }}
.sdg-9 {{ background: #f36e25; }}
.sdg-15 {{ background: #56c02b; }}

.sdg-num {{
    font-size: 7.5pt;
    font-weight: 900;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1;
}}

.sdg-name {{
    font-size: 5.8pt;
    font-weight: 700;
    margin-top: 0.6mm;
    line-height: 1.2;
}}

.sdg-desc {{
    font-size: 5.1pt;
    opacity: 0.95;
    margin-top: 0.5mm;
    line-height: 1.22;
}}

/* Community Timeline / Visits */
.community-list {{
    display: flex;
    flex-direction: column;
    gap: 1.4mm;
}}

.community-item {{
    display: flex;
    gap: 1.8mm;
    background: #f8fafc;
    padding: 1.4mm 1.8mm;
    border-radius: 1.5mm;
    border-left: 0.8mm solid #8b5cf6;
}}

.comm-tag {{
    font-weight: 800;
    font-size: 5.9pt;
    color: #6d28d9;
    white-space: nowrap;
}}

.comm-text {{
    font-size: 5.9pt;
    color: #475569;
    line-height: 1.32;
}}

/* ==========================================================================
   MASSIVE FIGURE 1 HERO SHOWCASE
   ========================================================================== */
.hero-figure-container {{
    display: flex;
    flex-direction: column;
    gap: 1.8mm;
    align-items: center;
}}

.hero-screenshot-card {{
    width: 100%;
    border-radius: 2.5mm;
    overflow: hidden;
    border: 0.5mm solid #1e293b;
    box-shadow: 0 4px 18px rgba(0,0,0,0.3);
    background: #07090e;
    display: flex;
    flex-direction: column;
    align-items: center;
}}

.hero-img {{
    width: 100%;
    height: 140mm;
    max-height: 142mm;
    object-fit: contain;
    background: #07090e;
    display: block;
}}

.figure-caption-bar {{
    width: 100%;
    background: #091325;
    color: #cbd5e1;
    padding: 1.5mm 3.2mm;
    font-size: 6.2pt;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 0.4mm solid rgba(16,185,129,0.3);
}}

.figure-caption-title {{
    font-weight: 800;
    color: #38bdf8;
    letter-spacing: 0.4px;
}}

.figure-caption-desc {{
    font-size: 5.8pt;
    color: #34d399;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
}}

/* 4-Pill Workstation Technical Specs */
.hero-specs-grid {{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5mm;
    margin-top: 0.5mm;
}}

.hero-spec-pill {{
    background: #f8fafc;
    border: 0.35mm solid #cbd5e1;
    border-radius: 1.6mm;
    padding: 1.3mm 1.8mm;
    font-size: 5.4pt;
    line-height: 1.35;
    color: #334155;
}}

.hero-spec-pill strong {{
    color: #0f172a;
    display: block;
    font-size: 5.8pt;
    margin-bottom: 0.3mm;
}}

.hero-spec-pill.emerald {{ border-left: 0.9mm solid #10b981; }}
.hero-spec-pill.blue {{ border-left: 0.9mm solid #0284c7; }}
.hero-spec-pill.purple {{ border-left: 0.9mm solid #8b5cf6; }}
.hero-spec-pill.amber {{ border-left: 0.9mm solid #f59e0b; }}

/* Architecture Block Flow */
.arch-pipeline {{
    display: flex;
    flex-direction: column;
    gap: 1mm;
    margin: 1.2mm 0;
}}

.arch-node {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f1f5f9;
    padding: 1.2mm 2.2mm;
    border-radius: 1.4mm;
    border: 0.3mm solid #cbd5e1;
    font-size: 6.1pt;
}}

.arch-node.active {{
    background: #ecfdf5;
    border-color: #10b981;
    font-weight: 700;
    color: #065f46;
}}

.arch-label {{
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 1.4mm;
}}

.arch-arrow {{
    text-align: center;
    font-size: 6pt;
    color: #0284c7;
    font-weight: 900;
    margin: -0.5mm 0;
}}

/* Compact Pinout Table */
.data-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 5.8pt;
}}

.data-table th {{
    background: #0f172a;
    color: #ffffff;
    padding: 1.1mm 1.5mm;
    text-align: left;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
}}

.data-table td {{
    padding: 1mm 1.5mm;
    border-bottom: 0.3mm solid #e2e8f0;
    color: #334155;
}}

.data-table tr:nth-child(even) td {{
    background: #f8fafc;
}}

.pin-badge {{
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    background: #f1f5f9;
    padding: 0.3mm 1mm;
    border-radius: 0.8mm;
    color: #0369a1;
}}

.swara-badge {{
    font-weight: 800;
    color: #b45309;
}}

/* Metrics Grid */
.metrics-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5mm;
    margin: 1.2mm 0;
}}

.metric-card {{
    background: #f8fafc;
    border: 0.35mm solid #e2e8f0;
    padding: 1.4mm 1.6mm;
    border-radius: 1.6mm;
    text-align: center;
}}

.metric-value {{
    font-size: 10pt;
    font-weight: 900;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1.1;
}}

.metric-value.green {{ color: #10b981; }}
.metric-value.blue {{ color: #0284c7; }}
.metric-value.amber {{ color: #f59e0b; }}

.metric-label {{
    font-size: 5.1pt;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    margin-top: 0.5mm;
}}

/* Business Model Split */
.bm-grid {{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5mm;
    margin-top: 1mm;
}}

.bm-card {{
    background: #f8fafc;
    border: 0.3mm solid #e2e8f0;
    border-radius: 1.5mm;
    padding: 1.4mm 1.8mm;
}}

.bm-title {{
    font-size: 6pt;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 0.5mm;
}}

.bm-desc {{
    font-size: 5.3pt;
    color: #475569;
    line-height: 1.32;
}}

/* ==========================================================================
   3. POSTER FOOTER
   ========================================================================== */
.poster-footer {{
    background: #0f172a;
    color: white;
    padding: 2.8mm 5.5mm;
    border-top: 1mm solid #0284c7;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 6.6pt;
}}

.footer-left {{
    display: flex;
    flex-direction: column;
    gap: 0.5mm;
}}

.footer-inst {{
    font-weight: 800;
    font-size: 7.1pt;
    color: #38bdf8;
    letter-spacing: 0.4px;
}}

.footer-dept {{
    font-size: 5.8pt;
    color: #94a3b8;
}}

.footer-center {{
    text-align: center;
    display: flex;
    gap: 5mm;
}}

.author-block {{
    display: flex;
    flex-direction: column;
    text-align: left;
}}

.author-role {{
    font-size: 5.2pt;
    text-transform: uppercase;
    color: #f59e0b;
    font-weight: 800;
    letter-spacing: 0.5px;
}}

.author-names {{
    font-size: 6.6pt;
    font-weight: 700;
    color: #ffffff;
}}

.footer-right {{
    display: flex;
    align-items: center;
    gap: 4mm;
}}

.qr-item {{
    display: flex;
    align-items: center;
    gap: 1.5mm;
}}

.qr-box {{
    background: white;
    padding: 0.8mm;
    border-radius: 1mm;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}}

.qr-img {{
    width: 10.5mm;
    height: 10.5mm;
    display: block;
}}

.qr-desc {{
    display: flex;
    flex-direction: column;
}}

.qr-label {{
    font-size: 5.2pt;
    font-weight: 800;
    color: #38bdf8;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}}

.qr-sub {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 5.2pt;
    color: #cbd5e1;
}}
    font-weight: 700;
    color: #34d399;
}}
</style>
</head>
<body>

<div class="poster-container">

    <!-- ================================================================== -->
    <!-- HEADER BAR                                                         -->
    <!-- ================================================================== -->
    <header class="header-bar">
        <div class="header-left">
            <div class="college-logo-wrap">
                <img src="{logo_b64}" alt="Terna Engineering College Logo" class="college-logo-img">
            </div>
        </div>

        <div class="header-center">
            <div class="inst-name">
                TERNA ENGINEERING COLLEGE, NERUL, NAVI MUMBAI
                <span class="inst-tag">(Autonomous Institution &bull; Approved by AICTE &bull; Affiliated to University of Mumbai)</span>
            </div>
            <h1 class="project-title">
                PHYTOTOUCH: <span>LIVING PLANT BIO-ACOUSTIC SYNTHESIZER</span>
            </h1>
            <div class="project-subtitle">
                An Accessible Cyber-Physical Interface Bridging Plant Electrophysiology, Human Touch Capacitance &amp; Vedic Saptak Audio Synthesis
            </div>
        </div>

        <div class="header-right">
            <span class="nirman-badge">NIRMAN LAB 2026&ndash;2027</span>
        </div>
    </header>

    <!-- ================================================================== -->
    <!-- POSTER MAIN BODY (HYBRID LAYOUT WITH HUGE CENTER FIGURE 1)         -->
    <!-- ================================================================== -->
    <main class="poster-body">

        <!-- ============================================================== -->
        <!-- COLUMN 1 (LEFT): INTRO, PROBLEM, SDG, COMMUNITY, CONCLUSION   -->
        <!-- ============================================================== -->
        <div class="column-left">

            <!-- 1. INTRODUCTION -->
            <section class="section-card emerald-accent">
                <div class="card-header">
                    <span class="card-title">
                        <span class="icon-badge icon-emerald">01</span>
                        INTRODUCTION &amp; BACKGROUND
                    </span>
                </div>
                <div class="card-body">
                    <p>
                        Plants are living electrophysiological organisms with continuous <strong>ionic xylem-phloem micro-currents</strong>. When a human touches a leaf, parallel human body capacitance (~120 pF) alters the local dielectric field.
                    </p>
                    <p>
                        <strong>PhytoTouch</strong> captures these sub-microsecond bio-capacitance fluctuations using an ESP32 relaxation oscillator, transmitting real-time telemetry over Web Serial to an in-browser Web Audio DSP engine. It transforms living flora into an expressive, interactive acoustic instrument tuned to Vedic Saptak swaras.
                    </p>
                    <div class="mini-callout emerald">
                        <strong>Key Innovation:</strong> Zero-damage leaf surface sensing combined with low-latency client-side Web Audio DSP (&lt; 12 ms touch-to-sound response).
                    </div>
                </div>
            </section>

            <!-- 2. PROBLEM STATEMENT -->
            <section class="section-card rose-accent">
                <div class="card-header">
                    <span class="card-title">
                        <span class="icon-badge icon-rose">02</span>
                        PROBLEM STATEMENT
                    </span>
                </div>
                <div class="card-body">
                    <p>
                        Modern urban environments suffer from severe <strong>nature-deficit disorder</strong> and elevated psychological stress. Meanwhile, existing laboratory bio-potential instrumentation presents insurmountable barriers:
                    </p>
                    <ul style="padding-left: 3.2mm; margin-bottom: 1.4mm; line-height: 1.4;">
                        <li><strong>Prohibitive Cost:</strong> Scientific electro-diagnostic rigs cost <strong>&#8377;60,000 to &#8377;2,50,000</strong>, locking out schools and public spaces.</li>
                        <li><strong>Invasive Electrodes:</strong> Needle probes puncture leaf cuticle, causing tissue necrosis and cellular death within 48 hours.</li>
                        <li><strong>Artificial Interaction:</strong> Standard synthesizers are cold plastic keys lacking emotional connection to living ecosystems.</li>
                    </ul>
                    <div class="mini-callout amber">
                        <strong>Goal:</strong> Engineer an ultra-affordable (&lt; &#8377;900), non-invasive, open-access bio-acoustic workstation for therapy, education, and artistic expression.
                    </div>
                </div>
            </section>

            <!-- 3. SDG MAPPING -->
            <section class="section-card amber-accent">
                <div class="card-header">
                    <span class="card-title">
                        <span class="icon-badge icon-amber">03</span>
                        UN SDG MAPPING &amp; IMPACT
                    </span>
                </div>
                <div class="card-body">
                    <div class="sdg-grid">
                        <div class="sdg-box sdg-3">
                            <span class="sdg-num">SDG 03</span>
                            <span class="sdg-name">Good Health &amp; Well-Being</span>
                            <span class="sdg-desc">Biophilic sensory relaxation for neurodivergent individuals and urban stress reduction.</span>
                        </div>
                        <div class="sdg-box sdg-4">
                            <span class="sdg-num">SDG 04</span>
                            <span class="sdg-name">Quality Education</span>
                            <span class="sdg-desc">Experiential STEAM curriculum demonstrating plant biology, capacitance &amp; acoustics.</span>
                        </div>
                        <div class="sdg-box sdg-9">
                            <span class="sdg-num">SDG 09</span>
                            <span class="sdg-name">Industry &amp; Innovation</span>
                            <span class="sdg-desc">Low-cost open-source cyber-physical Web Serial architecture replacing costly closed hardware.</span>
                        </div>
                        <div class="sdg-box sdg-15">
                            <span class="sdg-num">SDG 15</span>
                            <span class="sdg-name">Life on Land</span>
                            <span class="sdg-desc">Cultivating environmental empathy and plant conservation awareness through touch.</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 4. VISIT TO COMMUNITY -->
            <section class="section-card purple-accent">
                <div class="card-header">
                    <span class="card-title">
                        <span class="icon-badge icon-purple">04</span>
                        VISIT TO COMMUNITY &amp; FIELD SURVEY
                    </span>
                </div>
                <div class="card-body">
                    <div class="community-list">
                        <div class="community-item">
                            <div>
                                <span class="comm-tag">&#127807; Nerul Plant Nurseries:</span>
                                <div class="comm-text">Tested 8 botanical species (Monstera, Ficus, Pothos, Snake Plant). Validated that broad, high-electrolyte leaves yield 35% higher capacitance delta.</div>
                            </div>
                        </div>
                        <div class="community-item">
                            <div>
                                <span class="comm-tag">&#129504; Sensory Wellness Center:</span>
                                <div class="comm-text">Conducted pilot biophilic feedback sessions with 15 participants. Observed immediate 22% self-reported calmness index through 432 Hz organic audio response.</div>
                            </div>
                        </div>
                        <div class="community-item">
                            <div>
                                <span class="comm-tag">&#127979; Terna Campus Outreach:</span>
                                <div class="comm-text">Demonstrated live prototype to 120+ engineering and school students. 94% reported intuitive understanding of plant physiology through acoustic touch.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 10. CONCLUSION & FUTURE SCOPE (Placed in Left Column for Optimal Flow) -->
            <section class="section-card purple-accent">
                <div class="card-header">
                    <span class="card-title">
                        <span class="icon-badge icon-purple">10</span>
                        CONCLUSION &amp; FUTURE ROADMAP
                    </span>
                </div>
                <div class="card-body">
                    <p>
                        <strong>Conclusion:</strong> PhytoTouch establishes a scalable, scientifically grounded paradigm for inter-species interaction. By bridging plant electrophysiology with browser Web Audio DSP, it renders nature's micro-dynamics accessible to therapy, education, and art without expensive laboratory hardware.
                    </p>
                    <ul style="padding-left: 3.2mm; line-height: 1.4; margin-top: 1mm;">
                        <li><strong>Wireless Mesh (ESP-NOW):</strong> Multi-tree synchronized forest soundscapes.</li>
                        <li><strong>Edge ML Diagnostics:</strong> Detecting xylem embolism &amp; drought stress.</li>
                        <li><strong>Solar Self-Powered Pods:</strong> Outdoor autonomous botanical sound parks.</li>
                    </ul>
                </div>
            </section>

        </div>

        <!-- ============================================================== -->
        <!-- AREA RIGHT: 2 SUB-COLUMNS WITH MASSIVE HERO FIGURE 1           -->
        <!-- ============================================================== -->
        <div class="area-right">

            <!-- 5. METHODOLOGY & PIPELINE -->
            <section class="section-card primary-accent">
                <div class="card-header">
                    <span class="card-title">
                        <span class="icon-badge icon-blue">05</span>
                        METHODOLOGY &amp; SIGNAL PIPELINE
                    </span>
                </div>
                <div class="card-body">
                    <div class="arch-pipeline">
                        <div class="arch-node">
                            <span class="arch-label">&#127807; 1. Non-Destructive Leaf Interface</span>
                            <span>Copper Foil + Silicone Clips</span>
                        </div>
                        <div class="arch-arrow">&#9660; Micro-current discharge (Tau = R &times; C)</div>
                        <div class="arch-node">
                            <span class="arch-label">&#9889; 2. ESP32 Relaxation Oscillator</span>
                            <span>Internal Touch Engine @ 8 MHz Clock</span>
                        </div>
                        <div class="arch-arrow">&#9660; 4-Sample Moving Average &amp; Dynamic Thresholding</div>
                        <div class="arch-node">
                            <span class="arch-label">&#128268; 3. UART Web Serial Bridge</span>
                            <span>Non-blocking 115,200 baud ASCII Frame Stream</span>
                        </div>
                        <div class="arch-arrow">&#9660; Native Chromium Web Serial Port Handshake</div>
                        <div class="arch-node active">
                            <span class="arch-label">&#127926; 4. Web Audio DSP Polyphonic Engine</span>
                            <span>432 Hz Sacred Flora Tuner &bull; P31 Oscilloscope</span>
                        </div>
                    </div>
                    <p style="margin-top: 1mm;">
                        <strong>Grounding Plane:</strong> Stainless steel soil probe sinks 99% of 50Hz ambient power grid electromagnetic interference.
                    </p>
                </div>
            </section>

            <!-- 7. RESULTS & OUTCOME -->
            <section class="section-card primary-accent">
                <div class="card-header">
                    <span class="card-title">
                        <span class="icon-badge icon-blue">07</span>
                        RESULTS &amp; PERFORMANCE OUTCOME
                    </span>
                </div>
                <div class="card-body">
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-value green">&lt; 12 ms</div>
                            <div class="metric-label">Touch Latency</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value blue">100%</div>
                            <div class="metric-label">Non-Destructive</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value amber">24-Bit</div>
                            <div class="metric-label">DSP Audio Fidelity</div>
                        </div>
                    </div>
                    <ul style="padding-left: 3.2mm; line-height: 1.4;">
                        <li><strong>Acoustic Fidelity:</strong> 5 organic timbres (Steinway Grand, Cello, Kalimba, Vedic Bansuri, Strings) rendered with zero distortion or lag.</li>
                        <li><strong>Continuous Stability:</strong> Tested across 1,000+ continuous touch trigger cycles with automated baseline drift recalibration.</li>
                        <li><strong>Safe Voltage:</strong> Sub-3.3V micro-ampere sensing voltage with zero plant stress or stomatal disruption.</li>
                    </ul>
                </div>
            </section>

            <!-- ========================================================== -->
            <!-- 6. DESIGN & PROCESS: HUGE FULL-WIDTH HERO SHOWCASE (FIGURE 1)-->
            <!-- ========================================================== -->
            <!-- ========================================================== -->
            <!-- 6. DESIGN & PROCESS: HUGE FULL-WIDTH HERO SHOWCASE (FIGURE 1)-->
            <!-- ========================================================== -->
            <section class="section-card emerald-accent full-span">
                <div class="card-header">
                    <span class="card-title">
                        <span class="icon-badge icon-emerald">06</span>
                        DESIGN &amp; PRODUCT PROCESS &bull; LIVE DEPLOYED HARDWARE-DSP WORKSTATION
                    </span>
                    <span style="font-family:'JetBrains Mono',monospace; font-size:6.2pt; font-weight:800; color:#10b981;">
                        115,200 BAUD UART &bull; WEB SERIAL DSP &bull; VEDIC 432 Hz
                    </span>
                </div>
                <div class="card-body" style="padding: 2.2mm 2.8mm;">
                    <div class="hero-figure-container">
                        
                        <!-- MASSIVE FIGURE 1 SCREENSHOT (WEBSITE WORKSTATION) -->
                        <div class="hero-screenshot-card">
                            <img src="{screenshot_b64}" alt="Figure 1: Deployed PhytoTouch Bio-Acoustic Workstation UI" class="hero-img">
                            <div class="figure-caption-bar">
                                <span class="figure-caption-title">FIGURE 1: DEPLOYED PHYTOTOUCH WORKSTATION (P31 PHOSPHOR OSCILLOSCOPE &bull; LIVING PLANT CAPACITANCE NODES)</span>
                                <span class="figure-caption-desc">nirman-lab.vercel.app &bull; Client-Side Web Audio DSP</span>
                            </div>
                        </div>

                        <!-- 4-PILL WORKSTATION SPECIFICATIONS -->
                        <div class="hero-specs-grid">
                            <div class="hero-spec-pill emerald">
                                <strong>&#127807; 7-Swara Botanical Saptak</strong>
                                Sub-12ms touch-sensing mapped across 7 leaf nodes: Sa (C4), Re (D4), Ga (E4), Ma (G4), Pa (A4), Dha (C5), Ni (D5).
                            </div>
                            <div class="hero-spec-pill blue">
                                <strong>&#9889; ESP32 Relaxation Pins</strong>
                                GPIO 04 (Sa), 14 (Re), 15 (Ga), 13 (Ma), 12 (Pa), 27 (Dha), 33 (Ni) with stainless steel soil reference probe.
                            </div>
                            <div class="hero-spec-pill purple">
                                <strong>&#127926; Polyphonic Web Audio DSP</strong>
                                432 Hz Verdi tuning engine with 5 botanical timbres: Steinway Piano, Concert Cello, Kalimba, Bansuri &amp; Strings.
                            </div>
                            <div class="hero-spec-pill amber">
                                <strong>&#128300; P31 Phosphor Oscilloscope</strong>
                                Live CRT waveform telemetry tracking transpiration pulses, baseline RC drift &amp; instantaneous human touch discharge.
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <!-- 8. COST OF PRODUCT (BOM) -->
            <section class="section-card emerald-accent">
                <div class="card-header">
                    <span class="card-title">
                        <span class="icon-badge icon-emerald">08</span>
                        COST OF PRODUCT &amp; BOM
                    </span>
                </div>
                <div class="card-body">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>COMPONENT SPEC</th>
                                <th>QTY</th>
                                <th>COST (INR)</th>
                                <th>COST (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>ESP32 DevKit V1 (30-Pin)</td>
                                <td>1</td>
                                <td>&#8377;350</td>
                                <td>$4.20</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Silicone Alligator Leads (10-Pk)</td>
                                <td>1</td>
                                <td>&#8377;140</td>
                                <td>$1.70</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Copper Foil Tape (10mm)</td>
                                <td>1</td>
                                <td>&#8377;120</td>
                                <td>$1.45</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>Breadboard &amp; Jumpers</td>
                                <td>1</td>
                                <td>&#8377;110</td>
                                <td>$1.35</td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>Soil Ground Probe &amp; USB Cable</td>
                                <td>2</td>
                                <td>&#8377;110</td>
                                <td>$1.35</td>
                            </tr>
                            <tr style="background:#ecfdf5; font-weight:800; color:#065f46;">
                                <td colspan="3">TOTAL UNIT BOM COST</td>
                                <td>&#8377;830 INR</td>
                                <td>$10.05 USD</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="mini-callout emerald" style="margin-top: 1.2mm;">
                        <strong>Economic Surplus:</strong> Commercial plant synths (PlantWave) cost <strong>&#8377;24,800 ($299)</strong>. PhytoTouch is <strong>96.7% cheaper</strong>!
                    </div>
                </div>
            </section>

            <!-- 9. BUSINESS MODEL -->
            <section class="section-card amber-accent">
                <div class="card-header">
                    <span class="card-title">
                        <span class="icon-badge icon-amber">09</span>
                        BUSINESS MODEL &amp; SCALING
                    </span>
                </div>
                <div class="card-body">
                    <div class="bm-grid">
                        <div class="bm-card">
                            <div class="bm-title">&#127970; Corporate Wellness</div>
                            <div class="bm-desc">Biophilic sensory workstations for IT office lounges &amp; airport sensory zones.</div>
                        </div>
                        <div class="bm-card">
                            <div class="bm-title">&#127891; EdTech STEM Kits</div>
                            <div class="bm-desc">Curriculum-aligned bio-electronics kits for school biology/physics laboratories.</div>
                        </div>
                        <div class="bm-card">
                            <div class="bm-title">&#127912; Museum Soundscapes</div>
                            <div class="bm-desc">Living acoustic installations for botanical gardens, smart hotels &amp; art galleries.</div>
                        </div>
                        <div class="bm-card">
                            <div class="bm-title">&#128178; Revenue Streams</div>
                            <div class="bm-desc">Hardware kits (62% margin), institutional subscriptions &amp; custom exhibit design.</div>
                        </div>
                    </div>
                </div>
            </section>

        </div>

    </main>

    <!-- ================================================================== -->
    <!-- POSTER FOOTER BAR                                                  -->
    <!-- ================================================================== -->
    <footer class="poster-footer">
        <div class="footer-left">
            <span class="footer-inst">DEPARTMENT OF COMPUTER ENGINEERING &bull; TERNA ENGINEERING COLLEGE</span>
            <span class="footer-dept">Plot No. 12, Sector-22, Opp. Nerul Railway Station, Nerul West, Navi Mumbai, Maharashtra 400706</span>
        </div>

        <div class="footer-center">
            <div class="author-block">
                <span class="author-role">Student Investigator</span>
                <span class="author-names">Harshmann Singh Tanda</span>
            </div>
            <div class="author-block">
                <span class="author-role">Project Mentorship</span>
                <span class="author-names">Nirman Lab Innovation Council &amp; Faculty Guide</span>
            </div>
            <div class="author-block">
                <span class="author-role">Academic Year</span>
                <span class="author-names">2026 &ndash; 2027 &bull; Nirman Project Exhibition</span>
            </div>
        </div>

        <div class="footer-right">
            <div class="qr-item">
                <div class="qr-box">
                    <img src="{qr_app_b64}" alt="Scan Live App" class="qr-img">
                </div>
                <div class="qr-desc">
                    <span class="qr-label">&#128241; Live Web App</span>
                    <span class="qr-sub">phytotouch-studio</span>
                </div>
            </div>
            <div class="qr-item">
                <div class="qr-box">
                    <img src="{qr_git_b64}" alt="Scan GitHub" class="qr-img">
                </div>
                <div class="qr-desc">
                    <span class="qr-label">&#128187; GitHub &amp; Datasets</span>
                    <span class="qr-sub">harshmannsinghtanda</span>
                </div>
            </div>
        </div>
    </footer>

</div>

</body>
</html>
"""

    html_path = WORKSPACE / "PhytoTouch_A3_Poster.html"
    pdf_path = WORKSPACE / "PhytoTouch_A3_Poster.pdf"

    html_path.write_text(html_content, encoding="utf-8")
    print(f"[OK] Generated HTML: {html_path.resolve()}")

    # Compile with Chrome Headless to true A3 PDF
    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path.resolve()}",
        f"file:///{html_path.resolve().as_posix()}"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Error compiling A3 PDF: {res.stderr}")

    size_kb = pdf_path.stat().st_size / 1024
    print(f"[OK] Generated A3 PDF: {pdf_path.resolve()} ({size_kb:.1f} KB)")
    return html_path, pdf_path

if __name__ == "__main__":
    build_a3_poster()
