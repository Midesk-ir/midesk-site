export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'meetings:manage')
  const db = useMockDb()
  const id = getRouterParam(event, 'id')!
  const data = db.phase4.startMeeting(id, user.id)
  return { data }
})
