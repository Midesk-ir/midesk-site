export default defineEventHandler(async (event) => {
  const { user } = requireAuthWithPermission(event, 'correspondence:manage')
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const db = useMockDb()
  return { data: db.phase5.routeCorrespondence(id, user.id, body) }
})
