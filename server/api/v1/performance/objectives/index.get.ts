export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'performance:objectives:view')
  const db = useMockDb()
  return { data: db.phase5.listObjectives() }
})
