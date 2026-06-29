export default defineEventHandler((event) => {
  const db = useMockDb()
  const { session } = db.requireAuth(event)
  const tenantId = db.getTenantId(event, session)
  return db.getTenant(tenantId)
})
