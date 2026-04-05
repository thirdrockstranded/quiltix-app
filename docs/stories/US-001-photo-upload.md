# US-001 — Photo Upload

## Epic
Convert a user-provided photo into a pixel-style quilt pattern.

## Story
**As a** quilter,  
**I want to** upload a photo or capture one from my device camera,  
**So that** I can use it as the source image for my quilt pattern.

## Inputs
- Image file (upload) or camera capture (mobile browser)
- Accepted formats: JPEG, PNG, WEBP
- Maximum file size: 10MB

## Acceptance Criteria
- [ ] AC-01: User can select a file from their device via a file picker
- [ ] AC-02: User can capture a photo on a mobile browser via the native file input camera option (no custom camera UI)
- [ ] AC-03: Files with unsupported types are rejected with an error message containing the text "Accepted formats: JPEG, PNG, WEBP"
- [ ] AC-04: Files exceeding 10MB are rejected with an error message stating the 10MB limit
- [ ] AC-05: A preview of the uploaded image is displayed in a constrained container (max 400px wide, aspect ratio preserved, no cropping) before the user proceeds
- [ ] AC-06: If the uploaded image is below 300×300px, a non-blocking warning is displayed containing the text "This image is low resolution — pattern quality may be affected"
- [ ] AC-07: After a valid upload, a button with the label "Continue" is visible and enabled
- [ ] AC-08: Upload flow works on current versions of Chrome, Firefox, and Safari on desktop [MANUAL]
- [ ] AC-09: Upload flow works on current versions of Chrome and Safari on mobile [MANUAL]

## Definition of Done
- File type and size validation is enforced on the client before any server call is made
- Resolution detection runs client-side after file selection
- All error messages display user-friendly copy — no raw exception text, no stack traces
- Preview renders without layout shift or overflow outside its container
- Low-resolution warning is visible but does not disable the Continue button
- No hardcoded file size or resolution thresholds — both are named constants

## Environment / Testing Prerequisites
- All automated tests run inside Docker containers via `docker compose up`
- Frontend served by the React/Vite dev server container on `http://localhost:5173`
- Backend served by the FastAPI container on `http://localhost:8000`
- Playwright E2E tests run in a dedicated test container with browser binaries included
- `docker compose run test` is the single command to execute the full test suite
- No local Node, Python, or browser installs assumed outside of Docker

## Test Coverage

| AC | Test Name | Type |
|----|-----------|------|
| AC-01 | test_file_picker_opens_and_accepts_image | e2e |
| AC-02 | test_mobile_camera_capture_option_available | e2e |
| AC-03 | test_unsupported_file_type_rejected | unit + e2e |
| AC-04 | test_file_exceeding_10mb_rejected | unit + e2e |
| AC-05 | test_image_preview_renders_constrained | e2e |
| AC-06 | test_low_res_warning_displayed_below_threshold | unit + e2e |
| AC-07 | test_continue_button_visible_after_valid_upload | e2e |
| AC-08 | Cross-browser desktop | [MANUAL] |
| AC-09 | Cross-browser mobile | [MANUAL] |

**Notes on unit + e2e ACs:**
AC-03, AC-04, AC-06 each have a unit test covering the validation logic in isolation (pure function, no DOM) and an E2E test covering the full user-facing flow including the error/warning display.

## Notes
- Camera capture on mobile relies on the browser's native `<input type="file" accept="image/*" capture>` behavior — no custom camera UI is required or desired
- Image is not persisted server-side beyond the active session (MVP)
- The 300px resolution threshold for the low-quality warning is a named constant (`LOW_RES_THRESHOLD_PX`), not a magic number
- The 10MB file size limit is a named constant (`MAX_FILE_SIZE_MB`), not a magic number
- This story depends on US-000 (project bootstrap) being complete before implementation begins
