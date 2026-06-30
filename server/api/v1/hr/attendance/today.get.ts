export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'hr:attendance:view')
  const db = useMockDb()
  return { data: db.phase2.getTodayAttendance() }
})
