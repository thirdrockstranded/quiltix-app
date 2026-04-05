# US-004 — Grid Preview

## Epic
Convert a user-provided photo into a pixel-style quilt pattern.

## Story
**As a** quilter,  
**I want to** see a visual preview of my pixel quilt pattern,  
**So that** I can evaluate the result before committing to export.

## Inputs
- Color-mapped grid (from US-003)
- N quantized colors with RGB values (from US-003)
- Grid dimensions: columns × rows (from US-002)

## Acceptance Criteria
- [ ] The grid is rendered as a 2D array of colored squares matching the quantized color map
- [ ] Grid proportions reflect the actual quilt aspect ratio
- [ ] Each color in the palette is displayed in a legend alongside the grid, labeled by fabric number (e.g., "Fabric 1", "Fabric 2")
- [ ] The legend shows the RGB/hex value for each fabric color
- [ ] The preview scales responsively to fit the viewport on both desktop and mobile
- [ ] Individual grid cells are visually distinct (subtle border or spacing)
- [ ] The preview is displayed before the user proceeds to export

## Notes
- Color labels ("Fabric 1", "Fabric 2", etc.) are the MVP naming convention; custom naming is a future phase
- The preview does not need to be interactive (no zoom, no cell selection) at MVP
- RGB/hex values in the legend give the quilter a reference for fabric shopping or matching

## Test Coverage
- Unit: grid render data structure maps correctly from quantization output
- E2E (Playwright): grid renders with correct number of cells, legend displays correct number of colors, responsive layout on mobile viewport
