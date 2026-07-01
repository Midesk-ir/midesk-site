export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'surveys:view')
  const db = useMockDb()
  return { data: db.phase5.listSurveys() }
})
