export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ sprint_id: string | null }>(event)
  const task = db.phase1.assignTaskToSprint(id, body.sprint_id, db.tasks)
  return { data: task }
})
