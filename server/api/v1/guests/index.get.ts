export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'guests:manage')
  const db = useMockDb()
  return { data: db.phase5.listGuests() }
})
