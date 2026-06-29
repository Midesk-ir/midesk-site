export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const request = db.phase1.approveLeave(id)
  return { data: request }
})
