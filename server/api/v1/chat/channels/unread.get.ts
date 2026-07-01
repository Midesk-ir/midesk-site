export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'chat:view')
  const db = useMockDb()
  return { count: db.phase4.getUnreadTotal(user.id) }
})
