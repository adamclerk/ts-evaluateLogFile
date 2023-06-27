import { describe } from '@jest/globals';
import {
  minimumDistanceForAllToQuality,
  minimumPercentDistanceForAllToQuality,
  minimumStdDevAndDistanceToQuality,
} from './evaluators';

describe('evaluators: minimumDistance', () => {
  it('should return true if any value is within the distance', () => {
    const evaluator = minimumDistanceForAllToQuality({
      lte: { value: 1, quality: 'keep' },
      gt: { value: 1, quality: 'discard' },
    });
    expect(evaluator([1, 2, 3], 2)).toBe('keep');
  });

  it('should return false if any value is outside the distance', () => {
    const evaluator = minimumDistanceForAllToQuality({
      lte: { value: 1, quality: 'keep' },
      gt: { value: 1, quality: 'discard' },
    });
    expect(evaluator([1, 2, 3], 4)).toBe('discard');
  });
});

describe('evaluators: minimumPercentDistance', () => {
  it('should return true if any value is within the percent distance', () => {
    const evaluator = minimumPercentDistanceForAllToQuality({
      lte: { value: 1, quality: 'keep' },
      gt: { value: 1, quality: 'discard' },
    });
    expect(evaluator([99, 100, 101], 100)).toBe('keep');
  });

  it('should return false if any value is outside the percent distance', () => {
    const evaluator = minimumPercentDistanceForAllToQuality({
      lte: { value: 1, quality: 'keep' },
      gt: { value: 1, quality: 'discard' },
    });
    expect(evaluator([99, 100, 101], 50)).toBe('discard');
  });
});

describe('evaluators: minimumStdDevAndDistance', () => {
  it('should return "ultra precise" if all values are within the distance and stdDev', () => {
    const evaluator = minimumStdDevAndDistanceToQuality(0.5, {
      range: { 3: 'ultra precise', 5: 'very precise' },
      default: 'precise',
    });
    expect(evaluator([69.5, 70.1, 71.3, 71.5, 69.8], 70)).toBe('ultra precise');
  });

  it('should return "very precise" if all values are within the distance and stdDev', () => {
    const evaluator = minimumStdDevAndDistanceToQuality(0.5, {
      range: { 0.8: 'ultra precise', 3: 'very precise' },
      default: 'precise',
    });
    expect(evaluator([69.5, 70.1, 71.3, 71.5, 69.8], 70)).toBe('very precise');
  });
});
