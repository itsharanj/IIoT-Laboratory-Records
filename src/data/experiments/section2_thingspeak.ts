import { Experiment } from '../../types/experiment';

export const SECTION_2_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-11',
    expNo: 11,
    title: 'LM35 Monitoring via ThingSpeak',
    category: 'Section 2: ThingSpeak Cloud IoT Experiments',
    categoryShort: 'ThingSpeak',
    aim: 'Design a temperature monitoring system using LM35 interfaced with NodeMCU and observe the output in the Serial Monitor as well as ThingSpeak.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266', specs: 'Wi-Fi enabled microcontroller board', quantity: '1 No.' },
      { slNo: 2, name: 'LM35 Sensor', specs: 'Analog temperature sensor module', quantity: '1 No.' },
      { slNo: 3, name: 'ThingSpeak Account', specs: 'IoT cloud platform & API Key', quantity: '1 Account' },
      { slNo: 4, name: 'Breadboard & Wires', specs: 'Standard connecting leads', quantity: '1 Set' },
    ],
    procedure: `A. Hardware and Normal Procedure:
1. Connect the LM35 VCC pin to the NodeMCU ESP8266 3.3V pin and GND to the ESP8266 GND pin.
2. Connect the LM35 analog OUT pin directly to the ESP8266 analog input pin A0.
3. Connect the NodeMCU to your computer via micro-USB and select the correct COM port in Arduino IDE.
4. Verify the analog voltage reading formula in the sketch to scale millivolts to Celsius.
5. Open the Serial Monitor at 115200 baud to observe local real-time temperature readings.

B. ThingSpeak Procedure:
1. Sign in to ThingSpeak and create or open your designated channel (Channel ID: YOUR_CHANNEL_ID).
2. Configure Field 1 as "Temperature (°C)".
3. Copy the Write API Key (YOUR_WRITE_API_KEY) from the API Keys tab.
4. In the sketch, enter your Wi-Fi credentials ("YOUR_WIFI_NAME", "YOUR_WIFI_PASSWORD"), channel number (YOUR_CHANNEL_ID), and write API key ("YOUR_WRITE_API_KEY").
5. Compile and upload the sketch to the NodeMCU ESP8266 board.
6. Open the Serial Monitor to verify that the board connects to Wi-Fi and begins transmitting data packets.
7. Allow the 20-second update interval between writes and inspect the live temperature telemetry chart in the ThingSpeak dashboard.`,
    images: [],
    connections: [
      'LM35 VCC → ESP8266 3.3V',
      'LM35 GND → ESP8266 GND',
      'LM35 OUT → ESP8266 A0',
      'ThingSpeak Field 1 = Temperature',
    ],
    code: `#include <ESP8266WiFi.h>
#include <ThingSpeak.h>

char ssid[] = "YOUR_WIFI_NAME";
char pass[] = "YOUR_WIFI_PASSWORD";

WiFiClient client;

unsigned long channel = YOUR_CHANNEL_ID;
const char* writeKey = "YOUR_WRITE_API_KEY";

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  ThingSpeak.begin(client);
}

void loop() {
  float temperature = analogRead(A0) * 0.32;

  Serial.print("Temperature: ");
  Serial.println(temperature);

  ThingSpeak.setField(1, temperature);
  ThingSpeak.writeFields(channel, writeKey);

  delay(20000);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp11_ThingSpeak_LM35.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Temperature readings are pushed to and viewed on the ThingSpeak channel.',
    },
    conclusion: 'Temperature readings from the LM35 sensor were successfully logged to ThingSpeak cloud.',
  },
  {
    id: 'exp-12',
    expNo: 12,
    title: 'DHT11 Monitoring via ThingSpeak',
    category: 'Section 2: ThingSpeak Cloud IoT Experiments',
    categoryShort: 'ThingSpeak',
    aim: 'To interface a DHT11 sensor with NodeMCU ESP8266 and upload real-time ambient temperature and humidity data to ThingSpeak cloud platform over Wi-Fi.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: 'Wi-Fi 802.11 b/g/n, 2.4GHz', quantity: '1 No.' },
      { slNo: 2, name: 'DHT11 Sensor Module', specs: 'Temperature & humidity sensor', quantity: '1 No.' },
      { slNo: 3, name: 'ThingSpeak Cloud Channel', specs: 'Channel ID and Write API Key', quantity: '1 Account' },
      { slNo: 4, name: 'Breadboard & DuPont Wires', specs: 'Jumper cables', quantity: '1 Set' },
    ],
    procedure: `A. Hardware and Normal Procedure:
