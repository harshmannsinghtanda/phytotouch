/* ==============================================================================
   FirmwareGuideModal.jsx
   PhytoSonic: Complete Hardware Specification, Pinouts, Schematics,
   Firmware Source Code, Live WebSerial Terminal & BOM Guide
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState } from 'react';
import { 
  Cpu, 
  Terminal as TerminalIcon, 
  Layers, 
  ShoppingCart, 
  Copy, 
  Check, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { HardwareRigSimulator } from './HardwareRigSimulator';

const ESP32_SKETCH = `/*
 ==============================================================================
  PhytoSonic: Living Plant Bio-Acoustic Synthesizer Firmware
  Hardware: ESP32 DevKit V1 (ESP-WROOM-32 / NodeMCU-32S)
  Nirman Lab 2026 - Student Engineering Initiative
 ==============================================================================
*/

#define STATUS_LED 2
const int NUM_CHANNELS = 5;

// Pins: Touch 0, Touch 6, Touch 3, Touch 4, Touch 5
// Note: GPIO 14 is used for CH-02 to prevent conflict with STATUS_LED on GPIO 2!
const int touchPins[NUM_CHANNELS] = { 4, 14, 15, 13, 12 };

float baselines[NUM_CHANNELS] = { 70.0, 70.0, 70.0, 70.0, 70.0 };
float smoothed[NUM_CHANNELS]  = { 70.0, 70.0, 70.0, 70.0, 70.0 };

void calibrateBaselines() {
  digitalWrite(STATUS_LED, HIGH);
  const int CAL_SAMPLES = 25;
  float sum[NUM_CHANNELS] = { 0 };

  for (int s = 0; s < CAL_SAMPLES; s++) {
    for (int i = 0; i < NUM_CHANNELS; i++) {
      sum[i] += touchRead(touchPins[i]);
    }
    delay(20);
  }

  for (int i = 0; i < NUM_CHANNELS; i++) {
    baselines[i] = sum[i] / (float)CAL_SAMPLES;
    if (baselines[i] < 10.0) baselines[i] = 70.0;
    smoothed[i] = baselines[i];
  }

  digitalWrite(STATUS_LED, LOW);
  Serial.print("CALIBRATED:BASELINE:");
  for (int i = 0; i < NUM_CHANNELS; i++) {
    Serial.print((int)baselines[i]);
    if (i < NUM_CHANNELS - 1) Serial.print(",");
  }
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  delay(400);

  pinMode(STATUS_LED, OUTPUT);
  for (int k = 0; k < 3; k++) {
    digitalWrite(STATUS_LED, HIGH);
    delay(80);
    digitalWrite(STATUS_LED, LOW);
    delay(80);
  }

  calibrateBaselines();
  Serial.println("STATUS:PHYTO_SONIC_READY:ESP32_TOUCH_V2");
}

void loop() {
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    if (cmd == 'C' || cmd == 'c') {
      calibrateBaselines();
    }
  }

  bool anyTouched = false;

  for (int i = 0; i < NUM_CHANNELS; i++) {
    int raw = touchRead(touchPins[i]);
    smoothed[i] = (0.45f * (float)raw) + (0.55f * smoothed[i]);

    float threshold = baselines[i] * 0.72f;
    if (smoothed[i] < threshold) {
      anyTouched = true;
    }

    if (raw > baselines[i] * 0.88f) {
      baselines[i] = (baselines[i] * 0.998f) + (raw * 0.002f);
    }
  }

  digitalWrite(STATUS_LED, anyTouched ? HIGH : LOW);

  for (int i = 0; i < NUM_CHANNELS; i++) {
    Serial.print((int)smoothed[i]);
    if (i < NUM_CHANNELS - 1) Serial.print(",");
  }
  Serial.println();

  delay(33); // 30Hz update rate
}`;

const ARDUINO_SKETCH = `/*
 ==============================================================================
  PhytoSonic: Arduino Uno / Nano Fallback Firmware
  Connect 1M Ohm - 10M Ohm resistor from 5V to each Analog Pin (A0 to A4)
 ==============================================================================
*/

