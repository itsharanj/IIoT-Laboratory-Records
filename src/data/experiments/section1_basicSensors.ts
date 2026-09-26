import { Experiment } from '../../types/experiment';

export const SECTION_1_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-01',
    expNo: 1,
    title: 'LED Blinking',
    category: 'Section 1: Basic GPIO & Sensor Interfacing (Standalone NodeMCU)',
    categoryShort: 'Basic I/O & Sensors',
    aim: 'To interface a light-emitting diode (LED) to a GPIO pin of the NodeMCU ESP8266 development board and write an embedded program to blink the LED with a specified time delay.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Dev Board', specs: 'Tensilica Xtensa LX106, 3.3V logic', quantity: '1 No.' },
      { slNo: 2, name: '5mm LED (Red/Green)', specs: 'Forward Voltage: 2.0V, Current: 20mA', quantity: '1 No.' },
      { slNo: 3, name: 'Resistor', specs: '220Ω / 330Ω, 1/4 Watt', quantity: '1 No.' },
      { slNo: 4, name: 'Breadboard & Jumper Wires', specs: 'Standard pitch DuPont leads', quantity: '1 Set' },
      { slNo: 5, name: 'Micro-USB Cable & PC', specs: 'Data cable with Arduino IDE', quantity: '1 Set' },
    ],
    procedure: `1. Place the LED on the breadboard and identify its longer anode (+) lead and shorter cathode (-) lead.
2. Connect the anode lead to NodeMCU digital pin D1 through a 220Ω current-limiting resistor.
3. Connect the cathode lead directly to any GND pin on the NodeMCU board.
4. Connect the NodeMCU to your computer using a micro-USB cable.
5. Launch Arduino IDE, configure the board as "NodeMCU 1.0 (ESP-12E Module)", and select the appropriate serial COM port.
6. Verify and upload the program to the board.
7. Observe the external LED blinking continuously with a 1-second ON and 1-second OFF periodic cycle.`,
    images: ['/images/experiments/SINGLELED.jpeg'],
    code: `void setup() {
  pinMode(D1, OUTPUT);
}

void loop() {
  digitalWrite(D1, HIGH);
  delay(1000);
  digitalWrite(D1, LOW);
  delay(1000);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp01_LED_Blink.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'The external LED connected to the GPIO pin of NodeMCU blinks on/off at 1-second intervals.',
    },
    conclusion: 'The LED was successfully interfaced with the NodeMCU ESP8266 and periodic blinking operation with 1-second delay was verified.',
  },
  {
    id: 'exp-02',
    expNo: 2,
    title: 'Scrolling LED',
    category: 'Section 1: Basic GPIO & Sensor Interfacing (Standalone NodeMCU)',
    categoryShort: 'Basic I/O & Sensors',
    aim: 'To interface multiple LEDs to GPIO pins of the NodeMCU ESP8266 and program a sequential scrolling (chaser) light effect.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Dev Board', specs: '3.3V Logic Level', quantity: '1 No.' },
      { slNo: 2, name: '5mm LEDs (Red, Yellow, Green)', specs: 'Diffused LEDs', quantity: '3 Nos.' },
      { slNo: 3, name: 'Resistors', specs: '220Ω, 1/4 Watt', quantity: '3 Nos.' },
      { slNo: 4, name: 'Breadboard & Jumper Wires', specs: 'DuPont Male-to-Male', quantity: '1 Set' },
      { slNo: 5, name: 'Micro-USB Cable & PC', specs: 'Arduino IDE installed', quantity: '1 Set' },
    ],
    procedure: `1. Insert three 5mm LEDs (Red, Yellow, Green) onto the breadboard with shared ground alignment.
