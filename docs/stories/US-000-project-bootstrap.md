# US-000 — Project Bootstrap

## Epic
Establish the foundational development environment and project scaffold so that all subsequent user stories have a consistent, containerized environment to build and test against.

## Story
**As a** developer,  
**I want** a fully containerized project scaffold with all tooling configured,  
**So that** every subsequent user story can be implemented, tested, and run without any local environment setup outside of Docker.

## Inputs
- This file (`CLAUDE.md`)
- `VISION.md`
- Docker and Docker Compose available on the host machine

## Acceptance Criteria

### Repository Structure
- [ ] Repo root contains `docker-compose.yml`, `CLAUDE.md`, `VISION.md`, `README.md`
- [ ] `frontend/` contains a Vite + React + TypeScript scaffold
- [ ] `backend/` contains a FastAPI scaffold with a single health check endpoint (`GET /health` returns `{"status": "ok"}`)
- [ ] `tests/e2e/` contains a Playwright scaffold with one passing smoke test (health check endpoint is reachable)
- [ ] `docs/stories/` contains all user story files

### Docker Compose
- [ ] `docker compose up` starts frontend, backend, and does not error
- [ ] `docker compose run test` executes the full test suite (pytest + Playwright) and exits with results
- [ ] Frontend container serves the React app on `http://localhost:5173`
- [ ] Backend container serves FastAPI on `http://localhost:8000`
- [ ] Playwright test container can reach both frontend and backend by service name

### Frontend Scaffold
- [ ] Vite + React + TypeScript initialized
- [ ] ESLint with TypeScript recommended ruleset configured
- [ ] Prettier configured
- [ ] `npm run dev` starts the dev server inside the container
- [ ] `npm run build` produces a production build without errors
- [ ] `npm run lint` passes on the scaffold with no errors

### Backend Scaffold
- [ ] FastAPI app initialized
- [ ] Black and Ruff configured
- [ ] All functions and methods have type hints
- [ ] `GET /health` endpoint returns `{"status": "ok"}` with HTTP 200
- [ ] pytest configured and one passing test for the health check endpoint

### Playwright Scaffold
- [ ] Playwright installed in dedicated test container with browser binaries
- [ ] One smoke test: navigates to frontend and asserts the page loads without error
- [ ] Test results output to console on `docker compose run test`

## Definition of Done
- `docker compose up` runs without errors on a clean clone with no local dependencies installed
- All scaffold tests pass (`pytest` + Playwright smoke test)
- Lint passes on all scaffold code (Ruff, ESLint)
- No hardcoded ports, URLs, or environment values — all in environment variables or compose config

## Environment / Testing Prerequisites
- Docker and Docker Compose installed on host
- No other local dependencies required or assumed
- All commands run via `docker compose` — never directly against local Node or Python

## Test Coverage
- Unit (pytest): health check endpoint returns 200 and correct body
- E2E (Playwright): frontend loads, backend is reachable from test container

## Notes
- This story has no product-facing user value — it is infrastructure. It exists so every other story has a reliable foundation.
- Ports (5173, 8000) are the Vite and FastAPI defaults. If there is a reason to change them, document it in the session file.
- Hot reload should work inside the frontend container for developer experience (Vite HMR via Docker volume mount).
- This is the first story run through Claude Code for this project. Methodology observations about the bootstrap process itself are especially valuable — flag anything that feels like it should have been in the story or CLAUDE.md.
