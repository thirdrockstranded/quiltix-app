# US-006 — Pattern Export

## Epic
Convert a user-provided photo into a pixel-style quilt pattern.

## Story
**As a** quilter,  
**I want to** export my quilt pattern as a printable file,  
**So that** I can take it to my sewing table and use it as a working reference.

## Inputs
- Color-mapped grid (from US-003)
- Quantized color palette with fabric labels (from US-004)
- Yardage requirements per fabric (from US-005)
- Quilt inputs: dimensions, block size, seam allowance (from US-002)

## Acceptance Criteria
- [ ] User can export the pattern as a PDF
- [ ] Exported PDF includes the pixel grid with colored squares
- [ ] Exported PDF includes the fabric legend (Fabric N → color swatch + hex value)
- [ ] Exported PDF includes the fabric requirements list (yardage per fabric)
- [ ] Exported PDF includes key quilt parameters: finished dimensions, block size, cut size, seam allowance
- [ ] PDF is formatted to print cleanly on US Letter (8.5" × 11") paper
- [ ] Export button is clearly accessible from the preview screen
- [ ] Export completes without error for all valid pattern inputs

## Notes
- Output format is driven by stakeholder (primary quilter) review — the exact layout of the PDF should be validated against real quilting pattern conventions before finalizing
- A target template pattern from the stakeholder is the primary reference for PDF layout
- Future phase: image export (PNG) as an alternative to PDF
- Future phase: multi-page PDF for large grids (grid on page 1, fabric list on page 2)

## Test Coverage
- Unit: PDF generation produces a valid, non-empty file for known inputs
- Unit: all required sections present in generated PDF (grid, legend, yardage, parameters)
- E2E (Playwright): export button triggers download, downloaded file is a PDF
