export default defineEventHandler(async (event) => {
  requireAuthWithPermission(event, 'reports:manage')
  const body = await readBody(event)
  const db = useMockDb()
  return { data: db.phase5.createReport(body) }
})
