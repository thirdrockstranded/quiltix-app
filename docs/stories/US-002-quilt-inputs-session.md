# US-002 Session Document — Quilt Inputs

## What Was Built

A sequential quilt input form (Path A: quilt size first) that constrains block size selection based on the user's entered dimensions, displays live grid and cut size calculations, and hard-blocks Continue until a valid combination is selected.

### Files Created

**Frontend (`frontend/src/`)**
- `quilting.ts` — Pure functions: `isEvenlyDivisible`, `getValidBlockSizes`, `calculateGridDimensions`, `calculateCutSize`, `derivedValues`; exports `Measurement`, `GridDimensions`, `QuiltInputs`, `DerivedQuiltValues` interfaces
- `quilting.test.ts` — 14 Vitest unit tests covering all calculation functions and edge cases
- `components/QuiltInputs.tsx` — Main form component: quilt dimensions, constrained block size picker, live grid display, fabrics input, seam allowance field, unit labels throughout

**E2E Tests (`tests/e2e/`)**
- `quilt-inputs.spec.ts` — 12 Playwright tests covering the full sequential flow, AC by AC

### Files Modified

| File | Change |
|---|---|
| `frontend/src/constants.ts` | Added `COMMON_BLOCK_SIZES_IN`, `DEFAULT_SEAM_ALLOWANCE_IN`, `NUM_FABRICS_MIN`, `NUM_FABRICS_MAX`, `DEFAULT_UNIT`, `Unit` type |
| `frontend/src/components/PhotoUpload.tsx` | Added `onContinue: (file: File) => void` prop; replaced `console.log` in `handleContinue` with `onContinue(file)` call |
| `frontend/src/App.tsx` | Added `step` state (`'upload' | 'inputs'`), `photo` state; renders `<QuiltInputs>` after Continue; passes `handleUploadContinue` callback to `<PhotoUpload>` |

---

## Assumptions Made

- **Photo is required before accessing the quilt inputs screen.** No direct URL or refresh recovery to the inputs form. Refreshing the browser resets to photo upload. This is consistent with the single-page, no-router architecture from US-001.
- **Block size picker shows only valid sizes when at least one valid size exists.** When validBlockSizes.length > 0, only those sizes are rendered — invalid sizes are not shown at all. When validBlockSizes.length === 0, all 6 are shown with a warning.
- **The "no valid sizes" scenario only arises with non-integer quilt dimensions.** Since 1" always divides evenly into any whole-number dimension (e.g., 37/1=37), an empty valid-sizes list only occurs when the user enters fractional dimensions (e.g., 37.5 × 53.5). Test cases and e2e scenarios were updated to reflect this mathematical reality.
- **Continue button is hidden (not just disabled) when prerequisites are unmet.** The button is rendered conditionally on `canContinue`, not rendered disabled. This is slightly more aggressive than "disabled" but prevents any ambiguity about whether the form is submittable.
- **`handleContinue` logs to console.** No backend endpoint exists yet — US-003 will wire the quantization call. The logged payload includes all inputs with the `unit: 'in'` field.
- **Unit label rendered via `aria-hidden` spans alongside inputs, not as placeholder text.** Placeholders vanish on focus and are not accessible. Inline spans are visible at all times.

---

## Test Results

### Unit Tests (Vitest — `quilting.test.ts`)

```
✓ src/quilting.test.ts (14 tests) 10ms
✓ src/validation.test.ts (13 tests) 24ms

Test Files  2 passed (2)
     Tests  27 passed (27)
```

### E2E Tests (Playwright)

```
Running 21 tests using 3 workers

  ✓ smoke.spec.ts:3:5 › frontend loads without error
  ✓ smoke.spec.ts:8:5 › backend health check is reachable
  ✓ photo-upload.spec.ts:16:5 › test_file_picker_opens_and_accepts_image (AC-01)
  ✓ photo-upload.spec.ts:22:5 › test_mobile_camera_capture_option_available (AC-02)
  ✓ photo-upload.spec.ts:29:5 › test_unsupported_file_type_rejected (AC-03)
  ✓ photo-upload.spec.ts:41:5 › test_file_exceeding_10mb_rejected (AC-04)
  ✓ photo-upload.spec.ts:55:5 › test_image_preview_renders_constrained (AC-05)
  ✓ photo-upload.spec.ts:69:5 › test_low_res_warning_displayed_below_threshold (AC-06)
  ✓ photo-upload.spec.ts:86:5 › test_continue_button_visible_after_valid_upload (AC-07)
  ✓ quilt-inputs.spec.ts:24:5 › test_quilt_inputs_screen_shown_after_upload_continue (AC-flow)
  ✓ quilt-inputs.spec.ts:32:5 › test_quilt_size_inputs_shown_first_block_picker_hidden (AC-path-a)
  ✓ quilt-inputs.spec.ts:41:5 › test_block_picker_appears_after_both_dimensions_entered (AC-constrained)
  ✓ quilt-inputs.spec.ts:53:5 › test_block_picker_shows_valid_divisors_for_60x80 (AC-divisors)
  ✓ quilt-inputs.spec.ts:68:5 › test_all_six_sizes_shown_with_warning_when_no_valid_divisors (AC-no-valid)
  ✓ quilt-inputs.spec.ts:85:5 › test_grid_display_updates_live_on_block_size_selection (AC-live-grid)
  ✓ quilt-inputs.spec.ts:101:5 › test_continue_button_disabled_until_all_valid (AC-hard-block)
  ✓ quilt-inputs.spec.ts:120:5 › test_continue_blocked_when_no_valid_block_size_selected (AC-hard-block-no-divisor)
  ✓ quilt-inputs.spec.ts:134:5 › test_seam_allowance_visible_with_default_value (AC-seam-default)
  ✓ quilt-inputs.spec.ts:141:5 › test_seam_allowance_can_be_overridden (AC-seam-override)
  ✓ quilt-inputs.spec.ts:148:5 › test_fabrics_out_of_range_shows_error (AC-fabrics-validation)
  ✓ quilt-inputs.spec.ts:159:5 › test_unit_labels_displayed_on_all_measurement_fields (AC-unit-labels)

21 passed (4.7s)
```

