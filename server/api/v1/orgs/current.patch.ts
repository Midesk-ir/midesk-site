export default defineEventHandler(async (event) => {
  const db = useMockDb()
  const { session } = db.requireAuth(event)
  const tenantId = db.getTenantId(event, session)
  const tenant = db.getTenant(tenantId)
  if (!tenant) throw createError({ statusCode: 404, message: 'Tenant not found' })

  const body = await readBody<Partial<typeof tenant>>(event)
  Object.assign(tenant, body)
  return tenant
})
