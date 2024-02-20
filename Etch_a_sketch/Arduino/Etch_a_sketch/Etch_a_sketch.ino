/* Potentiometers #1 & #2 */
const int DELAY_MS = 5;
const int ANALOG_INPUT_PIN_1 = A0;
const int ANALOG_INPUT_PIN_2 = A1;
const int MAX_ANALOG_INPUT = 1023;
int _lastAnalogVal_1 = -1;
int _lastAnalogVal_2 = -1;

void setup() {
  Serial.begin(115200);
}

void loop() {

  // Get the new analog value
  int analogVal_1 = analogRead(ANALOG_INPUT_PIN_1);
  int analogVal_2 = analogRead(ANALOG_INPUT_PIN_2);

  // If one of the analog values has changed, send a new one over serial (but filter out some noise)
  if(_lastAnalogVal_1 + 1 < analogVal_1 || _lastAnalogVal_1 - 1 > analogVal_1 || _lastAnalogVal_2 + 1 < analogVal_2 || _lastAnalogVal_2 - 1 > analogVal_2) {

    Serial.print(analogVal_1);
    Serial.print(",");
    Serial.print(analogVal_2);
    Serial.println();

    _lastAnalogVal_1 = analogVal_1;
    _lastAnalogVal_2 = analogVal_2;
  }
  
  delay(DELAY_MS);
}