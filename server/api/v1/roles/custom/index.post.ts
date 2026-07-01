export default defineEventHandler(async (event) => {
  requireAuthWithPermission(event, 'roles:manage')
  const body = await readBody(event)
  const db = useMockDb()
  return { data: db.phase5.createCustomRole(body) }
})
