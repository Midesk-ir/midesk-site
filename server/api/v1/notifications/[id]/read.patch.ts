export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')
  const n = db.notifications.find(x => x.id === id)
  if (n) n.read_at = new Date().toISOString()
  return n
})
