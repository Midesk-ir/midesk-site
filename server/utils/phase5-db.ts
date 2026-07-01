import { randomUUID } from 'node:crypto'
import type { UserBrief } from '../../app/types/phase1'
import type {
  CheckoutPayload,
  Correspondence,
  CreateCorrespondencePayload,
  CreateCrmActivityPayload,
  CreateCrmContactPayload,
  CreateCrmOpportunityPayload,
  CreateCustomRolePayload,
  CreateReportPayload,
  CreateSurveyPayload,
  CrmActivity,
  CrmContact,
  CrmDashboard,
  CrmOpportunity,
  CrmOpportunityStage,
  CustomReport,
  CustomRole,
  CurrentSubscription,
  DataSourceInfo,
  GuestAccess,
  InviteGuestPayload,
  PerformanceDashboard,
  PerformanceIndicator,
  PerformanceObjective,
  PerformanceReview,
  ProjectFile,
  ProjectFolder,
  ReportPreviewResult,
  RouteCorrespondencePayload,
  SaConsultation,
  SaDashboardStats,
  SaFinancialStats,
  SaPlatformSettings,
  SaTenant,
  SubscriptionInvoice,
  SubscriptionPlan,
  Survey,
  SurveyReportItem,
  SurveyResponsePayload
} from '../../app/types/phase5'

const users: UserBrief[] = [
  { id: 'u1', name: 'علی محمدآبادی', avatar_url: null },
  { id: 'u2', name: 'Sara Johnson', avatar_url: null },
  { id: 'u3', name: 'محمد کریمی', avatar_url: null }
]

declare global {
  // eslint-disable-next-line no-var
  var __midesk_sa_sessions: Map<string, { token: string }> | undefined
}

const saSessions = globalThis.__midesk_sa_sessions ??= new Map<string, { token: string }>()
const SA_EMAIL = 'superadmin@midesk.io'
const SA_PASSWORD = 'superadmin'

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'pl-free',
    code: 'free',
    name: 'رایگان',
    features: ['۵ کاربر', '۲ پروژه', 'پشتیبانی ایمیل'],
    price_monthly: { IR: 0, INTL: 0 },
    price_yearly: { IR: 0, INTL: 0 },
    max_users: 5,
    max_projects: 2
  },
  {
    id: 'pl-starter',
    code: 'starter',
    name: 'استارتر',
    features: ['۲۰ کاربر', '۱۰ پروژه', 'HR پایه', 'چت'],
    price_monthly: { IR: 2_900_000, INTL: 29 },
    price_yearly: { IR: 29_000_000, INTL: 290 },
    max_users: 20,
    max_projects: 10
  },
  {
    id: 'pl-pro',
    code: 'pro',
    name: 'حرفه‌ای',
    features: ['۱۰۰ کاربر', 'پروژه نامحدود', 'CRM', 'گزارش‌ساز', 'AI'],
    price_monthly: { IR: 9_900_000, INTL: 99 },
    price_yearly: { IR: 99_000_000, INTL: 990 },
    max_users: 100,
    max_projects: 999
  },
  {
    id: 'pl-enterprise',
    code: 'enterprise',
    name: 'سازمانی',
    features: ['کاربر نامحدود', 'SSO', 'SLA', 'پشتیبانی اختصاصی'],
    price_monthly: { IR: 29_900_000, INTL: 299 },
    price_yearly: { IR: 299_000_000, INTL: 2990 },
    max_users: 9999,
    max_projects: 9999
  }
]

let guests: GuestAccess[] = [
  {
    id: 'g1',
    email: 'guest@example.com',
    name: 'مهمان نمونه',
    role: 'viewer',
    project_ids: ['p1'],
    expires_at: '2026-12-31T23:59:59Z',
    created_at: '2026-05-01T10:00:00Z'
  }
]

let customRoles: CustomRole[] = [
  {
    id: 'cr1',
    name: 'حسابدار',
    permissions: ['finance:expenses:view', 'finance:invoices:view', 'finance:budgets:view'],
    created_at: '2026-04-01T10:00:00Z'
  }
]