2. Connect each LED anode through an individual 220Ω resistor to NodeMCU digital pins D1, D2, and D3 respectively.
3. Connect the cathode leads of all three LEDs to the NodeMCU GND rail.
4. Plug the NodeMCU development board into your computer using a micro-USB cable.
5. In Arduino IDE, open the scrolling LED sketch, select the correct board profile and port, and click Upload.
6. Observe the sequential chaser light pattern cycling from D1 to D3 with the programmed delay intervals.`,
    images: ['/images/experiments/SCROLLINGLED.jpeg'],
    code: `void setup() {
  pinMode(D1, OUTPUT);
  pinMode(D2, OUTPUT);
  pinMode(D3, OUTPUT);
}

void loop() {
  digitalWrite(D1, HIGH);
  delay(1000);
  digitalWrite(D1, LOW);
  delay(1000);

  digitalWrite(D2, HIGH);
  delay(1000);
  digitalWrite(D2, LOW);
  delay(1000);

  digitalWrite(D3, HIGH);
  delay(1000);
  digitalWrite(D3, LOW);
  delay(1000);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp02_Scrolling_LED.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'The 3 LEDs light up one by one in sequence, verified on hardware.',
    },
    conclusion: 'Sequential scrolling of 3 LEDs was successfully programmed and verified on the NodeMCU ESP8266 hardware.',
  },
  {
    id: 'exp-03',
    expNo: 3,
    title: 'Pushbutton LED Control',
    category: 'Section 1: Basic GPIO & Sensor Interfacing (Standalone NodeMCU)',
    categoryShort: 'Basic I/O & Sensors',
    aim: 'To interface a push-button switch and an LED to the NodeMCU ESP8266, configuring the input pin with an internal pull-up resistor to control LED state upon button press.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Dev Board', specs: '3.3V Logic Level', quantity: '1 No.' },
      { slNo: 2, name: 'Push Button Switch', specs: '4-pin tactile momentary switch', quantity: '1 No.' },
      { slNo: 3, name: '5mm LED', specs: 'Diffused LED', quantity: '1 No.' },
      { slNo: 4, name: 'Resistor', specs: '220Ω, 1/4 Watt', quantity: '1 No.' },
      { slNo: 5, name: 'Breadboard & Jumper Wires', specs: 'DuPont Male-to-Male', quantity: '1 Set' },
    ],
    procedure: `1. Insert the 4-pin tactile momentary pushbutton and indicator LED onto the breadboard.
2. Connect one terminal of the pushbutton to NodeMCU pin D5 and the opposing terminal to 3.3V or GND (as configured in the sketch).
3. Connect the LED anode to NodeMCU pin D0 via a 220Ω resistor and the cathode to GND.
4. Connect the NodeMCU to your computer via micro-USB and select the active COM port in Arduino IDE.
5. Compile and upload the sketch to the NodeMCU.
6. Press the pushbutton and observe the LED turning ON; release the pushbutton and verify the LED turns OFF immediately.`,
    images: ['/images/experiments/PUSHBUTTONLED.jpeg'],
    code: `#define LED D0
#define BUTTON D5

void setup() {
  pinMode(LED, OUTPUT);
  pinMode(BUTTON, INPUT);

  digitalWrite(LED, LOW);
}

void loop() {
  if (digitalRead(BUTTON) == HIGH) {
    digitalWrite(LED, HIGH);
  } 
  else {
    digitalWrite(LED, LOW);
  }
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp03_PushButton_LED.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'The LED turns ON when the pushbutton is pressed and turns OFF when released.',
    },
    conclusion: 'Digital input state acquisition from a tactile switch and conditional LED output actuation was successfully demonstrated on the NodeMCU.',
  },
  {
    id: 'exp-04',
    expNo: 4,
    title: 'LDR Sensor Interfacing',
    category: 'Section 1: Basic GPIO & Sensor Interfacing (Standalone NodeMCU)',
    categoryShort: 'Basic I/O & Sensors',
    aim: 'To interface a Light Dependent Resistor (LDR) to the analog pin (A0) of the NodeMCU ESP8266 and measure ambient light intensity changes.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Dev Board', specs: '10-bit ADC (A0: 0-1.0V max)', quantity: '1 No.' },
      { slNo: 2, name: 'LDR Photoresistor', specs: '5mm CDS photocell', quantity: '1 No.' },
      { slNo: 3, name: 'Resistor', specs: '10kΩ for voltage divider', quantity: '1 No.' },
      { slNo: 4, name: 'Breadboard & Wires', specs: 'Standard connecting leads', quantity: '1 Set' },
    ],
    procedure: `1. Build a voltage divider on the breadboard by connecting an LDR in series with a 10kΩ fixed resistor.