1. For this read-only cloud telemetry retrieval experiment, no physical DHT11 hardware wiring is required.
2. Connect the NodeMCU ESP8266 development board to your PC using a micro-USB cable.
3. Configure the board as "NodeMCU 1.0 (ESP-12E Module)" and select the corresponding USB serial port in Arduino IDE.
4. Ensure the official ThingSpeak library is installed in your Arduino IDE environment.
5. Launch the Serial Monitor at 115200 baud to monitor Wi-Fi connectivity and telemetry stream status.

B. ThingSpeak Procedure:
1. Open your existing ThingSpeak channel (Channel ID: YOUR_CHANNEL_ID) containing recorded DHT11 environmental data.
2. Ensure Field 1 is designated for Temperature and Field 2 is designated for Humidity.
3. Navigate to the API Keys tab and copy your Read API Key (YOUR_READ_API_KEY).
4. Update the sketch placeholders with your network name ("YOUR_WIFI_NAME"), network password ("YOUR_WIFI_PASSWORD"), channel number (YOUR_CHANNEL_ID), and read key ("YOUR_READ_API_KEY").
5. Compile and upload the program to the ESP8266 microcontroller.
6. Observe the Serial Monitor as the microcontroller issues HTTP GET requests every 16 seconds.
7. Verify that HTTP status code 200 is returned and that fetched Temperature (°C) and Humidity (%) values match the latest readings logged on the ThingSpeak dashboard charts.`,
    images: ['/images/experiments/DHt11.jpeg'],
    connections: [
      'No DHT11 connection is required for this read-only code.',
      'ESP8266 connects to Wi-Fi and reads already saved DHT11 data from ThingSpeak.',
      'ThingSpeak Field 1 = Temperature',
      'ThingSpeak Field 2 = Humidity',
    ],
    code: `#include <ESP8266WiFi.h>
#include <DHT.h>
#include <ThingSpeak.h>

#define D1_PIN D1

const char* ssid = "YOUR_WIFI";
const char* pass = "YOUR_PASSWORD";

DHT dht(D1_PIN, DHT11);
WiFiClient client;

