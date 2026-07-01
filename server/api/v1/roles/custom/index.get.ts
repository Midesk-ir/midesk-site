export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'roles:manage')
  const db = useMockDb()
  return { data: db.phase5.listCustomRoles() }
})
