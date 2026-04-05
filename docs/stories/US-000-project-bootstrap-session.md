# US-000 Session Document — Project Bootstrap

## What Was Built

Full project scaffold committed to `main` as the initial commit, with `develop` branch created per GitFlow convention.

### Files Created

**Frontend (`frontend/`)**
- `Dockerfile` — Node 20 Alpine, runs `npm run dev`
- `package.json` — Vite 5.4, React 18.3, TypeScript 5.5, ESLint 9, Prettier 3.3
- `vite.config.ts` — sets `host: '0.0.0.0'` for Docker HMR
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` — Vite project-reference pattern
- `eslint.config.js` — flat config (ESLint 9), TypeScript recommended + react-hooks + react-refresh
- `.prettierrc` — single quotes, semicolons, 100 char width
- `index.html` / `src/main.tsx` / `src/App.tsx` / `src/vite-env.d.ts`

**Backend (`backend/`)**
- `Dockerfile` — Python 3.12 slim, uvicorn with `--reload`
- `requirements.txt` — fastapi 0.111.1, uvicorn, httpx, pytest
- `pyproject.toml` — Black + Ruff config, pytest `testpaths` + `pythonpath`
- `main.py` — single `GET /health` endpoint returning `{"status": "ok"}`
- `tests/test_health.py` — two pytest tests using `TestClient`

**E2E Tests (`tests/e2e/`)**
- `Dockerfile` — `mcr.microsoft.com/playwright:v1.46.0-jammy`
- `package.json` — `@playwright/test ^1.46.0`
- `playwright.config.ts` — `FRONTEND_URL` env var, `testMatch: **/*.spec.ts`
- `smoke.spec.ts` — two tests: frontend loads (asserts `<h1>` visible), backend health reachable

**Root**
- `docker-compose.yml` — frontend, backend, test (profiles: test) services
- `README.md` — updated with stack table, local dev startup instructions, project structure
- `.gitignore`

---

## Assumptions Made

- **Git identity was not configured globally.** Set `user.email = thirdrockstranded@gmail.com` and `user.name = thirdrockstranded` locally in the quiltix repo. User confirmed the email address.
- **Nested git repo used instead of standalone repo.** `quiltix/` is initialized as its own git repo nested inside `gcp-public/`. User chose this as a temporary arrangement before pushing to a dedicated remote.
- **`npm create vite` not run directly.** Per CLAUDE.md "containers by default" principle, the Vite scaffold was written manually rather than executing `npm create vite` against a local Node install. All files match what the `react-ts` template produces.
- **`package-lock.json` not generated.** Lock file is produced on first `docker compose up` (inside the container), not at scaffold time. First build will be slower; subsequent builds use the Docker layer cache.
- **Playwright version pinned to v1.46.0.** The Playwright Docker image tag and npm package version were aligned to the same release. This may lag behind current latest.
- **Test service uses `profiles: [test]`** so `docker compose up` starts only frontend and backend. `docker compose run test` bypasses the profile restriction and starts the test container with its dependencies. This matches the story's intent.
- **Backend health check uses Python's `urllib.request`** (stdlib) rather than installing `curl` into the slim image, keeping the image smaller.
- **Frontend `host: 0.0.0.0`** set in `vite.config.ts` rather than as a CLI flag, so it applies whether run via `npm run dev` inside or outside the container.
- **`VITE_API_URL` env var provided but not yet consumed** by App.tsx. The variable is wired in compose for future use; no application logic added per story scope.

---

## Test Results

Tests not executed — no Docker environment available during scaffolding session. Execution requires `docker compose up` and `docker compose run test` on a machine with Docker.

---

## Deviations from Story Spec

| Story Requirement | Actual | Note |
|---|---|---|
| `npm run lint` passes on scaffold | Not verified | Requires `npm install` in container |
| `npm run build` produces build without errors | Not verified | Requires `npm install` in container |
| All scaffold tests pass | Not verified | Requires Docker |
| Playwright smoke test: navigates to frontend | Implemented as `expect(page.locator('h1')).toBeVisible()` | Slightly more specific than "loads without error" |

---

## Acceptance Criteria Status

| Criterion | Status | Notes |
|---|---|---|
| Repo root contains docker-compose.yml, CLAUDE.md, VISION.md, README.md | ✅ | All present |
| `frontend/` contains Vite + React + TypeScript scaffold | ✅ | Written manually per containers-first principle |
| `backend/` contains FastAPI scaffold with `GET /health` | ✅ | Returns `{"status": "ok"}` |
| `tests/e2e/` contains Playwright scaffold | ✅ | One smoke test file |
| `docker compose up` starts frontend and backend without error | Unverified | Requires Docker |
| `docker compose run test` executes test suite | Unverified | Requires Docker |
| Frontend on port 5173, backend on port 8000 | ✅ | Configured in compose |
| Playwright container can reach services by name | ✅ | Uses `http://frontend:5173` and `http://backend:8000` |
| ESLint configured | ✅ | Flat config (ESLint 9) |
| Prettier configured | ✅ | `.prettierrc` present |
| Black and Ruff configured | ✅ | `pyproject.toml` |
| Type hints on all functions | ✅ | `health_check() -> dict[str, str]`, tests use `-> None` |
| pytest passing health check test | Unverified | Requires Docker |
| Playwright smoke test passing | Unverified | Requires Docker |
| No hardcoded ports/URLs | ✅ | All via env vars with compose defaults |
| `docker compose up` on clean clone, no local deps | ✅ (design) | Volumes + container installs handle deps |
| GitFlow: initial commit on main, develop branch created | ✅ | `main` has root commit; `develop` branched from it |

---

## [META] Methodology Observations

**[META-1] Bootstrap story cannot self-verify.** US-000 requires Docker to validate its own acceptance criteria, but scaffolding sessions don't have Docker available. The story should note which criteria are "design-verified" (can be confirmed by reading code) vs. "runtime-verified" (require `docker compose up`). This distinction would reduce ambiguity in session reports.

**[META-2] `npm create vite` vs. manual scaffold.** The story says "Scaffold the Vite + React + TypeScript frontend (`npm create vite`)" but CLAUDE.md says all dev runs in containers. These are in tension — you can't run `npm create vite` without a local Node install. The story should either explicitly permit a one-time scaffold command outside Docker, or acknowledge that the scaffold will be written manually. Flagging as a story completeness gap.

**[META-3] Git identity not in scope.** The story covers git init and branching but doesn't mention that a fresh repo needs `user.email` and `user.name` configured. This caused a blocking error mid-session. Small but worth noting in the story template.

**[META-4] Nested repo vs. standalone repo.** The story assumes a clean repo root but the project lives inside `gcp-public/`. This required a mid-session decision about repo structure that should have been resolved at the story level or in CLAUDE.md. Recommend adding a "Repository home" field to bootstrap stories in the methodology template.
