import type { CreateWorklogPayload } from '../../../../app/types/phase1'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  const body = await readBody<CreateWorklogPayload>(event)
  const project = db.projects.find(p => p.id === body.project_id)
  const entry = db.phase1.createWorklog(user.id, user.name, body, db.tasks)
  if (project) entry.project_name = project.name
  return { data: entry }
})
