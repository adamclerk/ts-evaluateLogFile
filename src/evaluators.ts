import * as ss from 'simple-statistics';

interface minimumDistanceToQualityParams {
  lte: {
    value: number;
    quality: string;
  };
  gt: {
    value: number;
    quality: string;
  };
}

export const minimumDistanceForAllToQuality =
  (params: minimumDistanceToQualityParams) =>
  (values: number[], knownValue: number): string => {
    const maxDistance = Math.max(...values.map((value) => Math.abs(value - knownValue)));
    if (maxDistance <= params.lte.value) {
      return params.lte.quality;
    } else {
      return params.gt.quality;
    }
  };

export const minimumPercentDistanceForAllToQuality =
  (params: minimumDistanceToQualityParams) =>
  (values: number[], knownValue: number): string => {
    const maxPercentDistance = Math.max(
      ...values.map((value) => Math.abs(value - knownValue) / knownValue)
    );
    if (maxPercentDistance <= params.lte.value) {
      return params.lte.quality;
    } else {
      return params.gt.quality;
    }
  };

interface minimumStdDevToQualityParams {
  range: { [key: number]: string };
  default: string;
}

export const minimumStdDevAndDistanceToQuality =
  (minimumDistance: number, params: minimumStdDevToQualityParams) =>
  (values: number[], knownValue: number): string => {
    const meanValue = ss.mean(values);
    if (Math.abs(meanValue - knownValue) > minimumDistance) {
      return 'precise';
    }

    const stdDevReading = ss.standardDeviation(values);
    const stdDevValues = Object.keys(params.range).map((key) => Number(key));
    const stdDevKey = stdDevValues.find((value) => {
      return stdDevReading < value;
    });
    if (stdDevKey === undefined) {
      return params.default;
    }
    return params.range[stdDevKey];
  };
