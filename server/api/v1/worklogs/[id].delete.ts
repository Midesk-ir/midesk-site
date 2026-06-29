export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')!
  db.phase1.deleteWorklog(id)
  return { success: true }
})
