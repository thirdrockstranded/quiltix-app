# Quiltix

> Convert any photo into a pixel-style quilt pattern with fabric yardage calculations.

See [VISION.md](./VISION.md) for the product north star, goals, and non-goals.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript 5, Vite 5 |
| Backend | Python 3.12, FastAPI |
| Image Processing | Pillow, scikit-learn |
| PDF Export | ReportLab |
| Testing — Logic | pytest |
| Testing — UI | Playwright |
| Containerization | Docker, Docker Compose |

---

## Local Development

**Prerequisites:** Docker and Docker Compose. No local Node or Python installation required.

### Start the development stack

```sh
docker compose up
```

- Frontend: http://localhost:5173 (Vite dev server with HMR)
- Backend: http://localhost:8000 (FastAPI with hot reload)
- API docs: http://localhost:8000/docs

### Run the test suite

```sh
docker compose run test
```

Executes pytest (backend unit tests) + Playwright (e2e smoke tests) and exits with results.

### Rebuild after dependency changes

```sh
docker compose build
docker compose up
```

---

## How It Works

1. User uploads a photo and provides inputs (quilt size, block size, fabric count, seam allowance)
2. The image is resized to match the quilt grid dimensions
3. K-means color quantization reduces the image to N colors
4. Each pixel is mapped to its nearest quantized color
5. Yardage per color is calculated (cut size = finished size + 2× seam allowance)
6. A visual grid preview and fabric requirements list are returned to the user
7. User exports a printable pattern

---

## Project Structure

```
quiltix/
├── CLAUDE.md               # AI session briefing — read before every session
├── VISION.md               # Product north star — read first
├── README.md               # This file
├── docker-compose.yml      # Brings up frontend, backend, and test runner
├── frontend/               # React + TypeScript + Vite
│   ├── Dockerfile
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
├── backend/                # FastAPI + image processing
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── tests/
│       └── test_health.py
├── tests/
│   └── e2e/                # Playwright smoke tests
│       ├── Dockerfile
│       ├── smoke.spec.ts
│       └── playwright.config.ts
└── docs/
    └── stories/            # User stories (specification)
```

---

## User Stories

User stories live in `docs/stories/`. Each file covers one feature area with acceptance criteria that map to automated tests. This project is Case Study 1 for the [story-driven-ai](https://github.com/thirdrockstranded/story-driven-ai) methodology experiment.

---

## Development Notes

- Seam allowance defaults to **1/4"**. Cut size = finished size + 1/2".
- All measurements flow through a unit-aware data model. Imperial ships first; metric is a future toggle.
- Color quantization quality is an accepted risk. Tuning happens with stakeholder feedback post-MVP.