unsigned long channel = 2283807;
const char* key = "YOUR_API_KEY";

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED)
    delay(500);

  dht.begin();
  ThingSpeak.begin(client);
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();

  Serial.print("Temp: ");
  Serial.println(t);
  Serial.print("Humidity: ");
  Serial.println(h);

  ThingSpeak.writeField(channel, 1, t, key);
  ThingSpeak.writeField(channel, 2, h, key);

  delay(20000);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp12_ThingSpeak_DHT11.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Temperature and humidity readings are uploaded to and plotted on ThingSpeak fields 1 and 2.',
    },
    conclusion: 'Continuous environmental telemetry was successfully streamed to ThingSpeak cloud charts.',
  },
  {
    id: 'exp-13',
    expNo: 13,
    title: 'Ultrasonic Monitoring via ThingSpeak',
    category: 'Section 2: ThingSpeak Cloud IoT Experiments',
    categoryShort: 'ThingSpeak',
    aim: 'To interface the HC-SR04 ultrasonic sensor with NodeMCU ESP8266 to measure distance and reservoir liquid level and transmit telemetry to ThingSpeak cloud.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Dev Board', specs: 'Wi-Fi enabled SoC', quantity: '1 No.' },
      { slNo: 2, name: 'HC-SR04 Ultrasonic Sensor', specs: '40kHz non-contact range finder', quantity: '1 No.' },
      { slNo: 3, name: 'Voltage Divider Resistors', specs: '1kΩ and 2kΩ level shifter', quantity: '1 Pair' },
      { slNo: 4, name: 'ThingSpeak Cloud Channel', specs: 'Field 1 configured for Distance (cm)', quantity: '1 Channel' },
    ],
    procedure: `A. Hardware and Normal Procedure:
1. Connect HC-SR04 VCC to NodeMCU VIN (5V) and GND to ESP8266 GND.
2. Connect HC-SR04 TRIG pin to GPIO pin D1.
3. Connect HC-SR04 ECHO pin to GPIO pin D2 through a voltage divider (1kΩ and 2kΩ resistors) to safely step down the 5V echo pulse to 3.3V logic.
4. Connect NodeMCU to the PC via USB and choose the appropriate port in Arduino IDE.
5. Upload the code and verify the distance calculations in the Serial Monitor (115200 baud) by moving an object in front of the sensor.

B. ThingSpeak Procedure:
1. Log in to ThingSpeak and create or select your channel (Channel ID: YOUR_CHANNEL_ID).
2. Configure Field 1 with the label "Distance (cm)".
3. Obtain your channel's Write API Key (YOUR_WRITE_API_KEY).
4. Replace the placeholders in the sketch with your network credentials ("YOUR_WIFI_NAME", "YOUR_WIFI_PASSWORD"), YOUR_CHANNEL_ID, and "YOUR_WRITE_API_KEY".
5. Compile and upload the code to the ESP8266 board.
6. Open the Serial Monitor to verify that the board connects to Wi-Fi and dispatches periodic HTTP POST updates.
7. Wait for the 20-second update interval and observe the real-time distance gauge and timeline chart on the ThingSpeak web dashboard.`,
    images: ['/images/experiments/ULTRASONICSENSOR.jpg'],
    connections: [
      'HC-SR04 VCC → ESP8266 VIN/5V',
      'HC-SR04 GND → ESP8266 GND',
      'HC-SR04 TRIG → ESP8266 D1',
      'HC-SR04 ECHO → ESP8266 D2 through a voltage divider, because ESP8266 pins are 3.3V only',
      'ThingSpeak Field 1 = Distance in cm',
    ],
    code: `#include <ESP8266WiFi.h>
#include <ThingSpeak.h>

char ssid[] = "YOUR_WIFI_NAME";
char pass[] = "YOUR_WIFI_PASSWORD";

WiFiClient client;

unsigned long channel = YOUR_CHANNEL_ID;
const char* writeKey = "YOUR_WRITE_API_KEY";

#define TRIG_PIN D1
#define ECHO_PIN D2

void setup() {
  Serial.begin(115200);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  ThingSpeak.begin(client);
}

void loop() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  float distance = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  ThingSpeak.setField(1, distance);
  ThingSpeak.writeFields(channel, writeKey);

  delay(20000);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp13_ThingSpeak_Ultrasonic.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Distance and reservoir level data uploaded and tracked live on ThingSpeak.',
    },
    conclusion: 'Acoustic distance and level monitoring data was successfully logged to ThingSpeak cloud.',
  },
  {
    id: 'exp-14',
    expNo: 14,
    title: 'Soil Moisture Monitoring via ThingSpeak',
    category: 'Section 2: ThingSpeak Cloud IoT Experiments',
    categoryShort: 'ThingSpeak',
    aim: 'To interface an analog soil moisture sensor with NodeMCU ESP8266 and log irrigation moisture data to ThingSpeak cloud.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: '10-bit ADC A0 pin', quantity: '1 No.' },
      { slNo: 2, name: 'Soil Moisture Sensor Probe', specs: 'Resistive/capacitive probe with LM393', quantity: '1 No.' },
      { slNo: 3, name: 'ThingSpeak Cloud Channel', specs: 'Configured for Moisture (%)', quantity: '1 Channel' },
      { slNo: 4, name: 'Connecting Wires & Breadboard', specs: 'DuPont cables', quantity: '1 Set' },
    ],
    procedure: `A. Hardware and Normal Procedure:
