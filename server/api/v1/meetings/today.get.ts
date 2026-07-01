export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'meetings:view')
  const db = useMockDb()
  return { data: db.phase4.listMeetings(user.id, 'today') }
})
