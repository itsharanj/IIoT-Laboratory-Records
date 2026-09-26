import { useMemo } from 'react';
import { ApparatusItem } from '../types/experiment';

interface ThingSpeakFlowDiagramProps {
  title?: string;
  apparatus?: ApparatusItem[];
  expNo?: number;
  className?: string;
}

interface FlowStep {
  label: string;
  sub: string;
  badge: string;
  accent: string;
}

export const ThingSpeakFlowDiagram = ({
  title = '',
  apparatus = [],
  expNo,
  className = '',
}: ThingSpeakFlowDiagramProps) => {
  const flowSteps: FlowStep[] = useMemo(() => {
    const t = title.toLowerCase();
    const appNames = apparatus.map((a) => a.name.toLowerCase()).join(' ');

    // 1. LM35 Temperature Sensor (Exp 6, 11 or similar)
    if (t.includes('lm35') || appNames.includes('lm35') || expNo === 11) {
      return [
        { label: 'LM35 Sensor', sub: 'Analog (10mV/°C)', badge: 'INPUT', accent: '#f59e0b' },
        { label: 'NodeMCU ESP8266', sub: '10-bit ADC Pin A0', badge: 'CONTROLLER', accent: '#0a84ff' },
        { label: 'Temp Calculation', sub: 'ADC * 0.32 / Formula', badge: 'PROCESSING', accent: '#38bdf8' },
        { label: 'Wi-Fi 2.4GHz', sub: 'IEEE 802.11 b/g/n', badge: 'TRANSPORT', accent: '#a855f7' },
        { label: 'ThingSpeak Cloud', sub: 'REST API via HTTP', badge: 'IOT CLOUD', accent: '#0284c7' },
        { label: 'Channel / Field 1', sub: 'Field 1: Temp (°C)', badge: 'DATA STORAGE', accent: '#30d158' },
        { label: 'Temperature Graph', sub: 'Live Telemetry Chart', badge: 'MONITORING', accent: '#34d399' },
      ];
    }

    // 2. DHT11 Sensor (Exp 8 or similar)
    if (t.includes('dht11') || appNames.includes('dht11') || expNo === 8) {
      return [
        { label: 'DHT11 Sensor', sub: 'Temp & Humidity', badge: 'INPUT', accent: '#06b6d4' },
        { label: 'NodeMCU ESP8266', sub: 'GPIO Digital Bus', badge: 'CONTROLLER', accent: '#0a84ff' },
        { label: 'Telemetry Processing', sub: 'Extract T(°C) & RH(%)', badge: 'PROCESSING', accent: '#38bdf8' },
        { label: 'Wi-Fi 2.4GHz', sub: 'REST HTTP Client', badge: 'TRANSPORT', accent: '#a855f7' },
        { label: 'ThingSpeak Cloud', sub: 'MathWorks IoT Engine', badge: 'IOT CLOUD', accent: '#0284c7' },
        { label: 'Field 1 & Field 2', sub: 'Fields: Temp & RH', badge: 'DATA STORAGE', accent: '#30d158' },
        { label: 'Dual Telemetry Graph', sub: 'Continuous Cloud Plot', badge: 'MONITORING', accent: '#34d399' },
      ];
    }

    // 3. LDR Sensor (Exp 9 or similar)
    if (t.includes('ldr') || appNames.includes('ldr') || t.includes('light') || expNo === 9) {
      return [
        { label: 'LDR Photoresistor', sub: 'Optical Divider', badge: 'INPUT', accent: '#eab308' },
        { label: 'NodeMCU ESP8266', sub: 'Analog Pin A0', badge: 'CONTROLLER', accent: '#0a84ff' },
        { label: 'Illumination Compute', sub: 'Raw ADC → Lux / %', badge: 'PROCESSING', accent: '#38bdf8' },
        { label: 'Wi-Fi 2.4GHz', sub: 'TCP/IP HTTP Stack', badge: 'TRANSPORT', accent: '#a855f7' },
        { label: 'ThingSpeak Cloud', sub: 'Write API Key Auth', badge: 'IOT CLOUD', accent: '#0284c7' },
        { label: 'Field 1 (Lux)', sub: 'Optical Stream', badge: 'DATA STORAGE', accent: '#30d158' },
        { label: 'Illumination Graph', sub: 'Real-Time Trend', badge: 'MONITORING', accent: '#34d399' },
      ];
    }

    // 4. Ultrasonic Sensor / Water Level (Exp 10 or similar)
    if (t.includes('ultrasonic') || appNames.includes('ultrasonic') || t.includes('distance') || t.includes('water level') || expNo === 10) {
      return [
        { label: 'Ultrasonic HC-SR04', sub: '40kHz Transceiver', badge: 'INPUT', accent: '#6366f1' },
        { label: 'NodeMCU ESP8266', sub: 'Trig / Echo Pins', badge: 'CONTROLLER', accent: '#0a84ff' },
        { label: 'Distance Calculation', sub: 'ToF * Speed / 2', badge: 'PROCESSING', accent: '#38bdf8' },
        { label: 'Wi-Fi 2.4GHz', sub: 'HTTP JSON / URL Payload', badge: 'TRANSPORT', accent: '#a855f7' },
        { label: 'ThingSpeak Cloud', sub: 'Channel Ingestion', badge: 'IOT CLOUD', accent: '#0284c7' },
        { label: 'Field 1 (Distance cm)', sub: 'Reservoir Level', badge: 'DATA STORAGE', accent: '#30d158' },
        { label: 'Level Telemetry Graph', sub: 'Depth Inventory Plot', badge: 'MONITORING', accent: '#34d399' },
      ];
    }

    // 5. Soil Moisture Sensor
    if (t.includes('soil') || appNames.includes('soil') || t.includes('moisture')) {
      return [
        { label: 'Soil Moisture Sensor', sub: 'Conductive Probes', badge: 'INPUT', accent: '#84cc16' },
        { label: 'NodeMCU ESP8266', sub: 'Analog Pin A0', badge: 'CONTROLLER', accent: '#0a84ff' },
        { label: 'Moisture Data Calc', sub: 'Volumetric Water %', badge: 'PROCESSING', accent: '#38bdf8' },
        { label: 'Wi-Fi 2.4GHz', sub: 'Periodic Sync (15s)', badge: 'TRANSPORT', accent: '#a855f7' },
        { label: 'ThingSpeak Cloud', sub: 'Telemetry Broker', badge: 'IOT CLOUD', accent: '#0284c7' },
        { label: 'Field 1 (Moisture)', sub: 'Irrigation Channel', badge: 'DATA STORAGE', accent: '#30d158' },
        { label: 'Monitoring Graph', sub: 'Soil Saturation Plot', badge: 'MONITORING', accent: '#34d399' },
      ];
    }

    // 6. Colour Sorting / Colour Sensor
    if (t.includes('colour') || t.includes('color') || appNames.includes('tcs3200') || appNames.includes('color')) {
      return [
        { label: 'Colour Sensor', sub: 'TCS3200 Photodiode', badge: 'INPUT', accent: '#ec4899' },
        { label: 'NodeMCU ESP8266', sub: 'Frequency Scaler', badge: 'CONTROLLER', accent: '#0a84ff' },
        { label: 'Colour Detection', sub: 'RGB Filter Parsing', badge: 'PROCESSING', accent: '#38bdf8' },
        { label: 'Wi-Fi 2.4GHz', sub: 'Wireless Upload', badge: 'TRANSPORT', accent: '#a855f7' },
        { label: 'ThingSpeak Cloud', sub: 'Spectral Channel', badge: 'IOT CLOUD', accent: '#0284c7' },
        { label: 'Fields 1-3 (R,G,B)', sub: 'Chromatic Values', badge: 'DATA STORAGE', accent: '#30d158' },
        { label: 'Data Monitoring', sub: 'Color Sorting Log', badge: 'MONITORING', accent: '#34d399' },
      ];
    }

    // 7. Weather Station
    if (t.includes('weather') || appNames.includes('bmp') || appNames.includes('bme')) {
      return [
        { label: 'Weather Sensors', sub: 'Multi-Sensor Array', badge: 'INPUT', accent: '#0ea5e9' },
        { label: 'NodeMCU ESP8266', sub: 'I2C / SPI Master', badge: 'CONTROLLER', accent: '#0a84ff' },
        { label: 'Weather Data Calc', sub: 'Pressure, Temp, Baro', badge: 'PROCESSING', accent: '#38bdf8' },
        { label: 'Wi-Fi 2.4GHz', sub: 'Weather Station Uplink', badge: 'TRANSPORT', accent: '#a855f7' },
        { label: 'ThingSpeak Cloud', sub: 'Meteorological Channel', badge: 'IOT CLOUD', accent: '#0284c7' },
        { label: 'Fields 1-4', sub: 'Atmospheric Feeds', badge: 'DATA STORAGE', accent: '#30d158' },
        { label: 'Weather Dashboard', sub: 'Live Climate Gauges', badge: 'MONITORING', accent: '#34d399' },
      ];
    }

    // Default ThingSpeak Flow
    return [
      { label: 'IoT Sensor', sub: 'Physical Transducer', badge: 'INPUT', accent: '#f59e0b' },
      { label: 'NodeMCU ESP8266', sub: 'Microcontroller SoC', badge: 'CONTROLLER', accent: '#0a84ff' },
      { label: 'Data Processing', sub: 'Sampling & Formatting', badge: 'PROCESSING', accent: '#38bdf8' },
      { label: 'Wi-Fi Network', sub: '802.11 b/g/n Hotspot', badge: 'TRANSPORT', accent: '#a855f7' },
      { label: 'ThingSpeak Cloud', sub: 'HTTP REST API', badge: 'IOT CLOUD', accent: '#0284c7' },
      { label: 'Channel / Field', sub: 'Field Data Storage', badge: 'DATA STORAGE', accent: '#30d158' },
      { label: 'Graph / Monitoring', sub: 'Cloud Analytics Visual', badge: 'MONITORING', accent: '#34d399' },
    ];
  }, [title, apparatus, expNo]);

  // Diagram SVG Geometry (7-step pipeline across standard viewbox)
  const totalSteps = flowSteps.length;
  const viewBoxWidth = 860;
  const viewBoxHeight = 160;

  const nodeWidth = 96;
  const nodeHeight = 58;
  const startX = 22;
  const spacing = (viewBoxWidth - startX * 2 - nodeWidth) / (totalSteps - 1);
  const nodeY = 48;

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      {/* SVG Container with horizontal scroll fallback for tiny mobile screens */}
      <div className="w-full overflow-x-auto py-1 scrollbar-thin">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full min-w-[700px] h-auto select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="ts-blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" />
            </pattern>

            {/* Linear Gradients for Flow Nodes */}
            <linearGradient id="cloud-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0a84ff" stopOpacity="0.12" />
            </linearGradient>

            {/* Arrow Marker */}
            <marker
              id="ts-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0ea5e9" />
            </marker>
          </defs>

          {/* Background Canvas */}
          <rect width={viewBoxWidth} height={viewBoxHeight} fill="#0d1117" rx="14" />
          <rect width={viewBoxWidth} height={viewBoxHeight} fill="url(#ts-blueprint-grid)" rx="14" />
          <rect
            width={viewBoxWidth}
            height={viewBoxHeight}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            rx="14"
          />

          {/* Flow Diagram Header Badge */}
          <g transform="translate(24, 16)">
            <rect width="180" height="18" rx="9" fill="rgba(2, 132, 199, 0.18)" stroke="#0284c7" strokeWidth="0.8" />
            <circle cx="10" cy="9" r="3.5" fill="#38bdf8" />
            <text x="20" y="12.5" fill="#e0f2fe" fontSize="9" fontWeight="bold" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">
              THINGSPEAK IOT DATA PIPELINE
            </text>
          </g>

          <g transform={`translate(${viewBoxWidth - 190}, 16)`}>
            <text x="0" y="12.5" fill="#71717a" fontSize="8.5" fontFamily="monospace, Courier, sans-serif">
              Live REST Telemetry Flow
            </text>
          </g>

          {/* Connectors / Flow Lines between steps */}
          {flowSteps.slice(0, totalSteps - 1).map((_, i) => {
            const x1 = startX + i * spacing + nodeWidth;
            const x2 = startX + (i + 1) * spacing;
            const y = nodeY + nodeHeight / 2;

            return (
              <g key={`arrow-${i}`}>
                {/* Connecting Line */}
                <line
                  x1={x1 + 2}
                  y1={y}
                  x2={x2 - 2}
                  y2={y}
                  stroke="#0284c7"
                  strokeWidth="1.8"
                  strokeDasharray="4,2"
                  markerEnd="url(#ts-arrow)"
                />
              </g>
            );
          })}

          {/* Step Nodes */}
          {flowSteps.map((step, idx) => {
            const x = startX + idx * spacing;
            const y = nodeY;

            return (
              <g key={`node-${idx}`} transform={`translate(${x}, ${y})`}>
                {/* Box Card */}
                <rect
                  width={nodeWidth}
                  height={nodeHeight}
                  rx="10"
                  fill="rgba(18, 24, 38, 0.85)"
                  stroke={step.accent}
                  strokeWidth="1.2"
                />

                {/* Header Tag / Badge */}
                <rect
                  x="6"
                  y="6"
                  width={nodeWidth - 12}
                  height="12"
                  rx="4"
                  fill={`${step.accent}20`}
                />
                <text
                  x={nodeWidth / 2}
                  y="15"
                  textAnchor="middle"
                  fill={step.accent}
                  fontSize="7"
                  fontWeight="bold"
                  fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
                >
                  {step.badge}
                </text>

                {/* Primary Label */}
                <text
                  x={nodeWidth / 2}
                  y="33"
                  textAnchor="middle"
                  fill="#f5f5f7"
                  fontSize="8.5"
                  fontWeight="bold"
                  fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
                >
                  {step.label.length > 15 ? `${step.label.substring(0, 14)}…` : step.label}
                </text>

                {/* Secondary Subtitle */}
                <text
                  x={nodeWidth / 2}
                  y="46"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="7"
                  fontFamily="monospace, Courier, sans-serif"
                >
                  {step.sub.length > 16 ? `${step.sub.substring(0, 15)}…` : step.sub}
                </text>
              </g>
            );
          })}

          {/* Footer Flow Indicator Bar */}
          <g transform={`translate(${startX}, 128)`}>
            <rect
              width={viewBoxWidth - startX * 2}
              height="20"
              rx="6"
              fill="rgba(255, 255, 255, 0.03)"
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="0.8"
            />
            <text
              x={(viewBoxWidth - startX * 2) / 2}
              y="13.5"
              textAnchor="middle"
              fill="#64748b"
              fontSize="8"
              fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
            >
              {flowSteps.map((s) => s.label).join('  →  ')}
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
};
