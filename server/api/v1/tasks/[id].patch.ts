export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')
  const task = db.tasks.find(t => t.id === id)
  if (!task) throw createError({ statusCode: 404, message: 'Not found' })

  const body = await readBody<Partial<typeof task>>(event)
  Object.assign(task, body, { updated_at: new Date().toISOString() })

  if (body.assignee === null) task.assignee = null
  if (typeof body.assignee === 'object' && body.assignee) {
    const user = db.getUser(body.assignee.id)
    if (user) task.assignee = { id: user.id, name: user.name, avatar_url: user.avatar_url }
  }

  if (body.story_points !== undefined) {
    db.phase1.recalcAllSprints(db.tasks)
  }

  return task
})
