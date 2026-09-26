import { Experiment } from '../../types/experiment';
import { SECTION_1_EXPERIMENTS } from './section1_basicSensors';
import { SECTION_2_EXPERIMENTS } from './section2_thingspeak';
import { SECTION_3_EXPERIMENTS } from './section3_packetTracer';
import { SECTION_4_EXPERIMENTS } from './section4_blynk';
import { SECTION_5_EXPERIMENTS } from './section5_webServer';
import { SECTION_6_EXPERIMENTS } from './section6_arduinoIotCloud';

export * from './section1_basicSensors';
export * from './section2_thingspeak';
export * from './section3_packetTracer';
export * from './section4_blynk';
export * from './section5_webServer';
export * from './section6_arduinoIotCloud';

/**
 * Single Source of Truth: All 29 Official IIoT Experiments in Exact Specified Sequence
 */
export const INITIAL_EXPERIMENTS: Experiment[] = [
  ...SECTION_1_EXPERIMENTS,
  ...SECTION_2_EXPERIMENTS,
  ...SECTION_3_EXPERIMENTS,
  ...SECTION_4_EXPERIMENTS,
  ...SECTION_5_EXPERIMENTS,
  ...SECTION_6_EXPERIMENTS,
];

export const EXPERIMENTS_DATA: Experiment[] = INITIAL_EXPERIMENTS;
export const EXPERIMENTS: Experiment[] = INITIAL_EXPERIMENTS;
