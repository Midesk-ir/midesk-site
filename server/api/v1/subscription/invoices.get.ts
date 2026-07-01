export default defineEventHandler((event) => {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  if (user.role !== 'OWNER') throw createError({ statusCode: 403, message: 'Forbidden' })
  return { data: db.phase5.listInvoices() }
})
