export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'correspondence:view')
  const db = useMockDb()
  return { data: db.phase5.inbox(user.id) }
})
