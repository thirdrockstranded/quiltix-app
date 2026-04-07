import { describe, it, expect } from 'vitest';
import {
  isEvenlyDivisible,
  getValidBlockSizes,
  calculateGridDimensions,
  calculateCutSize,
} from './quilting';

describe('isEvenlyDivisible', () => {
  it('returns true when dimension is evenly divisible by block size', () => {
    expect(isEvenlyDivisible(60, 4)).toBe(true);
    expect(isEvenlyDivisible(60, 3)).toBe(true);
    expect(isEvenlyDivisible(60, 2)).toBe(true);
    expect(isEvenlyDivisible(60, 1)).toBe(true);
  });

  it('returns true for fractional block sizes that divide evenly', () => {
    expect(isEvenlyDivisible(60, 1.5)).toBe(true);
    expect(isEvenlyDivisible(60, 2.5)).toBe(true);
  });

  it('returns false when dimension is not evenly divisible', () => {
    expect(isEvenlyDivisible(37, 4)).toBe(false);
    expect(isEvenlyDivisible(37, 3)).toBe(false);
    expect(isEvenlyDivisible(37, 2.5)).toBe(false);
  });

  it('returns false for zero block size', () => {
    expect(isEvenlyDivisible(60, 0)).toBe(false);
  });
});

describe('getValidBlockSizes', () => {
  it('returns common sizes that divide evenly into both dimensions', () => {
    // 60×80: 60/1.5=40✓ but 80/1.5=53.33✗ → 1.5 invalid
    //        60/2.5=24✓ and 80/2.5=32✓ → 2.5 valid
    //        60/3=20✓ but 80/3=26.67✗ → 3 invalid
    const result = getValidBlockSizes(60, 80);
    expect(result).toContain(1);
    expect(result).toContain(2);
    expect(result).toContain(2.5);
    expect(result).toContain(4);
    expect(result).not.toContain(1.5);
    expect(result).not.toContain(3);
  });

  it('returns all common sizes when all divide evenly', () => {
    // 60×60: 60/1=60✓, 60/1.5=40✓, 60/2=30✓, 60/2.5=24✓, 60/3=20✓, 60/4=15✓
    const result = getValidBlockSizes(60, 60);
    expect(result).toEqual([1, 1.5, 2, 2.5, 3, 4]);
  });

  it('returns empty array when no common sizes divide evenly', () => {
    // 37.5×53.5: non-integer dimensions where none of the 6 common sizes produce whole-number grids
    // 37.5/1=37.5✗, 37.5/1.5=25 but 53.5/1.5=35.67✗, 37.5/2=18.75✗,
    // 37.5/2.5=15 but 53.5/2.5=21.4✗, 37.5/3=12.5✗, 37.5/4=9.375✗
    const result = getValidBlockSizes(37.5, 53.5);
    expect(result).toEqual([]);
  });

  it('returns sizes that divide evenly into both width and height', () => {
    // 48×36: 48/4=12✓, 36/4=9✓ → 4 valid; 48/2.5=19.2✗ → 2.5 not valid
    const result = getValidBlockSizes(48, 36);
    expect(result).toContain(1);
    expect(result).toContain(2);
    expect(result).toContain(3);
    expect(result).toContain(4);
    expect(result).not.toContain(2.5);
  });

  it('handles square quilt with 1" block size always valid', () => {
    const result = getValidBlockSizes(10, 10);
    expect(result).toContain(1);
    expect(result).toContain(2);
  });
});

describe('calculateGridDimensions', () => {
  it('calculates correct columns and rows', () => {
    expect(calculateGridDimensions(60, 80, 2)).toEqual({ columns: 30, rows: 40 });
    expect(calculateGridDimensions(48, 36, 4)).toEqual({ columns: 12, rows: 9 });
    expect(calculateGridDimensions(60, 60, 1.5)).toEqual({ columns: 40, rows: 40 });
  });

  it('handles 1" block size producing large grids', () => {
    expect(calculateGridDimensions(60, 80, 1)).toEqual({ columns: 60, rows: 80 });
  });
});

describe('calculateCutSize', () => {
  it('adds seam allowance to both sides of block', () => {
    expect(calculateCutSize(2, 0.25)).toBeCloseTo(2.5);
    expect(calculateCutSize(3, 0.25)).toBeCloseTo(3.5);
    expect(calculateCutSize(4, 0.25)).toBeCloseTo(4.5);
  });

  it('uses custom seam allowance correctly', () => {
    expect(calculateCutSize(2, 0.5)).toBeCloseTo(3.0);
    expect(calculateCutSize(2, 0.375)).toBeCloseTo(2.75);
  });

  it('works with 1.5" block and default seam allowance', () => {
    expect(calculateCutSize(1.5, 0.25)).toBeCloseTo(2.0);
  });
});
