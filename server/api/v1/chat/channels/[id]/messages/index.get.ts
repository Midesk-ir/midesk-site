export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'chat:view')
  const db = useMockDb()
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const before = query.before as string | undefined
  const limit = query.limit ? Number(query.limit) : 50
  const data = db.phase4.listMessages(id, user.id, { before, limit })
  return { data }
})
