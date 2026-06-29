export default defineEventHandler(async (event) => {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  const body = await readBody<{ name?: string, password?: string }>(event)
  if (body.name) user.name = body.name
  return user
})
