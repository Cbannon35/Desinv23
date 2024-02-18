/* Multicolor LED */
int redBrightness = 0;
int greenBrightness = 0;
int blueBrightness = 0;
const int redLEDPin = 9;     // LED connected to pin 9
const int greenLEDPin = 10;  // LED connected to pin 10
const int blueLEDPin = 11;    // LED connected to pin 11

/* Potentiometer */
const int DELAY_MS = 5;
const int ANALOG_INPUT_PIN = A0;
const int MAX_ANALOG_INPUT = 1023;
int _lastAnalogVal = -1;

void setup() {
  Serial.begin(115200); // set baud rate to 115200
}

void loop() {

  // Get the new analog value
  int analogVal = analogRead(ANALOG_INPUT_PIN);

  // If the analog value has changed, send a new one over serial (but filter out some noise)
  if(_lastAnalogVal + 1 < analogVal || _lastAnalogVal - 1 > analogVal) {

    int direction = 1;
    if(_lastAnalogVal > analogVal) {
      direction = -1;
    }

    Serial.print(analogVal / 2);
    Serial.print(",");
    Serial.print(100);
    Serial.println();

    // float sizeFrac = analogVal / (float)MAX_ANALOG_INPUT;
    // int speedVec = static_cast<int>(sizeFrac * 1000) % 10 * direction;
    // // Serial.println(analogVal);
    // Serial.println(sizeFrac, 4); // 4 decimal point precision
    // _lastAnalogVal = analogVal;
    // Serial.println(speedVec); // 4 decimal point precision
  } else {
    redBrightness = 0;
    greenBrightness = 0;
    blueBrightness = 0;
  }

  
  delay(DELAY_MS);
}