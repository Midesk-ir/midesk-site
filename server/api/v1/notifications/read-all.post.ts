export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  db.notifications.forEach(n => { n.read_at = new Date().toISOString() })
  return { message: 'ok' }
})
