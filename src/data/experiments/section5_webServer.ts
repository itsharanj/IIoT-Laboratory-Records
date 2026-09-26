import { Experiment } from '../../types/experiment';

export const SECTION_5_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-25',
    expNo: 25,
    title: 'Ultrasonic Water Level Web Server',
    category: 'Section 5: Web Server Based IoT Projects',
    categoryShort: 'Web Server',
    aim: 'To develop an embedded HTTP web server on NodeMCU ESP8266 that measures liquid level using an HC-SR04 ultrasonic sensor and displays live graphical tank levels on a web browser without internet access.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Dev Board', specs: 'Wi-Fi SoftAP capable SoC', quantity: '1 No.' },
      { slNo: 2, name: 'HC-SR04 Ultrasonic Sensor', specs: '40kHz non-contact distance sensor', quantity: '1 No.' },
      { slNo: 3, name: 'Voltage Divider Resistors', specs: '1kΩ & 2kΩ level shifter resistors', quantity: '1 Pair' },
      { slNo: 4, name: 'Water Tank / Reservoir Model', specs: 'Graduated liquid container', quantity: '1 Unit' },
      { slNo: 5, name: 'Smartphone / Laptop', specs: 'Web browser client', quantity: '1 Unit' },
    ],
    procedure: `1. Connect HC-SR04 VCC to NodeMCU VIN (5V) and GND to NodeMCU GND.
2. Connect HC-SR04 TRIG to NodeMCU pin D7 and ECHO to pin D8 via a voltage divider (1kΩ/2kΩ resistors).
3. Mount the ultrasonic sensor at the top rim of the water tank container pointing downward.
4. Upload the code to NodeMCU using Arduino IDE; the ESP8266 will broadcast an Access Point ("Tank_Level_AP").
5. Connect your smartphone or PC Wi-Fi to "Tank_Level_AP" (Password: password123).
6. Open any web browser and navigate to the default gateway IP: 192.168.4.1.
7. Observe the web page displaying an animated visual liquid gauge and percentage calculation that automatically refreshes every 2 seconds.`,
    images: [],
    code: `#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* ssid = "Tank_Level_AP";
const char* password = "password123";

ESP8266WebServer server(80);

const int trigPin = D7;
const int echoPin = D8;
const int tankHeight = 50; // Total tank depth in cm

int getDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH);
  return duration * 0.034 / 2;
}

void handleRoot() {
  int distance = getDistance();
  int waterLevel = tankHeight - distance;
  if (waterLevel < 0) waterLevel = 0;
  int percentage = (waterLevel * 100) / tankHeight;
  if (percentage > 100) percentage = 100;

  String html = "<!DOCTYPE html><html><head><meta http-equiv='refresh' content='2'>";
  html += "<title>Water Level Web Server</title>";
  html += "<style>body{font-family:sans-serif;text-align:center;padding:40px;background:#121212;color:#fff;}";
  html += ".tank{width:120px;height:240px;border:3px solid #38bdf8;margin:20px auto;position:relative;border-radius:12px;overflow:hidden;background:#1e293b;}";
  html += ".water{background:#0284c7;width:100%;position:absolute;bottom:0;height:" + String(percentage) + "%;transition:height 0.5s ease;}";
  html += "</style></head><body><h1>Water Level Monitor</h1>";
  html += "<div class='tank'><div class='water'></div></div>";
  html += "<h2>" + String(percentage) + "% Full (" + String(waterLevel) + " cm)</h2>";
  html += "</body></html>";

  server.send(200, "text/html", html);
}

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);

  server.on("/", handleRoot);
  server.begin();
}

void loop() {
  server.handleClient();
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp25_Ultrasonic_WaterLevel_WebServer.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Liquid depth and animated percentage gauge rendered directly on embedded HTTP web page.',
    },
    conclusion: 'A standalone web server for real-time tank level monitoring was successfully deployed on the NodeMCU.',
  },
  {
    id: 'exp-26',
    expNo: 26,
    title: 'LED Control via Web Page',
    category: 'Section 5: Web Server Based IoT Projects',
    categoryShort: 'Web Server',
    aim: 'To build an embedded HTTP web server on NodeMCU ESP8266 allowing users to toggle external LEDs ON and OFF from any web browser on the local Wi-Fi network.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: 'Wi-Fi Station Mode capable', quantity: '1 No.' },
      { slNo: 2, name: '5mm LED & 220Ω Resistor', specs: 'Indicator diode and current limiter', quantity: '1 Set' },
      { slNo: 3, name: 'Breadboard & Jumper Wires', specs: 'Prototyping components', quantity: '1 Set' },
      { slNo: 4, name: 'PC / Mobile Browser', specs: 'Standard web client', quantity: '1 Unit' },
    ],
    procedure: `1. Connect an external LED anode to NodeMCU pin D1 through a 220Ω resistor and the cathode to GND.
2. In the sketch, configure your local Wi-Fi SSID ("YOUR_WIFI") and password ("YOUR_PASSWORD").
3. Connect the NodeMCU to your computer and upload the code using Arduino IDE.
4. Open the Serial Monitor at 115200 baud to observe the assigned local IP address (e.g. 192.168.1.50).
5. Ensure your phone or laptop is connected to the same Wi-Fi network and enter the NodeMCU IP address into the browser URL bar.
6. Click the "Turn ON" and "Turn OFF" hyperlink buttons on the served web page to remotely toggle the physical LED state.`,
    images: [],
    code: `#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";

