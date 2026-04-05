# US-002 — Quilt Inputs

## Epic
Convert a user-provided photo into a pixel-style quilt pattern.

## Story
**As a** quilter,  
**I want to** specify my quilt dimensions and block size in a guided sequence where the second input is constrained by the first,  
**So that** I can only arrive at valid combinations without doing the math myself.

## Input Flow (Sequential)

The user is asked **one of two questions first** — quilt size or block size. The answer to the first constrains the options for the second. Order TBD pending stakeholder input on how quilters naturally think about starting a project.

**Path A — Quilt size first:**
1. User enters finished quilt dimensions (width × height)
2. App calculates and presents only valid block sizes (divisors that produce whole-number grids)
3. User selects block size from constrained list or picker

**Path B — Block size first:**
1. User selects block size (from picker of common quilting values)
2. App constrains quilt size input to valid multiples, or warns in real time when combination produces a non-integer grid
3. User enters quilt dimensions

**Remaining inputs (after quilt size + block size are resolved):**
- Number of fabrics/colors (N)
- Seam allowance (default 0.25", visible and overridable)

## Inputs

| Field | Type | Default | Notes |
|---|---|---|---|
| Quilt width | Number (inches) | — | Required |
| Quilt height | Number (inches) | — | Required |
| Block/square size | Number (inches) | — | Required; finished size; may be picker or constrained list |
| Number of fabrics | Integer | — | Required; drives color quantization (N) |
| Seam allowance | Number (inches) | 0.25 | Visible and overridable |

## Acceptance Criteria
- [ ] User is prompted for either quilt size or block size first (order per stakeholder decision)
- [ ] After the first input is provided, the second is constrained to valid combinations only
- [ ] If quilt size is entered first, only block sizes that divide evenly into both dimensions are presented
- [ ] If block size is entered first, quilt size input warns in real time when dimensions are not evenly divisible
- [ ] Grid dimensions (columns × rows) are displayed as a live calculation as inputs are resolved (e.g., "Your quilt will be 30 × 40 blocks")
- [ ] Block size picker includes common quilting values: 1", 1.5", 2", 2.5", 3", 4" (open question: free entry also allowed?)
- [ ] Number of fabrics accepts integers between 2 and 20
- [ ] Seam allowance defaults to 0.25" and is visible to the user
- [ ] Seam allowance can be overridden by the user
- [ ] Unit label (inches) is clearly displayed alongside all fields
- [ ] Input layout is unit-aware in the data model to support future metric toggle without refactoring

## Derived Values (displayed live)
- Grid columns = quilt width ÷ block size
- Grid rows = quilt height ÷ block size
- Cut size = block size + (seam allowance × 2)

## Open Questions
- Which input comes first — quilt size or block size? Stakeholder (quilter) input needed; this likely reflects how quilters naturally start a project.
- Should block size be a picker only, or allow free entry with validation?

## Notes
- Imperial units only at launch; metric is a future phase
- Non-integer grid combinations should be prevented or clearly warned — they produce unusable patterns
- Seam allowance visibility is intentional — experienced quilters may have non-standard preferences
- Live grid dimension feedback reduces surprises before the user commits to processing

## Test Coverage
- Unit: given quilt size, assert correct set of valid block sizes returned
- Unit: given block size, assert valid quilt dimension multiples calculated correctly
- Unit: grid dimension calculation, cut size calculation, validation rules
- E2E (Playwright): sequential input flow, constrained picker updates correctly, live grid dimension display, validation error states
