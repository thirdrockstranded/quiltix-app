# US-003 — Color Quantization

## Epic
Convert a user-provided photo into a pixel-style quilt pattern.

## Story
**As a** quilter,  
**I want to** have my photo automatically reduced to my chosen number of colors,  
**So that** the pattern uses only as many fabrics as I have available or want to work with.

## Inputs
- Source image (from US-001)
- Number of fabrics / colors N (from US-002)
- Grid dimensions: columns × rows (derived in US-002)

## Process
1. Resize source image to grid dimensions (columns × rows pixels)
2. Apply k-means color quantization to reduce image to N colors
3. Map each pixel to its nearest quantized color
4. Return color-mapped grid and the N representative colors (as RGB values)

## Acceptance Criteria
- [ ] Image is resized to exactly match the derived grid dimensions before quantization
- [ ] Output contains exactly N distinct colors
- [ ] Every cell in the grid is assigned one of the N colors
- [ ] Processing completes in a reasonable time for typical inputs (target: under 10 seconds for grids up to 100×100)
- [ ] A loading/progress indicator is shown during processing
- [ ] If processing fails, a clear error message is shown and the user can retry

## Notes
- Color quantization quality (visual fidelity of the result) is an accepted risk for MVP — real-world results will guide tuning
- scikit-learn KMeans or Pillow's built-in quantize are both acceptable implementations; choose based on output quality in testing
- The N colors returned are the basis for all downstream yardage calculations and the visual preview

## Test Coverage
- Unit: resize logic produces correct grid dimensions, output contains exactly N colors, every grid cell is assigned a valid color index
- Unit: known input image with known N produces deterministic output (seed k-means for testability)
- E2E (Playwright): loading indicator appears during processing, error state on failure
