import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const body = await readBody<{ name: string, description?: string }>(event)

  const project = {
    id: randomUUID(),
    name: body.name,
    description: body.description ?? null,
    status: 'active' as const,
    members_count: 1,
    tasks_count: 0,
    progress: 0,
    created_at: new Date().toISOString()
  }
  db.projects.push(project)
  return project
})
