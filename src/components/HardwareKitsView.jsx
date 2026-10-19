import React, { useState } from 'react';
import { Cpu, Usb, Zap, ShoppingBag, Download, Copy, Check, Terminal, Layers, ShieldCheck, Activity } from 'lucide-react';

export function HardwareKitsView({ onOpenFirmware }) {
  const [copiedCode, setCopiedCode] = useState(false);

  const arduinoSnippet = `/* PhytoTouch Bio-Telemetry Core Firmware v2.4
   Board: ESP-WROOM-32 / ESP32-S3
   Differential Micro-Voltage Bio-Impedance Sensor */

#include <Arduino.h>

#define BIO_ANALOG_PIN 34    // High-Z Analog Bio-Electrode Channel
#define SAMPLE_WINDOW  128   // Moving average DSP window
#define NOTCH_50HZ_TAP 10    // Mains hum rejection filter

float baselineVoltage = 0.0;
uint32_t lastBroadcast = 0;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12); // 12-bit ADC (0 - 4095)
  analogSetAttenuation(ADC_11db);
  
  // Self-calibrate resting electrode offset
  long sum = 0;
  for(int i = 0; i < 256; i++) {
    sum += analogRead(BIO_ANALOG_PIN);
    delay(2);
  }
  baselineVoltage = (sum / 256.0) * (3.3 / 4095.0);
  Serial.println("{\"status\":\"CALIBRATED\",\"baseline_mv\":" + String(baselineVoltage * 1000) + "}");
}

void loop() {
  int raw = analogRead(BIO_ANALOG_PIN);
  float leafMv = (raw * (3.3 / 4095.0) - baselineVoltage) * 1000.0;
  
  // Broadcast JSON packet at 50Hz to Web Serial / Audio Synthesizer
  if (millis() - lastBroadcast >= 20) {
    lastBroadcast = millis();
    Serial.printf("{\"mv\":%.2f,\"raw\":%d,\"flux\":%.1f}\\n", leafMv, raw, abs(leafMv) * 14.2);
  }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(arduinoSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col w-full text-[#dde4de]">
      {/* Top Telemetry Micro-Bar */}
      <section className="w-full bg-[#09100c] px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-[#3b4a43]/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#47f3bb] animate-pulse"></span>
            <span className="font-['JetBrains_Mono'] text-[10px] text-[#47f3bb] uppercase tracking-widest font-bold">
              Hardware Architecture v4.2
            </span>
          </div>
          <span className="text-[#3b4a43] font-['JetBrains_Mono'] text-xs">/</span>
          <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1] font-medium">
            PHYTO-LAB EURORACK CLASS COMPLIANT
          </span>
        </div>
        <div className="flex items-center gap-5 text-[#bacac1] font-['JetBrains_Mono'] text-xs">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#47f3bb]" />
            <span>Signal Drift: &lt; 0.003%</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#f0c04d]" />
            <span>Input Z: 10 Gigohms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-['JetBrains_Mono'] text-[9px] text-[#47f3bb] bg-[#252b28] px-2 py-0.5 rounded font-bold">
              PRE-ORDER BATCH 04 READY
            </span>
          </div>
        </div>
      </section>

      {/* Hero Spotlight: PhytoTouch Pro 4-Channel Bio-MIDI Interface */}
      <section className="w-full px-4 md:px-8 py-12 md:py-16 relative overflow-hidden bg-gradient-to-b from-[#09100c] via-[#0e1512] to-[#171d1a]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Product Context & Actions */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#ffdf9d] bg-[#1b211e] border border-[#f0c04d]/30 px-3 py-1 rounded-full uppercase tracking-widest font-semibold">
                  Flagship Bio-Interface
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1]">Model: PT-PRO-Q4</span>
              </div>
              <h1 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-[#dde4de] tracking-tight">
                PhytoTouch Pro
              </h1>
              <p className="font-['Syne'] text-lg sm:text-xl text-[#47f3bb] font-medium">
                4-Channel Botanical Bio-MIDI &amp; Eurorack Converter
              </p>
            </div>

            <p className="font-['Inter'] text-sm sm:text-base text-[#bacac1] leading-relaxed">
              The benchmark for flora electrophysiology translation. Housed in custom CNC milled obsidian anodized aluminum, the PT-PRO captures cellular micro-voltage differentials across four distinct leaves or roots, rendering them into ultra-low-latency 1V/Oct CV, Gate bursts, and MPE-ready Polyphonic MIDI.
            </p>

            {/* Spec Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#1b211e] border border-[#3b4a43]/40 p-3 rounded-xl flex flex-col gap-1">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1] uppercase tracking-wider">Input Impedance</span>
                <span className="font-['JetBrains_Mono'] text-sm text-[#47f3bb] font-bold">10 GΩ Ultra-Z</span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#85948c]">Near-Zero Loading</span>
              </div>
              <div className="bg-[#1b211e] border border-[#3b4a43]/40 p-3 rounded-xl flex flex-col gap-1">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1] uppercase tracking-wider">ADC Sampling</span>
                <span className="font-['JetBrains_Mono'] text-sm text-[#dde4de] font-bold">24-bit / 96 kHz</span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#85948c]">Delta-Sigma Core</span>
              </div>
              <div className="bg-[#1b211e] border border-[#3b4a43]/40 p-3 rounded-xl flex flex-col gap-1 col-span-2 sm:col-span-1">
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#bacac1] uppercase tracking-wider">Roundtrip Delay</span>
                <span className="font-['JetBrains_Mono'] text-sm text-[#f0c04d] font-bold">&lt; 1.18 ms</span>
                <span className="font-['JetBrains_Mono'] text-[9px] text-[#85948c]">Direct HW Interrupt</span>
              </div>
            </div>

            {/* Pricing & Purchasing Dock */}
            <div className="bg-[#252b28] border border-[#47f3bb]/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-['Syne'] text-3xl font-extrabold text-[#dde4de]">$389</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1] uppercase">USD / In Stock</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#47f3bb]"></span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#bacac1]">Batch 04 allocation: Ships Nov 14, 2026</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => alert('PhytoTouch Pro added to shopping cart reservation.')}
                  className="px-6 py-3 bg-[#06d6a0] hover:bg-[#47f3bb] text-[#003827] font-['JetBrains_Mono'] text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,214,160,0.3)] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Reserve Pro Rig</span>
                </button>
                <button
                  onClick={onOpenFirmware}
                  className="px-4 py-3 bg-[#1b211e] hover:bg-[#303632] text-[#dde4de] border border-[#3b4a43]/40 font-['JetBrains_Mono'] text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Terminal className="w-4 h-4 text-[#f0c04d]" />
                  <span>Firmware</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hardware Box Visualizer */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative bg-[#09100c] border border-[#3b4a43]/40 rounded-2xl p-5 overflow-hidden shadow-2xl flex flex-col">
              <div className="flex items-center justify-between pb-3 mb-3 bg-[#171d1a] px-3.5 py-2 rounded-lg border border-[#3b4a43]/30">
                <div className="flex items-center gap-2">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] uppercase font-bold tracking-wider">
                    Device Render &amp; I/O Telemetry
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#85948c]">Direct 3D Preview</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f0c04d]"></span>
                  <span className="font-['JetBrains_Mono'] text-[10px] text-[#f0c04d]">CALIBRATED</span>
                </div>
              </div>

              {/* Hardware Preview Canvas */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#171d1a] border border-[#3b4a43]/40 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-['Syne'] text-base font-bold text-[#dde4de]">PhytoTouch PT-PRO</span>
                    <span className="font-['JetBrains_Mono'] text-[9px] px-2 py-0.5 rounded bg-[#47f3bb]/20 text-[#47f3bb]">24-BIT ADC</span>
                  </div>
                  <div className="flex items-center gap-2 font-['JetBrains_Mono'] text-[10px] text-[#ffdf9d]">
                    <span className="w-2 h-2 rounded-full bg-[#ffdf9d] animate-pulse"></span>
                    <span>432 Hz CLOCK</span>
                  </div>
                </div>

                {/* Oscilloscope Mini-Screen Simulation */}
                <div className="w-full h-24 bg-[#09100c] rounded-lg border border-[#47f3bb]/30 p-2 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between text-[8px] font-['JetBrains_Mono'] text-[#47f3bb]">
                    <span>CH1: MONSTERA 1.84mV</span>
                    <span>FFT: 432 Hz LYDIAN</span>
                  </div>
                  <svg className="w-full h-12" viewBox="0 0 400 50" preserveAspectRatio="none">
                    <path
                      d="M0,25 Q40,5 80,25 T160,25 T240,10 T320,40 T400,25"
                      fill="none"
                      stroke="#47f3bb"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="flex justify-between text-[8px] font-['JetBrains_Mono'] text-[#bacac1]">
                    <span>MIDI CH 01 • CV 3.42V</span>
                    <span className="text-[#f0c04d]">USB-C READY</span>
                  </div>
                </div>

                {/* I/O Jacks */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center font-['JetBrains_Mono'] text-[9px]">
                  <div className="bg-[#1b211e] p-2 rounded-lg border border-[#3b4a43]/30">
                    <div className="w-3 h-3 rounded-full bg-[#09100c] border-2 border-[#47f3bb] mx-auto mb-1"></div>
                    <span className="text-[#47f3bb] font-bold">CH1-4 CV</span>
                  </div>
                  <div className="bg-[#1b211e] p-2 rounded-lg border border-[#3b4a43]/30">
                    <div className="w-3 h-3 rounded-full bg-[#09100c] border-2 border-[#f0c04d] mx-auto mb-1"></div>
                    <span className="text-[#f0c04d] font-bold">GATE OUT</span>
                  </div>
                  <div className="bg-[#1b211e] p-2 rounded-lg border border-[#3b4a43]/30">
                    <div className="w-3 h-3 rounded-full bg-[#09100c] border-2 border-[#64f1b4] mx-auto mb-1"></div>
                    <span className="text-[#64f1b4] font-bold">TRS AUDIO</span>
                  </div>
                  <div className="bg-[#1b211e] p-2 rounded-lg border border-[#3b4a43]/30">
                    <div className="w-3 h-3 rounded-full bg-[#09100c] border-2 border-[#dde4de] mx-auto mb-1"></div>
                    <span className="text-[#dde4de] font-bold">USB-C MIDI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Botanical Rig (3 Kits) */}
      <section className="w-full bg-[#0e1512] py-16 px-4 md:px-8 border-t border-[#3b4a43]/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col gap-1">
            <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] uppercase tracking-widest font-semibold">
              Ecosystem Models
            </span>
            <h2 className="font-['Syne'] text-3xl sm:text-4xl font-bold text-[#dde4de]">
              Choose Your Botanical Rig
            </h2>
            <p className="font-['Inter'] text-xs sm:text-sm text-[#bacac1]">
              From DIY breadboard kits to Eurorack studio modules, explore the PhytoTouch hardware spectrum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kit 1 */}
            <div className="bg-[#171d1a] border border-[#3b4a43]/40 rounded-2xl p-6 flex flex-col justify-between gap-6 hover:border-[#47f3bb]/40 transition-colors">
              <div className="flex flex-col gap-3">
                <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1] uppercase font-semibold">Maker Edition</span>
                <h3 className="font-['Syne'] text-2xl font-bold text-[#dde4de]">PhytoTouch Core DIY Kit</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-['Syne'] text-3xl font-extrabold text-[#47f3bb]">$89</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1]">USD</span>
                </div>
                <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">
                  Open-source ESP32 shield PCB, 4x silver-chloride leaf clips, schematic documentation, and Arduino firmware ready for solder assembly.
                </p>
                <ul className="space-y-1.5 font-['JetBrains_Mono'] text-xs text-[#dde4de] pt-2 border-t border-[#3b4a43]/30">
                  <li className="flex items-center gap-2"><span className="text-[#47f3bb]">✓</span> ESP32-WROOM-32 Shield PCB</li>
                  <li className="flex items-center gap-2"><span className="text-[#47f3bb]">✓</span> 4x Low-Noise Leaf Clamps</li>
                  <li className="flex items-center gap-2"><span className="text-[#47f3bb]">✓</span> Web Serial &amp; MIDI Source Code</li>
                </ul>
              </div>
              <button
                onClick={() => alert('PhytoTouch Core DIY Kit reserved.')}
                className="w-full py-2.5 rounded-xl bg-[#1b211e] hover:bg-[#252b28] text-[#47f3bb] border border-[#47f3bb]/40 font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer"
              >
                Order DIY Kit
              </button>
            </div>

            {/* Kit 2 */}
            <div className="bg-[#252b28] border-2 border-[#47f3bb] rounded-2xl p-6 flex flex-col justify-between gap-6 relative shadow-[0_0_24px_rgba(6,214,160,0.2)]">
              <span className="absolute -top-3 right-6 font-['JetBrains_Mono'] text-[9px] bg-[#06d6a0] text-[#003827] px-3 py-1 rounded-full font-extrabold uppercase">
                MOST POPULAR
              </span>
              <div className="flex flex-col gap-3">
                <span className="font-['JetBrains_Mono'] text-xs text-[#ffdf9d] uppercase font-semibold">Flagship Workstation</span>
                <h3 className="font-['Syne'] text-2xl font-bold text-[#dde4de]">Studio Pro Synthesizer</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-['Syne'] text-3xl font-extrabold text-[#47f3bb]">$389</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1]">USD</span>
                </div>
                <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">
                  Fully assembled CNC aluminum console with OLED scope, 4-channel CV/Gate, 24-bit ADC, gold plated electrodes, and Ableton Link integration.
                </p>
                <ul className="space-y-1.5 font-['JetBrains_Mono'] text-xs text-[#dde4de] pt-2 border-t border-[#3b4a43]/30">
                  <li className="flex items-center gap-2"><span className="text-[#47f3bb]">✓</span> CNC Obsidian Aluminum Case</li>
                  <li className="flex items-center gap-2"><span className="text-[#47f3bb]">✓</span> 128x64 OLED Realtime Micro-Scope</li>
                  <li className="flex items-center gap-2"><span className="text-[#47f3bb]">✓</span> Polyphonic CV/Gate + USB MIDI</li>
                  <li className="flex items-center gap-2"><span className="text-[#47f3bb]">✓</span> 4x Braided Gold Electrode Probes</li>
                </ul>
              </div>
              <button
                onClick={() => alert('Studio Pro Synthesizer reserved.')}
                className="w-full py-3 rounded-xl bg-[#06d6a0] hover:bg-[#47f3bb] text-[#003827] font-['JetBrains_Mono'] text-xs font-extrabold transition-all shadow-[0_0_16px_rgba(6,214,160,0.3)] cursor-pointer"
              >
                Order Studio Pro
              </button>
            </div>

            {/* Kit 3 */}
            <div className="bg-[#171d1a] border border-[#3b4a43]/40 rounded-2xl p-6 flex flex-col justify-between gap-6 hover:border-[#f0c04d]/40 transition-colors">
              <div className="flex flex-col gap-3">
                <span className="font-['JetBrains_Mono'] text-xs text-[#ffdf9d] uppercase font-semibold">Eurorack Modular</span>
                <h3 className="font-['Syne'] text-2xl font-bold text-[#dde4de]">Flora Interface 14HP</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-['Syne'] text-3xl font-extrabold text-[#f0c04d]">$249</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1]">USD</span>
                </div>
                <p className="font-['Inter'] text-xs text-[#bacac1] leading-relaxed">
                  14HP Eurorack module providing 4x 1V/Oct CV outputs, 4x Gate triggers, bi-directional clock sync, and input attenuators for modular synths.
                </p>
                <ul className="space-y-1.5 font-['JetBrains_Mono'] text-xs text-[#dde4de] pt-2 border-t border-[#3b4a43]/30">
                  <li className="flex items-center gap-2"><span className="text-[#f0c04d]">✓</span> 14HP Standard Eurorack Format</li>
                  <li className="flex items-center gap-2"><span className="text-[#f0c04d]">✓</span> 4x 1V/Oct Volt/Octave Outputs</li>
                  <li className="flex items-center gap-2"><span className="text-[#f0c04d]">✓</span> Low 12mA Current Draw (+12V/-12V)</li>
                </ul>
              </div>
              <button
                onClick={() => alert('Eurorack Flora Interface reserved.')}
                className="w-full py-2.5 rounded-xl bg-[#1b211e] hover:bg-[#252b28] text-[#f0c04d] border border-[#f0c04d]/40 font-['JetBrains_Mono'] text-xs font-bold transition-all cursor-pointer"
              >
                Order Eurorack Module
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Developer & Maker Corner with Arduino Code */}
      <section className="w-full bg-[#09100c] py-16 px-4 md:px-8 border-t border-[#3b4a43]/30">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-['JetBrains_Mono'] text-xs text-[#47f3bb] uppercase tracking-widest font-semibold">
                Open Source Maker Stack
              </span>
              <h2 className="font-['Syne'] text-3xl font-bold text-[#dde4de]">
                ESP32 Firmware &amp; Web Serial API
              </h2>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 bg-[#1b211e] hover:bg-[#252b28] text-[#dde4de] border border-[#47f3bb]/30 rounded-xl font-['JetBrains_Mono'] text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#47f3bb]" /> : <Copy className="w-3.5 h-3.5 text-[#f0c04d]" />}
              <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Arduino Sketch'}</span>
            </button>
          </div>

          <div className="bg-[#171d1a] border border-[#3b4a43]/40 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-[#1b211e] px-4 py-2 border-b border-[#3b4a43]/40 flex items-center justify-between font-['JetBrains_Mono'] text-xs text-[#bacac1]">
              <span>PhytoTouch_ESP32_Firmware.ino</span>
              <span>115200 BAUD • 50 Hz STREAM</span>
            </div>
            <pre className="p-4 sm:p-6 text-xs sm:text-sm font-['JetBrains_Mono'] text-[#dde4de] overflow-x-auto leading-relaxed bg-[#09100c]/80">
              <code>{arduinoSnippet}</code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
