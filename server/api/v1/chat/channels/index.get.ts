export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'chat:view')
  const db = useMockDb()
  return { data: db.phase4.listChannels(user.id) }
})
