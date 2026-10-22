/* ==============================================================================
   CitrusHardwareGuideModal.jsx
   Physical Hardware Assembly, Wiring Schematics & ESP32 Flashing Manual
   World-class interactive interface for Mechatronics & Physical Computing
   Nirman Lab 2026 - Student Engineering Initiative
   ============================================================================== */

import React, { useState } from 'react';
import {
  Cpu,
  Wrench,
  Zap,
  Terminal,
  X,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Sliders,
  Play
} from 'lucide-react';

const ARDUINO_FIRMWARE_CODE = `/* ==============================================================================
   CitrusSense: ESP32 Optical Citrus Sorter & Diverter Gate Controller
   Firmware Version: 2.4.0 (Nirman Lab 2026 Student Engineering Initiative)
   Hardware Target: ESP32 DevKit V1 / Arduino Nano 33 IoT
   Compatible Servos: SG90, MG996R, RDS3115
   LED Ring: WS2812B NeoPixel (8, 12, or 16 LED Ring)
   Sensor: VL53L0X Time-of-Flight / Sharp GP2Y0A21YK0F IR Sensor
   Baud Rate: 115200 (Web Serial API compatible)
   ============================================================================== */

#include <Arduino.h>
#include <ESP32Servo.h>
#include <Adafruit_NeoPixel.h>

#define SERVO_PIN           18   // PWM pin for Gate Actuator Servo
#define NEOPIXEL_PIN        19   // Data pin for Optical Ring Illumination
#define NUM_LEDS            12   // Standard 12-LED WS2812B ring
#define PROXIMITY_PIN       34   // Analog input for IR distance sensor
#define STATUS_LED_PIN       2   // Onboard ESP32 Blue LED

#define GATE_ANGLE_NEUTRAL  90   // Straight through (Grade B / Retail)
#define GATE_ANGLE_GRADE_A  45   // Left chute (Grade A / Export)
#define GATE_ANGLE_GRADE_B  90   // Center chute (Grade B / Retail)
#define GATE_ANGLE_GRADE_C 135   // Right chute (Grade C / Industrial Pectin)
#define GATE_ANGLE_GRADE_D 175   // Trapdoor reject (Grade D / Bio-Hazard Quarantine)

Servo diverterServo;
Adafruit_NeoPixel ledRing(NUM_LEDS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

void setRingColor(uint8_t r, uint8_t g, uint8_t b) {
  for (int i = 0; i < NUM_LEDS; i++) {
    ledRing.setPixelColor(i, ledRing.Color(r, g, b));
  }
  ledRing.show();
}

void actuateGate(char grade) {
  int targetAngle = GATE_ANGLE_NEUTRAL;
  switch (grade) {
    case 'A': targetAngle = GATE_ANGLE_GRADE_A; setRingColor(0, 255, 80); break;
    case 'B': targetAngle = GATE_ANGLE_GRADE_B; setRingColor(245, 175, 10); break;
    case 'C': targetAngle = GATE_ANGLE_GRADE_C; setRingColor(30, 144, 255); break;
    case 'D': targetAngle = GATE_ANGLE_GRADE_D; setRingColor(255, 20, 20); break;
  }
  diverterServo.write(targetAngle);
  delay(450);
  diverterServo.write(GATE_ANGLE_NEUTRAL);
  setRingColor(240, 240, 210); // Restore inspection white
}

void setup() {
  Serial.begin(115200);
  pinMode(STATUS_LED_PIN, OUTPUT);
  ESP32PWM::allocateTimer(0);
  diverterServo.setPeriodHertz(50);
  diverterServo.attach(SERVO_PIN, 500, 2400);
  diverterServo.write(GATE_ANGLE_NEUTRAL);
  ledRing.begin();
  setRingColor(240, 240, 210);
  digitalWrite(STATUS_LED_PIN, HIGH);
  Serial.println("{\\"status\\":\\"CITRUSSENSE_ESP32_READY\\",\\"version\\":\\"2.4.0\\"}");
}

void loop() {
  if (Serial.available() > 0) {
    String incoming = Serial.readStringUntil('\\n');
    incoming.trim();
    if (incoming.startsWith("SORT:")) actuateGate(incoming.charAt(5));
    else if (incoming.startsWith("TEST:")) diverterServo.write(incoming.substring(5).toInt());
  }
  delay(10);
}`;

