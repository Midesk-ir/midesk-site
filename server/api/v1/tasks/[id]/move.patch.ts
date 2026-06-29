export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')
  const task = db.tasks.find(t => t.id === id)
  if (!task) throw createError({ statusCode: 404, message: 'Not found' })

  const body = await readBody<{ status: string, order_index: number }>(event)
  task.status = body.status as typeof task.status
  task.order_index = body.order_index
  task.updated_at = new Date().toISOString()
  return task
})
