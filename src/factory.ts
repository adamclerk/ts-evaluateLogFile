import { Device } from './devices';
import {
  minimumDistanceForAllToQuality,
  minimumPercentDistanceForAllToQuality,
  minimumStdDevAndDistanceToQuality,
} from './evaluators';
import { CONSTANTS } from './const';

export interface IDevice {
  name: string;
  getQuality(): string;
  addValue(value: number): void;
}

export interface IReferenceValues {
  temperature: number;
  humidity: number;
  monoxide: number;
}

export class DeviceFactory {
  constructor(public type: string, public name: string) {}
  static isDeviceLine(line: string): boolean {
    return (
      line.includes(CONSTANTS.THERMOMETER) ||
      line.includes(CONSTANTS.HUMIDITY) ||
      line.includes(CONSTANTS.MONOXIDE)
    );
  }

  static createDevice(type: string, name: string, referenceValues: IReferenceValues): IDevice {
    if (type === CONSTANTS.THERMOMETER) {
      return new Device(
        name,
        type,
        minimumStdDevAndDistanceToQuality(0.5, {
          range: { 3: CONSTANTS.ULTRA_PRECISE, 5: CONSTANTS.VERY_PRECISE },
          default: CONSTANTS.PRECISE,
        }),
        referenceValues.temperature
      );
    } else if (type === CONSTANTS.HUMIDITY) {
      return new Device(
        name,
        type,
        minimumPercentDistanceForAllToQuality({
          lte: { value: 0.01, quality: CONSTANTS.KEEP },
          gt: { value: 0.01, quality: CONSTANTS.DISCARD },
        }),
        referenceValues.humidity
      );
    } else if (type === CONSTANTS.MONOXIDE) {
      return new Device(
        name,
        type,
        minimumDistanceForAllToQuality({
          lte: { value: 3, quality: CONSTANTS.KEEP },
          gt: { value: 3, quality: CONSTANTS.DISCARD },
        }),
        referenceValues.monoxide
      );
    }
    throw new Error('Invalid device type');
  }
}