export function CitrusHardwareGuideModal({
  isOpen,
  onClose,
  isSerialConnected,
  onSerialConnect,
  onSerialDisconnect,
  onSerialSend
}) {
  const [activeTab, setActiveTab] = useState('tester'); // 'tester' | 'wiring' | 'firmware' | 'assembly'
  const [testAngle, setTestAngle] = useState(90);
  const [copied, setCopied] = useState(false);

  // Listen for Escape key
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTestServo = (angle) => {
    setTestAngle(angle);
    if (onSerialSend) {
      onSerialSend(`TEST:${angle}`);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(ARDUINO_FIRMWARE_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Persistent Floating Close Pill (Top-Right on Viewport) */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[60] craft-btn !py-2 !px-4 !text-xs font-black !bg-[#ef4444] hover:!bg-[#dc2626] !text-white flex items-center gap-1.5 shadow-2xl cursor-pointer active:scale-95 border-2 border-white/20"
        title="Close Hardware Guide (ESC)"
      >
        <X className="w-4 h-4 text-white" />
        <span>CLOSE [ESC]</span>
      </button>

      <div
        className="glass-panel w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-white/15 shadow-2xl overflow-hidden bg-[#0a0d14]/95 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 px-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#0f172a] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-tight">
                  ESP32 Mechatronic Sorter Hardware Manual
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30">
                  FIRMWARE V2.4
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                Wiring Schematics, WebSerial UART Diagnostics & Physical Diverter Assembly
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="craft-btn !py-2 !px-4 !text-xs font-black !bg-white/15 hover:!bg-white/25 !text-white border border-white/25 flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
            title="Close Guide (ESC)"
          >
            <X className="w-4 h-4 text-white" />
            <span>CLOSE [ESC]</span>
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-white/10 bg-[#0d111a] overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('tester')}
            className={`craft-btn !py-1.5 !px-3.5 !text-xs font-bold rounded-xl transition-all ${
              activeTab === 'tester'
                ? '!bg-white !text-black shadow-md'
                : '!bg-transparent !border-transparent text-[#94a3b8] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#f59e0b]" />
            1. LIVE WEBSERIAL & SERVO TESTER
          </button>

          <button
            onClick={() => setActiveTab('wiring')}
            className={`craft-btn !py-1.5 !px-3.5 !text-xs font-bold rounded-xl transition-all ${
              activeTab === 'wiring'
                ? '!bg-white !text-black shadow-md'
                : '!bg-transparent !border-transparent text-[#94a3b8] hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#38bdf8]" />
            2. SCHEMATIC & PINOUT
          </button>

          <button
            onClick={() => setActiveTab('firmware')}
            className={`craft-btn !py-1.5 !px-3.5 !text-xs font-bold rounded-xl transition-all ${
              activeTab === 'firmware'
                ? '!bg-white !text-black shadow-md'
                : '!bg-transparent !border-transparent text-[#94a3b8] hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#22c55e]" />
            3. ARDUINO C++ FIRMWARE
          </button>

          <button
            onClick={() => setActiveTab('assembly')}
            className={`craft-btn !py-1.5 !px-3.5 !text-xs font-bold rounded-xl transition-all ${
              activeTab === 'assembly'
                ? '!bg-white !text-black shadow-md'
                : '!bg-transparent !border-transparent text-[#94a3b8] hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-[#a855f7]" />
            4. DIY BENCHTOP CHUTE BUILD
          </button>
        </div>

        {/* Tab 1: Live WebSerial & Servo Tester */}
        {activeTab === 'tester' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Connection Banner */}
            <div className="bg-[#121622] border border-white/10 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#94a3b8] block uppercase">
                  WEB SERIAL API (CHROME / EDGE / OPERA)
                </span>
                <span className={`text-sm font-black font-mono flex items-center gap-2 mt-0.5 ${isSerialConnected ? 'text-[#22c55e]' : 'text-[#f59e0b]'}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${isSerialConnected ? 'bg-[#22c55e] animate-ping' : 'bg-[#f59e0b]'}`}></span>
                  {isSerialConnected ? 'ESP32 CONTROLLER CONNECTED (115200 BAUD)' : 'SIMULATION MODE (NO USB COM PORT DETECTED)'}
                </span>
                <p className="text-xs text-[#cbd5e1] mt-1">
                  Plug your ESP32 / Arduino via USB. The browser establishes bidirectional serial communications directly from this web page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isSerialConnected ? (
                  <button
                    onClick={onSerialDisconnect}
                    className="craft-btn !py-2 !px-4 !text-xs !bg-[#ef4444]/20 !border-[#ef4444]/50 !text-[#ef4444] font-bold"
                  >
                    DISCONNECT
                  </button>
                ) : (
                  <button
                    onClick={onSerialConnect}
                    className="craft-btn !py-2 !px-4 !text-xs !bg-[#22c55e] !text-black font-black flex items-center gap-1.5 shadow-lg"
                  >
                    <Zap className="w-4 h-4 text-black" />
                    CONNECT ESP32 VIA USB
                  </button>
                )}
              </div>
            </div>

            {/* Direct Servo Gate Actuator Tester */}
            <div className="bg-[#0e121a] border border-white/10 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#f59e0b]" />
                  DIRECT SERVO DIVERTER GATE ACTUATOR TESTER
                </h4>
                <span className="text-xs font-mono font-bold text-[#f59e0b] bg-[#f59e0b]/10 px-2.5 py-0.5 rounded border border-[#f59e0b]/30">
                  CURRENT ANGLE: {testAngle}°
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                Click any gate deflection angle below. CitrusSense will immediately transmit a UART packet <code className="text-[#38bdf8] font-mono">TEST:angle</code> to actuate the physical diverter servo:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <button
                  onClick={() => handleTestServo(45)}
                  className={`craft-btn !py-3 !px-2 flex flex-col items-center gap-1 transition-all ${
                    testAngle === 45 ? '!border-[#22c55e] !bg-[#22c55e]/15 !text-[#22c55e]' : ''
                  }`}
                >
                  <span className="text-sm font-black font-mono">GATE A: 45°</span>
                  <span className="text-[10px] text-[#94a3b8] font-semibold">GRADE A (EXPORT)</span>
                </button>

                <button
                  onClick={() => handleTestServo(90)}
                  className={`craft-btn !py-3 !px-2 flex flex-col items-center gap-1 transition-all ${
                    testAngle === 90 ? '!border-[#f59e0b] !bg-[#f59e0b]/15 !text-[#f59e0b]' : ''
                  }`}
                >
                  <span className="text-sm font-black font-mono">GATE B: 90°</span>
                  <span className="text-[10px] text-[#94a3b8] font-semibold">GRADE B (RETAIL)</span>
                </button>

                <button
                  onClick={() => handleTestServo(135)}
                  className={`craft-btn !py-3 !px-2 flex flex-col items-center gap-1 transition-all ${
                    testAngle === 135 ? '!border-[#38bdf8] !bg-[#38bdf8]/15 !text-[#38bdf8]' : ''
                  }`}
                >
                  <span className="text-sm font-black font-mono">GATE C: 135°</span>
                  <span className="text-[10px] text-[#94a3b8] font-semibold">GRADE C (PECTIN)</span>
                </button>

                <button
                  onClick={() => handleTestServo(175)}
                  className={`craft-btn !py-3 !px-2 flex flex-col items-center gap-1 transition-all ${
                    testAngle === 175 ? '!border-[#ef4444] !bg-[#ef4444]/15 !text-[#ef4444]' : ''
                  }`}
                >
                  <span className="text-sm font-black font-mono">GATE D: 175°</span>
                  <span className="text-[10px] text-[#94a3b8] font-semibold">GRADE D (REJECT)</span>
                </button>
              </div>
            </div>

            {/* Quick UART Telemetry Packet Inspector */}
            <div className="bg-[#0e121a] border border-white/10 p-4 rounded-2xl space-y-2">
              <span className="text-[11px] font-bold text-[#94a3b8] block uppercase">
                BIDIRECTIONAL SERIAL TELEMETRY PROTOCOL
              </span>
              <div className="font-mono text-xs text-[#cbd5e1] space-y-1 bg-[#06080c] p-3 rounded-xl border border-white/5">
                <div><span className="text-[#22c55e]">TX (Web -&gt; ESP32):</span> SORT:A | SORT:B | SORT:C | SORT:D | TEST:90</div>
                <div><span className="text-[#38bdf8]">RX (ESP32 -&gt; Web):</span> {`{"event":"SORT_ACK","grade":"A","angle":45,"total":142}`}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Wiring & Pinout */}
        {activeTab === 'wiring' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#f59e0b]" />
                ESP32 GPIO PINOUT SPECIFICATION
              </h4>
              <p className="text-xs text-[#94a3b8]">
                Wiring diagram for standard ESP32 30-pin / 38-pin DevKit V1:
              </p>
              
              <div className="border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[#121622] text-[#94a3b8] border-b border-white/10 font-mono">
                    <tr>
                      <th className="p-3">COMPONENT</th>
                      <th className="p-3">ESP32 GPIO</th>
                      <th className="p-3">POWER RAIL</th>
                      <th className="p-3">HARDWARE FUNCTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#0a0d14] text-[#cbd5e1] font-mono">
                    <tr>
                      <td className="p-3 font-bold text-white">SG90 / MG996R Servo</td>
                      <td className="p-3 text-[#f59e0b] font-bold">GPIO 18 (PWM)</td>
                      <td className="p-3">VIN / 5V (1A)</td>
                      <td className="p-3 text-[#94a3b8]">Diverter gate mechanical deflection arm</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">WS2812B NeoPixel Ring</td>
                      <td className="p-3 text-[#22c55e] font-bold">GPIO 19 (DATA)</td>
                      <td className="p-3">5V &amp; GND</td>
                      <td className="p-3 text-[#94a3b8]">12-LED shadowless illumination dome</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">VL53L0X ToF / IR Sensor</td>
                      <td className="p-3 text-[#38bdf8] font-bold">GPIO 34 (ANALOG)</td>
                      <td className="p-3">3.3V &amp; GND</td>
                      <td className="p-3 text-[#94a3b8]">Fruit arrival detection beam</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Diagnostic LED</td>
                      <td className="p-3 text-white font-bold">GPIO 2 (ONBOARD)</td>
                      <td className="p-3">Internal</td>
                      <td className="p-3 text-[#94a3b8]">Heartbeat &amp; Serial UART transmission indicator</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bill of Materials Card */}
            <div className="bg-[#121622] border border-white/10 p-4 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-white block uppercase">
                ESTIMATED PROTOTYPE BILL OF MATERIALS (UNDER ₹1,200 INR / $14 USD)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#0a0d14] p-3 rounded-xl border border-white/5">
                  <span className="text-[#94a3b8] block">ESP32 DevKit V1</span>
                  <span className="font-bold text-white font-mono">₹450 ($5.40)</span>
                </div>
                <div className="bg-[#0a0d14] p-3 rounded-xl border border-white/5">
                  <span className="text-[#94a3b8] block">SG90 / MG996R Servo</span>
                  <span className="font-bold text-white font-mono">₹280 ($3.30)</span>
                </div>
                <div className="bg-[#0a0d14] p-3 rounded-xl border border-white/5">
                  <span className="text-[#94a3b8] block">WS2812B 12-LED Ring</span>
                  <span className="font-bold text-white font-mono">₹180 ($2.10)</span>
                </div>
                <div className="bg-[#0a0d14] p-3 rounded-xl border border-white/5">
                  <span className="text-[#94a3b8] block">Acrylic / PVC Chute</span>
                  <span className="font-bold text-white font-mono">₹200 ($2.40)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Arduino C++ Firmware */}
        {activeTab === 'firmware' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">
                  COMPLETE ARDUINO C++ SOURCE SKETCH (READY TO FLASH)
                </h4>
                <p className="text-xs text-[#94a3b8]">
                  Open in Arduino IDE, select Board: "ESP32 Dev Module", and click Upload.
                </p>
              </div>

              <button
                onClick={handleCopyCode}
                className="craft-btn !py-2 !px-4 text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                {copied ? <Check className="w-4 h-4 text-[#22c55e]" /> : <Copy className="w-4 h-4" />}
                {copied ? 'COPIED TO CLIPBOARD!' : 'COPY INO CODE'}
              </button>
            </div>

            <pre className="bg-[#06080c] border border-white/10 p-4 rounded-2xl text-[11px] font-mono text-[#cbd5e1] overflow-x-auto max-h-[360px] leading-relaxed select-all">
              {ARDUINO_FIRMWARE_CODE}
            </pre>
          </div>
        )}

        {/* Tab 4: DIY Benchtop Chute Build */}
        {activeTab === 'assembly' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#a855f7]" />
              HOW TO BUILD THE LOW-COST DEMO RIG IN 30 MINUTES
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#121622] p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#f59e0b] block uppercase">
                  STEP 1: GRAVITY CHUTE
                </span>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Cut a 3-inch PVC pipe or rigid cardboard shipping tube at a 25° incline. Citrus rolls naturally under gravity without requiring expensive belt drives for table demonstrations.
                </p>
              </div>

              <div className="bg-[#121622] p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#22c55e] block uppercase">
                  STEP 2: OPTICAL APERTURE
                </span>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Mount the WS2812B NeoPixel ring over an inspection window in the chute. Mount your smartphone or webcam 12cm directly above to capture clear dorsal views.
                </p>
              </div>

              <div className="bg-[#121622] p-4 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs font-bold text-[#38bdf8] block uppercase">
                  STEP 3: SERVO DIVERTER GATE
                </span>
                <p className="text-xs text-[#cbd5e1] leading-relaxed">
                  Affix a 3D-printed or plastic guide flap to the SG90 servo spline at the bottom. As the AI identifies Grade A, B, or D, the servo instantaneously deflects into the target sorting bin!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-[#0d111a] flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-[#94a3b8]">
            <CheckCircle className="w-4 h-4 text-[#22c55e]" />
            <span>Firmware verified on ESP32 DevKit V1 and Arduino Nano 33 IoT</span>
          </div>

          <button
            onClick={onClose}
            className="craft-btn !py-2 !px-5 !text-xs !bg-white !text-black font-black cursor-pointer shadow-lg"
          >
            CLOSE GUIDE
          </button>
        </div>
      </div>
    </div>
  );
}
