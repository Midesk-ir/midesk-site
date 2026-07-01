export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'meetings:view')
  const db = useMockDb()
  const filter = getQuery(event).filter as 'today' | 'upcoming' | 'past' | undefined
  return { data: db.phase4.listMeetings(user.id, filter) }
})
