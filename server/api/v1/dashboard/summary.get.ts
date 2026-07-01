import { getPermissionsForRole, hasPermission } from '../../../utils/permissions'

const MANAGER_ROLES = ['OWNER', 'ADMIN', 'MANAGER'] as const

export default defineEventHandler((event) => {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  const permissions = getPermissionsForRole(user.role)
  const isAdmin = user.role === 'OWNER' || user.role === 'ADMIN'

  const myTasks = db.tasks.filter(t => t.assignee?.id === user.id).slice(0, 5)
  const overdue = db.tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done')
  const activeProjects = db.projects.filter(p => p.status === 'active')

  const activeSprint = db.phase1.getActiveSprint()
  let active_sprint = null
  if (activeSprint) {
    const project = db.projects.find(p => p.id === activeSprint.project_id)
    const endDate = Date.parse(activeSprint.end_date)
    const days_remaining = Math.max(0, Math.ceil((endDate - Date.now()) / 86400000))
    active_sprint = {
      ...activeSprint,
      project_name: project?.name ?? '',
      days_remaining
    }
  }

  const week_worklog_minutes = db.phase1.getWeekWorklogMinutes(user.id)

  const isManager = MANAGER_ROLES.includes(user.role as typeof MANAGER_ROLES[number])
  const pending_leave_count = isManager
    ? db.phase1.getPendingLeaveRequests().length
    : undefined

  let finance_widget: Record<string, unknown> | undefined

  if (hasPermission(permissions, 'finance:dashboard:view', isAdmin)) {
    const expenseSummary = db.phase3.getExpenseSummary()
    const financeDashboard = db.phase3.getFinanceDashboard()
    finance_widget = {
      pending_expenses_count: expenseSummary.pending_count,
      pending_expenses_amount: expenseSummary.pending_amount,
      overdue_invoices_count: financeDashboard.overdue_invoices_count,
      currency: expenseSummary.currency
    }
  } else if (hasPermission(permissions, 'finance:my:view', isAdmin)) {
    const payslips = db.phase3.listMyPayslips(user.id)
    const myExpenses = db.phase3.listMyExpenses(user.id)
    finance_widget = {
      latest_payslip: payslips[0] ?? null,
      my_pending_expenses_count: myExpenses.filter(e => !['paid', 'rejected'].includes(e.status)).length,
      currency: payslips[0]?.currency ?? 'IRR'
    }
  }

  let collab_widget: Record<string, unknown> | undefined
  if (hasPermission(permissions, 'chat:view', isAdmin)
    || hasPermission(permissions, 'meetings:view', isAdmin)
    || hasPermission(permissions, 'notes:view', isAdmin)) {
    collab_widget = {}
    if (hasPermission(permissions, 'chat:view', isAdmin)) {
      collab_widget.chat_unread = db.phase4.getUnreadTotal(user.id)
    }
    if (hasPermission(permissions, 'meetings:view', isAdmin)) {
      collab_widget.meetings_today = db.phase4.listMeetings(user.id, 'today').length
      collab_widget.meetings_upcoming = db.phase4.listMeetings(user.id, 'upcoming').length
    }
    if (hasPermission(permissions, 'notes:view', isAdmin)) {
      collab_widget.notes_count = db.phase4.listNotes(user.id).length
    }
  }

  let correspondence_widget: Record<string, unknown> | undefined
  if (hasPermission(permissions, 'correspondence:view', isAdmin)) {
    const inbox = db.phase5.inbox(user.id)
    correspondence_widget = {
      inbox_pending: inbox.filter(i => i.routing.status === 'pending').length
    }
  }

  let crm_widget: Record<string, unknown> | undefined
  if (hasPermission(permissions, 'crm:view', isAdmin)) {
    const crm = db.phase5.crmDashboard()
    crm_widget = {
      hot_opportunities: crm.hot_opportunities.length,
      open_opportunities: Object.values(crm.funnel).reduce((a, b) => a + b, 0)
        - crm.funnel.won - crm.funnel.lost,
      contacts_count: db.phase5.listContacts().length
    }
  }

  let surveys_widget: Record<string, unknown> | undefined
  if (hasPermission(permissions, 'surveys:view', isAdmin)) {
    const all = db.phase5.listSurveys()
    surveys_widget = {
      active_count: all.filter(s => s.status === 'active').length,
      draft_count: all.filter(s => s.status === 'draft').length
    }
  }

  let performance_widget: Record<string, unknown> | undefined
  if (hasPermission(permissions, 'performance:dashboard:view', isAdmin)) {
    const perf = db.phase5.performanceDashboard()
    performance_widget = {
      objectives_at_risk: perf.objectives_summary.at_risk + perf.objectives_summary.off_track,
      upcoming_reviews: perf.upcoming_reviews.length
    }
  }

  let reports_widget: Record<string, unknown> | undefined
  if (hasPermission(permissions, 'reports:view', isAdmin)) {
    reports_widget = { saved_count: db.phase5.listReports().length }
  }

  const notifications_unread = db.notifications.filter(n => !n.read_at).length

  return {
    my_tasks: myTasks,
    overdue_tasks: overdue,
    active_projects: activeProjects,
    recent_activity: [
      { id: 'a1', type: 'crm', message: 'فرصت «تمدید اشتراک سالانه» به مرحله مذاکره رفت', created_at: '2026-06-28T11:00:00Z' },
      { id: 'a2', type: 'correspondence', message: 'نامه داخلی «درخواست بودجه Q3» برای بررسی ارجاع شد', created_at: '2026-06-27T09:30:00Z' },
      { id: 'a3', type: 'task', message: 'تسک «پیاده‌سازی کانبان» به‌روزرسانی شد', created_at: '2026-06-20T14:00:00Z' },
      { id: 'a4', type: 'survey', message: 'نظرسنجی «رضایت تیم» منتشر شد', created_at: '2026-06-18T16:00:00Z' },
      { id: 'a5', type: 'project', message: 'پروژه «وب‌سایت Midesk» ایجاد شد', created_at: '2026-01-15T08:00:00Z' }
    ],
    active_sprint,
    week_worklog_minutes,
    notifications_unread,
    ...(pending_leave_count !== undefined && { pending_leave_count }),
    ...(finance_widget && { finance_widget }),
    ...(collab_widget && { collab_widget }),
    ...(correspondence_widget && { correspondence_widget }),
    ...(crm_widget && { crm_widget }),
    ...(surveys_widget && { surveys_widget }),
    ...(performance_widget && { performance_widget }),
    ...(reports_widget && { reports_widget })
  }
})
