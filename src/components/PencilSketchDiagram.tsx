import { ApparatusItem } from '../types/experiment';

interface PencilSketchDiagramProps {
  apparatus?: ApparatusItem[];
  category?: string;
  title?: string;
  expNo?: number;
  className?: string;
}

interface BlockSpec {
  title: string;
  subtitle: string;
  badge: string;
  pins: string[];
}

interface WireSpec {
  label: string;
  pinLeft: string;
  pinRight: string;
  direction?: 'right' | 'left' | 'both';
  color?: string;
}

interface ExperimentDiagramData {
  leftBlock: BlockSpec;
  centerBlock: BlockSpec;
  rightBlock: BlockSpec;
  leftWires: WireSpec[];
  rightWires: WireSpec[];
  flowCaption: string;
}

/**
 * Hand-drawn wobbly rectangle path with double-pass sketch strokes
 */
function makeSketchRect(x: number, y: number, w: number, h: number, seed = 0): string {
  const j = (n: number) => Math.sin(seed * 7.9 + n * 4.3) * 1.4;
  const p1 = `${x + j(1)},${y + j(2)}`;
  const p2 = `${x + w + j(3)},${y + j(4)}`;
  const p3 = `${x + w + j(5)},${y + h + j(6)}`;
  const p4 = `${x + j(7)},${y + h + j(8)}`;

  const pass1 = `M ${p1} L ${p2} L ${p3} L ${p4} Z`;
  const pass2 = `M ${x + j(2)},${y + j(1)} L ${x + w + j(4)},${y + j(3)} L ${x + w + j(6)},${y + h + j(5)} L ${x + j(8)},${y + h + j(7)} Z`;
  return `${pass1} ${pass2}`;
}

/**
 * Hand-drawn wobbly arrow path
 */
function makeSketchArrow(x1: number, y1: number, x2: number, y2: number, seed = 0, dir: 'right' | 'left' | 'both' = 'right'): string {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 + Math.sin(seed * 5.3) * 1.5;
  const shaft1 = `M ${x1},${y1} Q ${midX},${midY} ${x2},${y2}`;
  const shaft2 = `M ${x1 + 0.5},${y1 - 0.5} Q ${midX - 0.5},${midY + 0.5} ${x2 - 0.5},${y2 + 0.5}`;

  let heads = '';
  if (dir === 'right' || dir === 'both') {
    heads += ` M ${x2 - 7},${y2 - 4} L ${x2},${y2} L ${x2 - 7},${y2 + 4}`;
  }
  if (dir === 'left' || dir === 'both') {
    heads += ` M ${x1 + 7},${y1 - 4} L ${x1},${y1} L ${x1 + 7},${y1 + 4}`;
  }

  return `${shaft1} ${shaft2} ${heads}`;
}

/**
 * Clean hardware specification repository for all 29 official experiments
 */
