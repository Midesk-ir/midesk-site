export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'correspondence:view')
  const q = getQuery(event)
  const db = useMockDb()
  return { data: db.phase5.listCorrespondences(q.type as string, q.status as string) }
})
