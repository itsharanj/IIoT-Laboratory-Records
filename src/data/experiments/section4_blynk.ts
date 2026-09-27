import { Experiment } from '../../types/experiment';

export const SECTION_4_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-21',
    expNo: 21,
    title: 'LED Control using Blynk',
    category: 'Section 4: Blynk IoT Experiments',
    categoryShort: 'Blynk',
    settings: { cautionEnabled: true, cautionMessage: 'This experiment is not done yet. Please verify it by yourself. Once the experiment is completed and verified, the administrator can update this status.' },
    aim: 'To interface an LED with NodeMCU ESP8266 and control its state remotely from a smartphone using the Blynk IoT cloud platform and mobile application dashboard.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Dev Board', specs: 'Wi-Fi 802.11 b/g/n, Tensilica Xtensa', quantity: '1 No.' },
      { slNo: 2, name: '5mm LED & 220Ω Resistor', specs: 'Indicator diode and current limiter', quantity: '1 Set' },
      { slNo: 3, name: 'Blynk IoT Mobile Application', specs: 'Blynk app with configured Button widget on V0', quantity: '1 App' },
      { slNo: 4, name: 'Breadboard & DuPont Wires', specs: 'Connecting leads', quantity: '1 Set' },
      { slNo: 5, name: 'Wi-Fi Hotspot & USB Cable', specs: 'Internet connectivity', quantity: '1 Set' },
    ],
    procedure: `1. Connect the LED anode to NodeMCU pin D1 via a 220Ω resistor, and connect the cathode to GND.
2. Open the Blynk console/app, create a new template ("LED Control"), and add a Button widget assigned to Virtual Pin V0.
3. In the sketch, configure the template ID, template name, auth token ("YourAuthToken"), and your Wi-Fi credentials ("YOUR_WIFI", "YOUR_PASSWORD").
4. Connect the NodeMCU to your computer via micro-USB and upload the code using Arduino IDE.
5. Open the Serial Monitor at 115200 baud to confirm successful Wi-Fi connection and authentication with the Blynk cloud server.
6. Toggle the button widget in the Blynk smartphone app and observe the LED turning ON and OFF instantaneously.`,
    images: [],
    code: `#define BLYNK_TEMPLATE_ID "TMPLxxxxxx"
#define BLYNK_TEMPLATE_NAME "LED Control"
#define BLYNK_AUTH_TOKEN "YourAuthToken"

#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>

char auth[] = BLYNK_AUTH_TOKEN;
char ssid[] = "YOUR_WIFI";
char pass[] = "YOUR_PASSWORD";

const int ledPin = D1;

BLYNK_WRITE(V0) {
  int value = param.asInt();
  digitalWrite(ledPin, value ? HIGH : LOW);
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  Blynk.begin(auth, ssid, pass);
}

void loop() {
  Blynk.run();
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp21_Blynk_LED_Control.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'LED turns ON and OFF in response to the button widget toggled on the Blynk mobile application.',
    },
    conclusion: 'Remote wireless control of an LED from the Blynk IoT mobile application was successfully implemented and verified.',
  },
  {
    id: 'exp-22',
    expNo: 22,
    title: 'LDR Monitoring using Blynk',
    category: 'Section 4: Blynk IoT Experiments',
    categoryShort: 'Blynk',
    settings: { cautionEnabled: true, cautionMessage: 'This experiment is not done yet. Please verify it by yourself. Once the experiment is completed and verified, the administrator can update this status.' },
    aim: 'To monitor ambient light levels using an LDR sensor and display live intensity values on a Blynk mobile gauge widget.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: 'Analog pin A0 (10-bit ADC)', quantity: '1 No.' },
      { slNo: 2, name: 'LDR Photoresistor & 10kΩ Resistor', specs: 'Voltage divider assembly', quantity: '1 Set' },
      { slNo: 3, name: 'Blynk IoT App', specs: 'Configured Gauge widget on Virtual Pin V1', quantity: '1 App' },
      { slNo: 4, name: 'Breadboard & Wires', specs: 'DuPont cables', quantity: '1 Set' },
    ],
    procedure: `1. Wire the LDR and a 10kΩ resistor as a voltage divider, connecting the output junction to NodeMCU analog pin A0.
