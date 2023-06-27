import { IDevice } from './factory';

export class Device implements IDevice {
  private values: number[] = [];
  constructor(
    public name: string,
    public type: string,
    private qualityEvaluator: (values: number[], knownValue: number) => string,
    private referenceValue: number
  ) {}

  public addValue(value: number) {
    this.values.push(value);
  }

  public getQuality(): string {
    return this.qualityEvaluator(this.values, this.referenceValue);
  }
}
