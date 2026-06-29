export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')!
  return { data: db.phase1.getVelocity(id) }
})