2. In the Blynk app, add a Gauge widget and link it to Virtual Pin V1 with a display range from 0 to 1024.
3. In Arduino IDE, enter your Blynk authentication credentials and local Wi-Fi network parameters into the sketch.
4. Upload the code to the NodeMCU development board and open the Serial Monitor at 115200 baud.
5. Verify the device registers online with Blynk and begins sending periodic sensor telemetry every 2 seconds.
6. Vary ambient light over the LDR and verify the real-time gauge needle responding smoothly on the Blynk mobile dashboard.`,
    images: [],
    code: `#define BLYNK_TEMPLATE_ID "TMPLxxxxxx"
#define BLYNK_TEMPLATE_NAME "LDR Monitor"
#define BLYNK_AUTH_TOKEN "YourAuthToken"

#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>

char auth[] = BLYNK_AUTH_TOKEN;
char ssid[] = "YOUR_WIFI";
char pass[] = "YOUR_PASSWORD";

const int ldrPin = A0;
BlynkTimer timer;

void sendSensor() {
  int ldrVal = analogRead(ldrPin);
  Blynk.virtualWrite(V1, ldrVal);
  Serial.print("LDR Value: ");
  Serial.println(ldrVal);
}

void setup() {
  Serial.begin(115200);
  Blynk.begin(auth, ssid, pass);
  timer.setInterval(2000L, sendSensor);
}

void loop() {
  Blynk.run();
  timer.run();
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp22_Blynk_LDR_Monitor.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Real-time light intensity values are streamed to the Blynk mobile gauge widget.',
    },
    conclusion: 'Continuous ambient illumination telemetry was successfully transmitted and visualized on the Blynk app.',
  },
  {
    id: 'exp-23',
    expNo: 23,
    title: 'Smart Irrigation using Blynk',
    category: 'Section 4: Blynk IoT Experiments',
    categoryShort: 'Blynk',
    settings: { cautionEnabled: true, cautionMessage: 'This experiment is not done yet. Please verify it by yourself. Once the experiment is completed and verified, the administrator can update this status.' },
    aim: 'To design a Smart Irrigation system using NodeMCU ESP8266, Soil Moisture sensor, and relay-controlled water pump with automated and manual override in Blynk.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: 'Wi-Fi enabled SoC', quantity: '1 No.' },
      { slNo: 2, name: 'Soil Moisture Sensor Probe', specs: 'Conductometric analog probe', quantity: '1 No.' },
      { slNo: 3, name: '5V Relay Module & 5V Mini Submersible Pump', specs: 'Relay switch and water pump load', quantity: '1 Set' },
      { slNo: 4, name: 'Blynk IoT App', specs: 'Moisture gauge (V1) & Pump switch (V2)', quantity: '1 App' },
    ],
    procedure: `1. Connect the Soil Moisture Sensor VCC/GND to NodeMCU 3.3V/GND, and the analog output to pin A0.
2. Connect the relay module input pin to NodeMCU pin D1 and wire the mini submersible pump through the relay's normally open contacts.
3. In the Blynk app, configure a Gauge widget on V1 (Moisture %) and Button widgets on V2 (Pump Manual Switch) and V3 (Auto/Manual Mode).
4. Enter your Blynk template credentials and network Wi-Fi settings into the sketch, then upload it via Arduino IDE.
5. Open the Serial Monitor to verify network association and timer execution.
6. Place the sensor in dry soil (<30%) and verify that the relay turns ON automatically, and turns OFF when moisture exceeds 60%. Toggle to Manual mode to test remote app actuation.`,
    images: [],
    code: `#define BLYNK_TEMPLATE_ID "TMPLxxxxxx"
#define BLYNK_TEMPLATE_NAME "Smart Irrigation"
#define BLYNK_AUTH_TOKEN "YourAuthToken"

#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>

char auth[] = BLYNK_AUTH_TOKEN;
char ssid[] = "YOUR_WIFI";
char pass[] = "YOUR_PASSWORD";

const int moisturePin = A0;
const int pumpRelayPin = D1;
BlynkTimer timer;
bool manualOverride = false;

BLYNK_WRITE(V2) { // Manual pump switch
  int pumpState = param.asInt();
  if (manualOverride) {
    digitalWrite(pumpRelayPin, pumpState ? LOW : HIGH); // Active LOW relay
  }
}

BLYNK_WRITE(V3) { // Mode toggle (Auto / Manual)
  manualOverride = (param.asInt() == 1);
}

void checkMoisture() {
  int sensorVal = analogRead(moisturePin);
  int moisturePct = map(sensorVal, 1023, 300, 0, 100);
  moisturePct = constrain(moisturePct, 0, 100);

  Blynk.virtualWrite(V1, moisturePct);

  if (!manualOverride) {
    if (moisturePct < 30) {
      digitalWrite(pumpRelayPin, LOW); // Turn pump ON
      Blynk.virtualWrite(V2, 1);
    } else if (moisturePct > 60) {
      digitalWrite(pumpRelayPin, HIGH); // Turn pump OFF
      Blynk.virtualWrite(V2, 0);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(pumpRelayPin, OUTPUT);
  digitalWrite(pumpRelayPin, HIGH); // Initially OFF
  Blynk.begin(auth, ssid, pass);
  timer.setInterval(2000L, checkMoisture);
}

void loop() {
  Blynk.run();
  timer.run();
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp23_Blynk_Smart_Irrigation.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Water pump activates automatically when moisture drops below threshold, with manual control on Blynk.',
    },
    conclusion: 'Closed-loop precision irrigation with cloud mobile monitoring was successfully implemented on Blynk.',
  },
  {
    id: 'exp-24',
    expNo: 24,
    title: 'Smart Car Parking using Blynk',
    category: 'Section 4: Blynk IoT Experiments',
    categoryShort: 'Blynk',
    settings: { cautionEnabled: true, cautionMessage: 'This experiment is not done yet. Please verify it by yourself. Once the experiment is completed and verified, the administrator can update this status.' },
    aim: 'To implement an IoT Smart Car Parking system using NodeMCU ESP8266, IR slot sensors, and a servo gate controlled and monitored via Blynk.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: 'Wi-Fi 2.4GHz SoC', quantity: '1 No.' },
      { slNo: 2, name: 'IR Proximity Sensor Modules', specs: 'Entry and exit obstacle sensors', quantity: '2 Nos.' },
      { slNo: 3, name: 'SG90 Micro Servo Motor', specs: '180° rotation barrier gate', quantity: '1 No.' },
      { slNo: 4, name: 'Blynk IoT App', specs: 'Live parking slot count widget on V1', quantity: '1 App' },
    ],
    procedure: `1. Connect the Entry IR sensor output to NodeMCU pin D1, Exit IR sensor to pin D2, and SG90 servo signal wire to pin D3.
