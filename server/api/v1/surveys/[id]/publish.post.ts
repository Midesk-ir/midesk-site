export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'surveys:manage')
  const id = getRouterParam(event, 'id')!
  const db = useMockDb()
  return { data: db.phase5.publishSurvey(id) }
})