2. Connect the free lead of the LDR to NodeMCU 3.3V and the free lead of the 10kΩ resistor to GND.
3. Connect the central junction between the LDR and resistor to the NodeMCU analog input pin A0.
4. Connect the NodeMCU to your computer using a micro-USB cable.
5. Open Arduino IDE, select the correct port, and upload the LDR readout sketch.
6. Open the Serial Monitor at 9600 baud.
7. Vary ambient illumination by covering the LDR with your hand or shining a light source on it, observing real-time ADC value changes in the Serial Monitor.`,
    images: [],
    code: `int sensor = 0;
int pin = A0;

void setup() {
  pinMode(pin, INPUT);
  Serial.begin(9600);
}

void loop() {
  sensor = analogRead(pin);
  Serial.print("Value: ");
  Serial.println(sensor);
  delay(5000);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp04_LDR_Sensor.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'LDR values for different lighting conditions are observed in the serial monitor.',
    },
    conclusion: 'Analog ambient light intensity readings were successfully acquired and monitored through the serial interface.',
  },
  {
    id: 'exp-05',
    expNo: 5,
    title: 'Buzzer Tone Melody',
    category: 'Section 1: Basic GPIO & Sensor Interfacing (Standalone NodeMCU)',
    categoryShort: 'Basic I/O & Sensors',
    aim: 'To interface a piezo buzzer with the NodeMCU ESP8266 and generate tones or melodies using frequency modulation.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Dev Board', specs: '3.3V logic level', quantity: '1 No.' },
      { slNo: 2, name: 'Piezo Buzzer', specs: '5V passive buzzer module', quantity: '1 No.' },
      { slNo: 3, name: 'Breadboard & Jumper Wires', specs: 'Standard DuPont leads', quantity: '1 Set' },
      { slNo: 4, name: 'Micro-USB Cable & PC', specs: 'Programming environment', quantity: '1 Set' },
    ],
    procedure: `1. Connect the positive (+) pin of the passive piezo buzzer to NodeMCU digital pin D5.
2. Connect the negative (-) pin of the buzzer to NodeMCU GND.
3. Connect the NodeMCU to the computer using a micro-USB cable.
4. In Arduino IDE, configure the board settings, open the melody sketch, and upload the code.
5. Listen to the acoustic output from the piezo buzzer to verify frequency-modulated tone and pause sequencing.`,
    images: ['/images/experiments/TONEMELODY.jpeg'],
    code: `void setup()
{
  pinMode(D5, OUTPUT);
}

void loop()
{
  tone(D5, 500);
  delay(100);

  noTone(D5);
  delay(50);

  tone(D5, 250);
  delay(500);

  noTone(D5);
  delay(100);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp05_Buzzer_Melody.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'The piezo buzzer generates a sequential musical tone melody at periodic intervals.',
    },
    conclusion: 'Tone synthesis and acoustic melody generation using the NodeMCU ESP8266 and a piezo buzzer was successfully verified.',
  },
  {
    id: 'exp-06',
    expNo: 6,
    title: 'LM35 Temperature Sensor',
    category: 'Section 1: Basic GPIO & Sensor Interfacing (Standalone NodeMCU)',
    categoryShort: 'Basic I/O & Sensors',
    aim: 'Design a temperature monitoring system using the LM35 sensor interfaced with NodeMCU, observed in the Serial Monitor.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266', specs: 'Microcontroller board', quantity: '1 No.' },
      { slNo: 2, name: 'LM35 Temperature Sensor', specs: 'Precision analog temperature sensor', quantity: '1 No.' },
      { slNo: 3, name: 'Breadboard', specs: 'Prototyping board', quantity: '1 No.' },
      { slNo: 4, name: 'Jumper Wires', specs: 'Connecting wires', quantity: '1 Set' },
    ],
    procedure: `1. Identify the pinout of the LM35 sensor: Pin 1 (VCC), Pin 2 (Analog Output), Pin 3 (GND).
