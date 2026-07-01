export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'notifications:preferences')
  const db = useMockDb()
  return { data: db.phase4.getNotificationPreferences(user.id) }
})
