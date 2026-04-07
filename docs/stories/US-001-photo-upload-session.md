# US-001 Session Document — Photo Upload

## What Was Built

A client-side photo upload flow that validates file type, file size, and image resolution before displaying a constrained preview and enabling a Continue button. All validation runs in the browser before any server interaction.

### Files Created

**Frontend (`frontend/src/`)**
- `constants.ts` — `MAX_FILE_SIZE_MB = 10`, `LOW_RES_THRESHOLD_PX = 300`, `ACCEPTED_MIME_TYPES`
- `validation.ts` — Pure functions: `validateFileType`, `validateFileSize`, `checkResolution`
- `validation.test.ts` — 13 Vitest unit tests covering all validation branches
- `components/PhotoUpload.tsx` — Upload UI component with file input, error/warning display, constrained preview, and Continue button

**Frontend (`frontend/`)**
- `package.json` — Added `vitest ^2.0.0`, `@vitest/coverage-v8 ^2.0.0`, `jsdom ^25.0.0`; added `"test": "vitest run"` script

**E2E Tests (`tests/e2e/`)**
- `photo-upload.spec.ts` — 7 Playwright tests covering AC-01 through AC-07

### Files Modified

| File | Change |
|---|---|
| `frontend/src/App.tsx` | Replaced placeholder with `<PhotoUpload />` |
| `frontend/vite.config.ts` | Added `test: { environment: 'jsdom' }` block; added `server.allowedHosts: true` |
| `tests/e2e/Dockerfile` | Removed `npx playwright install --with-deps` — browsers already in base image |
| `tests/e2e/package.json` | Pinned `@playwright/test` to exact version `1.46.0` (was `^1.46.0`) |
| `tests/e2e/playwright.config.ts` | Added `devices['Desktop Chrome']` and Docker-safe Chromium launch args |

---

## Assumptions Made

- **Continue logs to console.** No backend endpoint exists yet for image data — clicking Continue calls `console.log('Upload complete', file)`. The image stays in browser memory; a future story (US-003 color quantization) will wire the backend call.
- **No router added.** `App.tsx` renders `<PhotoUpload />` directly as the full page. Routing deferred to a future story as discussed in pre-implementation Q&A.
- **`capture` attribute applied globally.** The file input uses `capture` without a value (equivalent to `capture="environment"`). This is the correct mobile behavior per the story notes; on desktop it has no effect.
- **1×1 PNG buffer used as the valid image fixture in e2e tests.** This is below `LOW_RES_THRESHOLD_PX`, so it also exercises the low-res warning path. AC-05 and AC-07 tests accept the warning being present — the warning is non-blocking by design.
- **Vitest version pinned to `^2.0.0`.** Vite 5.4.x is compatible with Vitest 2.x; using the Vitest 1.x series would require additional config.

---

## Test Results

### Unit Tests (Vitest)

```
✓ src/validation.test.ts (13 tests) 23ms

Test Files  1 passed (1)
     Tests  13 passed (13)
```

### E2E Tests (Playwright)

```
Running 9 tests using 2 workers

✓ smoke.spec.ts:3:5 › frontend loads without error (257ms)
✓ photo-upload.spec.ts:16:5 › test_file_picker_opens_and_accepts_image (AC-01) (263ms)
✓ smoke.spec.ts:8:5 › backend health check is reachable (32ms)
✓ photo-upload.spec.ts:22:5 › test_mobile_camera_capture_option_available (AC-02) (142ms)
✓ photo-upload.spec.ts:29:5 › test_unsupported_file_type_rejected (AC-03) (164ms)
✓ photo-upload.spec.ts:41:5 › test_file_exceeding_10mb_rejected (AC-04) (2.2s)
✓ photo-upload.spec.ts:55:5 › test_image_preview_renders_constrained (AC-05) (185ms)
✓ photo-upload.spec.ts:69:5 › test_low_res_warning_displayed_below_threshold (AC-06) (168ms)
✓ photo-upload.spec.ts:86:5 › test_continue_button_visible_after_valid_upload (AC-07) (164ms)

9 passed (4.2s)
```

---

## Deviations from Story Spec

None. All automatable acceptance criteria were implemented and verified.

---

## Acceptance Criteria Status

| Criterion | Status | Notes |
|---|---|---|
| AC-01: File picker, accepts image | ✅ | Verified by e2e |
| AC-02: Mobile camera capture option available | ✅ | `capture` attribute asserted present |
| AC-03: Unsupported type rejected with correct message | ✅ | Unit + e2e |
| AC-04: >10MB rejected with correct message | ✅ | Unit + e2e |
| AC-05: Preview constrained to max 400px wide, aspect ratio preserved | ✅ | e2e asserts `maxWidth: 400px` inline style |
| AC-06: Low-res warning for images below 300×300px, non-blocking | ✅ | Unit + e2e; Continue button enabled alongside warning |
| AC-07: Continue button visible and enabled after valid upload | ✅ | e2e |
| AC-08: Desktop cross-browser | [MANUAL] | Chrome, Firefox, Safari — not automated |
| AC-09: Mobile cross-browser | [MANUAL] | Chrome, Safari — not automated |

---

## Infrastructure Fixes (not in story scope)

Two pre-existing infrastructure issues were discovered and fixed during e2e test execution:

**1. Playwright container overwrote its own browser binaries.**
The `tests/e2e/Dockerfile` ran `npx playwright install --with-deps` after `npm install`. Because `package.json` used `^1.46.0`, `npm install` resolved to the latest Playwright (1.51.x at time of writing), and then installed the corresponding browser versions — which crashed (SIGSEGV) on the host kernel. Fixed by: removing `npx playwright install --with-deps` (the base image already ships correct browsers for 1.46.0) and pinning the package to exact version `1.46.0`.

**2. Vite 5.4.x blocked requests from the test container due to Host header validation.**
Vite 5.4 introduced `allowedHosts` enforcement. Playwright in the test container connects to `http://frontend:5173`, sending `Host: frontend`. Vite rejected this, serving an error page instead of the app — causing all browser-based tests to time out finding elements. Fixed by adding `server.allowedHosts: true` to `vite.config.ts`.

---

## [META] Methodology Observations

**[META-1] Infrastructure blocking story AC verification.** Both infrastructure failures (browser crash, Vite host check) blocked all e2e ACs and required diagnosis before any story-level testing could proceed. Neither failure was caused by this story's code — they were latent issues in the US-000 scaffold. The methodology should consider whether a "stack verification" gate (run the smoke tests before starting story implementation) should be a formal step in the workflow, so infrastructure issues are caught before implementation work begins rather than after.

**[META-2] `allowedHosts` is a Vite 5.4+ concern.** The US-000 scaffold targeted Vite 5.4.x but did not account for this new security behavior. Any project bootstrapped on Vite 5.4+ running Playwright in a Docker network will hit this. Worth adding to the bootstrap story's acceptance criteria or a CLAUDE.md note.

**[META-3] Playwright version pinning is load-bearing.** The `^` semver range in the e2e `package.json` caused a silent version mismatch between the CLI and the base image's browser binaries. The session document from US-000 did not flag this as a risk. Bootstrap stories should explicitly pin browser automation dependencies to exact versions, not ranges.