1. Connect the Soil Moisture Sensor VCC to NodeMCU 3.3V and GND to NodeMCU GND.
2. Connect the analog output pin (A0) of the soil moisture sensor to the ESP8266 analog input pin A0.
3. Insert the sensor probes into soil (or test dry air and water for calibration points).
4. Connect the board to your PC via micro-USB and select the board port in Arduino IDE.
5. Verify the map() formula in the code and inspect real-time moisture percentage readings on the Serial Monitor at 115200 baud.

B. ThingSpeak Procedure:
1. Access your ThingSpeak account and open or create the soil monitoring channel (Channel ID: YOUR_CHANNEL_ID).
2. Configure Field 1 as "Soil Moisture (%)".
3. Retrieve your Write API Key (YOUR_WRITE_API_KEY) from the channel settings.
4. Insert your network credentials ("YOUR_WIFI_NAME", "YOUR_WIFI_PASSWORD"), channel number (YOUR_CHANNEL_ID), and write API key ("YOUR_WRITE_API_KEY") into the sketch.
5. Compile and flash the program to the NodeMCU board.
6. Open the Serial Monitor to verify successful Wi-Fi connection and telemetry payload transmission.
7. Observe the periodic 20-second updates and confirm moisture trend fluctuations plotted live on your ThingSpeak dashboard chart.`,
    images: [],
    connections: [
      'Soil Moisture Sensor VCC → ESP8266 3.3V',
      'Soil Moisture Sensor GND → ESP8266 GND',
      'Soil Moisture Sensor A0 → ESP8266 A0',
      'ThingSpeak Field 1 = Soil Moisture %',
    ],
    code: `#include <ESP8266WiFi.h>
#include <ThingSpeak.h>

char ssid[] = "YOUR_WIFI_NAME";
char pass[] = "YOUR_WIFI_PASSWORD";

WiFiClient client;

unsigned long channel = YOUR_CHANNEL_ID;
const char* writeKey = "YOUR_WRITE_API_KEY";

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  ThingSpeak.begin(client);
}

