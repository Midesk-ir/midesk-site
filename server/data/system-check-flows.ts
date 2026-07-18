import type { SystemCheckFlow } from '../../app/types/system-check'

export const SYSTEM_CHECK_FLOWS: SystemCheckFlow[] = [
  {
    id: 'auth-session',
    module: 'auth',
    label: 'Session bootstrap',
    description: 'Login, bootstrap tenant context, load profile',
    pages: ['/login', '/dashboard'],
    steps: [
      { id: 'login', label: 'Login', method: 'POST', path: '/auth/login', auth: 'none', expectStatus: 200 },
      { id: 'bootstrap', label: 'Bootstrap', method: 'GET', path: '/core/bootstrap', auth: 'tenant', expectStatus: 200 },
      { id: 'me', label: 'Current user', method: 'GET', path: '/core/me', auth: 'tenant', expectStatus: 200 }
    ]
  },
  {
    id: 'core-dashboard',
    module: 'core',
    label: 'Core overview',
    description: 'Bootstrap, dashboard summary, org profile',
    pages: ['/dashboard', '/settings'],
    steps: [
      { id: 'bootstrap', label: 'Bootstrap', method: 'GET', path: '/core/bootstrap', auth: 'tenant', expectStatus: 200 },
      { id: 'dashboard', label: 'Dashboard summary', method: 'GET', path: '/dashboard/summary', auth: 'tenant', expectStatus: 200 },
      { id: 'org', label: 'Current org', method: 'GET', path: '/orgs/current', auth: 'tenant', expectStatus: 200 },
      { id: 'members', label: 'Org members', method: 'GET', path: '/orgs/current/members', auth: 'tenant', expectStatus: 200 }
    ]
  },
  {
    id: 'projects-list',
    module: 'projects',
    label: 'Projects workspace',
    description: 'List projects and supporting task metadata',
    pages: ['/projects'],
    steps: [
      { id: 'projects', label: 'Projects list', method: 'GET', path: '/projects', auth: 'tenant', expectStatus: 200 },
      { id: 'labels', label: 'Task labels', method: 'GET', path: '/tasks/labels/all', auth: 'tenant', expectStatus: 200 }
    ]
  },
  {
    id: 'work-time',
    module: 'worklogs',
    label: 'Work time tracking',
    description: 'Personal and team worklog views',
    pages: ['/worklog'],
    steps: [
      { id: 'my', label: 'My worklogs', method: 'GET', path: '/worklogs/my', auth: 'tenant', expectStatus: 200 },
      { id: 'team', label: 'Team worklogs', method: 'GET', path: '/worklogs/team', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'reports', label: 'Worklog reports', method: 'GET', path: '/worklogs/reports', auth: 'tenant', expectStatus: 200, optional: true }
    ]
  },
  {
    id: 'calendar-leave',
    module: 'calendar',
    label: 'Calendar & leave',
    description: 'Events, holidays, leave balances',
    pages: ['/calendar', '/leave'],
    steps: [
      { id: 'events', label: 'Calendar events', method: 'GET', path: '/calendar/events', auth: 'tenant', expectStatus: 200 },
      { id: 'holidays', label: 'Holidays', method: 'GET', path: '/calendar/holidays', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'leave-types', label: 'Leave types', method: 'GET', path: '/leave/types', auth: 'tenant', expectStatus: 200 },
      { id: 'leave-balance', label: 'Leave balance', method: 'GET', path: '/leave/balance', auth: 'tenant', expectStatus: 200 },
      { id: 'leave-my', label: 'My leave requests', method: 'GET', path: '/leave/requests/my', auth: 'tenant', expectStatus: 200 }
    ]
  },
  {
    id: 'hr-overview',
    module: 'hr',
    label: 'HR operations',
    description: 'HR dashboard, personnel, attendance',
    pages: ['/hr'],
    steps: [
      { id: 'dashboard', label: 'HR dashboard', method: 'GET', path: '/hr/dashboard', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'personnel', label: 'Personnel list', method: 'GET', path: '/hr/personnel', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'attendance-today', label: 'Attendance today', method: 'GET', path: '/hr/attendance/today', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'attendance-my', label: 'My attendance', method: 'GET', path: '/hr/attendance/my', auth: 'tenant', expectStatus: 200, optional: true }
    ]
  },
  {
    id: 'finance-overview',
    module: 'finance',
    label: 'Finance workspace',
    description: 'Finance dashboard, expenses, budgets',
    pages: ['/finance'],
    steps: [
      { id: 'dashboard', label: 'Finance dashboard', method: 'GET', path: '/finance/dashboard', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'expenses', label: 'Expenses list', method: 'GET', path: '/finance/expenses', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'budgets', label: 'Budgets', method: 'GET', path: '/finance/budgets', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'vendors', label: 'Vendors', method: 'GET', path: '/finance/vendors', auth: 'tenant', expectStatus: 200, optional: true }
    ]
  },
  {
    id: 'collaboration',
    module: 'chat',
    label: 'Collaboration suite',
    description: 'Chat, meetings, notes, AI requests',
    pages: ['/chat', '/meetings', '/notes', '/ai'],
    steps: [
      { id: 'channels', label: 'Chat channels', method: 'GET', path: '/chat/channels', auth: 'tenant', expectStatus: 200 },
      { id: 'unread', label: 'Unread messages', method: 'GET', path: '/chat/channels/unread', auth: 'tenant', expectStatus: 200 },
      { id: 'meetings', label: 'Meetings list', method: 'GET', path: '/meetings', auth: 'tenant', expectStatus: 200 },
      { id: 'meetings-today', label: 'Today meetings', method: 'GET', path: '/meetings/today', auth: 'tenant', expectStatus: 200 },
      { id: 'notes', label: 'My notes', method: 'GET', path: '/notes/my', auth: 'tenant', expectStatus: 200 },
      { id: 'ai-requests', label: 'AI requests', method: 'GET', path: '/ai/requests', auth: 'tenant', expectStatus: 200, optional: true }
    ]
  },
  {
    id: 'notifications',
    module: 'notifications',
    label: 'Notifications',
    description: 'Inbox, unread count, preferences',
    pages: ['/notifications', '/settings/notifications'],
    steps: [
      { id: 'list', label: 'Notifications', method: 'GET', path: '/notifications', auth: 'tenant', expectStatus: 200 },
      { id: 'count', label: 'Unread count', method: 'GET', path: '/notifications/count', auth: 'tenant', expectStatus: 200 },
      { id: 'prefs', label: 'Preferences', method: 'GET', path: '/notification-preferences', auth: 'tenant', expectStatus: 200 }
    ]
  },
  {
    id: 'org-directory',
    module: 'members',
    label: 'Org directory',
    description: 'Members, teams, guests, permissions',
    pages: ['/members', '/teams'],
    steps: [
      { id: 'members', label: 'Members', method: 'GET', path: '/members', auth: 'tenant', expectStatus: 200 },
      { id: 'teams', label: 'Teams', method: 'GET', path: '/teams', auth: 'tenant', expectStatus: 200 },
      { id: 'guests', label: 'Guests', method: 'GET', path: '/guests', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'permissions', label: 'Role permissions', method: 'GET', path: '/roles/permissions', auth: 'tenant', expectStatus: 200, optional: true }
    ]
  },
  {
    id: 'correspondence',
    module: 'correspondences',
    label: 'Correspondence inbox',
    description: 'Inbox and correspondence listing',
    pages: ['/correspondence'],
    steps: [
      { id: 'inbox', label: 'Inbox', method: 'GET', path: '/correspondences/inbox', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'list', label: 'Correspondences', method: 'GET', path: '/correspondences', auth: 'tenant', expectStatus: 200, optional: true }
    ]
  },
  {
    id: 'surveys',
    module: 'surveys',
    label: 'Surveys',
    description: 'Survey listing for admins and respondents',
    pages: ['/surveys'],
    steps: [
      { id: 'list', label: 'Surveys list', method: 'GET', path: '/surveys', auth: 'tenant', expectStatus: 200, optional: true }
    ]
  },
  {
    id: 'crm',
    module: 'crm',
    label: 'CRM pipeline',
    description: 'CRM dashboard, contacts, opportunities',
    pages: ['/crm'],
    steps: [
      { id: 'dashboard', label: 'CRM dashboard', method: 'GET', path: '/crm/dashboard', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'contacts', label: 'Contacts', method: 'GET', path: '/crm/contacts', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'opportunities', label: 'Opportunities', method: 'GET', path: '/crm/opportunities', auth: 'tenant', expectStatus: 200, optional: true }
    ]
  },
  {
    id: 'reports',
    module: 'reports',
    label: 'Report builder',
    description: 'Saved reports and data sources',
    pages: ['/reports'],
    steps: [
      { id: 'list', label: 'Reports list', method: 'GET', path: '/reports', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'sources', label: 'Data sources', method: 'GET', path: '/reports/data-sources', auth: 'tenant', expectStatus: 200, optional: true }
    ]
  },
  {
    id: 'performance',
    module: 'performance',
    label: 'Performance management',
    description: 'Indicators, objectives, reviews',
    pages: ['/performance'],
    steps: [
      { id: 'dashboard', label: 'Performance dashboard', method: 'GET', path: '/performance/dashboard', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'indicators', label: 'Indicators', method: 'GET', path: '/performance/indicators', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'objectives', label: 'Objectives', method: 'GET', path: '/performance/objectives', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'reviews', label: 'Reviews', method: 'GET', path: '/performance/reviews', auth: 'tenant', expectStatus: 200, optional: true }
    ]
  },
  {
    id: 'subscription',
    module: 'subscription',
    label: 'Subscription billing',
    description: 'Plans, invoices, subscription status',
    pages: ['/subscription'],
    steps: [
      { id: 'status', label: 'Subscription status', method: 'GET', path: '/subscription', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'plans', label: 'Available plans', method: 'GET', path: '/subscription/plans', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'invoices', label: 'Invoices', method: 'GET', path: '/subscription/invoices', auth: 'tenant', expectStatus: 200, optional: true }
    ]
  },
  {
    id: 'my-finance',
    module: 'my-finance',
    label: 'Employee finance',
    description: 'Personal expenses and payslips',
    pages: ['/my-finance'],
    steps: [
      { id: 'expenses', label: 'My expenses', method: 'GET', path: '/my-finance/expenses', auth: 'tenant', expectStatus: 200, optional: true },
      { id: 'payslips', label: 'Payslips', method: 'GET', path: '/my-finance/payslips', auth: 'tenant', expectStatus: 200, optional: true }
    ]
  },
  {
    id: 'super-admin',
    module: 'super-admin',
    label: 'Super admin APIs',
    description: 'Platform dashboard, tenants, plans',
    pages: ['/super-admin/dashboard'],
    steps: [
      { id: 'dashboard', label: 'SA dashboard', method: 'GET', path: '/super-admin/dashboard', auth: 'super-admin', expectStatus: 200 },
      { id: 'tenants', label: 'Tenants list', method: 'GET', path: '/super-admin/tenants', auth: 'super-admin', expectStatus: 200 },
      { id: 'plans', label: 'Plans list', method: 'GET', path: '/super-admin/plans', auth: 'super-admin', expectStatus: 200 },
      { id: 'financial', label: 'Financial overview', method: 'GET', path: '/super-admin/financial', auth: 'super-admin', expectStatus: 200 },
      { id: 'consultations', label: 'Consultations', method: 'GET', path: '/super-admin/consultations', auth: 'super-admin', expectStatus: 200 }
    ]
  }
]
