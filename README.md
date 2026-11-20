# G-Scores — Vietnam National High School Exam 2024 Analytics

A full-stack web application for looking up and analyzing **1,061,605** student exam records from the 2024 Vietnam National High School Examination (`diem_thi_thpt_2024.csv`).

- **Live Demo:** https://gos-avr7.vercel.app
- **API Health Check:** https://gos-production-c751ccd4.up.railway.app/api/health

---

## Features

1. **Score Lookup (`/search`)**
   - Look up scores by 8-digit registration number (`sbd`), preserving leading zeros (e.g., `01000001`).
   - Validates input on both client and server (Zod regex `/^\d{8}$/`), with sample quick-fill buttons and URL query synchronization (`?sbd=...`).
   - Displays each taken subject with its 4-tier classification (`>= 8.0`, `6.0–7.99`, `4.0–5.99`, `< 4.0`), decoded foreign language code (`N1`–`N7`), average score, and eligible university admission groups (`A00`, `A01`, `B00`, `C00`, `D01`).

2. **Score Distribution Report (`/reports`)**
   - Statistics of student counts and percentages across all **9 subjects** and **4 score levels**.
   - Interactive Recharts visualization with **Grouped / Stacked** bar toggle, subject category filtering (`All`, `Mandatory`, `Natural Science`, `Social Science`), custom tooltips, and a detailed breakdown table.

3. **Top 10 Group A00 Leaderboard (`/leaderboard`)**
   - Lists the highest-scoring Group A00 (Mathematics, Physics, Chemistry) candidates with deterministic tie-breaking (`total DESC, toan DESC, sbd ASC`) and standard competition ranking (`1, 1, 3`).
   - Direct drill-down from any row to the full student score card (`/search?sbd=<sbd>`).

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, TailwindCSS v4, React Router v7, Recharts v3, Rubik Font |
| **Backend** | Node.js 22, Express v5, TypeScript, Prisma ORM, Zod, Helmet, `express-rate-limit` |
| **Database** | PostgreSQL 16 (Wide-Table + Partial Expression Index) |
| **DevOps & Cloud** | Multi-stage Docker & Docker Compose, Neon (PostgreSQL), Railway (Backend), Vercel (Frontend) |

---

## Architecture & Engineering Highlights

### 1. OOP Subject Domain Layer (`backend/src/domain/`)
All subject definitions, score validation, 4-tier classification, foreign language metadata decoding, and admission group calculations are encapsulated in framework-independent TypeScript classes:
- `Subject` (abstract base class implementing Template Method `evaluate()`, `classifyScore()`, `extractScore()`).
- `MandatorySubject` (overrides `extractMetadata()` to decode `N1`-`N7` for Foreign Language), `NaturalScienceSubject`, and `SocialScienceSubject`.
- `SubjectRegistry` (centralized whitelist and lookup across all 9 subjects).
- `ExamGroup` (`GROUP_A00`, `GROUP_A01`, `GROUP_B00`, `GROUP_C00`, `GROUP_D01`) with IEEE 754-safe rounding (`Math.round(sum * 100) / 100`).

### 2. Database Design & Query Performance (1,061,605 Records)
- **Wide-Table Schema (`student_scores`):** Mirrors the 11-column CSV layout (`sbd VARCHAR(10) PK`, 9 nullable `DOUBLE PRECISION` score columns, `ma_ngoai_ngu VARCHAR(5)`).
- **Partial Expression Index for Group A00:**
  ```sql
  CREATE INDEX "idx_student_scores_group_a_total"
  ON "student_scores" (("toan" + "vat_li" + "hoa_hoc") DESC, "toan" DESC, "sbd" ASC)
  WHERE "toan" IS NOT NULL AND "vat_li" IS NOT NULL AND "hoa_hoc" IS NOT NULL;
  ```
  Allows PostgreSQL to satisfy Top-N Group A00 queries with a single `Index Scan` without adding a redundant derived column.
