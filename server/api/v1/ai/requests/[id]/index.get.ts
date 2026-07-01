export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'ai:view')
  const db = useMockDb()
  const id = getRouterParam(event, 'id')!
  const data = db.phase4.getAiRequest(id)
  if (!data) throw createError({ statusCode: 404, message: 'Not found' })
  return { data }
})
