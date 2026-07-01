export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'chat:view')
  const db = useMockDb()
  const id = getRouterParam(event, 'id')!
  db.phase4.markRead(id, user.id)
  return { ok: true }
})
