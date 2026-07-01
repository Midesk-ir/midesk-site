export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'chat:view')
  const db = useMockDb()
  const id = getRouterParam(event, 'id')!
  const channel = db.phase4.getChannel(id, user.id)
  if (!channel) throw createError({ statusCode: 404, message: 'Not found' })
  return { data: channel }
})
