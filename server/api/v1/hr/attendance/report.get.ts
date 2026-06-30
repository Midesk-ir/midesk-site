export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'hr:attendance:view')
  const db = useMockDb()
  const query = getQuery(event)
  const month = (query.month as string) || new Date().toISOString().slice(0, 7)
  return { data: db.phase2.getAttendanceReport(month) }
})
