export default defineEventHandler(async (event) => {
  requireAuthWithPermission(event, 'surveys:view')
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const db = useMockDb()
  return { data: db.phase5.respondSurvey(id, body) }
})
