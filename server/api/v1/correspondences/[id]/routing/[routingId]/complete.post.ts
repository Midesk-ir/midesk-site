export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'correspondence:manage')
  const corrId = getRouterParam(event, 'id')!
  const routingId = getRouterParam(event, 'routingId')!
  const db = useMockDb()
  return { data: db.phase5.completeRouting(corrId, routingId) }
})
