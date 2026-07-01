export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'notes:view')
  const db = useMockDb()
  return { data: db.phase4.listNotes(user.id) }
})
