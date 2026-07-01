export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'correspondence:view')
  const id = getRouterParam(event, 'id')!
  const db = useMockDb()
  return { data: db.phase5.getCorrespondence(id) }
})
