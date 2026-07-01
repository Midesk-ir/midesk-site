export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'ai:query')
  const db = useMockDb()
  const id = getRouterParam(event, 'id')!
  const data = db.phase4.completeAiRequest(id)
  if (!data) throw createError({ statusCode: 404, message: 'Not found' })
  return { data }
})
