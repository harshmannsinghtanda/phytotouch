"""
==============================================================================
CitrusSense PDF Generation Suite
Generates 3 publication-grade, executive PDFs:
1. CitrusSense_Technical_Working_Manual.pdf (Full system architecture & CV/Hardware manual)
2. CitrusSense_GitHub_Source_Code.pdf (Complete source code & GitHub repository handbook)
3. CitrusSense_Presentation_Pitch_Dossier.pdf (2-min verbal pitch, specs, nutrition, physics, economics & jury defense)
==============================================================================
"""

import os
import sys
import subprocess
import html
from pathlib import Path

WORKSPACE = Path(r"d:\veer-coding\Nirman Lab")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

COMMON_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

@page {
    size: A4 portrait;
    margin: 16mm 14mm 16mm 14mm;
}

@media print {
    body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
    .page-break {
        page-break-before: always;
        break-before: page;
    }
    .no-break {
        page-break-inside: avoid;
        break-inside: avoid;
    }
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    font-size: 10pt;
    line-height: 1.55;
}

/* Header & Banner */
.doc-header {
    border-bottom: 2px solid #0284c7;
    padding-bottom: 12px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}
.doc-header .brand {
    font-size: 16pt;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.doc-header .brand span {
    color: #0284c7;
}
.doc-header .meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    color: #64748b;
    text-align: right;
    line-height: 1.4;
}

/* Cover / Title Page Block */
.hero-box {
    background: linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e293b 100%);
    color: #ffffff;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    border: 1px solid #334155;
    position: relative;
    overflow: hidden;
}
.hero-box .badge {
    display: inline-block;
    background: rgba(2, 132, 199, 0.25);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.5);
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5pt;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    text-transform: uppercase;
    margin-bottom: 10px;
}
.hero-box h1 {
    font-size: 20pt;
    font-weight: 900;
    line-height: 1.2;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
}
.hero-box p {
    font-size: 9.5pt;
    color: #cbd5e1;
    line-height: 1.5;
    max-width: 90%;
}
.hero-box .kpi-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.hero-box .kpi-card {
    background: rgba(255, 255, 255, 0.05);
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.08);
}
.hero-box .kpi-card .val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13pt;
    font-weight: 800;
    color: #38bdf8;
}
.hero-box .kpi-card .lbl {
    font-size: 7pt;
    color: #94a3b8;
    text-transform: uppercase;
    font-weight: 600;
}

/* Headings */
h2 {
    font-size: 13pt;
    font-weight: 800;
    color: #0f172a;
    margin-top: 18px;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1.5px solid #e2e8f0;
    display: flex;
    align-items: center;
    gap: 6px;
}
h2 .num {
    background: #0284c7;
    color: white;
    font-size: 8pt;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
}
h3 {
    font-size: 10.5pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 12px;
    margin-bottom: 6px;
}
p {
    margin-bottom: 8px;
    color: #334155;
    font-size: 9pt;
}

/* Callout Box */
.callout {
    background: #f8fafc;
    border-left: 4px solid #0284c7;
    padding: 10px 14px;
    border-radius: 0 8px 8px 0;
    margin: 12px 0;
    font-size: 8.5pt;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
}
.callout.warning {
    border-left-color: #ef4444;
    background: #fef2f2;
}
.callout.success {
    border-left-color: #16a34a;
    background: #f0fdf4;
}
.callout.amber {
    border-left-color: #f59e0b;
    background: #fffbeb;
}
.callout-title {
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 3px;
    font-size: 8.5pt;
    display: flex;
    align-items: center;
    gap: 5px;
}

/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0 16px 0;
    font-size: 8pt;
}
th, td {
    padding: 6px 10px;
    text-align: left;
    border: 1px solid #cbd5e1;
}
th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 7.5pt;
    letter-spacing: 0.5px;
}
tr:nth-child(even) td {
    background: #f8fafc;
}

/* Badges */
.grade-pill {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-weight: 800;
    font-size: 7pt;
    font-family: 'JetBrains Mono', monospace;
}
.grade-a { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
.grade-b { background: #e0f2fe; color: #0369a1; border: 1px solid #7dd3fc; }
.grade-c { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
.grade-d { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }

/* Code Blocks */
.code-window {
    background: #090d16;
    border-radius: 8px;
    border: 1px solid #1e293b;
    margin: 10px 0 16px 0;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.code-header {
    background: #111726;
    padding: 5px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #1e293b;
}
.code-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.5pt;
    color: #94a3b8;
    font-weight: 600;
}
.code-lang {
    font-family: 'JetBrains Mono', monospace;
    font-size: 6.5pt;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.15);
    padding: 1px 6px;
    border-radius: 4px;
}
pre {
    font-family: 'JetBrains Mono', monospace;
    font-size: 7.2pt;
    color: #e2e8f0;
    padding: 10px 12px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
    line-height: 1.45;
}
code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8pt;
    background: #f1f5f9;
    color: #0f172a;
    padding: 1px 4px;
    border-radius: 3px;
    border: 1px solid #e2e8f0;
}

/* Grid & Cards */
.grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 10px 0;
}
.grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin: 10px 0;
}
.grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 10px 0;
}
.info-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.info-card.dark {
    background: #0f172a;
    color: #ffffff;
    border-color: #334155;
}
.info-card.dark h4 {
    color: #38bdf8;
}
.info-card.dark p {
    color: #cbd5e1;
}
.info-card h4 {
    font-size: 8.5pt;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 5px;
}
.info-card p {
    font-size: 8pt;
    color: #475569;
    margin: 0;
    line-height: 1.4;
}

/* Architecture Flow Diagram */
.flow-diagram {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 12px 8px;
    margin: 12px 0;
}
.flow-step {
    flex: 1;
    text-align: center;
    padding: 6px;
    background: #ffffff;
    border: 1px solid #94a3b8;
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.flow-step .step-title {
    font-size: 7.5pt;
    font-weight: 800;
    color: #0f172a;
    display: block;
}
.flow-step .step-desc {
    font-size: 6.5pt;
    color: #64748b;
    display: block;
}
.flow-arrow {
    padding: 0 4px;
    color: #0284c7;
    font-weight: 900;
    font-size: 11pt;
}

/* Footer on Pages */
.doc-footer {
    position: fixed;
    bottom: 8mm;
    left: 14mm;
    right: 14mm;
    border-top: 1px solid #e2e8f0;
    padding-top: 6px;
    display: flex;
    justify-content: space-between;
    font-size: 7pt;
    color: #94a3b8;
    font-family: 'JetBrains Mono', monospace;
}
"""

def print_pdf_via_chrome(html_path: Path, output_pdf_path: Path):
    """Executes Chrome headless to compile HTML into publication PDF."""
    abs_html = html_path.resolve()
    abs_pdf = output_pdf_path.resolve()
    
    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={abs_pdf}",
        f"file:///{abs_html.as_posix()}"
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"Chrome PDF generation failed for {html_path}: {res.stderr}")
    
    if not abs_pdf.exists() or abs_pdf.stat().st_size == 0:
        raise RuntimeError(f"Generated PDF is missing or 0 bytes: {abs_pdf}")
    
    print(f"✓ Generated PDF: {abs_pdf.name} ({abs_pdf.stat().st_size / 1024:.1f} KB)")
