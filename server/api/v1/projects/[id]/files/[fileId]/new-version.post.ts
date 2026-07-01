export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'files:manage')
  const fileId = getRouterParam(event, 'fileId')!
  const db = useMockDb()
  return { data: db.phase5.newVersion(fileId, user.id) }
})
