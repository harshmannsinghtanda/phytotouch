/* ==============================================================================
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

// --- PIN CONFIGURATION ---
#define SERVO_PIN           18   // PWM pin for Gate Actuator Servo
#define NEOPIXEL_PIN        19   // Data pin for Optical Ring Illumination
#define NUM_LEDS            12   // Standard 12-LED WS2812B ring
#define PROXIMITY_PIN       34   // Analog input for IR distance sensor (or GPIO for ToF)
#define STATUS_LED_PIN       2   // Onboard ESP32 Blue LED

// --- SERVO GATE DEFLECTION ANGLES (Degrees) ---
// Neutral chute: 90 deg (Straight through to Grade B / Domestic)
// Left deflection: 45 deg (Grade A / Export)
// Right deflection: 135 deg (Grade C / Processing)
// Trapdoor drop / Ejection: 175 deg (Grade D / Pathological Reject)
#define GATE_ANGLE_NEUTRAL  90
#define GATE_ANGLE_GRADE_A  45
#define GATE_ANGLE_GRADE_B  90
#define GATE_ANGLE_GRADE_C  135
#define GATE_ANGLE_GRADE_D  175

// --- GLOBAL OBJECTS ---
Servo diverterServo;
Adafruit_NeoPixel ledRing(NUM_LEDS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

// --- OPERATIONAL STATE ---
bool isArmed = true;
unsigned long lastFruitTriggerTime = 0;
unsigned long gateReturnTime = 0;
bool gateNeedsReset = false;
int totalFruitsSorted = 0;
int countA = 0, countB = 0, countC = 0, countD = 0;

// Set optical illumination ring color
void setRingColor(uint8_t r, uint8_t g, uint8_t b, bool pulse = false) {
  for (int i = 0; i < NUM_LEDS; i++) {
    ledRing.setPixelColor(i, ledRing.Color(r, g, b));
  }
  ledRing.show();
}

// Strobe effect for pathological rot rejection
void strobeRejectWarning() {
  for (int j = 0; j < 3; j++) {
    setRingColor(255, 0, 0);
    delay(40);
    setRingColor(0, 0, 0);
    delay(30);
  }
}

// Actuate diverter gate servo based on classification grade
void actuateGate(char grade) {
  int targetAngle = GATE_ANGLE_NEUTRAL;

  switch (grade) {
    case 'A': // Export
      targetAngle = GATE_ANGLE_GRADE_A;
      setRingColor(0, 255, 80); // Phosphor Green
      countA++;
      break;
    case 'B': // Domestic Retail
      targetAngle = GATE_ANGLE_GRADE_B;
      setRingColor(245, 175, 10); // Golden Amber
      countB++;
      break;
    case 'C': // Processing / Juicing
      targetAngle = GATE_ANGLE_GRADE_C;
      setRingColor(30, 144, 255); // Deep Blue
      countC++;
      break;
    case 'D': // Pathological Reject (Fungus/Rot)
      targetAngle = GATE_ANGLE_GRADE_D;
      strobeRejectWarning();
      setRingColor(255, 20, 20); // Warning Crimson
      countD++;
      break;
    default:
      targetAngle = GATE_ANGLE_NEUTRAL;
      setRingColor(220, 220, 220); // Neutral Inspection White
      break;
  }

  diverterServo.write(targetAngle);
  gateNeedsReset = true;
  gateReturnTime = millis() + 450; // Hold gate open for 450ms for fruit inertia
  totalFruitsSorted++;

  // Transmit real-time telemetry confirmation back to Web Serial UI
  Serial.print("{\"event\":\"SORT_ACK\",\"grade\":\"");
  Serial.print(grade);
  Serial.print("\",\"angle\":");
  Serial.print(targetAngle);
  Serial.print(",\"total\":");
  Serial.print(totalFruitsSorted);
  Serial.print(",\"counts\":{\"A\":");
  Serial.print(countA);
  Serial.print(",\"B\":");
  Serial.print(countB);
  Serial.print(",\"C\":");
  Serial.print(countC);
  Serial.print(",\"D\":");
  Serial.print(countD);
  Serial.println("}}");
}

void setup() {
  Serial.begin(115200);
  pinMode(STATUS_LED_PIN, OUTPUT);
  pinMode(PROXIMITY_PIN, INPUT);

  // Initialize Servo
  ESP32PWM::allocateTimer(0);
  diverterServo.setPeriodHertz(50); // Standard 50Hz servo
  diverterServo.attach(SERVO_PIN, 500, 2400);
  diverterServo.write(GATE_ANGLE_NEUTRAL);

  // Initialize NeoPixel Ring
  ledRing.begin();
  ledRing.setBrightness(140);
  
  // Power-on self test sweep
  setRingColor(0, 255, 80);
  delay(150);
  setRingColor(245, 175, 10);
  delay(150);
  setRingColor(255, 20, 20);
  delay(150);
  // Default to High-CRI Neutral White Inspection Illumination
  setRingColor(240, 240, 210);

  digitalWrite(STATUS_LED_PIN, HIGH);
  Serial.println("{\"status\":\"CITRUSSENSE_ESP32_READY\",\"version\":\"2.4.0\",\"baud\":115200}");
}

void loop() {
  unsigned long now = millis();

  // 1. Process incoming Web Serial commands from CitrusSense Web GUI
  if (Serial.available() > 0) {
    String incoming = Serial.readStringUntil('\n');
    incoming.trim();

    if (incoming.startsWith("SORT:")) {
      char grade = incoming.charAt(5); // e.g., 'SORT:A'
      actuateGate(grade);
    } 
    else if (incoming.startsWith("TEST:")) {
      int testAngle = incoming.substring(5).toInt();
      diverterServo.write(testAngle);
      Serial.print("{\"status\":\"MANUAL_SERVO_TEST\",\"angle\":");
      Serial.print(testAngle);
      Serial.println("}");
    }
    else if (incoming == "PING") {
      Serial.println("{\"status\":\"PONG\",\"uptime\":");
      Serial.print(millis());
      Serial.println("}");
    }
    else if (incoming == "WHITE_LIGHT") {
      setRingColor(255, 255, 230); // 5000K Inspection White
    }
    else if (incoming == "RESET_COUNTS") {
      countA = countB = countC = countD = totalFruitsSorted = 0;
      Serial.println("{\"status\":\"COUNTS_RESET\"}");
    }
  }

  // 2. Return diverter gate to neutral chute after fruit passes
  if (gateNeedsReset && now >= gateReturnTime) {
    diverterServo.write(GATE_ANGLE_NEUTRAL);
    setRingColor(240, 240, 210); // Restore uniform white lighting
    gateNeedsReset = false;
  }

  // 3. Proximity fruit trigger (if standalone without PC webcam trigger)
  // When an object breaks optical beam (< 150mm distance)
  int proximityVal = analogRead(PROXIMITY_PIN);
  if (proximityVal > 2200 && (now - lastFruitTriggerTime > 1200)) {
    lastFruitTriggerTime = now;
    Serial.println("{\"event\":\"FRUIT_DETECTED\",\"proximity\":");
    Serial.print(proximityVal);
    Serial.println("}");
  }

  delay(10);
}