---

## Deviations from Story Spec

None. All automatable acceptance criteria were implemented and verified.

---

## Acceptance Criteria Status

| Criterion | Status | Notes |
|---|---|---|
| User prompted for quilt size first (Path A) | ✅ | Dimension inputs shown before block picker |
| Second input constrained by first | ✅ | Block picker hidden until both dimensions entered |
| Only even divisors presented for quilt-size-first | ✅ | `getValidBlockSizes` filters common sizes; unit + e2e verified |
| Non-integer grid warning in real time | ✅ | Soft warning when no valid sizes; e2e verified with 37.5×53.5 |
| Grid dimensions displayed live | ✅ | "Your quilt will be N × M blocks" appears after valid block size selected |
| Block size picker includes 1", 1.5", 2", 2.5", 3", 4" | ✅ | `COMMON_BLOCK_SIZES_IN` constant; all 6 values in picker |
| Number of fabrics: integers 2–20 | ✅ | `min={2} max={20}` enforced; out-of-range shows error |
| Seam allowance defaults to 0.25" and is visible | ✅ | `DEFAULT_SEAM_ALLOWANCE_IN`; visible on screen from load |
| Seam allowance overridable | ✅ | Editable input; e2e verified |
| Unit label (inches) displayed alongside all fields | ✅ | "in" span on all measurement inputs |
| Data model unit-aware | ✅ | `Unit` type exported from constants; `unit: 'in'` carried through `QuiltInputs` and `DerivedQuiltValues` interfaces |

---

## Infrastructure Events

**Pre-existing docker-compose 1.29.2 / Docker API incompatibility.** Attempting `docker-compose up` when a previous frontend container existed with a stale anonymous volume (`/app/node_modules`) caused a `KeyError: 'ContainerConfig'` crash. Workaround: always run `docker-compose down` before `docker-compose up` in this environment. This is a known bug in docker-compose 1.29.2 with newer Docker Engine API versions.

**Branch housekeeping required before story work could begin.** US-001 had not been merged to main, so the git environment required:
1. Stashing in-progress US-002 work
2. Adding `.gitignore` to main (no `.gitignore` existed; `backend/__pycache__/main.cpython-312.pyc` was tracked on US-001 and blocked the merge)
3. Untracking the pyc file on US-001 and merging into main
4. Cutting `feature/US-002-quilt-inputs` from the updated main
5. Popping the stash

---

## [META] Methodology Observations

**[META-1] The "no valid sizes" scenario is mathematically unreachable for typical quilting inputs.**
The story describes showing all 6 block sizes with a warning "when no common sizes divide evenly." In practice, because 1" is always in the common list, and quilters always enter whole-number dimensions, there will always be at least one valid block size (1" itself). The "no valid sizes" warning path can only be reached with non-integer quilt dimensions (e.g., 37.5 × 53.5). This edge case was discovered during test authoring, required test fixture corrections, and reveals a gap in the story's scenario analysis. The story should have specified whether non-integer quilt dimensions are supported, and if so, what the expected input step is.

**[META-2] Open questions in the story (Path A vs B, free entry vs picker) were deferred to the session as pre-implementation Q&A.**
The two open questions flagged in the story required a Q&A round before implementation could start. This added a deliberate hold point and produced well-reasoned decisions. The story-driven-ai methodology benefited from having these as explicit open questions rather than implicit ambiguities — the implementation was cleaner as a result.

**[META-3] Branch sequencing is a workflow gap not addressed by the current methodology.**
The CLAUDE.md workflow specifies "Create a GitFlow feature branch" as step 4. However, it does not specify a prerequisite: the prior story's branch must be merged to main before the new branch is cut. This session required a branch cleanup detour that consumed meaningful time and introduced infrastructure risk. Recommend adding an explicit "merge prerequisite" step to the workflow, or adding a pre-implementation check: "Is the previous story's branch merged to main?"

**[META-4] docker-compose 1.29.2 bug is a recurring infrastructure risk.**
The `KeyError: 'ContainerConfig'` crash will recur any time the test suite is run without `docker-compose down` first. This was also observed (differently) in US-001. The team should either upgrade to a newer docker-compose (`docker compose` plugin, v2.x) or document the `docker-compose down` requirement explicitly in CLAUDE.md or a project README.
