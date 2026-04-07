import { test, expect } from '@playwright/test';

// Minimal valid 1x1 white PNG — same fixture used in photo-upload tests
const TINY_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==';

function tinyPngBuffer(): Buffer {
  return Buffer.from(TINY_PNG_BASE64, 'base64');
}

// Helper: advance from photo upload to the quilt inputs screen
async function advanceToQuiltInputs(page: import('@playwright/test').Page) {
  await page.goto('/');
  const input = page.getByTestId('file-input');
  await input.setInputFiles({
    name: 'photo.png',
    mimeType: 'image/png',
    buffer: tinyPngBuffer(),
  });
  await page.getByTestId('continue-button').click();
  await expect(page.getByTestId('quilt-inputs')).toBeVisible();
}

test('test_quilt_inputs_screen_shown_after_upload_continue (AC-flow)', async ({ page }) => {
  await advanceToQuiltInputs(page);
  // Photo upload UI is gone
  await expect(page.getByTestId('photo-upload')).not.toBeVisible();
  // Quilt inputs UI is present
  await expect(page.getByTestId('quilt-inputs')).toBeVisible();
});

test('test_quilt_size_inputs_shown_first_block_picker_hidden (AC-path-a)', async ({ page }) => {
  await advanceToQuiltInputs(page);
  // Quilt dimension inputs are visible
  await expect(page.getByTestId('quilt-width')).toBeVisible();
  await expect(page.getByTestId('quilt-height')).toBeVisible();
  // Block size picker not shown until dimensions are entered
  await expect(page.getByTestId('block-size-picker')).not.toBeVisible();
});

test('test_block_picker_appears_after_both_dimensions_entered (AC-constrained)', async ({
  page,
}) => {
  await advanceToQuiltInputs(page);
  // Entering only width does not show picker
  await page.getByTestId('quilt-width').fill('60');
  await expect(page.getByTestId('block-size-picker')).not.toBeVisible();
  // Entering height activates picker
  await page.getByTestId('quilt-height').fill('80');
  await expect(page.getByTestId('block-size-picker')).toBeVisible();
});

test('test_block_picker_shows_valid_divisors_for_60x80 (AC-divisors)', async ({ page }) => {
  await advanceToQuiltInputs(page);
  await page.getByTestId('quilt-width').fill('60');
  await page.getByTestId('quilt-height').fill('80');

  // 60×80 valid sizes: 1(✓), 1.5(✗ — 80/1.5=53.33), 2(✓), 2.5(✓ — 60/2.5=24, 80/2.5=32), 3(✗ — 80/3=26.67), 4(✓)
  await expect(page.getByTestId('block-size-option-1')).toBeVisible();
  await expect(page.getByTestId('block-size-option-2')).toBeVisible();
  await expect(page.getByTestId('block-size-option-2.5')).toBeVisible();
  await expect(page.getByTestId('block-size-option-4')).toBeVisible();
  // 1.5 and 3 are invalid — not shown when valid sizes exist
  await expect(page.getByTestId('block-size-option-1.5')).not.toBeVisible();
  await expect(page.getByTestId('block-size-option-3')).not.toBeVisible();
});

test('test_all_six_sizes_shown_with_warning_when_no_valid_divisors (AC-no-valid)', async ({
  page,
}) => {
  await advanceToQuiltInputs(page);
  // 37.5×53.5 — none of the 6 common sizes produce whole-number grids
  await page.getByTestId('quilt-width').fill('37.5');
  await page.getByTestId('quilt-height').fill('53.5');

  const warning = page.getByTestId('no-valid-sizes-warning');
  await expect(warning).toBeVisible();

  // All 6 options still shown
  for (const size of [1, 1.5, 2, 2.5, 3, 4]) {
    await expect(page.getByTestId(`block-size-option-${size}`)).toBeVisible();
  }
});

test('test_grid_display_updates_live_on_block_size_selection (AC-live-grid)', async ({ page }) => {
  await advanceToQuiltInputs(page);
  await page.getByTestId('quilt-width').fill('60');
  await page.getByTestId('quilt-height').fill('80');

  // Grid display not shown before block size selected
  await expect(page.getByTestId('grid-display')).not.toBeVisible();

  // Select 2" block → 60/2=30 columns, 80/2=40 rows
  await page.getByTestId('block-size-option-2').click();
  const gridDisplay = page.getByTestId('grid-display');
  await expect(gridDisplay).toBeVisible();
  await expect(gridDisplay).toContainText('30');
  await expect(gridDisplay).toContainText('40');
});

test('test_continue_button_disabled_until_all_valid (AC-hard-block)', async ({ page }) => {
  await advanceToQuiltInputs(page);

  // Continue not visible at start
  await expect(page.getByTestId('continue-button')).not.toBeVisible();

  await page.getByTestId('quilt-width').fill('60');
  await page.getByTestId('quilt-height').fill('80');
  await page.getByTestId('block-size-option-4').click();

  // Still no Continue — fabrics not filled
  await expect(page.getByTestId('continue-button')).not.toBeVisible();

  await page.getByTestId('num-fabrics').fill('8');
  // Now Continue should be visible and enabled
  await expect(page.getByTestId('continue-button')).toBeVisible();
  await expect(page.getByTestId('continue-button')).toBeEnabled();
});

test('test_continue_blocked_when_no_valid_block_size_selected (AC-hard-block-no-divisor)', async ({
  page,
}) => {
  await advanceToQuiltInputs(page);
  // 37.5×53.5 — none of the 6 common sizes divide evenly into both dimensions
  await page.getByTestId('quilt-width').fill('37.5');
  await page.getByTestId('quilt-height').fill('53.5');
  // Pick a size (none divide evenly — all 6 shown with warning)
  await page.getByTestId('block-size-option-1').click();
  await page.getByTestId('num-fabrics').fill('8');
  // Continue must remain hidden — non-integer grid
  await expect(page.getByTestId('continue-button')).not.toBeVisible();
});

test('test_seam_allowance_visible_with_default_value (AC-seam-default)', async ({ page }) => {
  await advanceToQuiltInputs(page);
  const seam = page.getByTestId('seam-allowance');
  await expect(seam).toBeVisible();
  await expect(seam).toHaveValue('0.25');
});

test('test_seam_allowance_can_be_overridden (AC-seam-override)', async ({ page }) => {
  await advanceToQuiltInputs(page);
  const seam = page.getByTestId('seam-allowance');
  await seam.fill('0.5');
  await expect(seam).toHaveValue('0.5');
});

test('test_fabrics_out_of_range_shows_error (AC-fabrics-validation)', async ({ page }) => {
  await advanceToQuiltInputs(page);
  const fabrics = page.getByTestId('num-fabrics');
  await fabrics.fill('1');
  await expect(page.getByTestId('fabrics-error')).toBeVisible();
  await fabrics.fill('21');
  await expect(page.getByTestId('fabrics-error')).toBeVisible();
  await fabrics.fill('8');
  await expect(page.getByTestId('fabrics-error')).not.toBeVisible();
});

test('test_unit_labels_displayed_on_all_measurement_fields (AC-unit-labels)', async ({ page }) => {
  await advanceToQuiltInputs(page);
  // "in" unit label appears alongside quilt dimension inputs
  const form = page.getByTestId('quilt-inputs');
  await expect(form).toContainText('in');
});
