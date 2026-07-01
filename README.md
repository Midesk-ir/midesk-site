# Midesk Site

Frontend for **Midesk** — a unified organization management platform (projects, HR, finance, collaboration). Built as a Nuxt 4 SPA with a built-in mock API for local development.

> **فارسی:** اپلیکیشن وب Midesk با Nuxt 4 — شامل پروژه، کانبان، منابع انسانی، مالی، چت، جلسات، AI و یادداشت. API موک داخل همان ریپو برای توسعه محلی.

---

## Features

| Area | Capabilities |
|------|----------------|
| **Core** | Auth (email / OTP), multi-tenant onboarding, dashboard, members, teams, notifications |
| **Projects** | Kanban, tasks, sprints, backlog, worklogs, reports (burndown, CFD, velocity) |
| **Calendar** | Events, holidays, shifts |
| **Leave** | Requests, balances, policies, approvals, reports |
| **HR (Phase 2)** | Personnel, attendance, contracts, documents, missions, recruitment, onboarding |
| **Finance (Phase 3)** | Expenses, budgets, invoices, purchase requests/orders, vendors, payroll, personal finance |
| **Collaboration (Phase 4)** | Chat (DM / group / channel), meetings (Jitsi/BBB), AI assistant, notes, notification preferences |
| **Phase 5** | Correspondence, surveys, CRM, custom reports, project files, subscription, super-admin, guests/roles, performance (KPI/OKR) |

### UX highlights

- **fa / en** with RTL/LTR, Jalali calendar, Vazirmatn font
- Dark glass UI (`midesk-card`, page headers, segment tabs)
- **IRR currency** formatting with correct RTL layout
- Permission-based navigation (`usePermissions`, Spatie-style strings)
- Mock real-time layer (Echo-compatible bus) for chat & notifications

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Nuxt 4, Vue 3, TypeScript |
| UI | Nuxt UI 4, Tailwind CSS 4 |
| State | Pinia |
| i18n | `@nuxtjs/i18n` |
| Forms | vee-validate + zod |
| Charts | ApexCharts |
| Dates | dayjs + jalali-dayjs, `@mahlaparvaz/vue-datepicker` |
| Other | vuedraggable, markdown-it, vue-sonner |

---

## Quick start

**Requirements:** Node.js 22+, pnpm 9+

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo login

| Field | Value |
|-------|--------|
| Email | `demo@midesk.io` |
| Password | `password` |
| OTP (SMS flow) | `123456` |

Demo user is **OWNER** (`u1`) with full permissions on tenant `t1`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Development server |
| `pnpm run build` | Production build |
| `pnpm run preview` | Preview production build |
| `pnpm run typecheck` | Vue/TS type check |
| `pnpm run lint` | ESLint |

CI (`.github/workflows/ci.yml`) runs **lint** and **typecheck** on every push.

---

## Docker

Production image runs the Nitro server (SPA + mock API at `/api/v1`).

```bash
# Production
docker compose up --build

# Or build & run manually
docker build -t midesk-site .
docker run --rm -p 3000:3000 midesk-site
```

