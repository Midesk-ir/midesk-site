export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'correspondence:manage')
  const id = getRouterParam(event, 'id')!
  const db = useMockDb()
  return { data: db.phase5.sendCorrespondence(id) }
})
