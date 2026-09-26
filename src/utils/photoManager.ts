import { Experiment, ExperimentImage, PhotoItem } from '../types/experiment';

export interface NormalizedPhoto {
  url: string;
  title: string;
  caption?: string;
  type?: string;
}

/**
 * Standard mapping of experiments to local photo filenames in public/images/experiments/
 * Supports canonical filenames (single-led, scrolling-led, etc.), case-insensitive variations,
 * and exp-XX.jpg identifiers.
 */
export const EXPERIMENT_PHOTO_MAPPINGS: Record<
  number,
  {
    title: string;
    caption: string;
    candidates: string[];
  }
> = {
  1: {
    title: 'Single LED Hardware Setup',
    caption: 'NodeMCU ESP8266 breadboard circuit with single LED connected to GPIO pin.',
    candidates: [
      '/images/experiments/SINGLELED.jpeg',
      '/images/experiments/single-led.jpg',
      '/images/experiments/single-led.jpeg',
      '/images/experiments/SINGLELED.jpg',
      '/images/experiments/single_led.jpg',
      '/images/experiments/single_led.jpeg',
      '/images/experiments/exp-01.jpg',
      '/images/experiments/exp-01.jpeg',
      '/images/experiments/exp-01-led.jpg',
    ],
  },
  2: {
    title: 'Scrolling LED Hardware Setup',
    caption: 'NodeMCU ESP8266 breadboard circuit with 3 sequential LEDs for chaser display.',
    candidates: [
      '/images/experiments/SCROLLINGLED.jpeg',
      '/images/experiments/scrolling-led.jpg',
      '/images/experiments/scrolling-led.jpeg',
      '/images/experiments/SCROLLINGLED.jpg',
      '/images/experiments/scrolling_led.jpg',
      '/images/experiments/scrolling_led.jpeg',
      '/images/experiments/exp-02.jpg',
      '/images/experiments/exp-02.jpeg',
    ],
  },
  3: {
    title: 'Pushbutton + LED Hardware Setup',
    caption: 'Tactile pushbutton switch with pull-up resistor and indicator LED on breadboard.',
    candidates: [
      '/images/experiments/PUSHBUTTONLED.jpeg',
      '/images/experiments/pushbutton-led.jpg',
      '/images/experiments/pushbutton-led.jpeg',
      '/images/experiments/PUSHBUTTONLED.jpg',
      '/images/experiments/pushbutton_led.jpg',
      '/images/experiments/pushbutton.jpg',
      '/images/experiments/exp-03.jpg',
      '/images/experiments/exp-03.jpeg',
    ],
  },
  5: {
    title: 'Buzzer Tone Melody Hardware Setup',
    caption: 'Piezo buzzer module interfaced to NodeMCU for acoustic tone synthesis.',
    candidates: [
      '/images/experiments/TONEMELODY.jpeg',
      '/images/experiments/tone-melody.jpg',
      '/images/experiments/tone-melody.jpeg',
      '/images/experiments/TONEMELODY.jpg',
      '/images/experiments/buzzer.jpg',
      '/images/experiments/buzzer.jpeg',
      '/images/experiments/tone_melody.jpg',
      '/images/experiments/exp-05.jpg',
      '/images/experiments/exp-05.jpeg',
    ],
  },
  6: {
    title: 'LM35 Temperature Sensor Hardware Setup',
    caption: 'Precision LM35 analog temperature sensor connected to ADC pin A0.',
    candidates: [
      '/images/experiments/LM35.jpeg',
      '/images/experiments/lm35.jpg',
      '/images/experiments/lm35.jpeg',
      '/images/experiments/LM35.jpg',
      '/images/experiments/lm35-sensor.jpg',
      '/images/experiments/exp-06.jpg',
      '/images/experiments/exp-06.jpeg',
    ],
  },
  7: {
    title: 'DHT11 Temperature & Humidity Hardware Setup',
    caption: 'DHT11 composite digital environmental sensor connected to GPIO pin.',
    candidates: [
      '/images/experiments/DHt11.jpeg',
      '/images/experiments/dht11.jpg',
      '/images/experiments/dht11.jpeg',
      '/images/experiments/DHT11.jpeg',
      '/images/experiments/DHT11.jpg',
      '/images/experiments/dht11-sensor.jpg',
      '/images/experiments/exp-07.jpg',
      '/images/experiments/exp-07.jpeg',
    ],
  },
  8: {
    title: 'Flame Sensor Hardware Setup',
    caption: 'Infrared flame phototransistor sensor module with alert buzzer and indicator LED.',
    candidates: [
      '/images/experiments/FLAMESENSOR.jpeg',
      '/images/experiments/flame-sensor.jpg',
      '/images/experiments/flame-sensor.jpeg',
      '/images/experiments/FLAMESENSOR.jpg',
      '/images/experiments/flame_sensor.jpg',
      '/images/experiments/flame.jpg',
      '/images/experiments/exp-08.jpg',
      '/images/experiments/exp-08.jpeg',
    ],
  },
  9: {
    title: 'Ultrasonic Distance Measurement Hardware Setup',
    caption: 'HC-SR04 ultrasonic transducer module interfaced to NodeMCU TRIG and ECHO pins.',
    candidates: [
      '/images/experiments/ULTRASONICSENSOR.jpg',
      '/images/experiments/ultrasonic.jpg',
      '/images/experiments/ultrasonic.jpeg',
      '/images/experiments/ULTRASONICSENSOR.jpeg',
      '/images/experiments/ultrasonic-sensor.jpg',
      '/images/experiments/exp-09.jpg',
      '/images/experiments/exp-09.jpeg',
    ],
  },
  11: {
    // Exp 11: Same LM35 hardware photo as Exp 6
    title: 'LM35 Hardware Setup (ThingSpeak IoT)',
    caption: 'LM35 temperature sensor hardware setup transmitting telemetry to ThingSpeak cloud.',
    candidates: [
      '/images/experiments/LM35.jpeg',
      '/images/experiments/lm35.jpg',
      '/images/experiments/lm35.jpeg',
      '/images/experiments/LM35.jpg',
      '/images/experiments/lm35-sensor.jpg',
      '/images/experiments/exp-06.jpg',
      '/images/experiments/exp-06.jpeg',
    ],
  },
  12: {
    // Exp 12: Same DHT11 hardware photo as Exp 7
    title: 'DHT11 Hardware Setup (ThingSpeak IoT)',
    caption: 'DHT11 sensor hardware setup sending temperature and humidity telemetry to ThingSpeak.',
    candidates: [
      '/images/experiments/DHt11.jpeg',
      '/images/experiments/dht11.jpg',
      '/images/experiments/dht11.jpeg',
      '/images/experiments/DHT11.jpeg',
      '/images/experiments/DHT11.jpg',
      '/images/experiments/dht11-sensor.jpg',
      '/images/experiments/exp-07.jpg',
      '/images/experiments/exp-07.jpeg',
    ],
  },
  13: {
    // Exp 13: Same Ultrasonic hardware photo as Exp 9
    title: 'Ultrasonic Distance Hardware Setup (ThingSpeak IoT)',
    caption: 'Ultrasonic sensor setup streaming distance telemetry to ThingSpeak IoT channel.',
    candidates: [
      '/images/experiments/ULTRASONICSENSOR.jpg',
      '/images/experiments/ultrasonic.jpg',
      '/images/experiments/ultrasonic.jpeg',
      '/images/experiments/ULTRASONICSENSOR.jpeg',
      '/images/experiments/ultrasonic-sensor.jpg',
      '/images/experiments/exp-09.jpg',
      '/images/experiments/exp-09.jpeg',
    ],
  },
};

