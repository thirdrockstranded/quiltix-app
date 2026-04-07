import { COMMON_BLOCK_SIZES_IN, Unit } from './constants';

export interface Measurement {
  value: number;
  unit: Unit;
}

export interface GridDimensions {
  columns: number;
  rows: number;
}

export interface QuiltInputs {
  widthIn: number;
  heightIn: number;
  blockSizeIn: number;
  numFabrics: number;
  seamAllowanceIn: number;
  unit: Unit;
}

export interface DerivedQuiltValues {
  grid: GridDimensions;
  cutSizeIn: number;
  unit: Unit;
}

const EPSILON = 1e-9;

function isWholeNumber(value: number): boolean {
  return Math.abs(value - Math.round(value)) < EPSILON;
}

export function isEvenlyDivisible(dimension: number, blockSize: number): boolean {
  if (blockSize <= 0) return false;
  return isWholeNumber(dimension / blockSize);
}

export function getValidBlockSizes(widthIn: number, heightIn: number): number[] {
  return COMMON_BLOCK_SIZES_IN.filter(
    (size) => isEvenlyDivisible(widthIn, size) && isEvenlyDivisible(heightIn, size)
  );
}

export function calculateGridDimensions(
  widthIn: number,
  heightIn: number,
  blockSizeIn: number
): GridDimensions {
  return {
    columns: Math.round(widthIn / blockSizeIn),
    rows: Math.round(heightIn / blockSizeIn),
  };
}

export function calculateCutSize(blockSizeIn: number, seamAllowanceIn: number): number {
  return blockSizeIn + seamAllowanceIn * 2;
}

export function derivedValues(inputs: QuiltInputs): DerivedQuiltValues {
  return {
    grid: calculateGridDimensions(inputs.widthIn, inputs.heightIn, inputs.blockSizeIn),
    cutSizeIn: calculateCutSize(inputs.blockSizeIn, inputs.seamAllowanceIn),
    unit: inputs.unit,
  };
}