const int NUM_CHANNELS = 5;
const int analogPins[NUM_CHANNELS] = { A0, A1, A2, A3, A4 };

void setup() {
  Serial.begin(115200);
  pinMode(13, OUTPUT);
  Serial.println("STATUS:PHYTO_SONIC_ARDUINO_READY");
}

void loop() {
  for (int i = 0; i < NUM_CHANNELS; i++) {
    int val = analogRead(analogPins[i]);
    int mapped = map(val, 0, 1023, 0, 100);
    Serial.print(mapped);
    if (i < NUM_CHANNELS - 1) Serial.print(",");
  }
  Serial.println();
  delay(33);
}`;

export const FirmwareGuideModal = ({ 
  isOpen, 
  onClose,
  isSerialConnected = false,
  serialStatus = '',
  lastSerialPacket = '',
  rawChannelValues = [70, 70, 70, 70, 70],
  onSerialSend,
  onCalibrate
}) => {
  const [activeTab, setActiveTab] = useState('schematic'); // 'schematic' | 'code' | 'terminal' | 'bom'
  const [copiedType, setCopiedType] = useState(null);
  const [activeBoard, setActiveBoard] = useState('esp32');
  const [customCommand, setCustomCommand] = useState('');

  if (!isOpen) return null;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSendCommand = (e) => {
    e.preventDefault();
    if (!customCommand.trim() || !onSerialSend) return;
    onSerialSend(customCommand.trim());
    setCustomCommand('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content !max-w-6xl border border-[#10b981]/30 bg-[#072417] shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#10b981]/20 bg-[#04170e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#34d399] shadow-inner">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-mono text-[#f0fdf4] tracking-wide flex items-center gap-2">
                  <span>🌱</span>
                  <span>PHYTOTOUCH HARDWARE & FIRMWARE SUITE</span>
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10b981]/25 text-[#34d399] border border-[#10b981]/40 font-bold">
                  ESP32 CAPACITIVE SENSING
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#86efac]">
                ELECTRODE MAPPING • C++ DRIVERS • WEB SERIAL TERMINAL • BOM
              </p>
            </div>
          </div>

          <button onClick={onClose} className="craft-btn !py-1.5 !px-3 !text-xs cursor-pointer">
            ESC / CLOSE
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#10b981]/20 bg-[#061e13] px-6 gap-2 pt-2">
          {[
            { id: 'schematic', label: '1.0 CIRCUIT & PINOUT', icon: Layers },
            { id: 'code', label: '2.0 C++ FIRMWARE DRIVER', icon: Cpu },
            { id: 'terminal', label: '3.0 LIVE SERIAL TERMINAL', icon: TerminalIcon },
            { id: 'bom', label: '4.0 HARDWARE BOM & WIRING', icon: ShoppingCart }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#34d399] text-[#34d399] bg-[#0a2e1d]'
                    : 'border-transparent text-[#86efac]/70 hover:text-[#f0fdf4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-xs text-[#f0fdf4] leading-relaxed">
          
          {/* TAB 1: SCHEMATICS & PINOUT */}
          {activeTab === 'schematic' && (
            <div className="space-y-6">
              {/* Wiring Architecture Banner */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#121620] flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-extrabold text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#f59e0b]" />
                    ELECTROPHYSIOLOGICAL BIO-CAPACITANCE PRINCIPLE
                  </h3>
                  <p className="text-[11px] text-[#94a3b8] mt-1 leading-relaxed max-w-2xl">
                    Living plant sap acts as an ionic electrolyte. The ESP32 internal touch peripheral counts relaxation oscillator charge/discharge cycles. When a human finger touches a leaf, parallel human body capacitance (~120 pF) decreases the cycle count.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/30 px-2.5 py-1 rounded-full font-bold">
                    SAMPLE FREQ: 30 Hz (33ms)
                  </span>
                </div>
              </div>

              {/* Live Interactive Hardware Rig & Circuit Simulator */}
              <div className="w-full">
                <HardwareRigSimulator />
              </div>

              {/* Pinout Table */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#121620] space-y-3">
                <h3 className="text-xs font-bold text-white uppercase">Pin Interconnect Matrix</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[#94a3b8]">
                        <th className="py-2 px-2">CHANNEL</th>
                        <th className="py-2 px-2">ESP32 GPIO</th>
                        <th className="py-2 px-2">TOUCH PERIPHERAL</th>
                        <th className="py-2 px-2">LEAF POSITION</th>
                        <th className="py-2 px-2">LEAD COLOR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[#e2e8f0]">
                      <tr>
                        <td className="py-2 px-2 font-bold text-[#ef4444]">CH-01</td>
                        <td className="py-2 px-2 font-bold text-white">GPIO 4</td>
                        <td className="py-2 px-2 text-[#94a3b8]">Touch 0</td>
                        <td className="py-2 px-2">Apex Sprout (High Solo Lead)</td>
                        <td className="py-2 px-2 text-[#ef4444]">Red Lead</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-bold text-[#f59e0b]">CH-02</td>
                        <td className="py-2 px-2 font-bold text-white">GPIO 14</td>
                        <td className="py-2 px-2 text-[#94a3b8]">Touch 6 (Safe from LED2)</td>
                        <td className="py-2 px-2">Upper Foliage (Harmonic Mid)</td>
                        <td className="py-2 px-2 text-[#f59e0b]">Orange Lead</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-bold text-[#22c55e]">CH-03</td>
                        <td className="py-2 px-2 font-bold text-white">GPIO 15</td>
                        <td className="py-2 px-2 text-[#94a3b8]">Touch 3</td>
                        <td className="py-2 px-2">Central Leaf (Chord Center)</td>
                        <td className="py-2 px-2 text-[#22c55e]">Green Lead</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-bold text-[#38bdf8]">CH-04</td>
                        <td className="py-2 px-2 font-bold text-white">GPIO 13</td>
                        <td className="py-2 px-2 text-[#94a3b8]">Touch 4</td>
                        <td className="py-2 px-2">Basal Petiole (Resonant Bass)</td>
                        <td className="py-2 px-2 text-[#38bdf8]">Cyan Lead</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-bold text-[#a855f7]">CH-05</td>
                        <td className="py-2 px-2 font-bold text-white">GPIO 12</td>
                        <td className="py-2 px-2 text-[#94a3b8]">Touch 5</td>
                        <td className="py-2 px-2">Soil Rhizome (2" Depth Probe)</td>
                        <td className="py-2 px-2 text-[#a855f7]">Purple Lead</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FIRMWARE CODE */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              {/* Board Selector */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveBoard('esp32')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeBoard === 'esp32'
                        ? 'bg-[#22c55e] text-black shadow-md'
                        : 'bg-white/5 text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    ESP32 DEVKIT V1 (PRIMARY SPEC)
                  </button>
                  <button
                    onClick={() => setActiveBoard('arduino')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeBoard === 'arduino'
                        ? 'bg-[#38bdf8] text-black shadow-md'
                        : 'bg-white/5 text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    ARDUINO UNO / NANO (FALLBACK)
                  </button>
                </div>

                <button
                  onClick={() => handleCopy(activeBoard === 'esp32' ? ESP32_SKETCH : ARDUINO_SKETCH, activeBoard)}
                  className="craft-btn craft-btn-primary !py-1.5 !px-3 text-xs font-bold"
                >
                  {copiedType === activeBoard ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" />
                      <span>COPIED CODE!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-black" />
                      <span>COPY SKETCH</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Box */}
              <pre className="p-4 rounded-xl bg-[#07090e] border border-white/10 text-[#4ade80] text-xs overflow-x-auto leading-relaxed max-h-[55vh]">
                {activeBoard === 'esp32' ? ESP32_SKETCH : ARDUINO_SKETCH}
              </pre>

              <div className="p-3.5 rounded-xl border border-white/10 bg-[#121620] text-xs text-[#94a3b8]">
                <strong className="text-white block mb-1">Arduino IDE Upload Instructions:</strong>
                1. Select Board: <code>Tools &gt; Board &gt; ESP32 Arduino &gt; DOIT ESP32 DEVKIT V1</code>.<br />
                2. Set Baud Rate: <code>115,200 baud</code>.<br />
                3. Click Upload. Once flashed, open the WebSerial connection in Chrome/Edge.
              </div>
            </div>
          )}

          {/* TAB 3: LIVE TERMINAL */}
          {activeTab === 'terminal' && (
            <div className="space-y-4">
              {/* Connection Status Box */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#121620] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${isSerialConnected ? 'bg-[#22c55e] animate-ping' : 'bg-[#ef4444]'}`}></span>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isSerialConnected ? 'WEB SERIAL PORT ONLINE' : 'WEB SERIAL DISCONNECTED'}
                    </span>
                    <span className="text-[11px] text-[#94a3b8]">
                      {serialStatus || 'Ready to pair with ESP32 USB COM Port @ 115200 baud'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onCalibrate}
                    className="craft-btn !py-1.5 !px-3 text-xs"
                    title="Send Tare Calibration command 'C' to microcontroller"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>TARE BASELINE [C]</span>
                  </button>
                </div>
              </div>

              {/* Live Signal Meters for All 5 Channels */}
              <div className="grid grid-cols-5 gap-2">
                {rawChannelValues.map((val, idx) => {
                  const channelNames = ['E01 Apex', 'E02 Foliage', 'E03 Mid', 'E04 Base', 'E05 Soil'];
                  const isTouched = val < 45; // Below threshold
                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center justify-between ${
                        isTouched ? 'border-[#22c55e] bg-[#22c55e]/15' : 'border-white/10 bg-[#07090e]'
                      }`}
                    >
                      <span className="text-[10px] text-[#94a3b8] uppercase">{channelNames[idx]}</span>
                      <span className="text-2xl font-bold my-1 text-white tabular-nums">{val}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isTouched ? 'bg-[#22c55e] text-black' : 'bg-white/10 text-[#94a3b8]'}`}>
                        {isTouched ? 'TOUCHED' : 'RESTING'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Raw Packet Stream Box */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#07090e] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#22c55e]" />
                    LIVE INCOMING USB SERIAL STREAM (CSV)
                  </span>
                  <span>BAUD: 115200</span>
                </div>
                <div className="p-3 rounded-lg bg-black/80 font-mono text-xs text-[#22c55e] min-h-[90px] flex flex-col justify-end">
                  <span className="text-[#94a3b8] text-[10px]">// Incoming frames from ESP32:</span>
                  <span className="text-white text-sm font-bold mt-1">
                    {lastSerialPacket ? `> ${lastSerialPacket}` : '> Waiting for data packet...'}
                  </span>
                </div>
              </div>

              {/* Interactive Command Sender */}
              <form onSubmit={handleSendCommand} className="flex gap-2">
                <input
                  type="text"
                  value={customCommand}
                  onChange={(e) => setCustomCommand(e.target.value)}
                  placeholder="Send UART ASCII command (e.g. 'C' for Calibrate, 'STATUS')..."
                  className="flex-1 bg-[#07090e] border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#22c55e]"
                />
                <button
                  type="submit"
                  disabled={!isSerialConnected}
                  className="craft-btn craft-btn-primary !py-2 !px-4 text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: BOM & WIRING */}
          {activeTab === 'bom' && (
            <div className="space-y-6">
              {/* Itemized BOM Table */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#121620] space-y-3">
                <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-[#f59e0b]" />
                  HARDWARE BILL OF MATERIALS (BOM)
                </h3>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[#94a3b8]">
                      <th className="py-2">ITEM #</th>
                      <th className="py-2">COMPONENT SPEC</th>
                      <th className="py-2">QTY</th>
                      <th className="py-2">PRICE (INR)</th>
                      <th className="py-2">PRICE (USD)</th>
                      <th className="py-2">PURPOSE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#e2e8f0]">
                    <tr>
                      <td className="py-2 text-[#94a3b8]">1</td>
                      <td className="py-2 font-bold text-white">ESP32 DevKit V1 (30-Pin)</td>
                      <td className="py-2">1</td>
                      <td className="py-2 text-[#22c55e]">₹320</td>
                      <td className="py-2 text-[#94a3b8]">$3.80</td>
                      <td className="py-2">Main controller with 10 capacitive touch ADCs</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[#94a3b8]">2</td>
                      <td className="py-2 font-bold text-white">Silicone Alligator Jumper Leads</td>
                      <td className="py-2">5</td>
                      <td className="py-2 text-[#22c55e]">₹120</td>
                      <td className="py-2 text-[#94a3b8]">$1.45</td>
                      <td className="py-2">Non-destructive leaf electrode attachments</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[#94a3b8]">3</td>
                      <td className="py-2 font-bold text-white">Conductive Copper Foil Tape (10mm)</td>
                      <td className="py-2">1 Roll</td>
                      <td className="py-2 text-[#22c55e]">₹150</td>
                      <td className="py-2 text-[#94a3b8]">$1.80</td>
                      <td className="py-2">Electrode pads that stick safely to leaf underside</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[#94a3b8]">4</td>
                      <td className="py-2 font-bold text-white">Stainless Steel Grounding Probe</td>
                      <td className="py-2">1</td>
                      <td className="py-2 text-[#22c55e]">₹60</td>
                      <td className="py-2 text-[#94a3b8]">$0.75</td>
                      <td className="py-2">Soil moisture & return ground plane probe</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[#94a3b8]">5</td>
                      <td className="py-2 font-bold text-white">Micro-USB / USB-C High-Speed Data Cable</td>
                      <td className="py-2">1</td>
                      <td className="py-2 text-[#22c55e]">₹110</td>
                      <td className="py-2 text-[#94a3b8]">$1.30</td>
                      <td className="py-2">Power + UART WebSerial 115200 baud stream</td>
                    </tr>
                    <tr className="border-t-2 border-white/20 font-bold text-white">
                      <td className="py-2.5" colSpan="3">TOTAL SYSTEM HARDWARE COST</td>
                      <td className="py-2.5 text-[#22c55e] text-sm">₹760</td>
                      <td className="py-2.5 text-[#22c55e] text-sm">$9.10</td>
                      <td className="py-2.5 text-[#94a3b8] font-normal">Ready for Student Exhibition</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Troubleshooting Checklist */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#07090e] space-y-3">
                <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                  HARDWARE SETUP & TROUBLESHOOTING CHECKLIST
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-[#94a3b8]">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <strong className="text-white block mb-1">1. USB Data vs Charging Cable:</strong>
                    Many cheap phone cables only have 2 power wires. You MUST use a 4-wire data cable, otherwise the browser will not discover the COM port.
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <strong className="text-white block mb-1">2. USB UART Driver (CP2102 / CH340):</strong>
                    If Windows does not recognize the ESP32 in Device Manager, download and install the official Silicon Labs CP210x or CH340 driver.
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <strong className="text-white block mb-1">3. Non-Destructive Leaf Clips:</strong>
                    Use small 10mm squares of copper tape on the underside of leaves and clip alligator leads to the tape. Never puncture or pierce the leaf tissue.
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <strong className="text-white block mb-1">4. 50Hz Mains Hum Suppression:</strong>
                    Fluorescent room lights can induce 50Hz electromagnetic noise. Connecting the ESP32 GND to the damp soil pot tray eliminates 99% of ambient noise.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#10b981]/20 bg-[#04170e]">
          <span className="text-[11px] font-mono text-[#86efac]">
            NIRMAN LAB 2026 • HARDWARE PROTOCOL V2.4 • LIVING PLANT SENSING
          </span>
          <button onClick={onClose} className="craft-btn !py-1.5 !px-4 text-xs font-bold cursor-pointer">
            CLOSE SHEET
          </button>
        </div>
      </div>
    </div>
  );
};
