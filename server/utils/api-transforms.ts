type JsonRecord = Record<string, unknown>

export function unwrapData<T = unknown>(body: unknown): T {
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as { data: T }).data
  }
  return body as T
}

export function unwrapCollection(body: unknown): JsonRecord[] {
  const data = unwrapData<unknown>(body)
  if (Array.isArray(data)) return data as JsonRecord[]
  return []
}

export function normalizeUser(user: JsonRecord | null | undefined): JsonRecord | null | undefined {
  if (!user) return user
  const name = user.name ?? user.full_name ?? ''
  return { ...user, name }
}

export function normalizeTask(task: JsonRecord): JsonRecord {
  return {
    ...task,
    assignee: normalizeUser(task.assignee as JsonRecord | undefined),
    reporter: normalizeUser(task.reporter as JsonRecord | undefined)
  }
}

export function normalizeTasks(tasks: unknown): JsonRecord[] {
  return unwrapCollection(tasks).map(normalizeTask)
}

function columnBase(col: JsonRecord, tasks: JsonRecord[]) {
  return {
    id: col.id,
    slug: col.slug,
    name: col.name,
    title: col.name,
    color: col.color,
    order_index: col.order_index,
    wip_limit: col.wip_limit ?? null,
    is_done_column: Boolean(col.is_done_column),
    current_count: tasks.length,
    tasks
  }
}

export function transformBoardResponse(body: unknown, swimlane = 'none') {
  const raw = body as { columns?: JsonRecord[] }
  const columns = raw.columns ?? []

  if (swimlane === 'assignee' || swimlane === 'priority') {
    const laneKeys = new Set<string>()
    for (const col of columns) {
      for (const sw of (col.swimlanes as JsonRecord[] | undefined) ?? []) {
        laneKeys.add(String(sw.key))
      }
    }

    const lanes = [...laneKeys].map((key) => {
      let label = key
      const laneColumns = columns.map((col) => {
        const swim = ((col.swimlanes as JsonRecord[] | undefined) ?? [])
          .find(item => String(item.key) === key)
        const tasks = normalizeTasks(swim?.tasks ?? [])
        if (swimlane === 'assignee' && key !== 'unassigned' && tasks[0]?.assignee) {
          const assignee = tasks[0].assignee as JsonRecord
          label = String(assignee.name ?? assignee.full_name ?? key)
        }
        return columnBase(col, tasks)
      })

      return { id: key, label, columns: laneColumns }
    })

    return { data: { swimlane, lanes } }
  }

  const mappedColumns = columns.map(col => columnBase(col, normalizeTasks(col.tasks)))

  return {
    data: {
      swimlane: 'none',
      lanes: [{ id: 'default', label: '', columns: mappedColumns }]
    }
  }
}

export function transformSprintDetail(body: unknown) {
  const sprint = unwrapData<JsonRecord>(body)
  const tasks = normalizeTasks(sprint.tasks)
  const { tasks: _tasks, ...sprintFields } = sprint

  return { data: { sprint: sprintFields, tasks } }
}

export function transformCloseSprintBody(body: unknown) {
  const payload = (body ?? {}) as { move_to?: string }
  if (!payload.move_to || payload.move_to === 'backlog') {
    return { move_to: 'backlog' }
  }
  return { move_to: 'next_sprint_id', next_sprint_id: payload.move_to }
}

export function deriveClockStatus(record: JsonRecord | null | undefined) {
  if (!record?.check_in_at) return 'not_started'
  if (record.check_out_at) return 'checked_out'
  if (record.break_start_at && !record.break_end_at) return 'on_break'
  return 'checked_in'
}

export function normalizeAttendanceRecord(record: JsonRecord) {
  return {
    ...record,
    user: normalizeUser(record.user as JsonRecord | undefined)
  }
}

export function transformAttendanceMy(body: unknown) {
  const records = unwrapCollection(body).map(normalizeAttendanceRecord)
  const today = new Date().toISOString().slice(0, 10)
  const todayRecord = records.find(record => record.date === today) ?? null

  return {
    data: {
      today: todayRecord,
      clock_status: deriveClockStatus(todayRecord),
      history: records
    }
  }
}

export function transformAttendanceAction(body: unknown) {
  const record = normalizeAttendanceRecord(unwrapData<JsonRecord>(body))
  return {
    data: {
      record,
      clock_status: deriveClockStatus(record)
    }
  }
}

