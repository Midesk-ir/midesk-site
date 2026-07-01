export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'performance:dashboard:view')
  const db = useMockDb()
  return { data: db.phase5.performanceDashboard() }
})
