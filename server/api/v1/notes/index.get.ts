export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'notes:view')
  const db = useMockDb()
  const visibility = getQuery(event).visibility as string | undefined
  return { data: db.phase4.listNotes(user.id, visibility) }
})
