import { randomUUID } from 'node:crypto'
import type { Task } from '../../app/types'
import type {
  BurndownData,
  CalendarEvent,
  CfdReport,
  CloseSprintPayload,
  CreateLeaveRequestPayload,
  CreateSprintPayload,
  CreateWorklogPayload,
  Holiday,
  LeaveBalance,
  LeaveRequest,
  LeaveType,
  ProjectColumn,
  Shift,
  Sprint,
  SwimlaneMode,
  UserBrief,
  VelocityReport,
  Worklog,
  WorklogFilters
} from '../../app/types/phase1'

const defaultColumns: Omit<ProjectColumn, 'project_id' | 'current_count'>[] = [
  { id: 'col-backlog', name: 'بک‌لاگ', slug: 'backlog', color: '#6b7280', order_index: 0, wip_limit: null, is_done_column: false },
  { id: 'col-todo', name: 'برای انجام', slug: 'todo', color: '#3b82f6', order_index: 1, wip_limit: 5, is_done_column: false },
  { id: 'col-in_progress', name: 'در حال انجام', slug: 'in_progress', color: '#f59e0b', order_index: 2, wip_limit: 3, is_done_column: false },
  { id: 'col-review', name: 'بررسی', slug: 'review', color: '#8b5cf6', order_index: 3, wip_limit: 2, is_done_column: false },
  { id: 'col-done', name: 'انجام شده', slug: 'done', color: '#22c55e', order_index: 4, wip_limit: null, is_done_column: true }
]

let projectColumns: ProjectColumn[] = [
  ...defaultColumns.map(c => ({ ...c, project_id: 'p1', current_count: 0 })),
  ...defaultColumns.map(c => ({ ...c, id: `${c.id}-p2`, project_id: 'p2', current_count: 0 }))
]

let sprints: Sprint[] = [
  {
    id: 'sp1',
    project_id: 'p1',
    name: 'اسپرینت ۱ — MVP',
    goal: 'تحویل فاز صفر و شروع فاز یک',
    status: 'active',
    start_date: '2026-06-01',
    end_date: '2026-06-28',
    total_points: 21,
    completed_points: 8,
    tasks_count: 4,
    done_count: 1
  },
  {
    id: 'sp2',
    project_id: 'p1',
    name: 'اسپرینت ۲ — Agile',
    goal: 'اسپرینت، گزارش و تایم‌شیت',
    status: 'planning',
    start_date: '2026-06-29',
    end_date: '2026-07-26',
    total_points: 0,
    completed_points: 0,
    tasks_count: 0,
    done_count: 0
  },
  {
    id: 'sp3',
    project_id: 'p1',
    name: 'اسپرینت صفر',
    goal: 'راه‌اندازی اولیه',
    status: 'closed',
    start_date: '2026-04-01',
    end_date: '2026-05-31',
    total_points: 13,
    completed_points: 13,
    tasks_count: 1,
    done_count: 1
  }
]

let worklogs: Worklog[] = [
  {
    id: 'wl1',
    task_id: 'task2',
    project_id: 'p1',
    project_name: 'وب‌سایت Midesk',
    task_title: 'پیاده‌سازی کانبان',
    description: 'پیاده‌سازی drag & drop',
    duration_minutes: 240,
    logged_date: '2026-06-20',
    user: { id: 'u1', name: 'علی رضایی', avatar_url: null }
  },
  {
    id: 'wl2',
    task_id: 'task3',
    project_id: 'p1',
    project_name: 'وب‌سایت Midesk',
    task_title: 'اتصال API احراز هویت',
    duration_minutes: 120,
    logged_date: '2026-06-21',
    user: { id: 'u1', name: 'علی رضایی', avatar_url: null }
  },
  {
    id: 'wl3',
    task_id: 'task4',
    project_id: 'p1',
    project_name: 'وب‌سایت Midesk',
    task_title: 'رفع باگ RTL در sidebar',
    duration_minutes: 90,
    logged_date: '2026-06-22',
    user: { id: 'u2', name: 'Sara Johnson', avatar_url: null }
  },
  {
    id: 'wl4',
    project_id: 'p1',
    project_name: 'وب‌سایت Midesk',
    duration_minutes: 60,
    logged_date: '2026-06-23',
    user: { id: 'u3', name: 'محمد کریمی', avatar_url: null }
  }
]

