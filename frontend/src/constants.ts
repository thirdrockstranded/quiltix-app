export const MAX_FILE_SIZE_MB = 10;
export const LOW_RES_THRESHOLD_PX = 300;
export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const COMMON_BLOCK_SIZES_IN = [1, 1.5, 2, 2.5, 3, 4] as const;
export const DEFAULT_SEAM_ALLOWANCE_IN = 0.25;
export const NUM_FABRICS_MIN = 2;
export const NUM_FABRICS_MAX = 20;
export const DEFAULT_UNIT = 'in' as const;

export type Unit = 'in' | 'cm';