/**
 * Cache for verified image URLs (true = loaded, false = missing/404)
 */
const imageAvailabilityCache = new Map<string, boolean>();

/**
 * Checks if an image file is actually reachable on the server, avoiding broken image icons
 */
export function checkImageExists(url: string): Promise<boolean> {
  if (!url) return Promise.resolve(false);
  if (imageAvailabilityCache.has(url)) {
    return Promise.resolve(imageAvailabilityCache.get(url)!);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageAvailabilityCache.set(url, true);
      resolve(true);
    };
    img.onerror = () => {
      imageAvailabilityCache.set(url, false);
      resolve(false);
    };
    img.src = url;
  });
}

/**
 * Resolves available photos for an experiment.
 * 1. If experiment.images has items, checks and returns verified ones.
 * 2. If experiment.images is empty, tests mapped candidate files in public/images/experiments/.
 * 3. Returns only existing, verified photos. If none exist, returns an empty array [].
 */
export async function resolveExperimentPhotos(
  experiment: Experiment
): Promise<NormalizedPhoto[]> {
  // These experiments intentionally have no material photo. Do not fall back
  // to legacy static images when their explicit image list is empty.
  if ([11].includes(experiment.expNo)) return [];

  // If experiment.images is provided explicitly
  if (experiment.images && experiment.images.length > 0) {
    const checked = await Promise.all(
      experiment.images.map(async (item, idx) => {
        const url = typeof item === 'string' ? item : item.url;
        const exists = await checkImageExists(url);
        if (!exists) return null;

        const defaultTitle =
          typeof item === 'string'
            ? experiment.images.length > 1
              ? `${experiment.title} — Photo ${idx + 1}`
              : `${experiment.title} — Hardware Setup`
            : item.title || `${experiment.title} — Photo`;

        const caption =
          typeof item === 'string'
            ? `Hardware breadboard and sensor interfacing setup verified for ${experiment.title}.`
            : item.caption;

        const photo: NormalizedPhoto = {
          url,
          title: defaultTitle,
          caption,
          type: 'photo',
        };
        return photo;
      })
    );

    const valid: NormalizedPhoto[] = checked.filter(
      (p): p is NormalizedPhoto => p !== null
    );
    if (valid.length > 0) return valid;
  }

  // Check mapping in EXPERIMENT_PHOTO_MAPPINGS for automatic file detection
  const mapping = EXPERIMENT_PHOTO_MAPPINGS[experiment.expNo];
  if (mapping) {
    for (const candidateUrl of mapping.candidates) {
      const exists = await checkImageExists(candidateUrl);
      if (exists) {
        return [
          {
            url: candidateUrl,
            title: mapping.title,
            caption: mapping.caption,
            type: 'photo',
          },
        ];
      }
    }
  }

  // If no photo exists on disk / server, return empty array so image section remains hidden
  return [];
}

/**
 * Formats photos for the ExperimentPhotosModal
 */
export function getExperimentPhotoItems(
  experiment: Experiment,
  availablePhotos: NormalizedPhoto[]
): PhotoItem[] {
  if (experiment.photos && experiment.photos.length > 0) {
    return experiment.photos;
  }

  return availablePhotos.map((photo) => ({
    title: photo.title,
    image: photo.url,
    downloadUrl: photo.url,
    description: photo.caption,
    category: 'Hardware Setup',
  }));
}
