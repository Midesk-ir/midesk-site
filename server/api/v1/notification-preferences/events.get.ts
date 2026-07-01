export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'notifications:preferences')
  const db = useMockDb()
  return { data: db.phase4.getNotificationEvents() }
})
