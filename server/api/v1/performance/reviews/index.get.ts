export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'performance:reviews:view')
  const db = useMockDb()
  return { data: db.phase5.listReviews() }
})
