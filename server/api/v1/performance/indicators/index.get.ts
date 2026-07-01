export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'performance:indicators:view')
  const db = useMockDb()
  return { data: db.phase5.listIndicators() }
})