let correspondences: Correspondence[] = [
  {
    id: 'corr1',
    number: '1404/001',
    type: 'internal',
    subject: 'درخواست تأیید بودجه فصل سوم',
    body: 'با سلام، لطفاً بودجه پیشنهادی فصل سوم را بررسی و تأیید فرمایید.',
    priority: 'normal',
    status: 'sent',
    routing: [
      {
        id: 'rt1',
        from: users[0]!,
        to: users[2]!,
        action: 'approve',
        status: 'pending',
        due_date: '2026-07-15',
        created_at: '2026-06-28T09:00:00Z'
      }
    ],
    created_at: '2026-06-28T08:00:00Z',
    updated_at: '2026-06-28T09:00:00Z'
  },
  {
    id: 'corr2',
    number: '1404/002',
    type: 'incoming',
    subject: 'نامه رسمی سازمان همکار',
    body: 'نامه دریافتی از سازمان همکار در خصوص تفاهم‌نامه.',
    priority: 'urgent',
    status: 'received',
    routing: [],
    created_at: '2026-06-25T10:00:00Z',
    updated_at: '2026-06-25T10:00:00Z'
  }
]

let surveys: Survey[] = [
  {
    id: 'sv1',
    title: 'رضایت‌سنجی محیط کار',
    type: 'survey',
    status: 'active',
    responses_count: 12,
    questions: [
      { id: 'q1', title: 'میزان رضایت کلی', type: 'rating', is_required: true, order_index: 0 },
      {
        id: 'q2',
        title: 'مهم‌ترین اولویت بهبود',
        type: 'single_choice',
        options: ['حقوق', 'محیط کار', 'مدیریت', 'آموزش'],
        is_required: true,
        order_index: 1
      },
      { id: 'q3', title: 'پیشنهادات', type: 'textarea', is_required: false, order_index: 2 }
    ],
    created_at: '2026-06-01T10:00:00Z'
  }
]

const surveyResponses: Record<string, SurveyResponsePayload[]> = {
  sv1: [
    { answers: { q1: 4, q2: 'محیط کار', q3: 'فضای استراحت بهتر' } },
    { answers: { q1: 5, q2: 'آموزش', q3: '' } }
  ]
}

let crmContacts: CrmContact[] = [
  {
    id: 'ct1',
    name: 'شرکت فناوری نوین',
    company: 'فناوری نوین',
    email: 'info@novin.ir',
    phone: '02112345678',
    type: 'lead',
    assigned_to: users[0],
    tags: ['B2B', 'فناوری'],
    created_at: '2026-05-10T10:00:00Z'
  },
  {
    id: 'ct2',
    name: 'رضا احمدی',
    company: 'تجارت الکترونیک پارس',
    email: 'r.ahmadi@pars.com',
    type: 'customer',
    assigned_to: users[1],
    tags: ['VIP'],
    created_at: '2026-04-20T10:00:00Z'
  }
]

let crmOpportunities: CrmOpportunity[] = [
  {
    id: 'op1',
    title: 'قرارداد پلتفرم Midesk',
    contact: crmContacts[0]!,
    value: 150_000_000,
    currency: 'IRR',
    stage: 'proposal',
    probability: 60,
    expected_close_date: '2026-08-30',
    created_at: '2026-05-15T10:00:00Z'
  },
  {
    id: 'op2',
    title: 'تمدید اشتراک سالانه',
    contact: crmContacts[1]!,
    value: 99_000_000,
    currency: 'IRR',
    stage: 'negotiation',
    probability: 80,
    expected_close_date: '2026-07-20',
    created_at: '2026-06-01T10:00:00Z'
  }
]

let crmActivities: CrmActivity[] = [
  {
    id: 'act1',
    contact_id: 'ct1',
    type: 'call',
    subject: 'تماس اولیه',
    notes: 'علاقه‌مند به دمو',
    performed_by: users[0]!,
    performed_at: '2026-06-20T14:00:00Z'
  }
]

let customReports: CustomReport[] = [
  {
    id: 'rpt1',
    name: 'گزارش هزینه‌های ماهانه',
    data_source: 'expenses',
    filters: [{ field: 'status', operator: 'eq', value: 'approved' }],
    columns: ['title', 'amount', 'date', 'category'],
    chart_type: 'bar',
    created_at: '2026-06-01T10:00:00Z'
  }
]