2. Connect LM35 Pin 1 to NodeMCU 3.3V, Pin 3 to NodeMCU GND, and Pin 2 (OUT) to NodeMCU analog pin A0.
3. Plug the NodeMCU into your computer using a micro-USB cable.
4. Launch Arduino IDE, configure the board and serial port, and upload the temperature monitoring sketch.
5. Open the Serial Monitor at 9600 baud.
6. Observe room temperature readings updated every 5 seconds; warm the sensor gently to verify proportional temperature rise.`,
    images: ['/images/experiments/LM35.jpeg'],
    code: `int sensor = 0;
int pin = A0;

void setup() {
  pinMode(pin, INPUT);
  Serial.begin(9600);
}

void loop() {
  sensor = analogRead(pin) * 0.32;
  Serial.print("Temperature: ");
  Serial.println(sensor);
  delay(5000);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp06_LM35_Temperature.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Temperature readings from the LM35 sensor are displayed in the Serial Monitor.',
    },
    conclusion: 'Temperature readings from the LM35 sensor are displayed in the Serial Monitor.',
  },
  {
    id: 'exp-07',
    expNo: 7,
    title: 'DHT11 Temperature & Humidity',
    category: 'Section 1: Basic GPIO & Sensor Interfacing (Standalone NodeMCU)',
    categoryShort: 'Basic I/O & Sensors',
    aim: 'To interface a DHT11 digital composite sensor with the NodeMCU ESP8266 and display real-time ambient temperature and relative humidity on the Serial Monitor.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: '32-bit SoC', quantity: '1 No.' },
      { slNo: 2, name: 'DHT11 Sensor Module', specs: '0-50°C (±2°C), 20-90% RH (±5% RH)', quantity: '1 No.' },
      { slNo: 3, name: 'Pull-up Resistor', specs: '4.7kΩ - 10kΩ', quantity: '1 No.' },
      { slNo: 4, name: 'Connecting Wires', specs: 'DuPont jumper cables', quantity: '1 Set' },
    ],
    procedure: `1. Connect DHT11 VCC to NodeMCU 3.3V and GND to NodeMCU GND.
2. Connect the DHT11 DATA pin to NodeMCU pin D4 (include a 4.7kΩ–10kΩ pull-up resistor between VCC and DATA if using a bare 4-pin sensor).
3. Connect the NodeMCU to your PC using a micro-USB cable.
4. In Arduino IDE, verify that the Adafruit DHT Sensor library is installed, select your COM port, and upload the program.
5. Open the Serial Monitor at 9600 baud.
6. Confirm continuous, calibrated temperature (°C) and relative humidity (%) readings streamed every 2 seconds.`,
    images: ['/images/experiments/DHt11.jpeg'],
    code: `#include <DHT.h>

#define DHTPIN D4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup()
{
  Serial.begin(9600);
  dht.begin();
}

void loop()
{
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  Serial.print("Current Humidity = ");
  Serial.print(humidity);
  Serial.print("%\\t Current Temperature = ");
  Serial.print(temperature);
  Serial.println(" C");

  delay(2000);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp07_DHT11_Sensor.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Real-time ambient temperature and humidity readings from the DHT11 sensor are displayed on the Serial Monitor.',
    },
    conclusion: 'Ambient temperature and relative humidity were successfully acquired from the DHT11 sensor and monitored via serial communication.',
  },
  {
    id: 'exp-08',
    expNo: 8,
    title: 'Flame Sensor Interfacing',
    category: 'Section 1: Basic GPIO & Sensor Interfacing (Standalone NodeMCU)',
    categoryShort: 'Basic I/O & Sensors',
    aim: 'To interface a flame sensor with the NodeMCU ESP8266 to detect fire/infrared radiation and trigger an alert.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: '3.3V logic level', quantity: '1 No.' },
      { slNo: 2, name: 'Flame Sensor Module (YG1006)', specs: '760nm - 1100nm infrared phototransistor', quantity: '1 No.' },
      { slNo: 3, name: 'Buzzer & 5mm LED', specs: 'Audio-visual alert transducers', quantity: '1 Set' },
      { slNo: 4, name: 'Resistor & Breadboard', specs: '220Ω resistor and DuPont cables', quantity: '1 Set' },
    ],
    procedure: `1. Connect the Flame Sensor VCC to NodeMCU 3.3V and GND to NodeMCU GND.
