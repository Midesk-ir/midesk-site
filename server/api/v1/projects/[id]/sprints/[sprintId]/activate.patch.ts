export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const sprintId = getRouterParam(event, 'sprintId')!
  const sprint = db.phase1.activateSprint(sprintId)
  return { data: sprint }
})