let projectFolders: ProjectFolder[] = [
  { id: 'f1', project_id: 'p1', parent_id: null, name: 'مستندات' },
  { id: 'f2', project_id: 'p1', parent_id: 'f1', name: 'طراحی' }
]

let projectFiles: ProjectFile[] = [
  {
    id: 'pf1',
    project_id: 'p1',
    folder_id: 'f2',
    name: 'wireframe-v2.pdf',
    file_path: '/mock/files/wireframe-v2.pdf',
    file_size: 1_024_000,
    mime_type: 'application/pdf',
    version: 2,
    uploaded_by: users[0]!,
    created_at: '2026-06-15T10:00:00Z'
  },
  {
    id: 'pf2',
    project_id: 'p1',
    folder_id: null,
    name: 'logo.png',
    file_path: '/mock/files/logo.png',
    file_size: 256_000,
    mime_type: 'image/png',
    version: 1,
    uploaded_by: users[1]!,
    created_at: '2026-06-10T10:00:00Z'
  }
]

let subscriptionInvoices: SubscriptionInvoice[] = [
  {
    id: 'inv1',
    amount: 9_900_000,
    currency: 'IRR',
    status: 'paid',
    due_date: '2026-06-01',
    paid_at: '2026-05-28T10:00:00Z',
    plan_name: 'حرفه‌ای'
  },
  {
    id: 'inv2',
    amount: 9_900_000,
    currency: 'IRR',
    status: 'pending',
    due_date: '2026-07-01',
    plan_name: 'حرفه‌ای'
  }
]

let saTenants: SaTenant[] = [
  { id: 't1', name: 'Midesk Demo', plan_code: 'pro', status: 'active', users_count: 5, created_at: '2025-01-01', mrr: 9_900_000 },
  { id: 't2', name: 'Acme Corp', plan_code: 'starter', status: 'active', users_count: 12, created_at: '2025-06-15', mrr: 2_900_000 },
  { id: 't3', name: 'Startup XYZ', plan_code: 'free', status: 'trial', users_count: 3, created_at: '2026-06-01', mrr: 0 }
]

let saConsultations: SaConsultation[] = [
  {
    id: 'con1',
    name: 'امیر حسینی',
    email: 'amir@company.ir',
    company: 'شرکت ABC',
    message: 'علاقه‌مند به دمو سازمانی هستیم.',
    status: 'pending',
    created_at: '2026-06-28T10:00:00Z'
  }
]

let saSettings: SaPlatformSettings = {
  platform_name: 'Midesk',
  support_email: 'support@midesk.io',
  default_trial_days: 14,
  maintenance_mode: false
}

let performanceIndicators: PerformanceIndicator[] = [
  { id: 'kpi1', name: 'نرخ تحویل به‌موقع', description: 'درصد تسک‌های تحویل‌شده در موعد', unit: '%', target: 90, current: 85, owner: users[0]! },
  { id: 'kpi2', name: 'رضایت مشتری', unit: 'امتیاز', target: 4.5, current: 4.2, owner: users[1]! }
]

let performanceObjectives: PerformanceObjective[] = [
  {
    id: 'obj1',
    title: 'افزایش بهره‌وری تیم',
    status: 'on_track',
    progress: 65,
    owner: users[0]!,
    due_date: '2026-09-30',
    key_results: [
      { id: 'kr1', title: 'کاهش ۲۰٪ زمان review', progress: 70 },
      { id: 'kr2', title: 'افزایش velocity ۱۵٪', progress: 60 }
    ]
  }
]

let performanceReviews: PerformanceReview[] = [
  {
    id: 'rev1',
    employee: users[2]!,
    reviewer: users[0]!,
    period: 'Q2 2026',
    status: 'scheduled',
    scheduled_at: '2026-07-10T10:00:00Z'
  }
]