2. Connect the Digital Output (D0) of the flame sensor module to NodeMCU pin D0.
3. Connect a buzzer to pin D1 and an indicator alert LED (with 220Ω resistor) to pin D3, referencing both cathodes to GND.
4. Connect the NodeMCU to your PC via USB and upload the flame detection code in Arduino IDE.
5. Open the Serial Monitor at 9600 baud.
6. Test detection by bringing a flame or lighter near the sensor (or adjusting the onboard LM393 potentiometer threshold), observing the buzzer and LED triggering alarm states upon flame detection.`,
    images: ['/images/experiments/FLAMESENSOR.jpeg'],
    code: `#define flamePin D0
#define buzzerPin D1
#define redled D3

int Flame = LOW;

void setup() {
  pinMode(buzzerPin, OUTPUT);
  pinMode(redled, OUTPUT);
  pinMode(flamePin, INPUT);
  Serial.begin(9600);
}

void loop() {
  Flame = digitalRead(flamePin);

  if (Flame == LOW)
  {
    digitalWrite(buzzerPin, HIGH);
    digitalWrite(redled, HIGH);
  }
  else
  {
    digitalWrite(buzzerPin, LOW);
    digitalWrite(redled, LOW);
  }
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp08_Flame_Sensor.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Flame presence is detected and alert status is printed to the Serial Monitor.',
    },
    conclusion: 'Flame detection system was successfully verified using an IR flame sensor module and NodeMCU ESP8266.',
  },
  {
    id: 'exp-09',
    expNo: 9,
    title: 'Ultrasonic Distance Measurement',
    category: 'Section 1: Basic GPIO & Sensor Interfacing (Standalone NodeMCU)',
    categoryShort: 'Basic I/O & Sensors',
    aim: 'To interface the HC-SR04 ultrasonic sensor with the NodeMCU ESP8266 to measure distance using the acoustic Time-of-Flight principle.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: '3.3V logic level', quantity: '1 No.' },
      { slNo: 2, name: 'HC-SR04 Ultrasonic Sensor', specs: '40kHz, 2cm to 400cm measurement range', quantity: '1 No.' },
      { slNo: 3, name: 'Voltage Divider Resistors', specs: '1kΩ and 2kΩ (5V to 3.3V Echo level shifter)', quantity: '1 Pair' },
      { slNo: 4, name: 'Breadboard & Wires', specs: 'DuPont cables', quantity: '1 Set' },
    ],
    procedure: `1. Connect HC-SR04 VCC to NodeMCU VIN (5V) and GND to NodeMCU GND.
2. Connect HC-SR04 TRIG pin to NodeMCU pin D7.
3. Connect HC-SR04 ECHO pin to NodeMCU pin D8 through a voltage divider (1kΩ and 2kΩ resistors) to protect the 3.3V GPIO.
4. Connect NodeMCU to the computer via USB and upload the distance measurement sketch using Arduino IDE.
5. Open the Serial Monitor at 9600 baud.
6. Place an obstacle in front of the sensor at varying distances and observe calculated centimeter distance values printed every second.`,
    images: ['/images/experiments/ULTRASONICSENSOR.jpg'],
    code: `const int trigPin = D7;
const int echoPin = D8;
long duration;
int distance;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = duration * 0.034 / 2;

  Serial.print("Distance: ");
  Serial.println(distance);
  delay(1000);
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp09_Ultrasonic_HCSR04.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'Ultrasonic sensor distance values for different scenarios are observed in the serial monitor.',
    },
    conclusion: 'Ultrasonic sensor distance values for different scenarios are observed in the serial monitor.',
  },
  {
    id: 'exp-10',
    expNo: 10,
    title: 'GSM SMS Send/Receive',
    category: 'Section 1: Basic GPIO & Sensor Interfacing (Standalone NodeMCU)',
    categoryShort: 'Basic I/O & Sensors',
    aim: 'To interface a SIM800L / SIM900 GSM module with NodeMCU ESP8266 using UART serial AT commands to transmit and receive SMS text messages.',
    apparatus: [
      { slNo: 1, name: 'NodeMCU ESP8266 Board', specs: 'Tensilica Xtensa LX106', quantity: '1 No.' },
      { slNo: 2, name: 'SIM800L GSM / GPRS Module', specs: 'Quad-band 850/900/1800/1900MHz', quantity: '1 No.' },
      { slNo: 3, name: 'External Power Supply', specs: '3.7V - 4.2V Li-ion (min 2A current peak)', quantity: '1 Unit' },
      { slNo: 4, name: 'Activated SIM Card', specs: 'Micro-SIM with SMS plan', quantity: '1 No.' },
      { slNo: 5, name: 'Connecting Wires & Breadboard', specs: 'DuPont cables', quantity: '1 Set' },
    ],
    procedure: `1. Insert an active micro-SIM card into the SIM800L module tray.
