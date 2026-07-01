export default defineEventHandler(async (event) => {
  requireAuthWithPermission(event, 'crm:manage')
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const db = useMockDb()
  return { data: db.phase5.updateContact(id, body) }
})
