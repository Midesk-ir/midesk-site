export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'reports:view')
  const id = getRouterParam(event, 'id')!
  const db = useMockDb()
  return { data: db.phase5.getReport(id) }
})