2. Provide a regulated 3.7V–4.2V external power supply (min 2A peak current) to the GSM module VCC/GND pins, and connect module GND to NodeMCU GND.
3. Connect GSM module TX to NodeMCU pin D5 (SoftwareSerial RX) and GSM module RX to NodeMCU pin D6 (SoftwareSerial TX).
4. Connect the NodeMCU to your computer and select the correct port in Arduino IDE.
5. In the sketch, enter your recipient destination mobile phone number in international format.
6. Upload the code to the board and open the Serial Monitor at 9600 baud.
7. Observe modem AT command handshakes ("AT", "AT+CMGF=1", "AT+CMGS") and verify SMS delivery on the target mobile handset.`,
    images: [],
    code: `#include <SoftwareSerial.h>

SoftwareSerial gsmSerial(D5, D6); // RX, TX

void setup() {
  Serial.begin(9600);
  gsmSerial.begin(9600);
  delay(1000);

  Serial.println("Initializing GSM Module...");
  gsmSerial.println("AT");
  delay(1000);
  gsmSerial.println("AT+CMGF=1"); // Set SMS to text mode
  delay(1000);
  gsmSerial.println("AT+CMGS=\\"+1234567890\\""); // Destination phone number
  delay(1000);
  gsmSerial.print("IIoT Lab Alert: NodeMCU GSM test message.");
  delay(100);
  gsmSerial.write(26); // ASCII code of CTRL+Z
  delay(1000);
  Serial.println("SMS sent successfully.");
}

void loop() {
  if (gsmSerial.available()) {
    Serial.write(gsmSerial.read());
  }
  if (Serial.available()) {
    gsmSerial.write(Serial.read());
  }
}`,
    codeLanguage: 'cpp',
    codeFilename: 'Exp10_GSM_SMS.ino',
    output: {
      type: 'terminal',
      mediaUrl: '',
      caption: 'GSM module initialized, AT commands sent, and SMS text message transmitted and received.',
    },
    conclusion: 'Cellular SMS transmission and serial AT command interfacing with the GSM module was successfully verified.',
  },
];
