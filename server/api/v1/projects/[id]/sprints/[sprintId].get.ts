export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const sprintId = getRouterParam(event, 'sprintId')!
  const sprint = db.phase1.getSprint(sprintId)
  if (!sprint) throw createError({ statusCode: 404, message: 'Sprint not found' })
  const tasks = db.tasks.filter(t => t.sprint_id === sprintId)
  return { data: { sprint, tasks } }
})