- **Single-Pass Aggregation + In-Memory Cache:** `ReportRepository.getScoreDistributionBySubjects` computes all 36 buckets (9 subjects × 4 levels) in one SQL pass using PostgreSQL `COUNT(*) FILTER (WHERE ...)`, then caches the static 2024 report in memory.
- **Streaming Batch Seeder (`backend/prisma/seed.ts`):** Reads the CSV using `fs.createReadStream` + `readline` (`for await...of`) with 5,000-row batches (`5,000 × 11 = 55,000` bind parameters, safely under PostgreSQL's 65,535 limit), idempotent count check, `skipDuplicates: true`, and `ANALYZE`.

## Project Structure

```text
GOS/
├── backend/
│   ├── prisma/
│   │   ├── migrations/              # Table DDL + Partial Expression Index
│   │   ├── schema.prisma            # Prisma StudentScore model
│   │   └── seed.ts                  # Streaming CSV batch seeder
│   ├── src/
│   │   ├── config/                  # Zod env validation, Prisma singleton, InMemoryCache
│   │   ├── controllers/             # HTTP handlers (ScoreController, ReportController)
│   │   ├── domain/                  # OOP Subjects, SubjectRegistry, ExamGroup + unit tests
│   │   ├── middlewares/             # Centralized AppError & ZodError handler
│   │   ├── repositories/            # Prisma ORM queries & analytical SQL
│   │   ├── routes/                  # /api/health, /api/scores, /api/reports
│   │   ├── services/                # Business orchestration, ranking, caching + unit tests
│   │   └── validators/              # Zod request schemas
│   ├── Dockerfile                   # Multi-stage Node 22 Alpine build
│   └── docker-entrypoint.sh         # Migrate, optional auto-seed, start server
├── frontend/
│   ├── public/                      # SVG favicon & sidebar icons
│   ├── src/
│   │   ├── components/              # Layout, Score cards, Recharts report, Leaderboard table
│   │   ├── hooks/                   # useScoreSearch, useScoreDistribution, useTopGroupA
│   │   ├── pages/                   # SearchScoresPage, ReportsPage, LeaderboardPage
│   │   ├── services/                # Typed fetch API client
│   │   └── types/                   # API TypeScript interfaces
│   ├── Dockerfile                   # Multi-stage Vite -> Nginx Alpine build
│   ├── nginx.conf                   # Gzip, /api reverse proxy, SPA try_files fallback
│   └── vercel.json                  # SPA rewrite rules for Vercel
├── dataset/
│   └── diem_thi_thpt_2024.csv       # Raw dataset (1,061,605 records)
└── docker-compose.yml               # Full-stack local orchestration
```

---

## API Reference

All endpoints return a consistent envelope: `{ "success": true, "data": ... }` or `{ "success": false, "error": { "code": "...", "message": "..." } }`.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/scores/:sbd` | Fetch detailed scores, 4-tier levels, and eligible exam groups for an 8-digit `sbd` |
| `GET` | `/api/reports/score-distribution` | Fetch 4-level score distribution counts and percentages across all 9 subjects |
| `GET` | `/api/reports/top-group-a?limit=10` | Fetch top Group A00 students (`limit`: integer `1..50`, default `10`) |

---

## Running Locally

### Option 1: Docker Compose (Recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
git clone https://github.com/Truc54/GOS.git
cd GOS
docker compose up --build
```

- On the first start with an empty volume, the backend container automatically runs Prisma migrations and seeds all **1,061,605** rows from `./dataset/diem_thi_thpt_2024.csv` (~90–100 seconds). Subsequent starts skip seeding automatically.
- **Web App:** http://localhost:3000
- **Backend API:** http://localhost:4000/api/health
- **PostgreSQL:** `localhost:5433` (`gscores` / `gscores_password` / `gscores_db`)

To stop containers:
```bash
docker compose down
```

### Option 2: Manual Local Development

Requires **Node.js 22+** and **PostgreSQL 16** (or Docker for PostgreSQL only).

1. **Start PostgreSQL:**
   ```bash
   docker compose up -d postgres
   ```

2. **Setup & run Backend:**
   ```bash
   cd backend
   cp .env.example .env
   npm ci
   npx prisma migrate deploy
   npm run prisma:seed
   npm run dev
   ```
   Backend runs at `http://localhost:4000`.

3. **Setup & run Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm ci
   npm run dev
   ```
   Frontend runs at `http://localhost:5173` (Vite proxies `/api` to `http://localhost:4000`).

---

## Testing & Verification

```bash
# Backend typecheck & unit tests (OOP domain, competition ranking, caching, Zod validators)
npm --prefix backend run typecheck
npm --prefix backend test

# Frontend typecheck & production build
npm --prefix frontend run typecheck
npm --prefix frontend run build
```
