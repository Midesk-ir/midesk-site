export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'notes:manage')
  const db = useMockDb()
  const id = getRouterParam(event, 'id')!
  db.phase4.deleteNote(id, user.id)
  return { ok: true }
})
