/**
 * Experiment data model for IIoT Laboratory Record
 */

export interface ApparatusItem {
  slNo?: number;
  name: string;
  specs: string;
  quantity: string;
}

export interface ExperimentImage {
  url: string;
  title?: string;
  caption?: string;
  type?: 'schematic' | 'circuit' | 'pinout' | 'photo';
}

export type ExperimentImageItem = string | ExperimentImage;

export interface PhotoItem {
  title: string;
  image: string;
  downloadUrl?: string;
  description?: string;
  category?: string;
}

export interface ExperimentContent {
  title?: string;
  category?: string;
  categoryShort?: string;
  aim?: string;
  theory?: string;
  procedure?: string;
  connections?: string[];
  conclusion?: string;
  softwareComponents?: string[];
  codeLanguage?: string;
  codeFilename?: string;
  tutorialVideoUrl?: string;
  output?: {
    type?: 'image' | 'video' | 'terminal' | 'waveform';
    mediaUrl?: string;
    terminalLog?: string;
    caption?: string;
  };
}

export interface ExperimentSettings {
  cautionEnabled?: boolean;
  cautionMessage?: string;
  showHardwarePhoto?: boolean;
  showSerialMonitor?: boolean;
  showThingSpeakDashboard?: boolean;
  showOutputPhoto?: boolean;
}

export interface Experiment {
  id: string; // e.g., 'exp-01'
  expNo: number; // e.g., 1
  title: string;
  category: string;
  categoryShort: string;
  aim: string;
  apparatus: ApparatusItem[];
  procedure: string;
  theory?: string;
  connections?: string[];
  images: (string | ExperimentImage)[];
  photos?: PhotoItem[];
  code: string;
  codeLanguage?: string;
  codeFilename?: string;
  output: {
    type: 'image' | 'video' | 'terminal' | 'waveform';
    mediaUrl?: string;
    terminalLog?: string;
    caption: string;
  };
  conclusion: string;
  softwareComponents?: string[];
  tutorialVideoUrl?: string;
  settings?: ExperimentSettings;
}
