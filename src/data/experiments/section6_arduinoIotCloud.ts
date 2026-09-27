import { Experiment } from '../../types/experiment';

export const SECTION_6_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-28',
    expNo: 28,
    title: 'Smart Home using Arduino IoT Cloud',
    category: 'Section 6: Arduino IoT Cloud & Voice Assistant Integration',
    categoryShort: 'Arduino Cloud & Voice',
    settings: { cautionEnabled: true, cautionMessage: 'This experiment is not done yet. Please verify it by yourself. Once the experiment is completed and verified, the administrator can update this status.' },
    aim: 'To design and deploy a Smart Home automation system using NodeMCU ESP8266 connected to Arduino IoT Cloud with bidirectional cloud variables for appliance switching.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: 'Wi-Fi enabled 32-bit SoC', quantity: '1 No.' },
      { slNo: 2, name: 'Opto-isolated Relay Module', specs: '5V coil, 10A/250VAC contacts', quantity: '1 No.' },
      { slNo: 3, name: '5mm LED Indicator & Resistor', specs: 'Visual status indicator', quantity: '1 Set' },
      { slNo: 4, name: 'Arduino IoT Cloud Account & App', specs: 'Configured Thing, Dashboard, & mobile app', quantity: '1 Account' },
    ],
    procedure: `1. Connect the Relay Module signal pin to NodeMCU pin D1, and connect an indicator LED through a resistor to pin D2.
2. In Arduino IoT Cloud, create a new "Thing", select ESP8266 as a third-party device, and add a CloudSwitch variable ("lightSwitch").
3. Create a Dashboard on Arduino IoT Cloud and link a Switch widget to the "lightSwitch" variable.
4. In the generated sketch, configure your network Wi-Fi SSID, password, and Secret Device Key.
5. Upload the code to the NodeMCU development board using the Arduino Create Agent or Arduino IDE.
6. Open the Serial Monitor to observe network registration and secure MQTT connection to Arduino IoT Cloud.
7. Toggle the switch widget on the Arduino IoT Cloud web dashboard or smartphone app, and verify that the relay and status LED actuate in real time.`,
    images: [],
    code: `#include "thingProperties.h"

const int relayPin = D1;
const int ledPin = D2;

void setup() {
  Serial.begin(9600);
  pinMode(relayPin, OUTPUT);
  pinMode(ledPin, OUTPUT);

  // Defined in thingProperties.h
  initProperties();

  ArduinoCloud.begin(ArduinoIoTPreferredConnection);
  setDebugMessageLevel(2);
  ArduinoCloud.printDebugInfo();
}

void loop() {
  ArduinoCloud.update();
}

void onLightSwitchChange() {
  if (lightSwitch) {
    digitalWrite(relayPin, HIGH);
    digitalWrite(ledPin, HIGH);
    Serial.println("Light turned ON via Arduino IoT Cloud");
  } else {
    digitalWrite(relayPin, LOW);
    digitalWrite(ledPin, LOW);
    Serial.println("Light turned OFF via Arduino IoT Cloud");
  }
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp28_ArduinoCloud_SmartHome.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Smart home fixtures respond to cloud dashboard widget toggles with real-time feedback.',
    },
    conclusion: 'Bidirectional device synchronization and smart home control via Arduino IoT Cloud was verified.',
  },
  {
    id: 'exp-29',
    expNo: 29,
    title: 'Alexa Voice-Controlled Home Automation',
    category: 'Section 6: Arduino IoT Cloud & Voice Assistant Integration',
    categoryShort: 'Arduino Cloud & Voice',
    settings: { cautionEnabled: true, cautionMessage: 'This experiment is not done yet. Please verify it by yourself. Once the experiment is completed and verified, the administrator can update this status.' },
    aim: 'To integrate NodeMCU ESP8266 with Amazon Alexa voice assistant using fauxmoESP / Arduino IoT Cloud for voice-activated home automation appliance control.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: 'Wi-Fi 2.4GHz SoC', quantity: '1 No.' },
      { slNo: 2, name: '2-Channel Relay Module', specs: 'Opto-isolated 5V relays', quantity: '1 No.' },
      { slNo: 3, name: 'Amazon Echo / Alexa App', specs: 'Voice recognition speaker or smartphone app', quantity: '1 Unit' },
      { slNo: 4, name: 'Appliances / Lamps & DuPont Wires', specs: 'Electrical loads and connecting leads', quantity: '1 Set' },
    ],
    procedure: `1. Connect Relay 1 input to NodeMCU pin D1 and Relay 2 input to pin D2, powering the relay board from 5V/VIN and GND.
2. Connect external household loads (e.g. lamp, fan) to the relay output terminals following standard electrical safety precautions.
3. In Arduino IDE, ensure the fauxmoESP and ESPAsyncWebServer libraries are installed.
4. In the sketch, enter your Wi-Fi credentials ("YOUR_WIFI", "YOUR_PASSWORD") and assign device names ("living room light", "ceiling fan").
5. Upload the code to the NodeMCU and open the Serial Monitor at 115200 baud to confirm Wi-Fi connection.
6. Say to your Amazon Echo device or Alexa mobile app: "Alexa, discover devices". Confirm both smart devices are discovered.
7. Speak the voice commands: "Alexa, turn on living room light" and "Alexa, turn off living room light", and verify the physical relay clicking and actuating the connected load immediately.`,
    images: [],
    code: `#include <ESP8266WiFi.h>
#include "fauxmoESP.h"

#define WIFI_SSID "YOUR_WIFI"
#define WIFI_PASS "YOUR_PASSWORD"

#define RELAY_1 D1
#define RELAY_2 D2

fauxmoESP fauxmo;

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_1, OUTPUT);
  pinMode(RELAY_2, OUTPUT);
  digitalWrite(RELAY_1, HIGH); // Active LOW off
  digitalWrite(RELAY_2, HIGH);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected!");

  // Device names as recognized by Alexa
  fauxmo.createServer(true);
  fauxmo.setPort(80);
  fauxmo.enable(true);
  fauxmo.addDevice("living room light");
  fauxmo.addDevice("ceiling fan");

  fauxmo.onSetState([](unsigned char device_id, const char * device_name, bool state, unsigned char value) {
    Serial.printf("[ALEXA] Device #%d (%s) state: %s\\n", device_id, device_name, state ? "ON" : "OFF");
    if (strcmp(device_name, "living room light") == 0) {
      digitalWrite(RELAY_1, state ? LOW : HIGH);
    } else if (strcmp(device_name, "ceiling fan") == 0) {
      digitalWrite(RELAY_2, state ? LOW : HIGH);
    }
  });
}

void loop() {
  fauxmo.handle();
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp29_Alexa_Voice_HomeAutomation.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Alexa voice commands ("Alexa, turn on living room light") actuate relays with instant response.',
    },
    conclusion: 'Voice-activated smart home appliance switching via Amazon Alexa integration was successfully implemented.',
  },
];