void loop() {
  int rawValue = analogRead(A0);

  int moisture = map(rawValue, 850, 350, 0, 100);
  moisture = constrain(moisture, 0, 100);

  Serial.print("Soil Moisture: ");
  Serial.print(moisture);
  Serial.println("%");

  ThingSpeak.setField(1, moisture);
  ThingSpeak.writeFields(channel, writeKey);

  delay(20000);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp14_ThingSpeak_SoilMoisture.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Soil moisture percentage telemetry plotted on ThingSpeak cloud channel.',
    },
    conclusion: 'Automated soil moisture tracking via ThingSpeak IoT cloud platform was successfully established.',
  },
  {
    id: 'exp-15',
    expNo: 15,
    title: 'Colour Sorting via ThingSpeak',
    category: 'Section 2: ThingSpeak Cloud IoT Experiments',
    categoryShort: 'ThingSpeak',
    settings: { cautionEnabled: true, cautionMessage: 'This experiment is not done yet. Please verify it by yourself. Once the experiment is completed and verified, the administrator can update this status.' },
    aim: 'To interface a TCS3200 colour sensor with NodeMCU ESP8266, detect Red, Green, and Blue color frequencies, and record color sorting telemetry to ThingSpeak cloud.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: 'GPIO pins D1-D5', quantity: '1 No.' },
      { slNo: 2, name: 'TCS3200 Colour Sensor Module', specs: 'Photodiode array with RGB filters', quantity: '1 No.' },
      { slNo: 3, name: 'ThingSpeak Cloud Channel', specs: '3 Fields for R, G, B color values', quantity: '1 Channel' },
      { slNo: 4, name: 'Breadboard & Jumper Wires', specs: 'Connecting leads', quantity: '1 Set' },
    ],
    procedure: `A. Hardware and Normal Procedure:
1. Connect TCS3200 VCC to NodeMCU 3.3V/5V and GND to ESP8266 GND.
2. Connect control pins: S0 to D1, S1 to D2, S2 to D3, S3 to D4, and sensor output OUT to D5.
3. Mount the sensor above the target sample at a fixed distance (approx. 2-3 cm).
4. Connect NodeMCU to your computer via USB and select the board and COM port in Arduino IDE.
5. Upload the code and verify the frequency pulse readings for Red, Green, and Blue filters in the Serial Monitor at 115200 baud.

B. ThingSpeak Procedure:
1. Create or select a ThingSpeak channel (Channel ID: YOUR_CHANNEL_ID) configured for multi-field spectral telemetry.
2. Set up Field 1 as "Red Frequency", Field 2 as "Green Frequency", and Field 3 as "Blue Frequency".
3. Copy the Write API Key (YOUR_WRITE_API_KEY) from the API Keys tab.
4. Configure the sketch placeholders with "YOUR_WIFI_NAME", "YOUR_WIFI_PASSWORD", YOUR_CHANNEL_ID, and "YOUR_WRITE_API_KEY".
5. Upload the sketch to the NodeMCU board.
6. Open the Serial Monitor to confirm Wi-Fi association and HTTP payload transmissions.
7. Wait for the 20-second update cycle and verify live color component plots rendered simultaneously on the ThingSpeak dashboard.`,
    images: [],
    connections: [
      'TCS3200 VCC → ESP8266 3.3V/5V',
      'TCS3200 GND → ESP8266 GND',
      'TCS3200 S0 → ESP8266 D1',
      'TCS3200 S1 → ESP8266 D2',
      'TCS3200 S2 → ESP8266 D3',
      'TCS3200 S3 → ESP8266 D4',
      'TCS3200 OUT → ESP8266 D5',
      'ThingSpeak Field 1 = Red Frequency',
      'ThingSpeak Field 2 = Green Frequency',
      'ThingSpeak Field 3 = Blue Frequency',
    ],
    code: `#include <ESP8266WiFi.h>
#include <ThingSpeak.h>

#define S0 D1
#define S1 D2
#define S2 D3
#define S3 D4
#define sensorOut D5

char ssid[] = "YOUR_WIFI";
char pass[] = "YOUR_PASSWORD";

WiFiClient client;
long myChannelNumber = 1234567;
const char myWriteAPIKey[] = "YOUR_WRITE_API_KEY";

int redFrequency = 0;
int greenFrequency = 0;
int blueFrequency = 0;

void setup() {
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(sensorOut, INPUT);

  // Set frequency scaling to 20%
  digitalWrite(S0, HIGH);
  digitalWrite(S1, LOW);

  Serial.begin(115200);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  ThingSpeak.begin(client);
}

void loop() {
  // Red filter
  digitalWrite(S2, LOW);
  digitalWrite(S3, LOW);
  redFrequency = pulseIn(sensorOut, LOW);

  // Green filter
  digitalWrite(S2, HIGH);
  digitalWrite(S3, HIGH);
  greenFrequency = pulseIn(sensorOut, LOW);

  // Blue filter
  digitalWrite(S2, LOW);
  digitalWrite(S3, HIGH);
  blueFrequency = pulseIn(sensorOut, LOW);

  Serial.printf("R: %d, G: %d, B: %d\\n", redFrequency, greenFrequency, blueFrequency);

  ThingSpeak.setField(1, redFrequency);
  ThingSpeak.setField(2, greenFrequency);
  ThingSpeak.setField(3, blueFrequency);
  ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);

  delay(20000);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp15_ThingSpeak_ColourSorting.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'RGB frequency metrics for object color sorting transmitted and visualized on ThingSpeak.',
    },
    conclusion: 'Color frequency analysis and cloud-based logging for industrial sorting was verified on ThingSpeak.',
  },
  {
    id: 'exp-16',
    expNo: 16,
    title: 'ThingSpeak Weather Station',
    category: 'Section 2: ThingSpeak Cloud IoT Experiments',
    categoryShort: 'ThingSpeak',
    settings: { cautionEnabled: true, cautionMessage: 'This experiment is not done yet. Please verify it by yourself. Once the experiment is completed and verified, the administrator can update this status.' },
    aim: 'To design a multi-sensor IoT weather station with NodeMCU ESP8266 combining temperature, humidity, and light intensity telemetry on ThingSpeak.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: 'Wi-Fi 2.4GHz SoC', quantity: '1 No.' },
      { slNo: 2, name: 'DHT11 Sensor', specs: 'Temperature & humidity sensor', quantity: '1 No.' },
      { slNo: 3, name: 'LDR Photoresistor & 10kΩ Resistor', specs: 'Light intensity sensor', quantity: '1 Set' },
      { slNo: 4, name: 'ThingSpeak Cloud Channel', specs: 'Multi-field telemetry dashboard', quantity: '1 Channel' },
    ],
    procedure: `A. Hardware and Normal Procedure:
1. Connect DHT11 VCC to NodeMCU 3.3V, GND to GND, and DATA pin to GPIO pin D4.
2. Connect LDR in series with a 10kΩ resistor across 3.3V and GND, and connect the junction to analog pin A0.
3. Connect NodeMCU to your workstation using a USB data cable and select the COM port in Arduino IDE.
4. Ensure DHT sensor and ThingSpeak libraries are installed in Arduino IDE.
5. Verify sensor readings on the Serial Monitor at 115200 baud to confirm proper environmental data acquisition.

B. ThingSpeak Procedure:
1. Log in to ThingSpeak and create or select your Weather Station channel (Channel ID: YOUR_CHANNEL_ID).
2. Configure Field 1 as "Temperature (°C)", Field 2 as "Humidity (%)", and Field 3 as "Light Intensity (ADC)".
3. Retrieve your Write API Key (YOUR_WRITE_API_KEY) from the channel settings.
4. Input your Wi-Fi credentials ("YOUR_WIFI_NAME", "YOUR_WIFI_PASSWORD"), channel ID (YOUR_CHANNEL_ID), and API key ("YOUR_WRITE_API_KEY") into the code.
5. Compile and upload the program to the NodeMCU ESP8266.
6. Open the Serial Monitor to observe successful Wi-Fi connection and multi-field data dispatches.
7. Allow the 20-second telemetry interval and review real-time weather trend graphs on your ThingSpeak cloud dashboard.`,
    images: [],
    connections: [
      'DHT11 VCC → ESP8266 3.3V',
      'DHT11 GND → ESP8266 GND',
      'DHT11 DATA → ESP8266 D4',
      'LDR + 10kΩ Divider Midpoint → ESP8266 A0',
      'ThingSpeak Field 1 = Temperature (°C)',
      'ThingSpeak Field 2 = Humidity (%)',
      'ThingSpeak Field 3 = Light Intensity (ADC)',
    ],
    code: `#include <ESP8266WiFi.h>
#include <ThingSpeak.h>
#include <DHT.h>

#define DHTPIN D4
#define DHTTYPE DHT11
const int LDR_PIN = A0;

DHT dht(DHTPIN, DHTTYPE);

char ssid[] = "YOUR_WIFI";
char pass[] = "YOUR_PASSWORD";

WiFiClient client;
long myChannelNumber = 1234567;
const char myWriteAPIKey[] = "YOUR_WRITE_API_KEY";

void setup() {
  Serial.begin(115200);
  dht.begin();
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  ThingSpeak.begin(client);
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  int light = analogRead(LDR_PIN);

  Serial.printf("Weather -> Temp: %.1f C, Hum: %.1f %%, Light: %d\\n", temp, hum, light);

  ThingSpeak.setField(1, temp);
  ThingSpeak.setField(2, hum);
  ThingSpeak.setField(3, light);
  ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);

  delay(20000);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp16_ThingSpeak_WeatherStation.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Multi-channel weather parameters streamed to ThingSpeak weather station dashboard.',
    },
    conclusion: 'A complete multi-parameter weather monitoring station was successfully deployed on ThingSpeak cloud.',
  },
];