ESP8266WebServer server(80);
const int ledPin = D1;
bool ledState = false;

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><title>ESP8266 LED Control</title>";
  html += "<style>body{font-family:sans-serif;text-align:center;padding:50px;background:#0f172a;color:#fff;}";
  html += "a{display:inline-block;padding:15px 30px;color:#fff;text-decoration:none;border-radius:10px;font-size:20px;margin:10px;}";
  html += ".on{background:#22c55e;} .off{background:#ef4444;}";
  html += "</style></head><body><h1>NodeMCU LED Control</h1>";
  html += "<p>Current LED Status: <b>" + String(ledState ? "ON" : "OFF") + "</b></p>";
  html += "<a class='on' href='/on'>Turn ON</a>";
  html += "<a class='off' href='/off'>Turn OFF</a>";
  html += "</body></html>";
  server.send(200, "text/html", html);
}

void handleOn() {
  ledState = true;
  digitalWrite(ledPin, HIGH);
  server.sendHeader("Location", "/");
  server.send(303);
}

void handleOff() {
  ledState = false;
  digitalWrite(ledPin, LOW);
  server.sendHeader("Location", "/");
  server.send(303);
}

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nIP address: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.on("/on", handleOn);
  server.on("/off", handleOff);
  server.begin();
}

void loop() {
  server.handleClient();
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp26_WebServer_LED_Control.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'LED turns ON/OFF instantly when clicking the buttons on the NodeMCU web server page.',
    },
    conclusion: 'Local area HTTP server appliance control was successfully implemented on NodeMCU ESP8266.',
  },
  {
    id: 'exp-27',
    expNo: 27,
    title: 'Touchless Attendance System',
    category: 'Section 5: Web Server Based IoT Projects',
    categoryShort: 'Web Server',
    aim: 'To design a Touchless Attendance System using NodeMCU ESP8266, RFID reader, and an embedded web server logging check-in records in real time.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: 'Wi-Fi 2.4GHz microcontroller', quantity: '1 No.' },
      { slNo: 2, name: 'MFRC522 RFID Reader Module', specs: '13.56 MHz contactless reader', quantity: '1 No.' },
      { slNo: 3, name: 'RFID Cards / Key Fobs', specs: 'Mifare Classic 1K tags', quantity: '2 Nos.' },
      { slNo: 4, name: 'Breadboard & SPI Wires', specs: 'DuPont jumper cables', quantity: '1 Set' },
    ],
    procedure: `1. Connect the RC522 RFID reader to the NodeMCU via SPI: SS/SDA to D4, SCK to D5, MOSI to D7, MISO to D6, RST to D3, 3.3V to 3.3V, and GND to GND.
2. In the sketch, enter your Wi-Fi credentials ("YOUR_WIFI", "YOUR_PASSWORD") and upload the program using Arduino IDE.
3. Open the Serial Monitor at 115200 baud to check RFID initialization and note the assigned local IP address.
4. Open a web browser on any device on the network and navigate to the NodeMCU IP address.
5. Tap an RFID card or key fob against the RC522 reader.
6. Verify that the card UID is captured in the Serial Monitor and the web page updates dynamically with the new attendee count and last detected UID.`,
    images: [],
    code: `#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN D4
#define RST_PIN D3

MFRC522 rfid(SS_PIN, RST_PIN);
ESP8266WebServer server(80);

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";

String lastUid = "None";
int attendanceCount = 0;

void handleRoot() {
  String html = "<!DOCTYPE html><html><head><meta http-equiv='refresh' content='3'>";
  html += "<title>Touchless Attendance</title>";
  html += "<style>body{font-family:sans-serif;text-align:center;padding:40px;background:#18181b;color:#f4f4f5;}";
  html += ".card{background:#27272a;padding:24px;border-radius:16px;max-width:400px;margin:20px auto;border:1px solid #3f3f46;}";
  html += "h1{color:#38bdf8;} .val{font-size:24px;font-weight:bold;color:#4ade80;}";
  html += "</style></head><body><h1>Touchless Attendance System</h1>";
  html += "<div class='card'>";
  html += "<p>Total Attendees Logged: <span class='val'>" + String(attendanceCount) + "</span></p>";
  html += "<p>Last Detected UID: <span class='val'>" + lastUid + "</span></p>";
  html += "</div></body></html>";
  server.send(200, "text/html", html);
}

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nIP: ");
  Serial.println(WiFi.localIP());

  server.on("/", handleRoot);
  server.begin();
}

void loop() {
  server.handleClient();

  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
    lastUid = "";
    for (byte i = 0; i < rfid.uid.size; i++) {
      lastUid += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
      lastUid += String(rfid.uid.uidByte[i], HEX);
    }
    lastUid.toUpperCase();
    attendanceCount++;
    Serial.println("Card Detected: " + lastUid);
    rfid.PICC_HaltA();
    delay(1000);
  }
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp27_Touchless_Attendance_WebServer.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'RFID tag scan registers attendee and increments attendance log on embedded web server.',
    },
    conclusion: 'Touchless smart attendance logging via RFID and embedded web server was successfully established.',
  },
];
