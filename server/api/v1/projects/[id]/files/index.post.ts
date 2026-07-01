export default defineEventHandler(async (event) => {
  const { user } = requireAuthWithPermission(event, 'files:manage')
  const projectId = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const db = useMockDb()
  return { data: db.phase5.uploadFile(projectId, user.id, body) }
})
