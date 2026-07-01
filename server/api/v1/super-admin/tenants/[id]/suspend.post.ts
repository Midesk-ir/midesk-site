export default defineEventHandler((event) => {
  const { db } = requireSaAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing id' })
  return { data: db.saSuspendTenant(id) }
})