const EXPERIMENT_DIAGRAM_REGISTRY: Record<number, ExperimentDiagramData> = {
  1: {
    leftBlock: {
      title: '5mm Red LED',
      subtitle: 'Current Limited (220Ω)',
      badge: 'ACTUATOR / LED',
      pins: ['Anode (+): D1 via 220Ω', 'Cathode (-): GND'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'ESP-12E / Wi-Fi SoC',
      badge: 'CONTROLLER',
      pins: ['GPIO5 / Pin D1 (Output)', 'GND (System Ground)', '3.3V Power Rail'],
    },
    rightBlock: {
      title: 'Periodic Blinking',
      subtitle: 'Serial Output Monitor',
      badge: 'OUTPUT / STATE',
      pins: ['HIGH (3.3V): LED ON', 'LOW (0V): LED OFF', '1000ms Toggle Period'],
    },
    leftWires: [
      { label: 'GPIO5 ──[220Ω]──> Anode', pinLeft: 'Anode (+)', pinRight: 'D1', direction: 'left', color: '#60a5fa' },
      { label: 'GND ─── Cathode', pinLeft: 'Cathode (-)', pinRight: 'GND', direction: 'right', color: '#94a3b8' },
    ],
    rightWires: [
      { label: 'Serial Log: "LED ON/OFF"', pinLeft: 'TX', pinRight: 'RX', direction: 'right', color: '#38bdf8' },
      { label: 'Visual State Indicator', pinLeft: 'State', pinRight: 'Light', direction: 'right', color: '#fbbf24' },
    ],
    flowCaption: 'NodeMCU Pin D1 drives 5mm LED via 220Ω resistor with periodic 1000ms HIGH/LOW cycle.',
  },

  2: {
    leftBlock: {
      title: '3x LED Array',
      subtitle: 'Red, Yellow, Green LEDs',
      badge: 'ACTUATOR ARRAY',
      pins: ['LED 1 (Red): Pin D1', 'LED 2 (Yellow): Pin D2', 'LED 3 (Green): Pin D3', 'Common Ground: GND'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'GPIO Chaser Logic',
      badge: 'CONTROLLER',
      pins: ['D1: GPIO5 (Red)', 'D2: GPIO4 (Yellow)', 'D3: GPIO0 (Green)', 'GND Shared Bus'],
    },
    rightBlock: {
      title: 'Sequential Chaser',
      subtitle: 'Running Light Pattern',
      badge: 'OUTPUT / DISPLAY',
      pins: ['Step 1: D1 ON (200ms)', 'Step 2: D2 ON (200ms)', 'Step 3: D3 ON (200ms)', 'Loop: Chaser Cycle'],
    },
    leftWires: [
      { label: 'D1, D2, D3 ──[220Ω]──> LEDs', pinLeft: 'Anodes', pinRight: 'D1-D3', direction: 'left', color: '#60a5fa' },
      { label: 'Common GND Bus', pinLeft: 'Cathodes', pinRight: 'GND', direction: 'right', color: '#94a3b8' },
    ],
    rightWires: [
      { label: 'Running Light Sequence', pinLeft: 'State', pinRight: 'Display', direction: 'right', color: '#38bdf8' },
      { label: '200ms Step Delay Loop', pinLeft: 'Timer', pinRight: 'Shift', direction: 'right', color: '#34d399' },
    ],
    flowCaption: 'NodeMCU sequentially asserts GPIO pins D1 -> D2 -> D3 to produce a running chaser display.',
  },

  3: {
    leftBlock: {
      title: 'Tactile Pushbutton',
      subtitle: 'Momentary 4-Pin Switch',
      badge: 'DIGITAL INPUT',
      pins: ['Pin 1: D5 (INPUT_PULLUP)', 'Pin 2: GND', 'Internal 10kΩ Pull-Up'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Debounce & Logic SoC',
      badge: 'CONTROLLER',
      pins: ['D5: GPIO14 (Button In)', 'D1: GPIO5 (LED Out)', 'GND / 3.3V Rails'],
    },
    rightBlock: {
      title: 'Indicator LED',
      subtitle: 'Visual Output Element',
      badge: 'ACTUATOR / LED',
      pins: ['D1 ──[220Ω]──> Anode', 'Cathode ─── GND', 'State: Controlled ON/OFF'],
    },
    leftWires: [
      { label: 'Button Pressed ───> LOW', pinLeft: 'Terminal 1', pinRight: 'D5', direction: 'right', color: '#38bdf8' },
      { label: 'Switch Ground Return', pinLeft: 'Terminal 2', pinRight: 'GND', direction: 'right', color: '#94a3b8' },
    ],
    rightWires: [
      { label: 'D1 Active HIGH ───> LED', pinLeft: 'D1 Out', pinRight: 'Anode', direction: 'right', color: '#60a5fa' },
      { label: 'GND Cathode Return', pinLeft: 'GND', pinRight: 'Cathode', direction: 'right', color: '#94a3b8' },
    ],
    flowCaption: 'Pushbutton pulls D5 to GND (LOW); ESP8266 detects pressed state and asserts D1 HIGH to light LED.',
  },

  4: {
    leftBlock: {
      title: 'LDR Photoresistor',
      subtitle: 'Light Dependent Divider',
      badge: 'ANALOG SENSOR',
      pins: ['VCC: 3.3V Rail', 'Divider Midpoint: A0', 'Series Resistor: 10kΩ GND'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: '10-Bit ADC Converter',
      badge: 'CONTROLLER',
      pins: ['Pin A0: ADC (0-1.0V)', '10-Bit Value: 0 - 1023', 'Serial UART @ 9600 Baud'],
    },
    rightBlock: {
      title: 'Serial Monitor',
      subtitle: 'Lux Telemetry Plotter',
      badge: 'OUTPUT / STREAM',
      pins: ['Raw ADC: 0 to 1023', 'Illumination (Lux / %)', '9600 Baud Terminal'],
    },
    leftWires: [
      { label: '3.3V Power ─── LDR', pinLeft: 'VCC', pinRight: '3.3V', direction: 'left', color: '#fbbf24' },
      { label: 'Voltage Divider ───> A0', pinLeft: 'Midpoint', pinRight: 'A0', direction: 'right', color: '#38bdf8' },
    ],
    rightWires: [
      { label: 'UART TX/RX Stream', pinLeft: 'TX', pinRight: 'Terminal', direction: 'right', color: '#38bdf8' },
      { label: 'Real-time Lux Readout', pinLeft: 'Data', pinRight: 'Plot', direction: 'right', color: '#34d399' },
    ],
    flowCaption: 'Ambient light modulates LDR resistance in a 10kΩ divider; ADC A0 samples the analog voltage.',
  },

  5: {
    leftBlock: {
      title: 'Piezo Buzzer',
      subtitle: 'Passive Acoustic Element',
      badge: 'AUDIO ACTUATOR',
      pins: ['Positive (+): D5 (PWM)', 'Negative (-): GND', 'Impedance: 16Ω'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'tone() PWM Engine',
      badge: 'CONTROLLER',
      pins: ['D5: GPIO14 (tone Pin)', 'Frequency: 262Hz - 523Hz', 'GND Shared Bus'],
    },
    rightBlock: {
      title: 'Melodic Sound',
      subtitle: 'Audible Frequencies',
      badge: 'ACOUSTIC OUTPUT',
      pins: ['Note C4: 262 Hz', 'Note E4: 330 Hz', 'Note G4: 392 Hz', 'Note C5: 523 Hz'],
    },
    leftWires: [
      { label: 'D5 PWM Tone Wave', pinLeft: 'Positive (+)', pinRight: 'D5', direction: 'left', color: '#60a5fa' },
      { label: 'GND Return Line', pinLeft: 'Negative (-)', pinRight: 'GND', direction: 'right', color: '#94a3b8' },
    ],
    rightWires: [
      { label: 'Acoustic Sound Waves', pinLeft: 'PWM', pinRight: 'Melody', direction: 'right', color: '#f59e0b' },
      { label: 'Serial Note Debugger', pinLeft: 'UART', pinRight: 'Monitor', direction: 'right', color: '#38bdf8' },
    ],
    flowCaption: 'ESP8266 generates variable PWM frequencies on D5 using tone() to play musical melodies on the buzzer.',
  },

  6: {
    leftBlock: {
      title: 'LM35 Temp Sensor',
      subtitle: 'Precision Analog Sensor',
      badge: 'ANALOG SENSOR',
      pins: ['Pin 1: VCC (3.3V)', 'Pin 2: VOUT (10mV/°C)', 'Pin 3: GND'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'ADC Conversion Engine',
      badge: 'CONTROLLER',
      pins: ['Pin A0: ADC (0-1.0V)', 'Formula: Vout * 100°C/V', 'UART 9600 Baud Output'],
    },
    rightBlock: {
      title: 'Serial Monitor',
      subtitle: 'Temperature Terminal',
      badge: 'OUTPUT / DISPLAY',
      pins: ['Ambient Temp (°C)', 'Resolution: 0.1 °C', 'Update: 1000ms Interval'],
    },
    leftWires: [
      { label: '3.3V Power Line', pinLeft: 'Pin 1 (VCC)', pinRight: '3.3V', direction: 'left', color: '#fbbf24' },
      { label: 'VOUT (10mV/°C) ───> A0', pinLeft: 'Pin 2 (OUT)', pinRight: 'A0', direction: 'right', color: '#38bdf8' },
    ],
    rightWires: [
      { label: 'Computed Temp (°C)', pinLeft: 'Data', pinRight: 'Terminal', direction: 'right', color: '#34d399' },
      { label: 'UART Serial @ 9600 Baud', pinLeft: 'TX', pinRight: 'PC', direction: 'right', color: '#38bdf8' },
    ],
    flowCaption: 'LM35 generates 10mV per degree Celsius; NodeMCU A0 ADC converts voltage and prints temperature.',
  },

  7: {
    leftBlock: {
      title: 'DHT11 Sensor',
      subtitle: 'Temp & Humidity Bus',
      badge: 'DIGITAL SENSOR',
      pins: ['Pin 1: VCC (3.3V)', 'Pin 2: DATA (1-Wire)', 'Pin 4: GND (Ground)'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: '1-Wire Bit-Bang SoC',
      badge: 'CONTROLLER',
      pins: ['D4: GPIO2 (DATA Pin)', '4.7kΩ Pull-Up Resistor', 'Sampling Rate: 0.5Hz (2s)'],
    },
    rightBlock: {
      title: 'Serial Monitor',
      subtitle: 'Dual Telemetry Readout',
      badge: 'OUTPUT / DISPLAY',
      pins: ['Temperature: 20-50 °C', 'Humidity: 20-90 % RH', 'Checksum Verified (OK)'],
    },
    leftWires: [
      { label: '3.3V VCC Power', pinLeft: 'Pin 1 (VCC)', pinRight: '3.3V', direction: 'left', color: '#fbbf24' },
      { label: 'Bidirectional DATA ─── D4', pinLeft: 'Pin 2 (DATA)', pinRight: 'D4', direction: 'both', color: '#38bdf8' },
    ],
    rightWires: [
      { label: 'Temp (°C) & Humidity (%)', pinLeft: 'Data', pinRight: 'Terminal', direction: 'right', color: '#34d399' },
      { label: 'Serial Log Stream @ 9600', pinLeft: 'TX', pinRight: 'PC', direction: 'right', color: '#38bdf8' },
    ],
    flowCaption: 'DHT11 transmits digital 40-bit data packets over single-wire bus on D4; ESP8266 extracts Temp & RH.',
  },

  8: {
    leftBlock: {
      title: 'IR Flame Sensor',
      subtitle: '760nm - 1100nm Spectrum',
      badge: 'OPTICAL SENSOR',
      pins: ['VCC: 3.3V Power', 'D0: Digital Output', 'GND: System Ground'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Emergency Logic SoC',
      badge: 'CONTROLLER',
      pins: ['D0: GPIO16 (Flame In)', 'D1: GPIO5 (Buzzer Out)', 'D2: GPIO4 (LED Out)'],
    },
    rightBlock: {
      title: 'Fire Alarm System',
      subtitle: 'Audible & Visual Alert',
      badge: 'ALARM ACTUATORS',
      pins: ['Active Buzzer (D1): BEEP', 'Red Alert LED (D2): FLASH', 'Status: FIRE DETECTED'],
    },
    leftWires: [
      { label: 'Flame Detected (LOW) ──> D0', pinLeft: 'D0 Out', pinRight: 'D0', direction: 'right', color: '#f87171' },
      { label: '3.3V / GND Power Bus', pinLeft: 'VCC/GND', pinRight: 'Power', direction: 'left', color: '#fbbf24' },
    ],
    rightWires: [
      { label: 'D1 Active HIGH ──> Buzzer', pinLeft: 'D1 Out', pinRight: 'Buzzer', direction: 'right', color: '#f87171' },
      { label: 'D2 Active HIGH ──> Alert LED', pinLeft: 'D2 Out', pinRight: 'LED', direction: 'right', color: '#fbbf24' },
    ],
    flowCaption: 'Flame sensor pulls D0 LOW upon detecting flame infrared signature; NodeMCU immediately trips buzzer & LED.',
  },

  9: {
    leftBlock: {
      title: 'HC-SR04 Ultrasonic',
      subtitle: '40kHz Transceiver Module',
      badge: 'DISTANCE SENSOR',
      pins: ['VCC: 5V (VIN Pin)', 'TRIG: 10µs Trigger (D7)', 'ECHO: Echo Pulse (D8)', 'GND: System Ground'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Time-of-Flight Compute',
      badge: 'CONTROLLER',
      pins: ['D7: GPIO13 (TRIG Pulse)', 'D8: GPIO15 (ECHO In)', 'Divider: 1kΩ / 2kΩ Resistors'],
    },
    rightBlock: {
      title: 'Serial Monitor',
      subtitle: 'Distance Measurements',
      badge: 'OUTPUT / TELEMETRY',
      pins: ['Distance (cm) = (Time * 0.034)/2', 'Range: 2cm to 400cm', 'Terminal Plot @ 9600 Baud'],
    },
    leftWires: [
      { label: '10µs Trigger Pulse ─── D7', pinLeft: 'TRIG', pinRight: 'D7', direction: 'left', color: '#60a5fa' },
      { label: 'ECHO Pulse (Divider) ──> D8', pinLeft: 'ECHO', pinRight: 'D8', direction: 'right', color: '#38bdf8' },
    ],
    rightWires: [
      { label: 'Real-time Distance (cm)', pinLeft: 'Computed', pinRight: 'Terminal', direction: 'right', color: '#34d399' },
      { label: 'Serial Log Stream @ 9600', pinLeft: 'TX', pinRight: 'PC', direction: 'right', color: '#38bdf8' },
    ],
    flowCaption: 'NodeMCU issues 10µs pulse on TRIG, measures pulse width on ECHO, and calculates target distance in cm.',
  },

  10: {
    leftBlock: {
      title: 'SIM800L GSM Module',
      subtitle: 'Cellular Quad-Band Modem',
      badge: 'COMMUNICATION',
      pins: ['VCC: External 4.0V / 2A', 'TXD: Serial Out -> D2', 'RXD: Serial In <- D1', 'GND: Shared Ground'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'SoftwareSerial Master',
      badge: 'CONTROLLER',
      pins: ['D2: GPIO4 (Software RX)', 'D1: GPIO5 (Software TX)', 'AT Command Protocol'],
    },
    rightBlock: {
      title: 'Cellular Network',
      subtitle: 'SMS Text Dispatch',
      badge: 'REMOTE WAN',
      pins: ['AT+CMGF=1 (Text Mode)', 'AT+CMGS (Send Message)', 'Carrier: GSM 900/1800MHz'],
    },
    leftWires: [
      { label: 'TXD Modem ───> D2 (RX)', pinLeft: 'TXD', pinRight: 'D2', direction: 'right', color: '#38bdf8' },
      { label: 'RXD Modem <─── D1 (TX)', pinLeft: 'RXD', pinRight: 'D1', direction: 'left', color: '#60a5fa' },
    ],
    rightWires: [
      { label: 'Cellular RF Uplink', pinLeft: 'Antenna', pinRight: 'Tower', direction: 'right', color: '#ec4899' },
      { label: 'SMS Notification Sent', pinLeft: 'Status', pinRight: 'Phone', direction: 'right', color: '#34d399' },
    ],
    flowCaption: 'NodeMCU sends AT commands over SoftwareSerial (D1/D2) to SIM800L to transmit cellular SMS messages.',
  },

  11: {
    leftBlock: {
      title: 'LM35 Sensor',
      subtitle: 'Analog Temp Transducer',
      badge: 'ANALOG INPUT',
      pins: ['Pin 1: VCC (3.3V)', 'Pin 2: VOUT (10mV/°C)', 'Pin 3: GND (Ground)'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Wi-Fi IoT Client SoC',
      badge: 'CONTROLLER',
      pins: ['Pin A0: ADC (0-1.0V)', 'Wi-Fi 2.4GHz IEEE 802.11b/g/n', 'ThingSpeak Client Library'],
    },
    rightBlock: {
      title: 'ThingSpeak Cloud',
      subtitle: 'Channel Telemetry',
      badge: 'IOT CLOUD',
      pins: ['Channel ID: Field 1 (Temp)', 'HTTP REST POST Request', '15s Update Rate Interval'],
    },
    leftWires: [
      { label: 'VOUT (10mV/°C) ───> A0', pinLeft: 'Pin 2 (OUT)', pinRight: 'A0', direction: 'right', color: '#38bdf8' },
      { label: '3.3V / GND Power Rails', pinLeft: 'Power', pinRight: 'Power', direction: 'left', color: '#fbbf24' },
    ],
    rightWires: [
      { label: 'Wi-Fi HTTP REST POST', pinLeft: 'Wi-Fi', pinRight: 'ThingSpeak', direction: 'right', color: '#0284c7' },
      { label: 'Live Temperature Chart', pinLeft: 'Data', pinRight: 'Field 1', direction: 'right', color: '#30d158' },
    ],
    flowCaption: 'LM35 analog voltage is sampled by A0; NodeMCU connects via Wi-Fi and pushes temperature data to ThingSpeak Field 1.',
  },

  12: {
    leftBlock: {
      title: 'DHT11 Sensor',
      subtitle: 'Digital Climate Transducer',
      badge: 'DIGITAL INPUT',
      pins: ['VCC: 3.3V Power', 'DATA: Pin D4 (1-Wire)', 'GND: Ground Bus'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Multi-Field IoT SoC',
      badge: 'CONTROLLER',
      pins: ['Pin D4: GPIO2 (DATA)', 'Wi-Fi 2.4GHz Hotspot', 'ThingSpeak REST Client'],
    },
    rightBlock: {
      title: 'ThingSpeak Cloud',
      subtitle: 'Dual Channel Feed',
      badge: 'IOT CLOUD',
      pins: ['Field 1: Temperature (°C)', 'Field 2: Relative Humidity (%)', 'Live Dual-Trace Graphs'],
    },
    leftWires: [
      { label: 'Digital Single-Wire ─── D4', pinLeft: 'DATA', pinRight: 'D4', direction: 'both', color: '#38bdf8' },
      { label: '3.3V & GND Power Bus', pinLeft: 'VCC/GND', pinRight: 'Power', direction: 'left', color: '#fbbf24' },
    ],
    rightWires: [
      { label: 'REST POST Multi-Field Data', pinLeft: 'Wi-Fi', pinRight: 'ThingSpeak', direction: 'right', color: '#0284c7' },
      { label: 'Live Temp & RH Cloud Feeds', pinLeft: 'Payload', pinRight: 'Fields 1 & 2', direction: 'right', color: '#30d158' },
    ],
    flowCaption: 'DHT11 measures temperature & humidity; NodeMCU uploads both telemetry streams simultaneously to ThingSpeak Fields 1 & 2.',
  },

  13: {
    leftBlock: {
      title: 'HC-SR04 Sensor',
      subtitle: 'Water Level Ultrasound',
      badge: 'DISTANCE INPUT',
      pins: ['VCC: 5V (NodeMCU VIN)', 'TRIG: D1 (GPIO5)', 'ECHO: D2 (GPIO4 Divider)', 'GND: Ground'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Reservoir Level Logic',
      badge: 'CONTROLLER',
      pins: ['D1: TRIG Pulse Output', 'D2: ECHO Pulse Input', 'Wi-Fi HTTP Client Stack'],
    },
    rightBlock: {
      title: 'ThingSpeak Cloud',
      subtitle: 'Reservoir Monitoring',
      badge: 'IOT CLOUD',
      pins: ['Field 1: Water Level (cm)', 'Reservoir Depth Percentage', 'Historical Storage Trends'],
    },
    leftWires: [
      { label: '10µs TRIG Pulse <─── D1', pinLeft: 'TRIG', pinRight: 'D1', direction: 'left', color: '#60a5fa' },
      { label: 'ECHO Pulse (Divider) ──> D2', pinLeft: 'ECHO', pinRight: 'D2', direction: 'right', color: '#38bdf8' },
    ],
    rightWires: [
      { label: 'Wi-Fi HTTP REST Ingestion', pinLeft: 'Wi-Fi', pinRight: 'ThingSpeak', direction: 'right', color: '#0284c7' },
      { label: 'Field 1: Level Telemetry Plot', pinLeft: 'Data', pinRight: 'Field 1', direction: 'right', color: '#30d158' },
    ],
    flowCaption: 'Ultrasonic echo transit time is measured on D1/D2 to compute reservoir level, which is published periodically to ThingSpeak.',
  },

  14: {
    leftBlock: {
      title: 'Soil Moisture Probe',
      subtitle: 'Conductivity Transducer',
      badge: 'ANALOG INPUT',
      pins: ['VCC: 3.3V Power', 'A0: Analog Output', 'GND: Ground', 'Calibration: 0-100%'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Smart Agriculture SoC',
      badge: 'CONTROLLER',
      pins: ['Pin A0: ADC Input (0-1023)', 'Soil Saturation Logic', 'Wi-Fi Station Mode'],
    },
    rightBlock: {
      title: 'ThingSpeak Cloud',
      subtitle: 'Irrigation Analytics',
      badge: 'IOT CLOUD',
      pins: ['Field 1: Soil Moisture (%)', 'Dry / Wet Threshold Alerts', 'Automated Irrigation Chart'],
    },
    leftWires: [
      { label: 'Analog Moisture Volts ──> A0', pinLeft: 'A0 Out', pinRight: 'A0', direction: 'right', color: '#38bdf8' },
      { label: '3.3V / GND Power Supply', pinLeft: 'Power', pinRight: 'Rails', direction: 'left', color: '#fbbf24' },
    ],
    rightWires: [
      { label: 'Wi-Fi HTTP REST Upload', pinLeft: 'Wi-Fi', pinRight: 'ThingSpeak', direction: 'right', color: '#0284c7' },
      { label: 'Field 1 Moisture Saturation %', pinLeft: 'Moisture', pinRight: 'Field 1', direction: 'right', color: '#30d158' },
    ],
    flowCaption: 'Soil conductivity is converted to volumetric moisture percentage and streamed to ThingSpeak for smart irrigation monitoring.',
  },

  15: {
    leftBlock: {
      title: 'TCS3200 Color Sensor',
      subtitle: '8x8 Photodiode Matrix',
      badge: 'OPTICAL INPUT',
      pins: ['S0, S1: Frequency Scaling', 'S2, S3: Color Filter Select', 'OUT: Frequency Pulse (D5)', 'VCC & GND: 3.3V/5V'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Chromatic Parser SoC',
      badge: 'CONTROLLER',
      pins: ['D1, D2: Control S0, S1', 'D3, D4: Filter S2, S3', 'D5: GPIO14 (Pulse In)', 'RGB Color Classification'],
    },
    rightBlock: {
      title: 'ThingSpeak Cloud',
      subtitle: '3-Channel Telemetry',
      badge: 'IOT CLOUD',
      pins: ['Field 1: Red Intensity', 'Field 2: Green Intensity', 'Field 3: Blue Intensity', 'Cloud Color Sorting Log'],
    },
    leftWires: [
      { label: 'Filter Select S0-S3 <── D1-D4', pinLeft: 'S0-S3', pinRight: 'D1-D4', direction: 'left', color: '#a855f7' },
      { label: 'OUT Frequency Pulse ──> D5', pinLeft: 'OUT', pinRight: 'D5', direction: 'right', color: '#38bdf8' },
    ],
    rightWires: [
      { label: 'REST POST Multi-Field RGB', pinLeft: 'Wi-Fi', pinRight: 'ThingSpeak', direction: 'right', color: '#0284c7' },
      { label: 'Fields 1, 2, 3 Chromatic Plot', pinLeft: 'RGB', pinRight: 'Fields 1-3', direction: 'right', color: '#ec4899' },
    ],
    flowCaption: 'TCS3200 measures Red, Green, and Blue light-to-frequency pulses; NodeMCU processes values and updates 3 ThingSpeak fields.',
  },

  16: {
    leftBlock: {
      title: 'DHT11 + LDR Sensors',
      subtitle: 'Multi-Sensor Array',
      badge: 'METEOROLOGY',
      pins: ['DHT11 DATA: Pin D4', 'LDR Analog: Pin A0', 'VCC (3.3V) & Shared GND', 'Solar Irradiance & Climate'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Weather Station Engine',
      badge: 'CONTROLLER',
      pins: ['D4: Digital Climate Bus', 'A0: Optical Lux Divider', 'Multi-Variable Packaging', 'Wi-Fi 802.11b/g/n'],
    },
    rightBlock: {
      title: 'ThingSpeak Weather',
      subtitle: 'Multi-Channel Station',
      badge: 'IOT CLOUD',
      pins: ['Field 1: Temperature (°C)', 'Field 2: Humidity (%)', 'Field 3: Ambient Light (Lux)', 'Comprehensive Weather Hub'],
    },
    leftWires: [
      { label: 'DHT11 DATA ─── D4', pinLeft: 'DHT11', pinRight: 'D4', direction: 'both', color: '#38bdf8' },
      { label: 'LDR Analog Divider ───> A0', pinLeft: 'LDR', pinRight: 'A0', direction: 'right', color: '#fbbf24' },
    ],
    rightWires: [
      { label: 'HTTP REST Multi-Field Uplink', pinLeft: 'Wi-Fi', pinRight: 'ThingSpeak', direction: 'right', color: '#0284c7' },
      { label: 'Fields 1, 2, 3 Weather Gauges', pinLeft: 'Package', pinRight: 'Dashboard', direction: 'right', color: '#30d158' },
    ],
    flowCaption: 'Composite meteorological sensors sample temperature, humidity, and light; NodeMCU bundles and logs all three to ThingSpeak.',
  },

  17: {
    leftBlock: {
      title: 'Smart Home Devices',
      subtitle: 'Smart Door, Light, Fan',
      badge: 'IOT END DEVICES',
      pins: ['Smart Door (Wireless)', 'Smart Light (Wireless)', 'Ceiling Fan (Wireless)', 'Window Actuator'],
    },
    centerBlock: {
      title: 'Cisco Home Gateway',
      subtitle: 'Central Coordinator',
      badge: 'GATEWAY',
      pins: ['SSID: "HomeGateway"', 'IP: 192.168.25.1', 'Embedded DHCP Server', 'IoT Registration Broker'],
    },
    rightBlock: {
      title: 'Tablet Controller',
      subtitle: 'IoT Monitor Browser',
      badge: 'USER INTERFACE',
      pins: ['Web Browser @ 192.168.25.1', 'Automated Condition Rules', 'Bi-directional Actuation'],
    },
    leftWires: [
      { label: '2.4GHz Wi-Fi Association', pinLeft: 'Wireless', pinRight: 'AP', direction: 'both', color: '#fbbf24' },
      { label: 'IoT Status Telemetry', pinLeft: 'Telemetry', pinRight: 'Gateway', direction: 'right', color: '#38bdf8' },
    ],
    rightWires: [
      { label: 'HTTP Control Dashboard', pinLeft: 'WebServer', pinRight: 'Tablet', direction: 'both', color: '#38bdf8' },
      { label: 'Automated Device Rules', pinLeft: 'Rules', pinRight: 'Actuation', direction: 'left', color: '#34d399' },
    ],
    flowCaption: 'Smart home end devices register wirelessly to the Cisco Home Gateway and are monitored and controlled via web dashboard.',
  },

  18: {
    leftBlock: {
      title: 'Smoke Detector',
      subtitle: 'Environmental Sensor',
      badge: 'SAFETY SENSOR',
      pins: ['Slot 0: Analog Smoke Level', 'Particulate Density Sensor', 'Simulation Gas Source'],
    },
    centerBlock: {
      title: 'MCU-PT Microcontroller',
      subtitle: 'Cisco PT Controller',
      badge: 'CONTROLLER',
      pins: ['Slot 0: Smoke Detector (IN)', 'Slot 1: Siren Alarm (OUT)', 'Slot 2: Sprinkler Valve (OUT)', 'Threshold Logic: > 150'],
    },
    rightBlock: {
      title: 'Emergency Actuators',
      subtitle: 'Siren & Fire Sprinkler',
      badge: 'FIRE SAFETY',
      pins: ['Slot 1: Audible Siren Alert', 'Slot 2: Sprinkler Water Release', 'Status: EMERGENCY TRIP'],
    },
    leftWires: [
      { label: 'Particulate Level ───> Slot 0', pinLeft: 'Analog Out', pinRight: 'Slot 0', direction: 'right', color: '#f87171' },
      { label: 'IoT Custom Cable', pinLeft: 'Cable', pinRight: 'Port', direction: 'right', color: '#94a3b8' },
    ],
    rightWires: [
      { label: 'Slot 1 Asserted ───> Siren ON', pinLeft: 'Slot 1', pinRight: 'Siren', direction: 'right', color: '#f87171' },
      { label: 'Slot 2 Asserted ───> Sprinkler', pinLeft: 'Slot 2', pinRight: 'Sprinkler', direction: 'right', color: '#38bdf8' },
    ],
    flowCaption: 'When smoke density surpasses threshold 150, the MCU-PT triggers the siren alarm and opens fire sprinkler valves.',
  },

  19: {
    leftBlock: {
      title: 'Digital Pushbutton',
      subtitle: 'Momentary Input',
      badge: 'INPUT COMPONENT',
      pins: ['Pin: Digital Out', 'IoT Custom Cable', 'State: HIGH on click'],
    },
    centerBlock: {
      title: 'MCU-PT Microcontroller',
      subtitle: 'Cisco PT Logic Board',
      badge: 'CONTROLLER',
      pins: ['Slot 0: Pushbutton Input', 'Slot 1: LED Output Driver', 'Direct State Propagation'],
    },
    rightBlock: {
      title: 'LED Actuator',
      subtitle: 'Visual Indicator',
      badge: 'ACTUATOR COMPONENT',
      pins: ['Pin: Digital In', 'Illumination State: ON/OFF', 'IoT Custom Cable'],
    },
    leftWires: [
      { label: 'Button Clicked ───> Slot 0', pinLeft: 'Terminal', pinRight: 'Slot 0', direction: 'right', color: '#38bdf8' },
      { label: 'IoT Connection Cable', pinLeft: 'Cable', pinRight: 'Port', direction: 'right', color: '#94a3b8' },
    ],
    rightWires: [
      { label: 'Slot 1 ───> LED Illuminate', pinLeft: 'Slot 1', pinRight: 'LED In', direction: 'right', color: '#60a5fa' },
      { label: 'Visual State Response', pinLeft: 'Signal', pinRight: 'State', direction: 'right', color: '#fbbf24' },
    ],
    flowCaption: 'In Cisco Packet Tracer, clicking the pushbutton toggles Slot 0, causing the MCU-PT to assert Slot 1 and illuminate the LED.',
  },

  20: {
    leftBlock: {
      title: 'IoT End Devices',
      subtitle: 'Motion, Siren, Lamp',
      badge: 'HETEROGENEOUS IOT',
      pins: ['Motion Sensor (Ethernet)', 'Siren Alarm (Ethernet)', 'Smart Lamp (Ethernet)', 'Cat6 Straight-Through'],
    },
    centerBlock: {
      title: '2960 Switch & Router',
      subtitle: 'Cisco IP Infrastructure',
      badge: 'NETWORK FABRIC',
      pins: ['2960 FastEthernet Ports', '2901 Router Gateway', 'Subnet: 192.168.1.0/24', 'DHCP IP Addressing'],
    },
    rightBlock: {
      title: 'IoT Server Dashboard',
      subtitle: 'Central Registration',
      badge: 'SERVER / CLOUD',
      pins: ['IoT Registration Service: ON', 'Server IP: 192.168.1.1', 'Web Browser Device Registry', 'End-to-End Control'],
    },
    leftWires: [
      { label: 'Cat6 Ethernet Cables', pinLeft: 'FastEthernet', pinRight: 'Switch Ports', direction: 'both', color: '#38bdf8' },
      { label: 'DHCP Request / ACK', pinLeft: 'IP Client', pinRight: 'Router', direction: 'both', color: '#94a3b8' },
    ],
    rightWires: [
      { label: 'IoT Registration Protocol', pinLeft: 'Uplink', pinRight: 'IoT Server', direction: 'both', color: '#34d399' },
      { label: 'Web Management Console', pinLeft: 'HTTP 80', pinRight: 'Dashboard', direction: 'both', color: '#fbbf24' },
    ],
    flowCaption: 'Diverse IoT smart devices communicate across Cisco 2960 switches and 2901 routers to register with the central IoT Server.',
  },

  21: {
    leftBlock: {
      title: 'Blynk Mobile App',
      subtitle: 'iOS / Android GUI',
      badge: 'MOBILE DASHBOARD',
      pins: ['Button Widget: Virtual Pin V1', 'Push / Switch Mode', 'Encrypted WAN Cloud Link'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Blynk Protocol Client',
      badge: 'CONTROLLER',
      pins: ['BLYNK_WRITE(V1) Handler', 'D1: GPIO5 (LED Control)', 'Wi-Fi Station 802.11b/g/n'],
    },
    rightBlock: {
      title: 'LED Actuator',
      subtitle: 'Controlled Hardware',
      badge: 'ACTUATOR / LED',
      pins: ['D1 ──[220Ω]──> Anode (+)', 'Cathode (-) ─── GND', 'State: Remotely Toggled'],
    },
    leftWires: [
      { label: 'Blynk Cloud WAN Protocol', pinLeft: 'App Widget', pinRight: 'Wi-Fi Client', direction: 'both', color: '#34d399' },
      { label: 'Virtual Pin V1 State (0 / 1)', pinLeft: 'V1 Stream', pinRight: 'Handler', direction: 'right', color: '#38bdf8' },
    ],
    rightWires: [
      { label: 'D1 GPIO Asserted (3.3V)', pinLeft: 'D1 Out', pinRight: 'Anode', direction: 'right', color: '#60a5fa' },
      { label: 'GND Return Path', pinLeft: 'GND', pinRight: 'Cathode', direction: 'right', color: '#94a3b8' },
    ],
    flowCaption: 'Toggling the button on the Blynk mobile app sends Virtual Pin V1 state over the cloud to switch the physical LED on D1.',
  },

  22: {
    leftBlock: {
      title: 'LDR Sensor Module',
      subtitle: 'Light Divider Circuit',
      badge: 'ANALOG INPUT',
      pins: ['VCC: 3.3V Rail', 'A0: Analog Output Voltage', 'GND: Ground Bus'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Blynk Telemetry Client',
      badge: 'CONTROLLER',
      pins: ['Pin A0: ADC (0-1023)', 'BlynkTimer: 1000ms Loop', 'Blynk.virtualWrite(V2, val)'],
    },
    rightBlock: {
      title: 'Blynk App Gauge',
      subtitle: 'Mobile Visual Display',
      badge: 'MOBILE DASHBOARD',
      pins: ['Virtual Pin V2 Gauge Widget', 'Scale: 0 to 1023 (or %)', 'Real-time Ambient Plot'],
    },
    leftWires: [
      { label: 'LDR Analog Output ───> A0', pinLeft: 'A0 Out', pinRight: 'A0', direction: 'right', color: '#38bdf8' },
      { label: '3.3V & GND Power Bus', pinLeft: 'Power', pinRight: 'Rails', direction: 'left', color: '#fbbf24' },
    ],
    rightWires: [
      { label: 'Blynk.virtualWrite(V2, lux)', pinLeft: 'Wi-Fi', pinRight: 'Blynk Cloud', direction: 'right', color: '#34d399' },
      { label: 'Live Gauge Value Stream', pinLeft: 'V2 Data', pinRight: 'App Widget', direction: 'right', color: '#38bdf8' },
    ],
    flowCaption: 'ESP8266 samples LDR light levels on A0 every second and publishes real-time readings to Virtual Pin V2 in the Blynk App.',
  },

  23: {
    leftBlock: {
      title: 'Soil Sensor + Relay',
      subtitle: 'Moisture & Submersible Pump',
      badge: 'SENSOR & RELAY',
      pins: ['Soil Sensor -> Pin A0', '5V Relay IN -> Pin D1', 'VCC (3.3V/5V) & GND'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Irrigation Controller',
      badge: 'CONTROLLER',
      pins: ['A0: Moisture Level ADC', 'D1: GPIO5 (Relay Driver)', 'Blynk Cloud Protocol'],
    },
    rightBlock: {
      title: 'Water Pump & App',
      subtitle: 'Automated Irrigation',
      badge: 'ACTUATOR & CLOUD',
      pins: ['5V DC Water Pump Actuation', 'Blynk App: Moisture Gauge', 'Auto / Manual Pump Switch'],
    },
    leftWires: [
      { label: 'Moisture Analog Volts ──> A0', pinLeft: 'Sensor', pinRight: 'A0', direction: 'right', color: '#38bdf8' },
      { label: 'D1 Low-Level Trigger ──> Relay', pinLeft: 'Relay IN', pinRight: 'D1', direction: 'left', color: '#60a5fa' },
    ],
    rightWires: [
      { label: 'Relay Contacts ──> Pump Power', pinLeft: 'Relay', pinRight: 'Pump', direction: 'right', color: '#fbbf24' },
      { label: 'Blynk Cloud Telemetry & Alert', pinLeft: 'Wi-Fi', pinRight: 'Blynk App', direction: 'both', color: '#34d399' },
    ],
    flowCaption: 'When soil moisture drops below calibrated threshold, ESP8266 triggers the relay to run the irrigation pump and notifies Blynk.',
  },

  24: {
    leftBlock: {
      title: '2x IR Sensors',
      subtitle: 'Entry & Exit Detectors',
      badge: 'OPTICAL INPUTS',
      pins: ['Entry IR: Pin D1 (GPIO5)', 'Exit IR: Pin D2 (GPIO4)', 'SG90 Servo Motor: Pin D3', 'VCC (5V VIN) & GND'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Parking Counter SoC',
      badge: 'CONTROLLER',
      pins: ['D1: Entry Obstacle In', 'D2: Exit Obstacle In', 'D3: PWM Servo Gate Driver', 'Slot Count Variable'],
    },
    rightBlock: {
      title: 'Gate Servo & App',
      subtitle: 'Barrier & Live Slots',
      badge: 'ACTUATION & IOT',
      pins: ['SG90 Servo: 0° Closed / 90° Open', 'Blynk App: Free Slots Counter', 'PARKING FULL Warning State'],
    },
    leftWires: [
      { label: 'Entry Sensor ───> D1', pinLeft: 'Entry IR', pinRight: 'D1', direction: 'right', color: '#38bdf8' },
      { label: 'Exit Sensor ───> D2', pinLeft: 'Exit IR', pinRight: 'D2', direction: 'right', color: '#60a5fa' },
    ],
    rightWires: [
      { label: 'PWM Servo Arm ─── D3 (0°-90°)', pinLeft: 'D3 Out', pinRight: 'Servo Gate', direction: 'right', color: '#fbbf24' },
      { label: 'Blynk App Live Slot Display', pinLeft: 'Wi-Fi', pinRight: 'Blynk Cloud', direction: 'right', color: '#34d399' },
    ],
    flowCaption: 'Vehicles detected by entry/exit IR sensors update parking inventory; ESP8266 lifts the servo barrier and syncs slots to Blynk.',
  },

  25: {
    leftBlock: {
      title: 'HC-SR04 Ultrasonic',
      subtitle: 'Overhead Tank Gauge',
      badge: 'ACOUSTIC SENSOR',
      pins: ['VCC: 5V (NodeMCU VIN)', 'TRIG: Pin D1', 'ECHO: Pin D2 (Divider)', 'GND: Ground'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Embedded Web Server',
      badge: 'CONTROLLER & HTTP',
      pins: ['ESP8266WebServer (Port 80)', 'Time-of-Flight Computation', 'Dynamic HTML5 Generation'],
    },
    rightBlock: {
      title: 'Web Browser Client',
      subtitle: 'Responsive Web UI',
      badge: 'HTML5 DASHBOARD',
      pins: ['HTTP GET http://<ESP_IP>/', 'Real-time Water Tank SVG Graphic', 'Depth (cm) & Volume (%)'],
    },
    leftWires: [
      { label: '10µs TRIG Pulse <─── D1', pinLeft: 'TRIG', pinRight: 'D1', direction: 'left', color: '#60a5fa' },
      { label: 'ECHO Pulse (Divider) ──> D2', pinLeft: 'ECHO', pinRight: 'D2', direction: 'right', color: '#38bdf8' },
    ],
    rightWires: [
      { label: 'HTTP Port 80 Web Service', pinLeft: 'HTTP Server', pinRight: 'Browser', direction: 'both', color: '#38bdf8' },
      { label: 'Live HTML5 Water Level Gauge', pinLeft: 'HTML/CSS', pinRight: 'Dashboard', direction: 'right', color: '#34d399' },
    ],
    flowCaption: 'HC-SR04 measures water depth; NodeMCU hosts a standalone HTTP web server serving live HTML5 animated water level gauges.',
  },

  26: {
    leftBlock: {
      title: 'Web Browser Client',
      subtitle: 'Mobile / PC HTTP Client',
      badge: 'HTTP CLIENT',
      pins: ['Button: [Turn LED ON]', 'Button: [Turn LED OFF]', 'URL: http://192.168.4.1/'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'HTTP Server (Port 80)',
      badge: 'CONTROLLER',
      pins: ['Route: /led/on -> D1 HIGH', 'Route: /led/off -> D1 LOW', 'D1: GPIO5 (LED Driver)'],
    },
    rightBlock: {
      title: '5mm LED Actuator',
      subtitle: 'Physical Hardware',
      badge: 'ACTUATOR / LED',
      pins: ['D1 ──[220Ω]──> Anode (+)', 'Cathode (-) ─── GND', 'State Synchronized with UI'],
    },
    leftWires: [
      { label: 'HTTP GET /led/on & /off', pinLeft: 'Browser Click', pinRight: 'HTTP Server', direction: 'right', color: '#38bdf8' },
      { label: 'HTML Response Page & Status', pinLeft: 'GUI Update', pinRight: 'Web Page', direction: 'left', color: '#34d399' },
    ],
    rightWires: [
      { label: 'D1 GPIO Logic (3.3V / 0V)', pinLeft: 'D1 Out', pinRight: 'Anode', direction: 'right', color: '#60a5fa' },
      { label: 'GND Cathode Return', pinLeft: 'GND', pinRight: 'Cathode', direction: 'right', color: '#94a3b8' },
    ],
    flowCaption: 'Clicking ON/OFF buttons in a web browser issues HTTP requests to NodeMCU, toggling physical GPIO pin D1 and the connected LED.',
  },

  27: {
    leftBlock: {
      title: 'RC522 RFID Reader',
      subtitle: '13.56MHz SPI Transceiver',
      badge: 'RFID HARDWARE',
      pins: ['SDA: D4 | SCK: D5 | MOSI: D6', 'MISO: D7 | RST: D3', 'VCC: 3.3V | GND: Ground', 'RFID Smart Tag / Cards'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Attendance Server SoC',
      badge: 'CONTROLLER',
      pins: ['MFRC522 SPI Protocol Driver', 'D1: GPIO5 (Buzzer Beep)', 'ESP8266WebServer (Port 80)', 'Student Log Table Memory'],
    },
    rightBlock: {
      title: 'Attendance Web Page',
      subtitle: 'Live Attendance Records',
      badge: 'HTTP WEB PORTAL',
      pins: ['Live Web Table with Timestamp', 'Student Name & Card UID', 'Audible Confirmation Beep'],
    },
    leftWires: [
      { label: 'SPI Bus (D3-D7) ─── RC522', pinLeft: 'SPI Lines', pinRight: 'D3-D7', direction: 'both', color: '#38bdf8' },
      { label: '3.3V & GND Power Rails', pinLeft: 'Power', pinRight: 'Rails', direction: 'left', color: '#fbbf24' },
    ],
    rightWires: [
      { label: 'D1 ───> Buzzer Audio Beep', pinLeft: 'D1 Out', pinRight: 'Buzzer', direction: 'right', color: '#f59e0b' },
      { label: 'HTTP Portal Attendance Log', pinLeft: 'Web Server', pinRight: 'Portal', direction: 'right', color: '#34d399' },
    ],
    flowCaption: 'Scanning an RFID tag reads its unique UID over SPI; NodeMCU sounds a buzzer on D1 and appends the timestamp to a local web portal.',
  },

  28: {
    leftBlock: {
      title: 'DHT11 & 2-Ch Relay',
      subtitle: 'Sensors & AC Appliances',
      badge: 'SENSOR & RELAY',
      pins: ['DHT11 DATA: Pin D4', 'Relay 1: Pin D1 (Light)', 'Relay 2: Pin D2 (Fan)', 'VCC & GND Shared Rails'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Arduino IoT Cloud Thing',
      badge: 'CONTROLLER',
      pins: ['ArduinoCloud.update()', 'TLS Encrypted MQTT Broker', 'Bi-directional Property Sync'],
    },
    rightBlock: {
      title: 'Arduino IoT Cloud',
      subtitle: 'Official Web Dashboard',
      badge: 'IOT CLOUD HUB',
      pins: ['Cloud Switches (Light / Fan)', 'Temperature & Humidity Gauges', 'Historical Cloud Analytics'],
    },
    leftWires: [
      { label: 'DHT11 ─── D4 (Climate Bus)', pinLeft: 'DHT11', pinRight: 'D4', direction: 'both', color: '#38bdf8' },
      { label: 'D1 & D2 ───> Relay Coils', pinLeft: 'Relays', pinRight: 'D1/D2', direction: 'left', color: '#60a5fa' },
    ],
    rightWires: [
      { label: 'TLS Encrypted MQTT Stream', pinLeft: 'Wi-Fi', pinRight: 'Arduino Cloud', direction: 'both', color: '#0284c7' },
      { label: 'Interactive Dashboard Widgets', pinLeft: 'Props', pinRight: 'Switches', direction: 'both', color: '#30d158' },
    ],
    flowCaption: 'NodeMCU synchronizes variables with Arduino IoT Cloud over encrypted MQTT, displaying sensor gauges and switching relay loads.',
  },

  29: {
    leftBlock: {
      title: 'Amazon Alexa Echo',
      subtitle: 'Voice Assistant Device',
      badge: 'VOICE ASSISTANT',
      pins: ['"Alexa, turn on the lights"', 'Echo Dot / Mobile Alexa App', 'Cloud Voice Recognition'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Sinric Pro Voice Client',
      badge: 'CONTROLLER',
      pins: ['SinricPro.handle() Client', 'D1: GPIO5 (Relay Driver)', 'Wi-Fi 2.4GHz Connected'],
    },
    rightBlock: {
      title: 'AC Appliance Relay',
      subtitle: 'Isolated 230V Load',
      badge: 'HIGH VOLTAGE LOAD',
      pins: ['Optocoupler Isolated Relay', 'NO / COM Terminal Connections', '230V AC Home Light Bulb'],
    },
    leftWires: [
      { label: 'Voice Command ───> Alexa Cloud', pinLeft: 'Voice', pinRight: 'Alexa', direction: 'right', color: '#06b6d4' },
      { label: 'SinricPro Cloud Bridge', pinLeft: 'SinricPro', pinRight: 'ESP8266', direction: 'right', color: '#38bdf8' },
    ],
    rightWires: [
      { label: 'D1 Active LOW ───> Relay Coil', pinLeft: 'D1 Out', pinRight: 'Relay IN', direction: 'right', color: '#60a5fa' },
      { label: 'Relay Contacts Switch AC Load', pinLeft: 'NO/COM', pinRight: '230V Lamp', direction: 'right', color: '#f59e0b' },
    ],
    flowCaption: 'Spoken voice commands to Amazon Alexa route via Sinric Pro to NodeMCU, which actuates a relay to control AC home lighting.',
  },
};

/**
 * Fallback generator for generic or customized experiments
 */
function getFallbackDiagramData(
  title: string,
  category: string,
  apparatus: ApparatusItem[] = []
): ExperimentDiagramData {
  const external = apparatus.filter(
    (a) =>
      !a.name.toLowerCase().includes('nodemcu') &&
      !a.name.toLowerCase().includes('esp8266') &&
      !a.name.toLowerCase().includes('breadboard') &&
      !a.name.toLowerCase().includes('jumper')
  );

  const compName = external[0]?.name ? external[0].name.replace(/\(.*?\)/g, '').trim().slice(0, 18) : 'Input Sensor';
  const outName = external[1]?.name ? external[1].name.replace(/\(.*?\)/g, '').trim().slice(0, 18) : 'Serial Monitor';

  return {
    leftBlock: {
      title: compName,
      subtitle: 'Hardware Transducer',
      badge: 'INPUT DEVICE',
      pins: ['VCC: 3.3V / 5V Rail', 'DATA / OUT: Signal Pin', 'GND: Shared Ground Bus'],
    },
    centerBlock: {
      title: 'NodeMCU ESP8266',
      subtitle: 'Processing SoC',
      badge: 'CONTROLLER',
      pins: ['GPIO Pins (D1-D8)', 'Analog ADC Pin A0', 'Wi-Fi 802.11b/g/n & UART'],
    },
    rightBlock: {
      title: outName,
      subtitle: 'Output / Telemetry Hub',
      badge: 'OUTPUT / CLOUD',
      pins: ['Processed Data Output', 'Control State Feedback', 'Verified Operation'],
    },
    leftWires: [
      { label: 'Signal Wire ───> GPIO/ADC', pinLeft: 'OUT', pinRight: 'GPIO', direction: 'right', color: '#38bdf8' },
      { label: '3.3V & GND Power Rails', pinLeft: 'Power', pinRight: 'Rails', direction: 'left', color: '#fbbf24' },
    ],
    rightWires: [
      { label: 'Processed Output Data', pinLeft: 'Data', pinRight: 'System', direction: 'right', color: '#34d399' },
      { label: 'Telemetry & Control Bus', pinLeft: 'Bus', pinRight: 'Feedback', direction: 'right', color: '#60a5fa' },
    ],
    flowCaption: `Digital circuit block architecture for ${title || category}`,
  };
}

export const PencilSketchDiagram = ({
  apparatus = [],
  category = '',
  title = '',
  expNo,
  className = 'w-full h-full',
}: PencilSketchDiagramProps) => {
  // Retrieve experiment-specific diagram definition
  const data: ExperimentDiagramData =
    (expNo && EXPERIMENT_DIAGRAM_REGISTRY[expNo]) ||
    getFallbackDiagramData(title, category, apparatus);

  // SVG Geometry Constants
  const svgWidth = 740;
  const svgHeight = 220;

  // Block Box Dimensions
  const boxW = 186;
  const boxH = 118;
  const boxY = 46;

  const box1X = 20;               // Left Component Box
  const box2X = 277;              // Center NodeMCU ESP8266 Box
  const box3X = 534;              // Right Output / Cloud Box

  // Wires coordinates
  const wire1StartX = box1X + boxW;
  const wire1EndX = box2X;
  const wire2StartX = box2X + boxW;
  const wire2EndX = box3X;

  const wireY1 = boxY + 36;
  const wireY2 = boxY + 76;

  return (
    <div className={`w-full overflow-hidden select-none ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto block select-none"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dark Glass Slate Canvas Background */}
        <rect width={svgWidth} height={svgHeight} fill="#111115" rx="16" />
        <rect
          width={svgWidth}
          height={svgHeight}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1.2"
          rx="16"
        />

        {/* Subtle Technical Blueprint Grid */}
        <defs>
          <pattern id={`sketch-grid-${expNo || 'gen'}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width={svgWidth} height={svgHeight} fill={`url(#sketch-grid-${expNo || 'gen'})`} rx="16" />

        {/* Top Header Annotations */}
        <text
          x="24"
          y="28"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
          fontSize="9.5"
          fontWeight="bold"
          letterSpacing="1.2"
          fill="#38bdf8"
        >
          ✏️ SCHEMATIC BLOCK DIAGRAM // CIRCUIT ARCHITECTURE
        </text>

        {expNo && (
          <text
            x={svgWidth - 24}
            y="28"
            textAnchor="end"
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            fontSize="9.5"
            fontWeight="bold"
            fill="#a1a1aa"
          >
            EXP #{String(expNo).padStart(2, '0')}
          </text>
        )}

        {/* ========================================================= */}
        {/* BOX 1: LEFT COMPONENT / SENSOR                           */}
        {/* ========================================================= */}
        <path
          d={makeSketchRect(box1X, boxY, boxW, boxH, (expNo || 1) * 3 + 1)}
          fill="rgba(255, 255, 255, 0.03)"
          stroke="#d4d4d8"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Left Badge */}
        <rect
          x={box1X + 10}
          y={boxY + 10}
          width={boxW - 20}
          height="16"
          rx="4"
          fill="rgba(255, 255, 255, 0.06)"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="0.8"
        />
        <text
          x={box1X + boxW / 2}
          y={boxY + 21.5}
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="8"
          fontWeight="bold"
          letterSpacing="0.8"
          fill="#cbd5e1"
        >
          {data.leftBlock.badge}
        </text>

        {/* Left Title & Subtitle */}
        <text
          x={box1X + boxW / 2}
          y={boxY + 44}
          textAnchor="middle"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
          fontSize="12.5"
          fontWeight="bold"
          fill="#f8fafc"
        >
          {data.leftBlock.title}
        </text>
        <text
          x={box1X + boxW / 2}
          y={boxY + 58}
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="8.5"
          fill="#94a3b8"
        >
          {data.leftBlock.subtitle}
        </text>

        {/* Left Pins Divider */}
        <line
          x1={box1X + 12}
          y1={boxY + 66}
          x2={box1X + boxW - 12}
          y2={boxY + 66}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          strokeDasharray="3 2"
        />

        {/* Left Pins Listing */}
        {data.leftBlock.pins.slice(0, 3).map((pin, i) => (
          <text
            key={i}
            x={box1X + 14}
            y={boxY + 79 + i * 12.5}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fontSize="8"
            fill="#cbd5e1"
          >
            • {pin}
          </text>
        ))}

        {/* ========================================================= */}
        {/* CONNECTION WIRES: BOX 1 -> BOX 2                         */}
        {/* ========================================================= */}
        {data.leftWires.slice(0, 2).map((wire, idx) => {
          const wireY = idx === 0 ? wireY1 : wireY2;
          const arrowColor = wire.color || '#38bdf8';
          return (
            <g key={idx}>
              <path
                d={makeSketchArrow(wire1StartX, wireY, wire1EndX, wireY, (expNo || 1) * 5 + idx, wire.direction || 'right')}
                fill="none"
                stroke={arrowColor}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Wire Label pill */}
              <text
                x={(wire1StartX + wire1EndX) / 2}
                y={wireY - 6}
                textAnchor="middle"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fontSize="7.5"
                fontWeight="bold"
                fill="#f1f5f9"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
              >
                {wire.label}
              </text>
            </g>
          );
        })}

        {/* ========================================================= */}
        {/* BOX 2: CENTER NODEMCU ESP8266 / CONTROLLER               */}
        {/* ========================================================= */}
        <path
          d={makeSketchRect(box2X, boxY - 3, boxW, boxH + 6, (expNo || 1) * 3 + 2)}
          fill="rgba(10, 132, 255, 0.08)"
          stroke="#0a84ff"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Center Badge */}
        <rect
          x={box2X + 10}
          y={boxY + 8}
          width={boxW - 20}
          height="16"
          rx="4"
          fill="rgba(10, 132, 255, 0.18)"
          stroke="rgba(10, 132, 255, 0.35)"
          strokeWidth="0.8"
        />
        <text
          x={box2X + boxW / 2}
          y={boxY + 19.5}
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="8"
          fontWeight="bold"
          letterSpacing="0.8"
          fill="#93c5fd"
        >
          {data.centerBlock.badge}
        </text>

        {/* Center Title & Subtitle */}
        <text
          x={box2X + boxW / 2}
          y={boxY + 43}
          textAnchor="middle"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
          fontSize="13"
          fontWeight="bold"
          fill="#ffffff"
        >
          {data.centerBlock.title}
        </text>
        <text
          x={box2X + boxW / 2}
          y={boxY + 57}
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="8.5"
          fill="#38bdf8"
        >
          {data.centerBlock.subtitle}
        </text>

        {/* Center Pins Divider */}
        <line
          x1={box2X + 12}
          y1={boxY + 66}
          x2={box2X + boxW - 12}
          y2={boxY + 66}
          stroke="rgba(10, 132, 255, 0.25)"
          strokeWidth="1"
          strokeDasharray="3 2"
        />

        {/* Center Pins Listing */}
        {data.centerBlock.pins.slice(0, 3).map((pin, i) => (
          <text
            key={i}
            x={box2X + 14}
            y={boxY + 80 + i * 13}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fontSize="8"
            fontWeight="bold"
            fill="#e0f2fe"
          >
            ▸ {pin}
          </text>
        ))}

        {/* ========================================================= */}
        {/* CONNECTION WIRES: BOX 2 -> BOX 3                         */}
        {/* ========================================================= */}
        {data.rightWires.slice(0, 2).map((wire, idx) => {
          const wireY = idx === 0 ? wireY1 : wireY2;
          const arrowColor = wire.color || '#34d399';
          return (
            <g key={idx}>
              <path
                d={makeSketchArrow(wire2StartX, wireY, wire2EndX, wireY, (expNo || 1) * 7 + idx, wire.direction || 'right')}
                fill="none"
                stroke={arrowColor}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Wire Label pill */}
              <text
                x={(wire2StartX + wire2EndX) / 2}
                y={wireY - 6}
                textAnchor="middle"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fontSize="7.5"
                fontWeight="bold"
                fill="#f1f5f9"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
              >
                {wire.label}
              </text>
            </g>
          );
        })}

        {/* ========================================================= */}
        {/* BOX 3: RIGHT OUTPUT / ACTUATOR / CLOUD                   */}
        {/* ========================================================= */}
        <path
          d={makeSketchRect(box3X, boxY, boxW, boxH, (expNo || 1) * 3 + 3)}
          fill="rgba(255, 255, 255, 0.03)"
          stroke="#d4d4d8"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Badge */}
        <rect
          x={box3X + 10}
          y={boxY + 10}
          width={boxW - 20}
          height="16"
          rx="4"
          fill="rgba(255, 255, 255, 0.06)"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth="0.8"
        />
        <text
          x={box3X + boxW / 2}
          y={boxY + 21.5}
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="8"
          fontWeight="bold"
          letterSpacing="0.8"
          fill="#cbd5e1"
        >
          {data.rightBlock.badge}
        </text>

        {/* Right Title & Subtitle */}
        <text
          x={box3X + boxW / 2}
          y={boxY + 44}
          textAnchor="middle"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
          fontSize="12.5"
          fontWeight="bold"
          fill="#f8fafc"
        >
          {data.rightBlock.title}
        </text>
        <text
          x={box3X + boxW / 2}
          y={boxY + 58}
          textAnchor="middle"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="8.5"
          fill="#94a3b8"
        >
          {data.rightBlock.subtitle}
        </text>

        {/* Right Pins Divider */}
        <line
          x1={box3X + 12}
          y1={boxY + 66}
          x2={box3X + boxW - 12}
          y2={boxY + 66}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          strokeDasharray="3 2"
        />

        {/* Right Pins Listing */}
        {data.rightBlock.pins.slice(0, 3).map((pin, i) => (
          <text
            key={i}
            x={box3X + 14}
            y={boxY + 79 + i * 12.5}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
            fontSize="8"
            fill="#cbd5e1"
          >
            • {pin}
          </text>
        ))}

        {/* ========================================================= */}
        {/* BOTTOM FOOTER: DATA PIPELINE SUMMARY                     */}
        {/* ========================================================= */}
        <rect
          x="20"
          y={svgHeight - 34}
          width={svgWidth - 40}
          height="22"
          rx="6"
          fill="rgba(255, 255, 255, 0.03)"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="0.8"
        />
        <text
          x="30"
          y={svgHeight - 20}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
          fontSize="8"
          fill="#94a3b8"
        >
          <tspan fill="#38bdf8" fontWeight="bold">FLOW PIPELINE: </tspan>
          {data.flowCaption}
        </text>
      </svg>
    </div>
  );
};
