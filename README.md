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
