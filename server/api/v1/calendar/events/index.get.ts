export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  return { data: db.phase1.calendarEvents }
})
