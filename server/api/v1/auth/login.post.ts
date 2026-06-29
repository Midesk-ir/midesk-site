export default defineEventHandler(async (event) => {
  const db = useMockDb()
  const body = await readBody<{ email?: string, phone?: string, password: string }>(event)

  const user = db.users.find(u =>
    (body.email && u.email === body.email) || (body.phone && u.phone === body.phone)
  )

  if (!user || body.password !== 'password') {
    throw createError({ statusCode: 422, data: { message: 'Invalid credentials', details: { email: ['Invalid email or password'] } } })
  }

  const tenant = db.getTenant('t1')
  const token = db.createToken(user.id, tenant?.id ?? null)

  return { token, user, tenant }
})
