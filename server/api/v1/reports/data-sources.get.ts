export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'reports:view')
  const db = useMockDb()
  return { data: db.phase5.dataSources() }
})
