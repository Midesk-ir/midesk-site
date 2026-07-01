export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'meetings:view')
  const db = useMockDb()
  const id = getRouterParam(event, 'id')!
  const data = db.phase4.getMeeting(id, user.id)
  if (!data) throw createError({ statusCode: 404, message: 'Not found' })
  return { data }
})
