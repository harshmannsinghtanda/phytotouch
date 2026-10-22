/*
 ==============================================================================
  PhytoSonic: Living Plant Bio-Acoustic Synthesizer Firmware
  Hardware: Arduino Uno / Nano / Mega (ATmega328P)
  Fallback for students using Arduino instead of ESP32
 ==============================================================================
  
  HOW TO WIRE WITH ARDUINO UNO:
  1. Take 5 Resistors (1 MegaOhm or 500k to 10M Ohm each).
  2. Connect one end of each resistor to 5V.
  3. Connect the other end of each resistor to Analog Pins:
       - Resistor 1 -> Pin A0 (Leaf 1)
       - Resistor 2 -> Pin A1 (Leaf 2)
       - Resistor 3 -> Pin A2 (Leaf 3)
       - Resistor 4 -> Pin A3 (Leaf 4)
       - Resistor 5 -> Pin A4 (Leaf 5)
  4. Connect a wire from each Analog Pin to a leaf of your plant.
  5. Connect Arduino GND to the soil or to your wrist.
  6. When someone touches a leaf, human resistance changes the ADC reading!
 ==============================================================================
*/

const int NUM_CHANNELS = 5;
const int analogPins[NUM_CHANNELS] = { A0, A1, A2, A3, A4 };

void setup() {
  Serial.begin(115200);
  pinMode(13, OUTPUT);
}

void loop() {
  for (int i = 0; i < NUM_CHANNELS; i++) {
    int val = analogRead(analogPins[i]);
    // Map 0-1023 down to 0-100 scale for consistency with web app
    int mapped = map(val, 0, 1023, 0, 100);
    Serial.print(mapped);
    if (i < NUM_CHANNELS - 1) {
      Serial.print(",");
    }
  }
  Serial.println();
  delay(35);
}
