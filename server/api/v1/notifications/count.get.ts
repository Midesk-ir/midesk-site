export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const unread = db.notifications.filter(n => !n.read_at).length
  return { count: unread }
})
