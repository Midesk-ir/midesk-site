import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const projectId = getRouterParam(event, 'id')
  const body = await readBody<{ title: string, status?: string, priority?: string }>(event)

  const columnTasks = db.tasks.filter(t => t.project_id === projectId && t.status === (body.status ?? 'backlog'))
  const maxOrder = columnTasks.reduce((max, t) => Math.max(max, t.order_index), 0)

  const task = {
    id: randomUUID(),
    project_id: projectId!,
    title: body.title,
    description: null,
    status: (body.status ?? 'backlog') as 'backlog',
    priority: (body.priority ?? 'medium') as 'medium',
    assignee: null,
    labels: [],
    due_date: null,
    order_index: maxOrder + 1000,
    checklist: [],
    comments_count: 0,
    story_points: null,
    sprint_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  db.tasks.push(task)

  const project = db.projects.find(p => p.id === projectId)
  if (project) {
    project.tasks_count++
  }

  return task
})
