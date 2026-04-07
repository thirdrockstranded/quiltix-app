import { test, expect } from '@playwright/test';

// Minimal valid 1x1 white PNG (67 bytes). Width and height are both 1px,
// which is below LOW_RES_THRESHOLD_PX (300), so it will trigger the low-res warning.
const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==';

function tinyPngBuffer(): Buffer {
  return Buffer.from(TINY_PNG_BASE64, 'base64');
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('test_file_picker_opens_and_accepts_image (AC-01)', async ({ page }) => {
  const input = page.getByTestId('file-input');
  await expect(input).toBeVisible();
  await expect(input).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp');
});

test('test_mobile_camera_capture_option_available (AC-02)', async ({ page }) => {
  const input = page.getByTestId('file-input');
  // The capture attribute enables native camera on mobile browsers.
  // We assert it is present in the HTML; actual camera UI is not testable in Playwright.
  await expect(input).toHaveAttribute('capture');
});

test('test_unsupported_file_type_rejected (AC-03)', async ({ page }) => {
  const input = page.getByTestId('file-input');
  await input.setInputFiles({
    name: 'anim.gif',
    mimeType: 'image/gif',
    buffer: Buffer.from('GIF89a'),
  });
  const error = page.getByTestId('error-message');
  await expect(error).toBeVisible();
  await expect(error).toContainText('Accepted formats: JPEG, PNG, WEBP');
});

test('test_file_exceeding_10mb_rejected (AC-04)', async ({ page }) => {
  const input = page.getByTestId('file-input');
  // 10MB + 1 byte
  const oversizedBuffer = Buffer.alloc(10 * 1024 * 1024 + 1, 0);
  await input.setInputFiles({
    name: 'big.jpg',
    mimeType: 'image/jpeg',
    buffer: oversizedBuffer,
  });
  const error = page.getByTestId('error-message');
  await expect(error).toBeVisible();
  await expect(error).toContainText('10MB');
});

test('test_image_preview_renders_constrained (AC-05)', async ({ page }) => {
  const input = page.getByTestId('file-input');
  await input.setInputFiles({
    name: 'photo.png',
    mimeType: 'image/png',
    buffer: tinyPngBuffer(),
  });
  const preview = page.getByTestId('preview-image');
  await expect(preview).toBeVisible();
  // Assert the max-width constraint is applied via inline style
  const maxWidth = await preview.evaluate((el) => (el as HTMLImageElement).style.maxWidth);
  expect(maxWidth).toBe('400px');
});

test('test_low_res_warning_displayed_below_threshold (AC-06)', async ({ page }) => {
  const input = page.getByTestId('file-input');
  // The 1x1 PNG is below the 300px threshold — warning must appear
  await input.setInputFiles({
    name: 'tiny.png',
    mimeType: 'image/png',
    buffer: tinyPngBuffer(),
  });
  const warning = page.getByTestId('warning-message');
  await expect(warning).toBeVisible();
  await expect(warning).toContainText('This image is low resolution — pattern quality may be affected');
  // Continue button must still be enabled (non-blocking warning)
  const continueBtn = page.getByTestId('continue-button');
  await expect(continueBtn).toBeVisible();
  await expect(continueBtn).toBeEnabled();
});

test('test_continue_button_visible_after_valid_upload (AC-07)', async ({ page }) => {
  const input = page.getByTestId('file-input');
  await input.setInputFiles({
    name: 'photo.png',
    mimeType: 'image/png',
    buffer: tinyPngBuffer(),
  });
  const continueBtn = page.getByTestId('continue-button');
  await expect(continueBtn).toBeVisible();
  await expect(continueBtn).toBeEnabled();
  await expect(continueBtn).toHaveText('Continue');
});