const leaveTypes: LeaveType[] = [
  { id: 'lt1', name: 'استحقاقی', default_balance_days: 26, unit: 'day', is_paid: true },
  { id: 'lt2', name: 'استعلاجی', default_balance_days: 14, unit: 'day', is_paid: true },
  { id: 'lt3', name: 'بدون حقوق', default_balance_days: 30, unit: 'day', is_paid: false }
]

let leaveRequests: LeaveRequest[] = [
  {
    id: 'lr1',
    user: { id: 'u2', name: 'Sara Johnson', avatar_url: null },
    leave_type: leaveTypes[0]!,
    start_date: '2026-07-01',
    end_date: '2026-07-03',
    duration_days: 3,
    status: 'pending',
    note: 'سفر خانوادگی',
    approval_chain: [
      { role: 'manager', status: 'approved' },
      { role: 'hr', status: 'pending' }
    ]
  },
  {
    id: 'lr2',
    user: { id: 'u3', name: 'محمد کریمی', avatar_url: null },
    leave_type: leaveTypes[1]!,
    start_date: '2026-06-25',
    end_date: '2026-06-26',
    duration_days: 2,
    status: 'approved',
    note: 'معاینه پزشکی',
    approval_chain: [
      { role: 'manager', status: 'approved' },
      { role: 'hr', status: 'approved' }
    ]
  }
]

let calendarEvents: CalendarEvent[] = [
  {
    id: 'ev1',
    title: 'جلسه Planning',
    type: 'meeting',
    start_date: '2026-06-24T09:00:00',
    end_date: '2026-06-24T10:30:00',
    all_day: false,
    color: '#ff5c00'
  },
  {
    id: 'ev2',
    title: 'Deadline فاز ۱',
    type: 'deadline',
    start_date: '2026-06-28',
    end_date: '2026-06-28',
    all_day: true,
    color: '#ef4444'
  }
]

const holidays: Holiday[] = [
  { id: 'h1', name: 'عید قربان', date: '2026-06-27' },
  { id: 'h2', name: 'شهادت امام جعفر صادق', date: '2026-07-04' }
]

const shifts: Shift[] = [
  { id: 'sh1', name: 'شیفت صبح', date: '2026-06-24', start_time: '08:00', end_time: '16:00' },
  { id: 'sh2', name: 'شیفت عصر', date: '2026-06-25', start_time: '14:00', end_time: '22:00' }
]

function userBrief(id: string, name: string): UserBrief {
  return { id, name, avatar_url: null }
}

function recalcSprint(sprintId: string, tasks: Task[]) {
  const sprint = sprints.find(s => s.id === sprintId)
  if (!sprint) return
  const sprintTasks = tasks.filter(t => t.sprint_id === sprintId)
  sprint.tasks_count = sprintTasks.length
  sprint.done_count = sprintTasks.filter(t => t.status === 'done').length
  sprint.total_points = sprintTasks.reduce((sum, t) => sum + (t.story_points ?? 0), 0)
  sprint.completed_points = sprintTasks
    .filter(t => t.status === 'done')
    .reduce((sum, t) => sum + (t.story_points ?? 0), 0)
}

function recalcAllSprints(tasks: Task[]) {
  sprints.forEach(s => recalcSprint(s.id, tasks))
}

function syncColumnCounts(projectId: string, tasks: Task[]) {
  projectColumns
    .filter(c => c.project_id === projectId)
    .forEach((col) => {
      col.current_count = tasks.filter(
        t => t.project_id === projectId && t.status === col.slug
      ).length
    })
}

