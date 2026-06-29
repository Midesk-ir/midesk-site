const MANAGER_ROLES = ['OWNER', 'ADMIN', 'MANAGER'] as const

export default defineEventHandler((event) => {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  if (!MANAGER_ROLES.includes(user.role as typeof MANAGER_ROLES[number])) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }
  return { data: db.phase1.getPendingLeaveRequests() }
})
