export default defineEventHandler(async (event) => {
  requireAuthWithPermission(event, 'crm:manage')
  const body = await readBody(event)
  const db = useMockDb()
  return { data: db.phase5.createOpportunity(body) }
})
