export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'roles:manage')
  const id = getRouterParam(event, 'id')!
  const db = useMockDb()
  db.phase5.deleteCustomRole(id)
  return { data: { ok: true } }
})
