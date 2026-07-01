export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'crm:view')
  const db = useMockDb()
  return { data: db.phase5.crmDashboard() }
})
