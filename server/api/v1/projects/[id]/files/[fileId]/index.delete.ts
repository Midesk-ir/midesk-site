export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'files:manage')
  const fileId = getRouterParam(event, 'fileId')!
  const db = useMockDb()
  db.phase5.deleteFile(fileId)
  return { data: { ok: true } }
})
