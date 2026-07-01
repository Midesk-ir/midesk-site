export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'surveys:view')
  const id = getRouterParam(event, 'id')!
  const db = useMockDb()
  return { data: db.phase5.getSurvey(id) }
})
