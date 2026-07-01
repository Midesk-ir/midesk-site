export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'guests:manage')
  const id = getRouterParam(event, 'id')!
  const db = useMockDb()
  db.phase5.revokeGuest(id)
  return { data: { ok: true } }
})