2. Power both IR sensors and the servo from 5V/VIN and GND rails.
3. In the Blynk app, add a Value Display or Gauge widget assigned to Virtual Pin V1 to show available parking slot counts.
4. Enter your Blynk Auth Token and Wi-Fi credentials into the code, and upload it using Arduino IDE.
5. Open the Serial Monitor at 115200 baud to confirm device initialization and gate calibration to 0 degrees.
6. Trigger the Entry IR sensor: verify the servo arm opens 90 degrees for 3 seconds, closes, and available slots decrement on the Blynk app. Repeat for Exit to verify incrementing count.`,
    images: [],
    code: `#define BLYNK_TEMPLATE_ID "TMPLxxxxxx"
#define BLYNK_TEMPLATE_NAME "Smart Parking"
#define BLYNK_AUTH_TOKEN "YourAuthToken"

#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
#include <Servo.h>

char auth[] = BLYNK_AUTH_TOKEN;
char ssid[] = "YOUR_WIFI";
char pass[] = "YOUR_PASSWORD";

const int irEntry = D1;
const int irExit = D2;
const int servoPin = D3;

Servo gateServo;
int totalSlots = 4;
int availableSlots = 4;

void setup() {
  Serial.begin(115200);
  pinMode(irEntry, INPUT);
  pinMode(irExit, INPUT);
  gateServo.attach(servoPin);
  gateServo.write(0); // Gate closed

  Blynk.begin(auth, ssid, pass);
  Blynk.virtualWrite(V1, availableSlots);
}

void loop() {
  Blynk.run();

  if (digitalRead(irEntry) == LOW && availableSlots > 0) {
    gateServo.write(90); // Open barrier gate
    delay(3000);
    gateServo.write(0);
    availableSlots--;
    Blynk.virtualWrite(V1, availableSlots);
  }

  if (digitalRead(irExit) == LOW && availableSlots < totalSlots) {
    gateServo.write(90); // Open barrier gate
    delay(3000);
    gateServo.write(0);
    availableSlots++;
    Blynk.virtualWrite(V1, availableSlots);
  }
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp24_Blynk_Smart_Parking.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Available parking slots decrement on car entry and update live on the Blynk dashboard.',
    },
    conclusion: 'Smart parking occupancy tracking and automated barrier gate actuation was verified via Blynk.',
  },
];
