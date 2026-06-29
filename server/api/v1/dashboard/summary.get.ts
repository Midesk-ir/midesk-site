const MANAGER_ROLES = ['OWNER', 'ADMIN', 'MANAGER'] as const

export default defineEventHandler((event) => {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
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

  return {
    my_tasks: myTasks,
    overdue_tasks: overdue,
    active_projects: activeProjects,
    recent_activity: [
      { id: 'a1', type: 'task', message: 'تسک «پیاده‌سازی کانبان» به‌روزرسانی شد', created_at: '2026-06-20T14:00:00Z' },
      { id: 'a2', type: 'project', message: 'پروژه «وب‌سایت Midesk» ایجاد شد', created_at: '2026-01-15T08:00:00Z' }
    ],
    active_sprint,
    week_worklog_minutes,
    ...(pending_leave_count !== undefined && { pending_leave_count })
  }
})
