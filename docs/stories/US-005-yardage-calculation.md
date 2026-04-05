# US-005 — Yardage Calculation

## Epic
Convert a user-provided photo into a pixel-style quilt pattern.

## Story
**As a** quilter,  
**I want to** see exactly how much of each fabric I need to buy,  
**So that** I can shop and cut accurately without waste or shortage.

## Inputs
- Color-mapped grid (from US-003) — count of squares per color
- Block/square finished size (from US-002)
- Seam allowance (from US-002, default 0.25")
- N quantized colors (from US-003)

## Calculations

### Cut Size
```
cut_size = finished_size + (seam_allowance × 2)
```

### Squares Per Fabric Strip (assuming standard 42" usable fabric width)
```
squares_per_strip = floor(42 ÷ cut_size)
```

### Number of Strips Required Per Color
```
strips_needed = ceil(square_count ÷ squares_per_strip)
```

### Total Fabric Height Required
```
fabric_height_inches = strips_needed × cut_size
```

### Yardage (rounded up to nearest 1/8 yard)
```
yardage = ceil((fabric_height_inches ÷ 36) × 8) ÷ 8
```

## Acceptance Criteria
- [ ] Yardage is calculated for every fabric/color in the palette
- [ ] Cut size = finished block size + (seam allowance × 2)
- [ ] Standard fabric width of 42" (usable) is used as the basis for strip calculations
- [ ] Yardage is rounded up to the nearest 1/8 yard (quilting convention)
- [ ] Results are displayed as a fabric requirements list: Fabric N — X.X yards
- [ ] Total fabric count (number of distinct fabrics) is displayed
- [ ] Seam allowance used in the calculation is shown in the results for transparency

## Notes
- 42" usable width is the quilting industry standard for pre-washed quilting cotton; this should be a named constant in code, not a magic number
- Rounding up to 1/8 yard is standard quilting convention — never round down
- Future phase: allow user to override fabric width (e.g., for wide-back fabrics at 108")
- Future phase: add a small overage buffer (e.g., 10%) as an optional user setting
- Imperial units only at MVP; data model must carry units for future metric support

## Test Coverage
- Unit: cut size calculation with various finished sizes and seam allowances
- Unit: strip count calculation with known square counts
- Unit: yardage rounding (assert always rounds up to nearest 1/8 yard, never down)
- Unit: full calculation with known inputs produces expected yardage output (regression test)
- E2E (Playwright): fabric requirements list displays correct number of entries matching N colors