const DATA_SOURCES: DataSourceInfo[] = [
  { id: 'tasks', label: 'Tasks', columns: ['title', 'status', 'priority', 'assignee', 'due_date'] },
  { id: 'attendance', label: 'Attendance', columns: ['user', 'date', 'check_in', 'check_out', 'hours'] },
  { id: 'expenses', label: 'Expenses', columns: ['title', 'amount', 'date', 'category', 'status'] },
  { id: 'leave', label: 'Leave', columns: ['user', 'type', 'start_date', 'end_date', 'status'] },
  { id: 'worklogs', label: 'Worklogs', columns: ['user', 'task', 'minutes', 'date'] }
]

const EXPENSE_PREVIEW_ROWS = [
  { title: 'سفر کاری اصفهان', amount: 18_500_000, date: '1404/01/12', category: 'سفر', status: 'approved' },
  { title: 'خرید لوازم اداری', amount: 4_200_000, date: '1404/01/28', category: 'اداری', status: 'approved' },
  { title: 'لایسنس Figma', amount: 9_800_000, date: '1404/02/05', category: 'نرم‌افزار', status: 'approved' },
  { title: 'ناهار تیم', amount: 3_100_000, date: '1404/02/18', category: 'پذیرایی', status: 'approved' },
  { title: 'هتل کنفرانس', amount: 22_000_000, date: '1404/03/02', category: 'سفر', status: 'approved' },
  { title: 'تجهیزات شبکه', amount: 15_600_000, date: '1404/03/20', category: 'تجهیزات', status: 'approved' }
]

const EXPENSE_MONTH_LABELS = ['فروردین', 'اردیبهشت', 'خرداد'] as const

function buildExpensePreview(payload: CreateReportPayload): ReportPreviewResult {
  const rows = EXPENSE_PREVIEW_ROWS.map((src) => {
    const row: Record<string, string | number> = {}
    for (const col of payload.columns) {
      if (col in src) row[col] = src[col as keyof typeof src]!
    }
    return row
  })

  let chart_data: Record<string, number> | undefined
  if (payload.chart_type && payload.chart_type !== 'table') {
    chart_data = {}
    for (const [i, src] of EXPENSE_PREVIEW_ROWS.entries()) {
      const month = EXPENSE_MONTH_LABELS[Math.min(Math.floor(i / 2), EXPENSE_MONTH_LABELS.length - 1)]!
      chart_data[month] = (chart_data[month] ?? 0) + src.amount
    }
  }

  return { columns: payload.columns, rows, chart_data }
}

function buildGenericPreview(payload: CreateReportPayload): ReportPreviewResult {
  const rows = Array.from({ length: 5 }, (_, i) => {
    const row: Record<string, string | number> = {}
    for (const col of payload.columns) row[col] = `${col}-${i + 1}`
    if (payload.columns.includes('amount')) row.amount = (i + 1) * 1_000_000
    return row
  })
  const chart_data: Record<string, number> = {}
  if (payload.chart_type && payload.chart_type !== 'table') {
    payload.columns.slice(0, 4).forEach((c, i) => { chart_data[c] = (i + 1) * 1_000_000 })
  }
  return { columns: payload.columns, rows, chart_data }
}

function userBrief(id: string): UserBrief {
  return users.find(u => u.id === id) ?? { id, name: 'Unknown', avatar_url: null }
}

function nextCorrNumber() {
  const n = correspondences.length + 1
  return `1404/${String(n).padStart(3, '0')}`
}

