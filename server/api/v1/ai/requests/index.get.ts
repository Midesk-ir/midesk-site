export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'ai:view')
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  return { data: db.phase4.listAiRequests(user.id) }
})
