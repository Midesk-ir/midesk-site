export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:contracts:view')
  const query = getQuery(event)
  const days = query.days ? Number(query.days) : 30
  return { data: db.phase2.getExpiringContracts(days) }
})
