"""
==============================================================================
build_all_three_pdfs.py
Master runner that compiles all 3 PDFs requested by the user:
1. CitrusSense_Technical_Working_Manual.pdf
2. CitrusSense_GitHub_Source_Code.pdf
3. CitrusSense_Presentation_Pitch_Dossier.pdf
==============================================================================
"""

import os
import sys
import fitz  # PyMuPDF
from pathlib import Path

# Add current scripts directory to sys.path
scripts_dir = Path(__file__).resolve().parent
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

import generate_pdf1_manual
import generate_pdf2_code
import generate_pdf3_pitch

def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    print("=" * 70)
    print("CITRUSSENSE MASTER PDF COMPILER - NIRMAN LAB 2026")
    print("=" * 70)

    # 1. Build PDF 1: Working Manual
    print("\n[1/3] Compiling Technical Working Manual PDF...")
    pdf1 = generate_pdf1_manual.build_pdf1()

    # 2. Build PDF 2: Full Source Code
    print("\n[2/3] Compiling Full Source Code PDF for GitHub...")
    pdf2 = generate_pdf2_code.build_pdf2()

    # 3. Build PDF 3: Presentation Pitch Dossier
    print("\n[3/3] Compiling Presentation Pitch & Jury Defense PDF...")
    pdf3 = generate_pdf3_pitch.build_pdf3()

    print("\n" + "=" * 70)
    print("PDF VERIFICATION & SUMMARY (via PyMuPDF)")
    print("=" * 70)

    for p in [pdf1, pdf2, pdf3]:
        doc = fitz.open(p)
        size_kb = p.stat().st_size / 1024
        print(f"File: {p.name}")
        print(f"  - Path:       {p.resolve()}")
        print(f"  - Pages:      {len(doc)}")
        print(f"  - Size:       {size_kb:.1f} KB")
        print(f"  - Dimensions: {doc[0].rect.width:.1f} x {doc[0].rect.height:.1f} pts (A4)")
        print("-" * 50)

    print("\nALL 3 CITRUSSENSE PDFS COMPILED AND VERIFIED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
