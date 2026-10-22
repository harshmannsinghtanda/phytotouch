/*
 ==============================================================================
  PhytoSonic Model-01: Living Plant Bio-Acoustic Synthesizer Firmware
  Hardware: ESP32 NodeMCU / DevKit V1 (30-pin or 38-pin, ESP-WROOM-32)
  Nirman Lab 2026 - Student Engineering Initiative
 ==============================================================================
  
  PHYSICAL WIRING SPECIFICATION:
  1. Microcontroller: ESP32 DevKit V1 connected to PC/Laptop via USB Data Cable.
  2. Five Biological Sensing Channels (Using ESP32 Internal Touch Controller):
       - Channel 1 (Apex Sprout):   GPIO 4  (Touch 0) -> Alligator clip on top leaf tip
       - Channel 2 (Upper Foliage):  GPIO 14 (Touch 6) -> Alligator clip on upper foliage
       - Channel 3 (Mid Canopy):     GPIO 15 (Touch 3) -> Alligator clip on center leaf
       - Channel 4 (Basal Petiole):  GPIO 13 (Touch 4) -> Alligator clip on lower leaf/stem
       - Channel 5 (Soil/Rhizome):   GPIO 12 (Touch 5) -> 2-inch stainless/brass soil probe
  3. Ground Reference:
       - Connect ESP32 'GND' to plant soil pot bottom tray or conductive touch strip.
  4. Onboard Status LED:
       - GPIO 2 blinks on active bio-capacitive human touch.

  FEATURES:
  - Automatic 500ms baseline calibration on boot (adapts to any plant species).
  - Exponential Moving Average (EMA) 50Hz mains noise suppression.
  - Remote 'C' serial command trigger for on-the-fly re-calibration from web app.
 ==============================================================================
*/

// Status LED (GPIO 2 on NodeMCU-32S / DevKit V1)
#define STATUS_LED 2

// Number of biological sensing channels
const int NUM_CHANNELS = 5;

// ESP32 Hardware Capacitive Touch GPIOs (Touch 0, Touch 6, Touch 3, Touch 4, Touch 5)
// Note: GPIO 14 (Touch 6) is used instead of GPIO 2 to prevent conflict with STATUS_LED!
const int touchPins[NUM_CHANNELS] = { 4, 14, 15, 13, 12 };

// Dynamic baseline and smoothed readings
float baselines[NUM_CHANNELS] = { 70.0, 70.0, 70.0, 70.0, 70.0 };
float smoothed[NUM_CHANNELS]  = { 70.0, 70.0, 70.0, 70.0, 70.0 };

// Auto-calibration function (samples plant resting state)
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
    if (baselines[i] < 10.0) baselines[i] = 70.0; // Fail-safe fallback
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
  // Start high-speed UART at 115200 baud for ultra-low WebSerial latency
  Serial.begin(115200);
  delay(400);

  pinMode(STATUS_LED, OUTPUT);

  // Triple-blink LED to signal firmware boot
  for (int k = 0; k < 3; k++) {
    digitalWrite(STATUS_LED, HIGH);
    delay(80);
    digitalWrite(STATUS_LED, LOW);
    delay(80);
  }

  // Perform initial tare/calibration against current plant environment
  calibrateBaselines();

  // Send ready handshake packet to browser
  Serial.println("STATUS:PHYTO_SONIC_READY:ESP32_TOUCH_V2");
}

void loop() {
  // Check for incoming serial commands from Web App (e.g. 'C' for Re-Calibrate)
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    if (cmd == 'C' || cmd == 'c') {
      calibrateBaselines();
    }
  }

  bool anyTouched = false;

  // Read each bio-capacitive channel with Exponential Moving Average (EMA)
  for (int i = 0; i < NUM_CHANNELS; i++) {
    int raw = touchRead(touchPins[i]);

    // Alpha = 0.45 provides smooth response without lagging behind fast finger taps
    smoothed[i] = (0.45f * (float)raw) + (0.55f * smoothed[i]);

    // Active touch threshold: reading drops by > 28% from undisturbed baseline
    float threshold = baselines[i] * 0.72f;
    if (smoothed[i] < threshold) {
      anyTouched = true;
    }

    // Slowly drift baseline up if plant moisture / ambient humidity shifts over hours
    if (raw > baselines[i] * 0.88f) {
      baselines[i] = (baselines[i] * 0.998f) + (raw * 0.002f);
    }
  }

  // Visual LED feedback on active bio-touch
  digitalWrite(STATUS_LED, anyTouched ? HIGH : LOW);

  // Stream comma-separated values to the Web Serial API
  // Format: "val0,val1,val2,val3,val4" (e.g. "68,69,21,72,65")
  for (int i = 0; i < NUM_CHANNELS; i++) {
    Serial.print((int)smoothed[i]);
    if (i < NUM_CHANNELS - 1) {
      Serial.print(",");
    }
  }
  Serial.println();

  // 30 Hz refresh rate (33.3ms period) for optimal Web Audio synth latency
  delay(33);
}
