export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')
  const project = db.projects.find(p => p.id === id)
  if (!project) throw createError({ statusCode: 404, message: 'Not found' })
  return project
})
