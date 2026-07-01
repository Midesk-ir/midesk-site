export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'notes:manage')
  const db = useMockDb()
  const id = getRouterParam(event, 'id')!
  const data = db.phase4.togglePin(id, user.id)
  return { data }
})
