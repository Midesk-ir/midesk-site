export default defineEventHandler(async (event) => {
  const { user } = requireAuthWithPermission(event, 'crm:manage')
  const body = await readBody(event)
  const db = useMockDb()
  return { data: db.phase5.createActivity(user.id, body) }
})
