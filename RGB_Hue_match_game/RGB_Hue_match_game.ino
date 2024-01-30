/*
Author: Christopher Bannon

This code was made for an Arduino Uno to power 2 RGB LEDs - common anode (negative)

using pins 13, 12, 11, 10, 9, 8, 7, 6, 5, 4
simple test to fade 3 channels LED

  This example code modified from: https://www.arduino.cc/en/Tutorial/BuiltInExamples/Fade
*/

/* Random LED */
int brightness_1 = 0;    // how bright the LED is
int redBrightness_1 = 0;
int greenBrightness_1 = 0;
int blueBrightness_1 = 0; 

const int redLEDPin_1 = 11;     // LED connected to pin 9
const int greenLEDPin_1 = 12;  // LED connected to pin 10
const int blueLEDPin_1 = 13;    // LED connected to pin 11

/* Player Controlled LED */
int brightness_2 = 0;    // how bright the LED is
int redBrightness_2 = 0;
int greenBrightness_2 = 0;
int blueBrightness_2 = 0; 

const int redLEDPin_2 = 8;     // LED connected to pin 9
const int greenLEDPin_2 = 9;  // LED connected to pin 10
const int blueLEDPin_2 = 10;    // LED connected to pin 11

/* Button Logic */
int adding = 1; // +1 or -1 depending on if we are adding rbg or subtracting
const int state_LED = 7;
const int state_button = 6;

const int red_button = 3;
const int green_button = 4;
const int blue_button = 5;

void setup() {
  // initialize serial communications at 9600 bps:
  Serial.begin(9600); 

  // set the digital pins as outputs
  pinMode(greenLEDPin_1,OUTPUT);
  pinMode(redLEDPin_1,OUTPUT);
  pinMode(blueLEDPin_1,OUTPUT);

  pinMode(greenLEDPin_2,OUTPUT);
  pinMode(redLEDPin_2,OUTPUT);
  pinMode(blueLEDPin_2,OUTPUT);

  pinMode(state_LED, OUTPUT);
  pinMode(state_button, INPUT_PULLUP);

  pinMode(red_button, INPUT_PULLUP);
  pinMode(blue_button, INPUT_PULLUP);
  pinMode(green_button, INPUT_PULLUP);

  /* set state button */
  digitalWrite(state_LED, HIGH);
  adding = 1;

  Flash_LEDs(5);
}

void loop() {
  /* check if user matched other LED */
  if(checkEquality()) {
    randomize_LEDs();
    printLEDs();
  }
  /* sample buttons */
  sample_buttons();
  /* display LEDs */
  analogWrite(redLEDPin_1, redBrightness_1);
  analogWrite(greenLEDPin_1, greenBrightness_1);
  analogWrite(blueLEDPin_1, blueBrightness_1);
  analogWrite(redLEDPin_2, redBrightness_2);
  analogWrite(greenLEDPin_2, greenBrightness_2);
  analogWrite(blueLEDPin_2, blueBrightness_2);
}

// ---------------------------------
void AllOff (){
  analogWrite(redLEDPin_1, 0);
  analogWrite(greenLEDPin_1, 0);
  analogWrite(blueLEDPin_1, 0);
  analogWrite(redLEDPin_2, 0);
  analogWrite(greenLEDPin_2, 0);
  analogWrite(blueLEDPin_2, 0);

  analogWrite(state_button, 0);
  adding = false;
}
// ---------------------------------

// ---------------------------------
void Flash_LEDs(int times) {
  //Test the LED.
  for (int i = 0; i < times; i++) {
    analogWrite(redLEDPin_1, 100);
    analogWrite(greenLEDPin_1, 100);
    analogWrite(blueLEDPin_1, 100);
    analogWrite(redLEDPin_2, 100);
    analogWrite(greenLEDPin_2, 100);
    analogWrite(blueLEDPin_2, 100);
    delay(500);
    analogWrite(redLEDPin_1, 0);
    analogWrite(greenLEDPin_1, 0);
    analogWrite(blueLEDPin_1, 0);
    analogWrite(redLEDPin_2, 0);
    analogWrite(greenLEDPin_2, 0);
    analogWrite(blueLEDPin_2, 0);
    delay(500);
  }
}
// ---------------------------------
/* Returns a multiple of 10 between 0 and 250 */
int randomRGB() {
  int randomValue = random(26);
  int mappedValue = randomValue * 10;
  return mappedValue;
}
/* Checks if the user has set RGB to same */
bool checkEquality() {
  return redBrightness_1 == redBrightness_2 && greenBrightness_1 == greenBrightness_2 && blueBrightness_1 == blueBrightness_2;
}

void randomize_LEDs() {
  redBrightness_1 = randomRGB();
  greenBrightness_1 = randomRGB();
  blueBrightness_1 = randomRGB();
  redBrightness_2 = randomRGB();
  greenBrightness_2 = randomRGB();
  blueBrightness_2 = randomRGB();
}

void sample_buttons() {
  if (digitalRead(state_button) == HIGH) {
    printLEDs();

    if (adding > 0) {
      digitalWrite(state_LED, LOW);
      adding = -1;
    } else {
      digitalWrite(state_LED, HIGH);
      adding = 1;
    }
    

    while (digitalRead(state_button) == HIGH) {
      delay(0.5);
    }
  }
  if (digitalRead(red_button) == HIGH) {

    redBrightness_2 += adding * 10;
    redBrightness_2 = boundRGB(redBrightness_2);

    while (digitalRead(red_button) == HIGH) {
      delay(0.5);
    }
    printLEDs();
  }
  if (digitalRead(green_button) == HIGH) {

    greenBrightness_2 += adding * 10;
    greenBrightness_2 = boundRGB(greenBrightness_2);

    while (digitalRead(green_button) == HIGH) {
      delay(0.5);
    }
    printLEDs();
  }
  if (digitalRead(blue_button) == HIGH) {

    blueBrightness_2 += adding * 10;
    blueBrightness_2 = boundRGB(blueBrightness_2);

    while (digitalRead(blue_button) == HIGH) {
      delay(0.5);
    }
    printLEDs();
  }
}

/* returns 255 or 0 to bound rgb value */
int boundRGB(int value) {
  if (value > 255) {
    return 255;
  } else if (value < 0) {
    return 0;
  } else {
    return value;
  }
}

/* prints the led values */
void printLEDs() {
  Serial.println("LED 1:");
  Serial.print("R: ");
  Serial.print(redBrightness_1);
  Serial.print(" G: ");
  Serial.print(greenBrightness_1);
  Serial.print(" B: ");
  Serial.println(blueBrightness_1);
  Serial.println("LED 2:");
  Serial.print("R: ");
  Serial.print(redBrightness_2);
  Serial.print(" G: ");
  Serial.print(greenBrightness_2);
  Serial.print(" B: ");
  Serial.println(blueBrightness_2);
}