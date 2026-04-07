import { ACCEPTED_MIME_TYPES, LOW_RES_THRESHOLD_PX, MAX_FILE_SIZE_MB } from './constants';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileType(file: File): ValidationResult {
  if ((ACCEPTED_MIME_TYPES as readonly string[]).includes(file.type)) {
    return { valid: true };
  }
  return { valid: false, error: 'Accepted formats: JPEG, PNG, WEBP' };
}

export function validateFileSize(file: File): ValidationResult {
  const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
  if (file.size <= maxBytes) {
    return { valid: true };
  }
  return { valid: false, error: `File exceeds the ${MAX_FILE_SIZE_MB}MB limit` };
}

export function checkResolution(width: number, height: number): string | null {
  if (width < LOW_RES_THRESHOLD_PX || height < LOW_RES_THRESHOLD_PX) {
    return 'This image is low resolution — pattern quality may be affected';
  }
  return null;
}
