import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Cpu, Info } from 'lucide-react';

export function FirmwareModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const code = `/* ==============================================================================
   PhytoTouch - ESP32 Bio-Telemetry Micro-Voltage Firmware v2.4
   Target: ESP32-WROOM-32 / ESP32-S3
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

#include <Arduino.h>

#define BIO_PIN_CH1  34  // Analog Input CH1 (ADC1_CH6)
#define BIO_PIN_CH2  35  // Analog Input CH2 (ADC1_CH7)
#define BIO_PIN_CH3  32  // Analog Input CH3 (ADC1_CH4)
#define BIO_PIN_CH4  33  // Analog Input CH4 (ADC1_CH5)

#define OVERSAMPLE_COUNT 64

float offsets[4] = {0, 0, 0, 0};
uint32_t lastTx = 0;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12); // 12-bit (0-4095)
  analogSetAttenuation(ADC_11db);

  // Calibration loop
  delay(500);
  for (int ch = 0; ch < 4; ch++) {
    int pin = (ch == 0) ? BIO_PIN_CH1 : (ch == 1) ? BIO_PIN_CH2 : (ch == 2) ? BIO_PIN_CH3 : BIO_PIN_CH4;
    long acc = 0;
    for (int i = 0; i < OVERSAMPLE_COUNT; i++) {
      acc += analogRead(pin);
      delay(1);
    }
    offsets[ch] = (acc / (float)OVERSAMPLE_COUNT) * (3.3 / 4095.0);
  }

  Serial.println("{\"status\":\"INITIALIZED\",\"channels\":4,\"baud\":115200}");
}

void loop() {
  if (millis() - lastTx >= 20) { // 50 Hz Packet Broadcast
    lastTx = millis();

    int raw1 = analogRead(BIO_PIN_CH1);
    float mv1 = ((raw1 * (3.3 / 4095.0)) - offsets[0]) * 1000.0;

    Serial.printf("{\"ch\":1,\"mv\":%.2f,\"raw\":%d}\\n", mv1, raw1);
  }
}
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#171d1a] border border-[#f0c04d]/30 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col font-['Inter'] text-[#dde4de]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#3b4a43]/40 flex items-center justify-between bg-[#1b211e]">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#f0c04d]" />
            <h3 className="font-['Syne'] text-base font-bold text-[#dde4de]">ESP32 Firmware &amp; Setup Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#bacac1] hover:text-white hover:bg-[#252b28] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4 overflow-y-auto text-xs">
          <div className="flex items-center justify-between">
            <span className="font-['JetBrains_Mono'] text-xs text-[#bacac1]">
              Flashing Instructions &amp; Arduino Sketch
            </span>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded-lg bg-[#252b28] hover:bg-[#303632] text-[#47f3bb] border border-[#47f3bb]/30 flex items-center gap-1.5 font-['JetBrains_Mono'] text-[11px] font-bold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-[#f0c04d]" />}
              <span>{copied ? 'Copied!' : 'Copy Sketch'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#09100c] border border-[#3b4a43]/40 text-[#dde4de] font-['JetBrains_Mono'] text-[11px] overflow-x-auto leading-relaxed">
            <code>{code}</code>
          </pre>

          <div className="bg-[#1b211e] p-4 rounded-xl border border-[#3b4a43]/30 flex flex-col gap-2">
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#f0c04d] font-bold uppercase">
              Wiring &amp; Pinout Configuration:
            </span>
            <ul className="space-y-1 text-[#bacac1] font-['JetBrains_Mono'] text-[11px]">
              <li>• GPIO 34 (ADC1_CH6) → Signal Lead Leaf Electrode 1</li>
              <li>• GPIO 35 (ADC1_CH7) → Signal Lead Leaf Electrode 2</li>
              <li>• GND → Ground Electrode inserted gently into soil root ball</li>
              <li>• 100kΩ - 1MΩ Resistor between Analog Pin and GND (Pull-down stabilizer)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
