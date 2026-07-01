export default defineEventHandler(async (event) => {
  requireAuthWithPermission(event, 'reports:view')
  const body = await readBody(event)
  const db = useMockDb()
  return { data: db.phase5.previewReport(body) }
})
