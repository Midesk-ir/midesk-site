export default defineEventHandler(async (event) => {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  if (user.role !== 'OWNER') throw createError({ statusCode: 403, message: 'Forbidden' })
  const body = await readBody(event)
  return { data: db.phase5.checkout(body) }
})
