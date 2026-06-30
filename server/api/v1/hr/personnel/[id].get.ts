export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:personnel:view')
  const id = getRouterParam(event, 'id')!
  const data = db.phase2.getPersonnel(id)
  if (!data) throw createError({ statusCode: 404, message: 'Not found' })
  return { data }
})