Open [http://localhost:3000](http://localhost:3000)

### Development in Docker (hot reload)

```bash
docker compose --profile dev up dev
```

### Environment

Copy `.env.example` to `.env` and adjust if needed:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Host port (compose) |
| `NUXT_PUBLIC_API_BASE` | `/api/v1` | API base URL |

When pointing to an external backend:

```bash
NUXT_PUBLIC_API_BASE=https://api.example.com/v1 docker compose up --build
```

---

## Configuration

```ts
// nuxt.config.ts
runtimeConfig.public.apiBase  // default: '/api/v1'
```

Point `apiBase` to your Laravel/backend API when replacing the mock layer. Auth uses `Authorization: Bearer <token>` and `X-Tenant-Id` headers (see `app/utils/api-fetch.ts`).

**Locale cookie:** `i18n_locale` (`fa` | `en`)

---

## Project structure

```
app/
├── components/       # Feature UI (hr, finance, chat, meeting, notes, ai, layout, …)
├── composables/      # useApi, useAuth, usePermissions, useRealtime, useCalendar, …
├── layouts/          # default, auth, auth-onboarding, marketing, fullscreen
├── middleware/       # auth, guest, tenant, hr, finance, admin, manager, …
├── pages/            # File-based routes
├── plugins/          # auth-bootstrap, echo (mock), datepicker portal, …
├── stores/           # Pinia stores per domain
├── types/            # phase1.ts … phase4.ts
└── utils/            # api-client, currency-format, session-bootstrap, …

i18n/locales/         # fa.json, en.json

server/
├── api/v1/           # Mock REST handlers (mirror future backend)
└── utils/            # mock-db, phase1-db … phase4-db, permissions
```

### Mock data layers

| Module | Server util |
|--------|-------------|
| Core / projects / tasks | `phase1-db.ts` |
| HR / leave | `phase2-db.ts` |
| Finance | `phase3-db.ts` |
| Chat / meetings / AI / notes | `phase4-db.ts` |
| Phase 5 (correspondence, CRM, …) | `phase5-db.ts` |
| Phase 5 modules | `phase5-db.ts` |

All routes go through `useMockDb()` in `server/utils/mock-db.ts`.

---

## Main routes

### Core & projects

| Path | Description |
|------|-------------|
| `/` | Landing (marketing) |
| `/login`, `/register`, `/verify-otp` | Auth |
| `/onboarding` | Tenant setup |
| `/dashboard` | Dashboard |
| `/projects`, `/projects/[id]` | Projects & kanban |
| `/projects/[id]/sprints`, `/reports`, `/settings` | Sprints & analytics |
| `/teams`, `/members` | Teams & invites |
| `/worklog`, `/worklog/team` | Time tracking |
| `/calendar` | Calendar |
| `/notifications`, `/settings` | Notifications & profile |

### HR & leave

| Path | Description |
|------|-------------|
| `/hr` | HR dashboard |
| `/hr/personnel`, `/hr/personnel/[id]` | Personnel |
| `/hr/attendance`, `/hr/attendance/my` | Attendance |
| `/hr/contracts`, `/hr/documents`, `/hr/missions` | Contracts, docs, missions |
| `/hr/recruitment`, `/hr/recruitment/[id]` | Recruitment |
| `/hr/onboarding`, `/hr/settings` | Onboarding & HR settings |
| `/leave`, `/leave/requests`, `/leave/policies` | Leave |

### Finance

| Path | Description |
|------|-------------|
| `/finance` | Finance dashboard |
| `/finance/expenses`, `/finance/expenses/my` | Expenses |
| `/finance/budgets`, `/finance/invoices` | Budgets & invoices |
| `/finance/purchase-requests`, `/finance/purchase-orders` | Procurement |
| `/finance/vendors`, `/finance/payroll` | Vendors & payroll |
| `/my-finance` | Personal finance view |

### Collaboration

| Path | Description |
|------|-------------|
| `/chat`, `/chat/[channelId]` | Messenger (roster + conversation) |
| `/meetings`, `/meetings/[id]`, `/meetings/[id]/room` | Meetings |
| `/ai` | AI assistant |
| `/notes` | Notes |
| `/settings/notifications` | Notification preferences |

### Phase 5

| Path | Description |
|------|-------------|
| `/correspondence`, `/correspondence/inbox`, `/correspondence/[id]` | Correspondence & routing |
| `/surveys`, `/surveys/[id]`, `/surveys/[id]/edit`, `/surveys/[id]/report` | Surveys |
| `/crm`, `/crm/contacts`, `/crm/opportunities` | CRM |
| `/reports`, `/reports/new`, `/reports/[id]` | Custom report builder |
| `/projects/[id]/files` | Project file manager |
| `/subscription`, `/subscription/checkout` | Subscription (OWNER) |
| `/performance`, `/performance/objectives`, `/performance/reviews` | KPI / OKR / reviews |
| `/super-admin/*` | Super admin panel (`superadmin@midesk.io` / `superadmin`) |

---

## Conventions

### Page header

Use `LayoutMideskPageHeader` with `#actions` and `LayoutMideskPageHeaderButton`:

```vue
<LayoutMideskPageHeader :title="t('nav.notes')" :subtitle="t('notes.pageSubtitle')">
  <template #actions>
    <LayoutMideskPageHeaderButton variant="primary" icon="i-lucide-plus" @click="open = true">
      {{ t('notes.create') }}
    </LayoutMideskPageHeaderButton>
  </template>
</LayoutMideskPageHeader>
```

Button variants: `primary`, `outline`, `soft-primary`, `soft-neutral`, `nav` (back).

### Filter tabs

Use `UiSegmentTabs` for pill-style filters (meetings, notes, etc.).

### Permissions

Server: `requireAuthWithPermission(event, 'resource:action')`  
Client: `usePermissions().can('finance:expenses:view')`  
Role matrix: `server/utils/permissions.ts`

### API from stores

```ts
import { storeApi } from '~/utils/api-client'
await storeApi<{ data: T[] }>('/notes')
```

---

## Replacing the mock API

1. Set `runtimeConfig.public.apiBase` to your backend URL (e.g. `https://api.example.com/v1`).
2. Keep the same route shapes and `{ data: … }` response envelope where possible.
3. Implement real broadcasting auth at `/api/v1/broadcasting/auth` for WebSockets.
4. Remove or disable Nitro handlers under `server/api/v1/` when fully migrated.

---

## License

Private — © Midesk. All rights reserved unless otherwise specified by the repository owner.
