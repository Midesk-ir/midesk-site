export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const sprint = db.phase1.getSprint(id)
  if (!sprint) throw createError({ statusCode: 404, message: 'Sprint not found' })
  return { data: db.phase1.getBurndown(id) }
})