export function usePhase5Db() {
  return {
    // ── Guests ──
    listGuests() { return guests },
    inviteGuest(payload: InviteGuestPayload) {
      const g: GuestAccess = { id: randomUUID(), ...payload, created_at: new Date().toISOString() }
      guests.push(g)
      return g
    },
    revokeGuest(id: string) {
      guests = guests.filter(g => g.id !== id)
    },

    // ── Custom Roles ──
    listCustomRoles() { return customRoles },
    createCustomRole(payload: CreateCustomRolePayload) {
      const r: CustomRole = { id: randomUUID(), ...payload, created_at: new Date().toISOString() }
      customRoles.push(r)
      return r
    },
    updateCustomRole(id: string, payload: Partial<CreateCustomRolePayload>) {
      const idx = customRoles.findIndex(r => r.id === id)
      if (idx < 0) throw createError({ statusCode: 404, message: 'Not found' })
      customRoles[idx] = { ...customRoles[idx]!, ...payload }
      return customRoles[idx]!
    },
    deleteCustomRole(id: string) {
      customRoles = customRoles.filter(r => r.id !== id)
    },
    listAllPermissions() {
      return Object.values(usePermissionsList())
    },

    // ── Correspondence ──
    listCorrespondences(type?: string, status?: string) {
      let list = [...correspondences]
      if (type) list = list.filter(c => c.type === type)
      if (status) list = list.filter(c => c.status === status)
      return list.sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    },
    getCorrespondence(id: string) {
      const c = correspondences.find(x => x.id === id)
      if (!c) throw createError({ statusCode: 404, message: 'Not found' })
      return c
    },
    createCorrespondence(userId: string, payload: CreateCorrespondencePayload) {
      const c: Correspondence = {
        id: randomUUID(),
        number: nextCorrNumber(),
        type: payload.type,
        subject: payload.subject,
        body: payload.body,
        priority: payload.priority ?? 'normal',
        status: 'draft',
        parent_id: payload.parent_id,
        routing: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      correspondences.unshift(c)
      return c
    },
    sendCorrespondence(id: string) {
      const c = this.getCorrespondence(id)
      c.status = c.type === 'outgoing' ? 'sent' : c.type === 'incoming' ? 'received' : 'sent'
      c.updated_at = new Date().toISOString()
      return c
    },
    signCorrespondence(id: string, userId: string) {
      const c = this.getCorrespondence(id)
      c.signed_by = userBrief(userId)
      c.updated_at = new Date().toISOString()
      return c
    },
    routeCorrespondence(id: string, fromUserId: string, payload: RouteCorrespondencePayload) {
      const c = this.getCorrespondence(id)
      const routing = {
        id: randomUUID(),
        from: userBrief(fromUserId),
        to: userBrief(payload.to_user_id),
        action: payload.action,
        status: 'pending' as const,
        note: payload.note,
        due_date: payload.due_date,
        created_at: new Date().toISOString()
      }
      c.routing.push(routing)
      c.updated_at = new Date().toISOString()
      return c
    },
    inbox(userId: string) {
      return correspondences.flatMap(c =>
        c.routing
          .filter(r => r.to.id === userId)
          .map(r => ({ correspondence: c, routing: r }))
      )
    },
    completeRouting(corrId: string, routingId: string) {
      const c = this.getCorrespondence(corrId)
      const r = c.routing.find(x => x.id === routingId)
      if (!r) throw createError({ statusCode: 404, message: 'Routing not found' })
      r.status = 'completed'
      c.updated_at = new Date().toISOString()
      return c
    },

    // ── Surveys ──
    listSurveys() { return surveys },
    getSurvey(id: string) {
      const s = surveys.find(x => x.id === id)
      if (!s) throw createError({ statusCode: 404, message: 'Not found' })
      return s
    },
    createSurvey(payload: CreateSurveyPayload) {
      const s: Survey = {
        id: randomUUID(),
        title: payload.title,
        type: payload.type ?? 'survey',
        status: 'draft',
        responses_count: 0,
        questions: payload.questions ?? [],
        created_at: new Date().toISOString()
      }
      surveys.unshift(s)
      return s
    },
    updateSurvey(id: string, payload: Partial<CreateSurveyPayload & { status: Survey['status'] }>) {
      const idx = surveys.findIndex(s => s.id === id)
      if (idx < 0) throw createError({ statusCode: 404, message: 'Not found' })
      surveys[idx] = { ...surveys[idx]!, ...payload }
      return surveys[idx]!
    },
    publishSurvey(id: string) {
      const s = this.getSurvey(id)
      s.status = 'active'
      return s
    },
    respondSurvey(id: string, payload: SurveyResponsePayload) {
      const s = this.getSurvey(id)
      if (!surveyResponses[id]) surveyResponses[id] = []
      surveyResponses[id]!.push(payload)
      s.responses_count++
      return s
    },
    surveyReport(id: string): SurveyReportItem[] {
      const s = this.getSurvey(id)
      const responses = surveyResponses[id] ?? []
      return s.questions.map(q => {
        const answers = responses.map(r => r.answers[q.id]).filter(a => a !== undefined && a !== '')
        if (q.type === 'rating' || q.type === 'number') {
          const nums = answers.map(Number).filter(n => !Number.isNaN(n))
          const avg = nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0
          return { question_id: q.id, question_title: q.title, type: q.type, data: { average: avg, count: nums.length } }
        }
        if (q.type === 'single_choice' || q.type === 'multiple_choice') {
          const counts: Record<string, number> = {}
          for (const a of answers) {
            const items = Array.isArray(a) ? a : [String(a)]
            for (const item of items) counts[item] = (counts[item] ?? 0) + 1
          }
          return { question_id: q.id, question_title: q.title, type: q.type, data: counts }
        }
        return { question_id: q.id, question_title: q.title, type: q.type, data: answers.map(String) }
      })
    },

    // ── CRM ──
    crmDashboard(): CrmDashboard {
      const funnel = { lead: 0, qualified: 0, proposal: 0, negotiation: 0, won: 0, lost: 0 } as Record<CrmOpportunityStage, number>
      for (const o of crmOpportunities) funnel[o.stage]++
      const hot = crmOpportunities.filter(o => o.probability >= 70 && o.stage !== 'won' && o.stage !== 'lost')
      return { funnel, hot_opportunities: hot, recent_activities: crmActivities.slice(0, 10) }
    },
    listContacts(type?: string) {
      let list = [...crmContacts]
      if (type) list = list.filter(c => c.type === type)
      return list
    },
    getContact(id: string) {
      const c = crmContacts.find(x => x.id === id)
      if (!c) throw createError({ statusCode: 404, message: 'Not found' })
      return c
    },
    createContact(payload: CreateCrmContactPayload) {
      const c: CrmContact = {
        id: randomUUID(),
        name: payload.name,
        company: payload.company,
        email: payload.email,
        phone: payload.phone,
        type: payload.type,
        assigned_to: payload.assigned_to_id ? userBrief(payload.assigned_to_id) : undefined,
        tags: payload.tags ?? [],
        created_at: new Date().toISOString()
      }
      crmContacts.unshift(c)
      return c
    },
    updateContact(id: string, payload: Partial<CreateCrmContactPayload>) {
      const idx = crmContacts.findIndex(c => c.id === id)
      if (idx < 0) throw createError({ statusCode: 404, message: 'Not found' })
      const prev = crmContacts[idx]!
      crmContacts[idx] = {
        ...prev,
        ...payload,
        assigned_to: payload.assigned_to_id ? userBrief(payload.assigned_to_id) : prev.assigned_to
      }
      crmOpportunities.forEach(o => {
        if (o.contact.id === id) o.contact = crmContacts[idx]!
      })
      return crmContacts[idx]!
    },
    listOpportunities() { return crmOpportunities },
    createOpportunity(payload: CreateCrmOpportunityPayload) {
      const contact = this.getContact(payload.contact_id)
      const o: CrmOpportunity = {
        id: randomUUID(),
        title: payload.title,
        contact,
        value: payload.value,
        currency: payload.currency ?? 'IRR',
        stage: payload.stage ?? 'lead',
        probability: payload.probability ?? 10,
        expected_close_date: payload.expected_close_date,
        created_at: new Date().toISOString()
      }
      crmOpportunities.unshift(o)
      return o
    },
    updateOpportunityStage(id: string, stage: CrmOpportunityStage) {
      const o = crmOpportunities.find(x => x.id === id)
      if (!o) throw createError({ statusCode: 404, message: 'Not found' })
      o.stage = stage
      return o
    },
    listActivities(contactId?: string) {
      let list = [...crmActivities]
      if (contactId) list = list.filter(a => a.contact_id === contactId)
      return list.sort((a, b) => b.performed_at.localeCompare(a.performed_at))
    },
    createActivity(userId: string, payload: CreateCrmActivityPayload) {
      const a: CrmActivity = {
        id: randomUUID(),
        contact_id: payload.contact_id,
        type: payload.type,
        subject: payload.subject,
        notes: payload.notes,
        performed_by: userBrief(userId),
        performed_at: new Date().toISOString()
      }
      crmActivities.unshift(a)
      return a
    },

    // ── Reports ──
    listReports() { return customReports },
    getReport(id: string) {
      const r = customReports.find(x => x.id === id)
      if (!r) throw createError({ statusCode: 404, message: 'Not found' })
      return r
    },
    createReport(payload: CreateReportPayload) {
      const r: CustomReport = {
        id: randomUUID(),
        name: payload.name,
        data_source: payload.data_source,
        filters: payload.filters ?? [],
        columns: payload.columns,
        chart_type: payload.chart_type ?? 'table',
        schedule: payload.schedule,
        created_at: new Date().toISOString()
      }
      customReports.unshift(r)
      return r
    },
    dataSources() { return DATA_SOURCES },
    previewReport(payload: CreateReportPayload): ReportPreviewResult {
      if (payload.data_source === 'expenses') return buildExpensePreview(payload)
      return buildGenericPreview(payload)
    },

    // ── Project Files ──
    listFolders(projectId: string) {
      return projectFolders.filter(f => f.project_id === projectId)
    },
    listFiles(projectId: string, folderId?: string | null) {
      return projectFiles.filter(f =>
        f.project_id === projectId && (folderId === undefined ? true : f.folder_id === folderId)
      )
    },
    uploadFile(projectId: string, userId: string, data: { name: string, folder_id?: string | null, mime_type?: string, file_size?: number }) {
      const f: ProjectFile = {
        id: randomUUID(),
        project_id: projectId,
        folder_id: data.folder_id ?? null,
        name: data.name,
        file_path: `/mock/files/${data.name}`,
        file_size: data.file_size ?? 1024,
        mime_type: data.mime_type ?? 'application/octet-stream',
        version: 1,
        uploaded_by: userBrief(userId),
        created_at: new Date().toISOString()
      }
      projectFiles.unshift(f)
      return f
    },
    deleteFile(id: string) {
      projectFiles = projectFiles.filter(f => f.id !== id)
    },
    newVersion(id: string, userId: string) {
      const f = projectFiles.find(x => x.id === id)
      if (!f) throw createError({ statusCode: 404, message: 'Not found' })
      f.version++
      f.uploaded_by = userBrief(userId)
      f.created_at = new Date().toISOString()
      return f
    },

    // ── Subscription ──
    currentSubscription(): CurrentSubscription {
      const plan = subscriptionPlans.find(p => p.code === 'pro')!
      return {
        plan,
        status: 'active',
        expires_at: '2026-12-31T23:59:59Z',
        usage: { users: 5, projects: 3 }
      }
    },
    listPlans() { return subscriptionPlans },
    listInvoices() { return subscriptionInvoices },
    checkout(payload: CheckoutPayload) {
      const plan = subscriptionPlans.find(p => p.code === payload.plan_code)
      if (!plan) throw createError({ statusCode: 422, message: 'Invalid plan' })
      return { redirect_url: `/subscription/checkout?status=success&plan=${payload.plan_code}` }
    },
    verifyPayment(status: string) {
      return { success: status === 'success', message: status === 'success' ? 'Payment successful' : 'Payment failed' }
    },

    // ── Super Admin ──
    saLogin(email: string, password: string) {
      if (email !== SA_EMAIL || password !== SA_PASSWORD) {
        throw createError({ statusCode: 422, message: 'Invalid credentials' })
      }
      const token = randomUUID()
      saSessions.set(token, { token })
      return { token }
    },
    saVerifyToken(token: string) {
      return saSessions.has(token)
    },
    saLogout(token: string) {
      saSessions.delete(token)
    },
    saDashboard(): SaDashboardStats {
      const mrr = saTenants.reduce((s, t) => s + t.mrr, 0)
      return {
        tenants_count: saTenants.length,
        active_subscriptions: saTenants.filter(t => t.status === 'active').length,
        new_this_month: 1,
        mrr,
        arr: mrr * 12,
        revenue_by_month: [
          { month: '2026-01', amount: mrr * 0.8 },
          { month: '2026-02', amount: mrr * 0.85 },
          { month: '2026-03', amount: mrr * 0.9 },
          { month: '2026-04', amount: mrr * 0.95 },
          { month: '2026-05', amount: mrr * 0.98 },
          { month: '2026-06', amount: mrr }
        ],
        revenue_by_plan: { free: 0, starter: 2_900_000, pro: 9_900_000, enterprise: 0 }
      }
    },
    saListTenants(search?: string) {
      let list = [...saTenants]
      if (search) {
        const q = search.toLowerCase()
        list = list.filter(t => t.name.toLowerCase().includes(q))
      }
      return list
    },
    saSuspendTenant(id: string) {
      const t = saTenants.find(x => x.id === id)
      if (!t) throw createError({ statusCode: 404, message: 'Not found' })
      t.status = 'suspended'
      return t
    },
    saListPlans() { return subscriptionPlans },
    saCreatePlan(plan: SubscriptionPlan) {
      subscriptionPlans.push(plan)
      return plan
    },
    saUpdatePlan(id: string, payload: Partial<SubscriptionPlan>) {
      const idx = subscriptionPlans.findIndex(p => p.id === id)
      if (idx < 0) throw createError({ statusCode: 404, message: 'Not found' })
      subscriptionPlans[idx] = { ...subscriptionPlans[idx]!, ...payload }
      return subscriptionPlans[idx]!
    },
    saDeletePlan(id: string) {
      const idx = subscriptionPlans.findIndex(p => p.id === id)
      if (idx >= 0) subscriptionPlans.splice(idx, 1)
    },
    saFinancial(): SaFinancialStats {
      const mrr = saTenants.reduce((s, t) => s + t.mrr, 0)
      return {
        mrr,
        arr: mrr * 12,
        revenue_by_plan: { free: 0, starter: 2_900_000, pro: 9_900_000, enterprise: 0 },
        revenue_by_cycle: { monthly: mrr * 0.7, yearly: mrr * 0.3 * 12 },
        cancellations_this_month: 0
      }
    },
    saListConsultations() { return saConsultations },
    saUpdateConsultation(id: string, status: SaConsultation['status']) {
      const c = saConsultations.find(x => x.id === id)
      if (!c) throw createError({ statusCode: 404, message: 'Not found' })
      c.status = status
      return c
    },
    saGetSettings() { return saSettings },
    saUpdateSettings(payload: Partial<SaPlatformSettings>) {
      saSettings = { ...saSettings, ...payload }
      return saSettings
    },

    // ── Performance ──
    performanceDashboard(): PerformanceDashboard {
      const objs = performanceObjectives
      return {
        indicators: performanceIndicators,
        objectives_summary: {
          on_track: objs.filter(o => o.status === 'on_track').length,
          at_risk: objs.filter(o => o.status === 'at_risk').length,
          off_track: objs.filter(o => o.status === 'off_track').length,
          completed: objs.filter(o => o.status === 'completed').length
        },
        upcoming_reviews: performanceReviews.filter(r => r.status !== 'completed')
      }
    },
    listIndicators() { return performanceIndicators },
    listObjectives() { return performanceObjectives },
    listReviews() { return performanceReviews },
    users
  }
}

function usePermissionsList() {
  // Lazy import to avoid circular deps — re-export permission keys for custom roles UI
  return {
    'correspondence:view': 'correspondence:view',
    'correspondence:manage': 'correspondence:manage',
    'surveys:view': 'surveys:view',
    'surveys:manage': 'surveys:manage',
    'crm:view': 'crm:view',
    'crm:manage': 'crm:manage',
    'reports:view': 'reports:view',
    'reports:manage': 'reports:manage',
    'files:view': 'files:view',
    'files:manage': 'files:manage',
    'subscription:view': 'subscription:view',
    'subscription:manage': 'subscription:manage',
    'guests:manage': 'guests:manage',
    'roles:manage': 'roles:manage',
    'performance:dashboard:view': 'performance:dashboard:view',
    'performance:indicators:manage': 'performance:indicators:manage',
    'performance:objectives:manage': 'performance:objectives:manage',
    'performance:reviews:manage': 'performance:reviews:manage'
  }
}

export function requireSaAuth(event: import('h3').H3Event) {
  const auth = getHeader(event, 'authorization')
  if (!auth?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  const token = auth.slice(7)
  const db = usePhase5Db()
  if (!db.saVerifyToken(token)) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  return { token, db }
}
