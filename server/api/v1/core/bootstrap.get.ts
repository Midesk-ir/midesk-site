export default defineEventHandler((event) => {
  const db = useMockDb()
  const { user, session } = db.requireAuth(event)
  const tenantId = db.getTenantId(event, session)
  const tenant = db.getTenant(tenantId)

  return {
    user,
    tenant,
    permissions: ['project:read', 'project:write', 'task:read', 'task:write', 'member:invite']
  }
})
