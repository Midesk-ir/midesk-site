export default defineEventHandler((event) => {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  const query = getQuery(event)
  const filters = {
    from: query.from as string | undefined,
    to: query.to as string | undefined,
    project_id: query.project_id as string | undefined
  }
  return { data: db.phase1.getMyWorklogs(user.id, filters) }
})
