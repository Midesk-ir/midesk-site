# Midesk — Phase 0 Frontend

Nuxt 3/4 SPA for Midesk MVP (Phase 0): auth, onboarding, dashboard, projects, kanban, teams, settings, notifications.

## Stack

- Nuxt 4 + Vue 3 + TypeScript
- Nuxt UI + Tailwind CSS 4
- Pinia, @nuxtjs/i18n (fa/en + RTL/LTR)
- vee-validate + zod, vuedraggable, dayjs + jalali

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo credentials

- **Email:** `demo@midesk.io`
- **Password:** `password`
- **OTP (SMS login):** `123456`

## Mock API

Phase 0 includes a Nitro mock API at `/api/v1/*` for frontend development without backend. Replace with real API by pointing `runtimeConfig.public.apiBase` to your backend.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |

## Project structure

```
app/
├── components/   # ui, kanban, task, project, layout
├── composables/  # useApi, useAuth, useCalendar, ...
├── layouts/      # default, auth, marketing
├── middleware/   # auth, guest, tenant, admin
├── pages/        # routes
├── stores/       # auth, tenant, ui
└── types/
i18n/locales/     # fa.json, en.json
server/api/v1/    # mock REST API
```