export function initPhase1Tasks(tasks: Task[]) {
  const assignments: Record<string, { sprint_id: string | null, story_points: number }> = {
    task1: { sprint_id: 'sp3', story_points: 5 },
    task2: { sprint_id: 'sp1', story_points: 8 },
    task3: { sprint_id: 'sp1', story_points: 5 },
    task4: { sprint_id: 'sp1', story_points: 3 },
    task5: { sprint_id: null, story_points: 2 },
    task6: { sprint_id: null, story_points: 3 },
    task7: { sprint_id: null, story_points: 5 }
  }
  tasks.forEach((task) => {
    const extra = assignments[task.id]
    task.sprint_id = extra?.sprint_id ?? null
    task.story_points = extra?.story_points ?? null
  })
  recalcAllSprints(tasks)
  syncColumnCounts('p1', tasks)
  syncColumnCounts('p2', tasks)
}

export function usePhase1Db() {
  return {
    sprints,
    projectColumns,
    worklogs,
    leaveTypes,
    leaveRequests,
    calendarEvents,
    holidays,
    shifts,

    getSprints(projectId: string) {
      return sprints.filter(s => s.project_id === projectId)
    },

    getSprint(id: string) {
      return sprints.find(s => s.id === id) ?? null
    },

    createSprint(projectId: string, payload: CreateSprintPayload) {
      const sprint: Sprint = {
        id: randomUUID(),
        project_id: projectId,
        name: payload.name,
        goal: payload.goal,
        status: 'planning',
        start_date: payload.start_date,
        end_date: payload.end_date,
        total_points: 0,
        completed_points: 0,
        tasks_count: 0,
        done_count: 0
      }
      sprints.push(sprint)
      return sprint
    },

    activateSprint(sprintId: string) {
      const sprint = sprints.find(s => s.id === sprintId)
      if (!sprint) throw createError({ statusCode: 404, message: 'Sprint not found' })
      sprints.forEach((s) => {
        if (s.project_id === sprint.project_id && s.status === 'active') {
          s.status = 'review'
        }
      })
      sprint.status = 'active'
      return sprint
    },

    closeSprint(sprintId: string, payload: CloseSprintPayload, tasks: Task[]) {
      const sprint = sprints.find(s => s.id === sprintId)
      if (!sprint) throw createError({ statusCode: 404, message: 'Sprint not found' })
      const incomplete = tasks.filter(t => t.sprint_id === sprintId && t.status !== 'done')
      incomplete.forEach((task) => {
        if (payload.move_to === 'backlog') {
          task.sprint_id = null
          task.status = 'backlog'
        } else {
          task.sprint_id = payload.move_to
        }
      })
      sprint.status = 'closed'
      recalcAllSprints(tasks)
      syncColumnCounts(sprint.project_id, tasks)
      return sprint
    },

    getBacklog(projectId: string, tasks: Task[]) {
      return tasks.filter(t => t.project_id === projectId && !t.sprint_id)
    },

    assignTaskToSprint(taskId: string, sprintId: string | null, tasks: Task[]) {
      const task = tasks.find(t => t.id === taskId)
      if (!task) throw createError({ statusCode: 404, message: 'Task not found' })
      task.sprint_id = sprintId
      recalcAllSprints(tasks)
      return task
    },

    getColumns(projectId: string) {
      return projectColumns
        .filter(c => c.project_id === projectId)
        .sort((a, b) => a.order_index - b.order_index)
    },

    createColumn(projectId: string, data: Partial<ProjectColumn>) {
      const col: ProjectColumn = {
        id: randomUUID(),
        project_id: projectId,
        name: data.name ?? 'ستون جدید',
        slug: data.slug ?? `col_${Date.now()}`,
        color: data.color,
        order_index: data.order_index ?? projectColumns.filter(c => c.project_id === projectId).length,
        wip_limit: data.wip_limit ?? null,
        is_done_column: data.is_done_column ?? false,
        current_count: 0
      }
      projectColumns.push(col)
      return col
    },

    updateColumn(id: string, data: Partial<ProjectColumn>) {
      const col = projectColumns.find(c => c.id === id)
      if (!col) throw createError({ statusCode: 404, message: 'Column not found' })
      Object.assign(col, data)
      return col
    },

    deleteColumn(id: string) {
      const idx = projectColumns.findIndex(c => c.id === id)
      if (idx < 0) throw createError({ statusCode: 404, message: 'Column not found' })
      projectColumns.splice(idx, 1)
    },

    reorderColumns(projectId: string, ids: string[]) {
      ids.forEach((id, index) => {
        const col = projectColumns.find(c => c.id === id && c.project_id === projectId)
        if (col) col.order_index = index
      })
      return this.getColumns(projectId)
    },

    getBoardWithColumns(projectId: string, tasks: Task[], swimlane: SwimlaneMode = 'none') {
      syncColumnCounts(projectId, tasks)
      const cols = this.getColumns(projectId)
      const projectTasks = tasks.filter(t => t.project_id === projectId)

      const buildRow = (rowTasks: Task[]) =>
        cols.map(col => ({
          id: col.id,
          slug: col.slug,
          name: col.name,
          color: col.color,
          wip_limit: col.wip_limit,
          current_count: rowTasks.filter(t => t.status === col.slug).length,
          is_done_column: col.is_done_column,
          tasks: rowTasks
            .filter(t => t.status === col.slug)
            .sort((a, b) => a.order_index - b.order_index)
        }))

      if (swimlane === 'none') {
        return { swimlane, lanes: [{ id: 'all', label: '', columns: buildRow(projectTasks) }] }
      }

      if (swimlane === 'assignee') {
        const assigneeIds = [...new Set(projectTasks.map(t => t.assignee?.id ?? 'unassigned'))]
        return {
          swimlane,
          lanes: assigneeIds.map((aid) => {
            const label = aid === 'unassigned'
              ? 'بدون مسئول'
              : projectTasks.find(t => t.assignee?.id === aid)?.assignee?.name ?? aid
            const laneTasks = projectTasks.filter(t => (t.assignee?.id ?? 'unassigned') === aid)
            return { id: aid, label, columns: buildRow(laneTasks) }
          })
        }
      }

      const priorities = ['critical', 'high', 'medium', 'low'] as const
      return {
        swimlane,
        lanes: priorities.map(priority => ({
          id: priority,
          label: priority,
          columns: buildRow(projectTasks.filter(t => t.priority === priority))
        }))
      }
    },

    getBurndown(sprintId: string): BurndownData {
      const sprint = sprints.find(s => s.id === sprintId)!
      const total = sprint.total_points || 21
      const days = 14
      const daily = Array.from({ length: days }, (_, i) => {
        const remaining = Math.max(0, total - Math.round((total / days) * i * 0.85))
        return {
          date: new Date(Date.parse(sprint.start_date) + i * 86400000).toISOString().slice(0, 10),
          remaining_points: remaining,
          completed_points: total - remaining
        }
      })
      const ideal_line = Array.from({ length: days }, (_, i) => ({
        date: daily[i]!.date,
        remaining_points: Math.max(0, total - Math.round((total / (days - 1)) * i))
      }))
      return { sprint, daily, ideal_line }
    },

    getVelocity(projectId: string): VelocityReport {
      const projectSprints = sprints.filter(s => s.project_id === projectId && s.status !== 'planning')
      const data = projectSprints.map(s => ({
        sprint_id: s.id,
        sprint_name: s.name,
        committed_points: s.total_points,
        completed_points: s.completed_points
      }))
      const average = data.length
        ? Math.round(data.reduce((sum, d) => sum + d.completed_points, 0) / data.length)
        : 0
      return { sprints: data, average_completed: average }
    },

    getCfd(projectId: string): CfdReport {
      const cols = this.getColumns(projectId)
      const column_names = Object.fromEntries(cols.map(c => [c.slug, c.name]))
      const daily = Array.from({ length: 14 }, (_, i) => {
        const date = new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(0, 10)
        const columns: Record<string, number> = {}
        cols.forEach((col, ci) => {
          columns[col.slug] = Math.max(0, 2 + ci + Math.round(Math.sin(i + ci) * 2))
        })
        return { date, columns }
      })
      return { column_names, daily }
    },

    getMyWorklogs(userId: string, filters: WorklogFilters = {}) {
      return worklogs.filter((w) => {
        if (w.user.id !== userId) return false
        if (filters.from && w.logged_date < filters.from) return false
        if (filters.to && w.logged_date > filters.to) return false
        if (filters.project_id && w.project_id !== filters.project_id) return false
        return true
      })
    },

    getTeamWorklogs(filters: WorklogFilters = {}) {
      return worklogs.filter((w) => {
        if (filters.from && w.logged_date < filters.from) return false
        if (filters.to && w.logged_date > filters.to) return false
        if (filters.project_id && w.project_id !== filters.project_id) return false
        return true
      })
    },

    createWorklog(userId: string, userName: string, payload: CreateWorklogPayload, tasks: Task[]) {
      const task = payload.task_id ? tasks.find(t => t.id === payload.task_id) : null
      const entry: Worklog = {
        id: randomUUID(),
        ...payload,
        task_title: task?.title ?? null,
        user: userBrief(userId, userName)
      }
      worklogs.unshift(entry)
      return entry
    },

    updateWorklog(id: string, data: Partial<CreateWorklogPayload>) {
      const wl = worklogs.find(w => w.id === id)
      if (!wl) throw createError({ statusCode: 404, message: 'Worklog not found' })
      Object.assign(wl, data)
      return wl
    },

    deleteWorklog(id: string) {
      worklogs = worklogs.filter(w => w.id !== id)
    },

    getWeekSummary(userId: string) {
      const now = new Date()
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now)
        d.setDate(d.getDate() - (6 - i))
        const date = d.toISOString().slice(0, 10)
        const minutes = worklogs
          .filter(w => w.user.id === userId && w.logged_date === date)
          .reduce((sum, w) => sum + w.duration_minutes, 0)
        return { date, minutes }
      })
    },

    getLeaveBalances(userId: string): LeaveBalance[] {
      const used = leaveRequests
        .filter(r => r.user.id === userId && r.status === 'approved')
        .reduce((acc, r) => {
          acc[r.leave_type.id] = (acc[r.leave_type.id] ?? 0) + r.duration_days
          return acc
        }, {} as Record<string, number>)
      return leaveTypes.map(lt => ({
        leave_type: lt,
        total: lt.default_balance_days,
        used: used[lt.id] ?? 0,
        remaining: lt.default_balance_days - (used[lt.id] ?? 0)
      }))
    },

    getMyLeaveRequests(userId: string) {
      return leaveRequests.filter(r => r.user.id === userId)
    },

    getPendingLeaveRequests() {
      return leaveRequests.filter(r => r.status === 'pending')
    },

    createLeaveRequest(userId: string, userName: string, payload: CreateLeaveRequestPayload) {
      const lt = leaveTypes.find(t => t.id === payload.leave_type_id)!
      const start = Date.parse(payload.start_date)
      const end = Date.parse(payload.end_date)
      const duration_days = Math.max(1, Math.round((end - start) / 86400000) + 1)
      const req: LeaveRequest = {
        id: randomUUID(),
        user: userBrief(userId, userName),
        leave_type: lt,
        start_date: payload.start_date,
        end_date: payload.end_date,
        duration_days,
        status: 'pending',
        note: payload.note,
        approval_chain: [
          { role: 'manager', status: 'pending' },
          { role: 'hr', status: 'pending' }
        ]
      }
      leaveRequests.unshift(req)
      return req
    },

    approveLeave(id: string) {
      const req = leaveRequests.find(r => r.id === id)
      if (!req) throw createError({ statusCode: 404 })
      req.status = 'approved'
      return req
    },

    rejectLeave(id: string, reason: string) {
      const req = leaveRequests.find(r => r.id === id)
      if (!req) throw createError({ statusCode: 404 })
      req.status = 'rejected'
      req.reject_reason = reason
      return req
    },

    getActiveSprint(projectId?: string) {
      const list = projectId
        ? sprints.filter(s => s.project_id === projectId && s.status === 'active')
        : sprints.filter(s => s.status === 'active')
      return list[0] ?? null
    },

    getWeekWorklogMinutes(userId: string) {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const from = weekAgo.toISOString().slice(0, 10)
      return worklogs
        .filter(w => w.user.id === userId && w.logged_date >= from)
        .reduce((sum, w) => sum + w.duration_minutes, 0)
    },

    recalcAllSprints,
    syncColumnCounts
  }
}
