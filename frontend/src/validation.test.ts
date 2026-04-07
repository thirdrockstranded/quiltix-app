import { describe, it, expect } from 'vitest';
import { validateFileType, validateFileSize, checkResolution } from './validation';
import { MAX_FILE_SIZE_MB, LOW_RES_THRESHOLD_PX } from './constants';

function makeFile(name: string, type: string, sizeBytes: number): File {
  const content = new Uint8Array(sizeBytes);
  return new File([content], name, { type });
}

describe('validateFileType', () => {
  it('accepts image/jpeg', () => {
    const result = validateFileType(makeFile('photo.jpg', 'image/jpeg', 100));
    expect(result.valid).toBe(true);
  });

  it('accepts image/png', () => {
    const result = validateFileType(makeFile('photo.png', 'image/png', 100));
    expect(result.valid).toBe(true);
  });

  it('accepts image/webp', () => {
    const result = validateFileType(makeFile('photo.webp', 'image/webp', 100));
    expect(result.valid).toBe(true);
  });

  it('rejects image/gif with the correct error message', () => {
    const result = validateFileType(makeFile('anim.gif', 'image/gif', 100));
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Accepted formats: JPEG, PNG, WEBP');
  });

  it('rejects application/pdf with the correct error message', () => {
    const result = validateFileType(makeFile('doc.pdf', 'application/pdf', 100));
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Accepted formats: JPEG, PNG, WEBP');
  });
});

describe('validateFileSize', () => {
  it('accepts a file exactly at the limit', () => {
    const exactly10MB = MAX_FILE_SIZE_MB * 1024 * 1024;
    const result = validateFileSize(makeFile('photo.jpg', 'image/jpeg', exactly10MB));
    expect(result.valid).toBe(true);
  });

  it('accepts a file below the limit', () => {
    const result = validateFileSize(makeFile('photo.jpg', 'image/jpeg', 1024));
    expect(result.valid).toBe(true);
  });

  it('rejects a file one byte over the limit', () => {
    const oneByteover = MAX_FILE_SIZE_MB * 1024 * 1024 + 1;
    const result = validateFileSize(makeFile('photo.jpg', 'image/jpeg', oneByteover));
    expect(result.valid).toBe(false);
    expect(result.error).toContain('10MB');
  });
});

describe('checkResolution', () => {
  it('returns null when both dimensions meet the threshold', () => {
    const warning = checkResolution(LOW_RES_THRESHOLD_PX, LOW_RES_THRESHOLD_PX);
    expect(warning).toBeNull();
  });

  it('returns null for high-resolution images', () => {
    const warning = checkResolution(1920, 1080);
    expect(warning).toBeNull();
  });

  it('returns warning when width is below threshold', () => {
    const warning = checkResolution(LOW_RES_THRESHOLD_PX - 1, 1000);
    expect(warning).toBe('This image is low resolution — pattern quality may be affected');
  });

  it('returns warning when height is below threshold', () => {
    const warning = checkResolution(1000, LOW_RES_THRESHOLD_PX - 1);
    expect(warning).toBe('This image is low resolution — pattern quality may be affected');
  });

  it('returns warning when both dimensions are below threshold', () => {
    const warning = checkResolution(100, 100);
    expect(warning).toBe('This image is low resolution — pattern quality may be affected');
  });
});
