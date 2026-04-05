# CLAUDE.md — Quiltix

This file is read at the start of every Claude Code session. It is the project briefing. Read it fully before taking any action.

---

## What This Project Is

Quiltix is a web application that converts photos into pixel-style quilt patterns with fabric yardage calculations. See `VISION.md` for the full product north star, constraints, and non-goals.

This project is **Case Study 1** for the [story-driven-ai](https://github.com/thirdrockstranded/story-driven-ai) methodology experiment. User stories are the specification. Acceptance criteria are the verification contract. Deviations, surprises, and methodology gaps are valuable data — capture them, do not paper over them.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, FastAPI |
| Image Processing | Pillow, scikit-learn |
| PDF Export | ReportLab |
| Testing — Logic | pytest |
| Testing — UI | Playwright |
| Containerization | Docker, Docker Compose |

---

## Overriding Engineering Principles

These apply to every decision, in every story, without exception:

1. **Keep it simple.** The simplest solution that satisfies the acceptance criteria is the correct solution. Do not over-engineer.
2. **SOLID principles.** Single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion. Apply them.
3. **Containers by default.** All development, testing, and runtime occurs inside Docker containers. Never suggest or generate setup instructions that assume local installs of Node, Python, or browsers outside of Docker. If there is a compelling reason to deviate, state it explicitly and wait for approval.

---

## Code Style

### Python
- Formatter: **Black**
- Linter: **Ruff**
- Type hints: **required on all functions and methods**

### TypeScript / React
- Build tool: **Vite**
- Formatter: **Prettier**
- Linter: **ESLint with TypeScript recommended ruleset**
- Code must be human-readable in the repository. Minification and optimization are the build process's job, not the source code's job.

---

## Workflow — How to Execute a User Story

When given a user story to implement, follow this sequence exactly:

### 1. Read the spec
Read the story file (`docs/stories/US-XXX-name.md`), `VISION.md`, and this file before doing anything else.

### 2. Ask clarifying questions
Ask all foreseeable clarifying questions upfront — about the story, the environment, ambiguous acceptance criteria, or anything in the three information layers (story, project, session). Do not start implementation until questions are answered.

### 3. Document answers and plan
Write out the implementation plan. State which files will be created or modified, which dependencies will be added, and how each acceptance criterion will be verified. Wait for approval before proceeding.

### 4. Create a GitFlow feature branch
Branch naming convention: `feature/US-XXX-short-description`
Example: `feature/US-001-photo-upload`
Never commit directly to `main` or `develop`.

### 5. Implement autonomously
Execute the plan. During this phase:
- Make reasonable assumptions for anything not covered by the story
- **Bold every assumption made during autonomous execution** in the report back
- Generate all tests required by the story's Test Coverage section
- Run tests after implementation. Fix collateral failures in pre-existing tests if 2 or fewer are affected. If more than 2 pre-existing tests fail due to this story's changes, stop and report — do not attempt to fix.

### 6. Report back
When done (or stopped), produce a session document at:
`docs/stories/US-XXX-name-session.md`

This document must include:
- What was built
- All assumptions made (bolded)
- Test results
- Any deviations from the story spec
- Any acceptance criteria that could not be met and why
- Any methodology-level observations flagged with `[META]`

---

## File Safety Rules

| Action | Rule |
|--------|------|
| Delete files | Only within explicit scope of the current story. Never otherwise. |
| Install dependencies | Allowed if the dependency is an obvious standard choice or was part of story design. Document it in the session file. |
| Modify story files | **Never.** Stories, VISION.md, and CLAUDE.md are read-only. Issues go in the session document. |
| Create new files | Allowed within story scope. |
| Modify files outside story scope | Ask first. |

---

## Story-Driven-AI Awareness

This project is a live case study. That means:

- If a story does not contain enough information to implement correctly, that is a **methodology finding**, not just a blocker. Flag it as `[META]` in the session document.
- If an assumption had to be made that should have been in the story, flag it.
- If the acceptance criteria were ambiguous in a way that affected implementation, flag it.
- If something about the story format caused confusion or required guessing, flag it.

These observations feed back into the story-driven-ai framework. They are as valuable as the code itself.

---

## Docker Environment

- `docker compose up` brings up the full stack (frontend, backend, test runner)
- Playwright tests run in a dedicated container with browser binaries
- pytest runs in the backend container
- Do not assume any service is running outside of Docker Compose
- The compose file is at the repo root: `docker-compose.yml`