export function transformAttendanceToday(body: unknown) {
  const records = unwrapCollection(body).map(normalizeAttendanceRecord)
  const present = records.filter(r => ['present', 'late', 'half_day'].includes(String(r.status))).length
  const absent = records.filter(r => r.status === 'absent').length
  const onLeave = records.filter(r => r.status === 'on_leave').length
  const onMission = records.filter(r => r.status === 'mission').length

  return {
    data: {
      present,
      absent,
      on_leave: onLeave,
      on_mission: onMission,
      records
    }
  }
}

export function transformAttendanceReport(body: unknown) {
  const raw = body as {
    records?: unknown
    summary?: JsonRecord
  }
  const records = unwrapCollection(raw.records ?? body).map(normalizeAttendanceRecord)
  const byUser = new Map<string, JsonRecord>()

  for (const record of records) {
    const userId = String(record.user_id)
    if (!byUser.has(userId)) {
      byUser.set(userId, {
        user: record.user ?? { id: userId, name: userId },
        days: {},
        summary: { present: 0, late: 0, absent: 0, overtime_minutes: 0 }
      })
    }
    const row = byUser.get(userId)!
    const days = row.days as Record<string, string>
    days[String(record.date)] = String(record.status)
    const summary = row.summary as JsonRecord
    if (record.status === 'present') summary.present = Number(summary.present) + 1
    if (record.status === 'late') summary.late = Number(summary.late) + 1
    if (record.status === 'absent') summary.absent = Number(summary.absent) + 1
    summary.overtime_minutes = Number(summary.overtime_minutes) + Number(record.overtime_minutes ?? 0)
  }

  return { data: [...byUser.values()] }
}

export function normalizeNotification(item: JsonRecord): JsonRecord {
  const payload = (item.data ?? {}) as JsonRecord
  const taskId = payload.task_id as string | undefined
  const projectId = payload.project_id as string | undefined

  return {
    ...item,
    title: payload.task_title ?? payload.step_title ?? payload.title ?? String(item.type ?? 'Notification'),
    body: payload.message ?? payload.body ?? '',
    action_url: (payload.action_url as string | undefined)
      ?? (taskId && projectId ? `/projects/${projectId}?task=${taskId}` : null)
  }
}

export function normalizeNotifications(body: unknown) {
  const items = unwrapCollection(body).map(normalizeNotification)
  return { data: items }
}

export function unwrapTenant(body: unknown) {
  return unwrapData(body)
}

export function unwrapCreateOrg(body: unknown) {
  const raw = body as { tenant?: unknown }
  if (raw.tenant) return raw.tenant
  return unwrapData(body)
}

function planRegionKey(region: unknown): 'IR' | 'INTL' {
  return String(region).toUpperCase() === 'IR' ? 'IR' : 'INTL'
}

export function normalizeSuperAdminPlan(plan: JsonRecord): JsonRecord {
  const rawFeatures = plan.features
  const prices = (plan.prices as JsonRecord[] | undefined) ?? []

  const priceMonthly = { IR: 0, INTL: 0 }
  const priceYearly = { IR: 0, INTL: 0 }

  for (const price of prices) {
    const region = planRegionKey(price.region)
    priceMonthly[region] = Number(price.monthly_amount ?? 0)
    priceYearly[region] = Number(price.yearly_amount ?? 0)
  }

  let maxUsers = Number(plan.max_users ?? 0)
  let maxProjects = Number(plan.max_projects ?? 0)
  let features: string[] = []

  if (Array.isArray(rawFeatures)) {
    features = rawFeatures.map(item => String(item))
  } else if (rawFeatures && typeof rawFeatures === 'object') {
    const featureMap = rawFeatures as JsonRecord
    if (featureMap.max_users != null) maxUsers = Number(featureMap.max_users)
    if (featureMap.max_projects != null) maxProjects = Number(featureMap.max_projects)
    features = Object.entries(featureMap).map(([key, value]) => `${key}: ${value}`)
  }

  return {
    id: plan.id,
    code: plan.code,
    name: plan.name,
    features,
    price_monthly: priceMonthly,
    price_yearly: priceYearly,
    max_users: maxUsers,
    max_projects: maxProjects
  }
}

export function normalizeSuperAdminPlans(body: unknown) {
  return { data: unwrapCollection(body).map(normalizeSuperAdminPlan) }
}
