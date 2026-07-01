# Midesk — Frontend (Phase 0–2)

Nuxt 4 SPA for Midesk: auth, projects, kanban, teams, and **Phase 2 HR** (personnel, attendance, contracts, documents, missions, recruitment, onboarding, leave policies).

## Stack

- Nuxt 4 + Vue 3 + TypeScript
- Nuxt UI + Tailwind CSS 4
- Pinia, @nuxtjs/i18n (fa/en + RTL/LTR)
- vee-validate + zod, vuedraggable, dayjs + jalali, ApexCharts

## Quick start

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo credentials

- **Email:** `demo@midesk.io`
- **Password:** `password`
- **OTP (SMS login):** `123456`

## Mock API

Nitro mock API at `/api/v1/*` for local development. Point `runtimeConfig.public.apiBase` to your backend when ready.

### Phase 2 HR routes

| Route | Description |
|-------|-------------|
| `/hr` | HR dashboard |
| `/hr/personnel` | Personnel list + create |
| `/hr/personnel/[id]` | Profile (tabs) + edit |
| `/hr/attendance` | Team attendance (HR) |
| `/hr/attendance/my` | My clock + history |
| `/hr/contracts` | Contracts + renew/create |
| `/hr/documents` | Document upload/list |
| `/hr/missions` | Missions |
| `/hr/recruitment` | Requisitions + kanban |
| `/hr/onboarding` | Templates + progress |
| `/hr/settings` | HR settings |
| `/leave/policies` | Leave policies |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Development server |
| `pnpm run build` | Production build |
| `pnpm run preview` | Preview production build |
| `pnpm run typecheck` | TypeScript check |
| `pnpm run lint` | ESLint |

## Project structure

```
app/
├── components/   # hr, recruitment, onboarding, leave, kanban, layout, …
├── composables/  # useApi, useAuth, usePermissions, …
├── layouts/      # default, auth, marketing
├── middleware/   # auth, guest, tenant, hr, …
├── pages/        # routes incl. hr/*
├── stores/       # auth, hr (incl. attendance, recruitment), leave, …
└── types/        # phase1.ts, phase2.ts
i18n/locales/     # fa.json, en.json
server/api/v1/    # mock REST API (hr/*, leave/*, …)
```
