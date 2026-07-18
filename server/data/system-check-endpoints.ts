export const SYSTEM_CHECK_ENDPOINTS = [
  {
    "method": "POST",
    "path": "/ai/query",
    "module": "ai",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/ai/requests",
    "module": "ai",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/ai/requests/:id",
    "module": "ai",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/ai/requests/:id/complete",
    "module": "ai",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/auth/login",
    "module": "auth",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/auth/login/otp",
    "module": "auth",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/auth/logout",
    "module": "auth",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/auth/register",
    "module": "auth",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/auth/verify-otp",
    "module": "auth",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/broadcasting/auth",
    "module": "broadcasting",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/calendar/events",
    "module": "calendar",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/calendar/events",
    "module": "calendar",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/calendar/holidays",
    "module": "calendar",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/calendar/shifts",
    "module": "calendar",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/chat/channels",
    "module": "chat",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/chat/channels",
    "module": "chat",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/chat/channels/:id",
    "module": "chat",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/chat/channels/:id/messages",
    "module": "chat",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/chat/channels/:id/messages",
    "module": "chat",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/chat/channels/:id/read",
    "module": "chat",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/chat/channels/unread",
    "module": "chat",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/chat/dm",
    "module": "chat",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/chat/messages/:id/reactions",
    "module": "chat",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/core/bootstrap",
    "module": "core",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/core/me",
    "module": "core",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "PATCH",
    "path": "/core/me",
    "module": "core",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/correspondences",
    "module": "correspondences",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/correspondences",
    "module": "correspondences",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/correspondences/:id",
    "module": "correspondences",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/correspondences/:id/route",
    "module": "correspondences",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/correspondences/:id/routing/:routingId/complete",
    "module": "correspondences",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/correspondences/:id/send",
    "module": "correspondences",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/correspondences/:id/sign",
    "module": "correspondences",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/correspondences/inbox",
    "module": "correspondences",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/crm/activities",
    "module": "crm",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/crm/activities",
    "module": "crm",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/crm/contacts",
    "module": "crm",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/crm/contacts",
    "module": "crm",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/crm/contacts/:id",
    "module": "crm",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/crm/contacts/:id",
    "module": "crm",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/crm/dashboard",
    "module": "crm",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/crm/opportunities",
    "module": "crm",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/crm/opportunities",
    "module": "crm",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/crm/opportunities/:id/stage",
    "module": "crm",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/dashboard/summary",
    "module": "dashboard",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/finance/budgets",
    "module": "finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/finance/budgets",
    "module": "finance",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/finance/budgets/overview",
    "module": "finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/finance/cost-centers",
    "module": "finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/finance/dashboard",
    "module": "finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/finance/expenses",
    "module": "finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/finance/expenses",
    "module": "finance",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/finance/expenses/:id/approve",
    "module": "finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/finance/expenses/:id/pay",
    "module": "finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/finance/expenses/:id/reject",
    "module": "finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/finance/expenses/:id/submit",
    "module": "finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/finance/expenses/summary",
    "module": "finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/finance/invoices",
    "module": "finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/finance/invoices",
    "module": "finance",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/finance/invoices/:id/pay",
    "module": "finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/finance/payroll",
    "module": "finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/finance/payroll/:id",
    "module": "finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/finance/payroll/:id/approve",
    "module": "finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/finance/payroll/bulk-pay",
    "module": "finance",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/finance/payroll/calculate",
    "module": "finance",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/finance/purchase-orders",
    "module": "finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/finance/purchase-requests",
    "module": "finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/finance/purchase-requests",
    "module": "finance",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/finance/purchase-requests/:id/convert-to-po",
    "module": "finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/finance/purchase-requests/:id/finance-review",
    "module": "finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/finance/purchase-requests/:id/owner-review",
    "module": "finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/finance/purchase-requests/:id/submit",
    "module": "finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/finance/vendors",
    "module": "finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/finance/vendors",
    "module": "finance",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/finance/vendors/:id",
    "module": "finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/guests",
    "module": "guests",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/guests",
    "module": "guests",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "DELETE",
    "path": "/guests/:id",
    "module": "guests",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/hr/attendance/break-end",
    "module": "hr",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/hr/attendance/break-start",
    "module": "hr",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/hr/attendance/check-in",
    "module": "hr",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/hr/attendance/check-out",
    "module": "hr",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/hr/attendance/my",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/hr/attendance/report",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/hr/attendance/today",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/hr/candidates",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/hr/candidates/:id/hire",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/hr/candidates/:id/resume",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/hr/candidates/:id/status",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/hr/contracts",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/hr/contracts",
    "module": "hr",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/hr/contracts/:id/renew",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/hr/contracts/expiring",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/hr/dashboard",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/hr/documents",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/hr/documents",
    "module": "hr",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/hr/documents/:id/download",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/hr/interviews",
    "module": "hr",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/hr/interviews/:id",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/hr/missions",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/hr/missions",
    "module": "hr",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/hr/missions/:id/approve",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/hr/missions/:id/reject",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/hr/missions/my",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/hr/onboarding/progress",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "PATCH",
    "path": "/hr/onboarding/progress/:id/complete-step",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/hr/onboarding/templates",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "PATCH",
    "path": "/hr/onboarding/templates/:id",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/hr/personnel",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/hr/personnel",
    "module": "hr",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "DELETE",
    "path": "/hr/personnel/:id",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/hr/personnel/:id",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/hr/personnel/:id",
    "module": "hr",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/hr/requisitions",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/hr/requisitions",
    "module": "hr",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/hr/settings",
    "module": "hr",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "PATCH",
    "path": "/hr/settings",
    "module": "hr",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/leave/balance",
    "module": "leave",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/leave/policies",
    "module": "leave",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/leave/policies",
    "module": "leave",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/leave/policies/:id",
    "module": "leave",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/leave/report",
    "module": "leave",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/leave/requests",
    "module": "leave",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/leave/requests/:id/approve",
    "module": "leave",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/leave/requests/:id/reject",
    "module": "leave",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/leave/requests/my",
    "module": "leave",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/leave/requests/pending",
    "module": "leave",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/leave/types",
    "module": "leave",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/meetings",
    "module": "meetings",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/meetings",
    "module": "meetings",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/meetings/:id",
    "module": "meetings",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/meetings/:id/start",
    "module": "meetings",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/meetings/today",
    "module": "meetings",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/members",
    "module": "members",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/my-finance/expenses",
    "module": "my-finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/my-finance/payslips",
    "module": "my-finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/my-finance/payslips/:id",
    "module": "my-finance",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/my-finance/receipts",
    "module": "my-finance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/notes",
    "module": "notes",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/notes",
    "module": "notes",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "DELETE",
    "path": "/notes/:id",
    "module": "notes",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/notes/:id",
    "module": "notes",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/notes/:id/pin",
    "module": "notes",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/notes/my",
    "module": "notes",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/notification-preferences",
    "module": "notification-preferences",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "PATCH",
    "path": "/notification-preferences/:eventType",
    "module": "notification-preferences",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/notification-preferences/events",
    "module": "notification-preferences",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/notifications",
    "module": "notifications",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "PATCH",
    "path": "/notifications/:id/read",
    "module": "notifications",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/notifications/count",
    "module": "notifications",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/notifications/read-all",
    "module": "notifications",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/orgs",
    "module": "orgs",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/orgs/current",
    "module": "orgs",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "PATCH",
    "path": "/orgs/current",
    "module": "orgs",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/orgs/current/members",
    "module": "orgs",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/orgs/current/members/invite",
    "module": "orgs",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/performance/dashboard",
    "module": "performance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/performance/indicators",
    "module": "performance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/performance/objectives",
    "module": "performance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/performance/reviews",
    "module": "performance",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/projects",
    "module": "projects",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/projects",
    "module": "projects",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/projects/:id",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/projects/:id/backlog",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/projects/:id/board",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/projects/:id/columns",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/projects/:id/columns",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "DELETE",
    "path": "/projects/:id/columns/:colId",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/projects/:id/columns/:colId",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/projects/:id/columns/reorder",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/projects/:id/files",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/projects/:id/files",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "DELETE",
    "path": "/projects/:id/files/:fileId",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/projects/:id/files/:fileId/new-version",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/projects/:id/members",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/projects/:id/report/cfd",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/projects/:id/report/velocity",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/projects/:id/sprints",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/projects/:id/sprints",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/projects/:id/sprints/:sprintId",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/projects/:id/sprints/:sprintId/activate",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/projects/:id/sprints/:sprintId/close",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/projects/:id/tasks",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/projects/:id/tasks",
    "module": "projects",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/reports",
    "module": "reports",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/reports",
    "module": "reports",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/reports/:id",
    "module": "reports",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/reports/data-sources",
    "module": "reports",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/reports/preview",
    "module": "reports",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/roles/custom",
    "module": "roles",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/roles/custom",
    "module": "roles",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "DELETE",
    "path": "/roles/custom/:id",
    "module": "roles",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/roles/custom/:id",
    "module": "roles",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/roles/permissions",
    "module": "roles",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/sprints/:id/report/burndown",
    "module": "sprints",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/subscription",
    "module": "subscription",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/subscription/invoices",
    "module": "subscription",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/subscription/pay",
    "module": "subscription",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/subscription/plans",
    "module": "subscription",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/subscription/verify",
    "module": "subscription",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/super-admin/auth/login",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/super-admin/consultations",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "PATCH",
    "path": "/super-admin/consultations/:id",
    "module": "super-admin",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/super-admin/dashboard",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/super-admin/financial",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/super-admin/plans",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/super-admin/plans",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "DELETE",
    "path": "/super-admin/plans/:id",
    "module": "super-admin",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/super-admin/plans/:id",
    "module": "super-admin",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/super-admin/settings",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "PATCH",
    "path": "/super-admin/settings",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/super-admin/system-check/catalog",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/super-admin/system-check/health",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/super-admin/system-check/probe",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/super-admin/system-check/run-all-flows",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/super-admin/system-check/run-flow",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/super-admin/system-check/run-module",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/super-admin/tenants",
    "module": "super-admin",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/super-admin/tenants/:id/suspend",
    "module": "super-admin",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/surveys",
    "module": "surveys",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/surveys",
    "module": "surveys",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/surveys/:id",
    "module": "surveys",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/surveys/:id",
    "module": "surveys",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/surveys/:id/publish",
    "module": "surveys",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/surveys/:id/report",
    "module": "surveys",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/surveys/:id/respond",
    "module": "surveys",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/tasks/:id",
    "module": "tasks",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/tasks/:id",
    "module": "tasks",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/tasks/:id/checklist",
    "module": "tasks",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/tasks/:id/checklist",
    "module": "tasks",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/tasks/:id/comments",
    "module": "tasks",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "POST",
    "path": "/tasks/:id/comments",
    "module": "tasks",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/tasks/:id/move",
    "module": "tasks",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/tasks/:id/sprint",
    "module": "tasks",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/tasks/labels/all",
    "module": "tasks",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/teams",
    "module": "teams",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "POST",
    "path": "/worklogs",
    "module": "worklogs",
    "hasParams": false,
    "safeGet": false
  },
  {
    "method": "DELETE",
    "path": "/worklogs/:id",
    "module": "worklogs",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "PATCH",
    "path": "/worklogs/:id",
    "module": "worklogs",
    "hasParams": true,
    "safeGet": false
  },
  {
    "method": "GET",
    "path": "/worklogs/my",
    "module": "worklogs",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/worklogs/reports",
    "module": "worklogs",
    "hasParams": false,
    "safeGet": true
  },
  {
    "method": "GET",
    "path": "/worklogs/team",
    "module": "worklogs",
    "hasParams": false,
    "safeGet": true
  }
] as const
