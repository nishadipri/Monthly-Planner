# Monthly Planner (Modernized V1)

Modernized in-place from the original JavaScript project to a **Next.js + TypeScript** app with a local-first planner core.

## What is included

- Next.js App Router + TypeScript architecture
- Single-page monthly planner (`/`) with **Monday-first** calendar grid
- Month navigation (`Previous`, `Today`, `Next`)
- Task create/edit/delete
- Task fields: title, date, category, priority, status, notes
- Filters: status, category, priority
- Local storage keys:
  - `planner.tasks.v2`
  - `planner.settings.v1`
- Legacy auto-migration from old `savedTasks` format
- Basic offline support:
  - `manifest.webmanifest`
  - `public/sw.js`
  - online/offline indicator in UI
- Legacy app preserved under `legacy/`

## Run locally

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

## Validation scripts

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

## CI/CD (GitHub Actions)

This project now includes two workflows:

- `CI` (`.github/workflows/ci.yml`)
  - Runs on every push and pull request
  - Executes: `npm ci`, `npm run lint`, `npm run test`, `npm run build`
- `CD (Vercel)` (`.github/workflows/cd-vercel.yml`)
  - Triggers only after `CI` completes successfully
  - Deploys only when the branch is `main`
  - Uses Vercel CLI to build and deploy production

### One-time setup for CD

In GitHub repository settings, add these secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VERCEL_SCOPE` (optional, recommended if your project is under a Vercel team)

You can find `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` in Vercel project settings.
Create `VERCEL_TOKEN` from your Vercel account token settings.

Without these secrets, CI will still run, but CD deployment will fail with a clear message.
If `NOT_FOUND` appears, it usually means token/scope/project mismatch.

## Test coverage added

- Unit
  - Calendar matrix generation (Monday-first)
  - Legacy migration + idempotency
  - Storage settings read/write
  - Filter behavior
- Component/integration
  - Create/edit/delete flow
  - Filtering behavior
  - Month navigation across year boundaries
- E2E smoke
  - Legacy migration on first load
  - Persistence after reload
  - Offline indicator behavior

## Project structure (important paths)

- `app/` - Next.js app router entry points + global styles
- `src/components/planner/` - planner UI and interactions
- `src/hooks/use-planner.ts` - core planner state and actions
- `src/lib/storage.ts` - local storage and migration logic
- `src/lib/date.ts` - calendar/date helpers
- `legacy/` - preserved original HTML/CSS/JS implementation

## AWS Phase 2 (planned)

Not implemented in V1.

Recommended future path:
- Amplify Hosting + Cognito + AppSync + DynamoDB
- Budget guardrail target: **$0-$5/month** (alerts + strict limits)
- Subdomain setup can use external DNS CNAME/ALIAS or Route 53 later
