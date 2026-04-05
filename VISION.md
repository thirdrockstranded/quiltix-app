# Quiltix — Vision

## What Is Quiltix?

Quiltix is a web-based tool that converts any photograph into a pixel-style quilt pattern. A quilter uploads a photo, specifies their desired quilt dimensions, block size, and number of fabrics, and Quiltix produces a color-reduced pixel grid representing the quilt design — along with the fabric yardage required to make it.

The "pixels" of the quilt are fabric squares. The "colors" are fabrics. The output is a practical, printable pattern a quilter can actually take to their sewing table.

## Who Is It For?

Quilters — hobbyist through experienced — who want to create pixel-style quilts from meaningful photos (pets, portraits, landscapes, logos) without manually designing the pattern themselves.

The primary stakeholder and domain expert is an experienced quilter with deep knowledge of fabric requirements, cutting conventions, and pattern usability. All output format decisions are validated against real quilting practice.

## The Core Problem It Solves

Designing a pixel quilt from a photo today requires manual work in image editing software, color reduction by hand, and tedious yardage calculations. Quiltix collapses that entire workflow into a single guided web experience.

## Core Capabilities (MVP)

- Upload or capture a photo via browser (desktop and mobile)
- Input: finished quilt dimensions (width × height)
- Input: block/square size
- Input: number of fabrics/colors (N)
- Input: seam allowance (default 1/4")
- Output: visual pixel grid preview using the quantized color palette
- Output: fabric requirements list — yardage per color, seam allowance included
- Export: printable pattern (PDF or image)

## Guiding Constraints

- **Seam allowance:** Defaults to 1/4" (standard quilting convention). Cut size = finished block size + 1/2" (1/4" per side). This value is visible and user-overridable even in MVP.
- **Units:** Imperial at launch (inches, yards). The data model and UI are built unit-aware from day one so that a metric toggle is a configuration change in a future phase, not a refactor.
- **Block shapes:** Squares only at launch. Half-square triangles (HSTs) are a defined future phase.
- **Platform:** Web application. Works on desktop and mobile browsers. No app store required.
- **Color quantization:** K-means clustering via scikit-learn or Pillow's built-in quantize. Output quality is an accepted risk to be tuned with stakeholder feedback.

## Explicit Non-Goals (MVP)

- Half-square triangles or any other block shapes
- Metric/imperial toggle (architected for, deferred to Phase 2)
- Manual color palette editing or swapping
- Fabric vendor or colorway matching
- User accounts, save, or share features
- Native mobile app

## Future Phases (Parking Lot)

| Feature | Notes |
|---|---|
| Half-square triangles (HSTs) | Adds diagonal edge detection; yardage math significantly more complex |
| Metric/imperial toggle | Data model supports it from day one; UI toggle is Phase 2 |
| Manual palette override | Let user swap quantized colors before export |
| Fabric vendor matching | Match palette colors to real fabric SKUs |
| Save / share / accounts | Persist and share patterns |

## Guiding Principles

- **Quilter-first output.** The pattern and yardage output must be practically usable at the cutting table, not just visually interesting on screen. Domain expertise from the primary stakeholder drives all output format decisions.
- **Unit-aware from the start.** Never hard-code imperial assumptions into logic. Always carry units through the data model.
- **Simple inputs, useful outputs.** The user should need no technical knowledge to operate the tool. Complexity lives in the algorithm, not the UI.
- **Self-documenting codebase.** User stories live alongside the code they describe. The repo is the specification.
