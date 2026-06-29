export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')
  const task = db.tasks.find(t => t.id === id)
  if (!task) throw createError({ statusCode: 404, message: 'Not found' })
  return task
})
