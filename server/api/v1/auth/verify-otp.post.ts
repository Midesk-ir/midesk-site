export default defineEventHandler(async (event) => {
  const db = useMockDb()
  const body = await readBody<{ phone: string, code: string }>(event)
  const otp = db.otpCodes.get(body.phone)

  if (!otp || otp.code !== body.code) {
    throw createError({ statusCode: 422, data: { details: { code: ['Invalid code'] } } })
  }

  let user = db.users.find(u => u.phone === body.phone)
  if (!user) {
    user = {
      id: `u${Date.now()}`,
      name: 'کاربر جدید',
      email: null,
      phone: body.phone,
      avatar_url: null,
      role: 'OWNER'
    }
    db.users.push(user)
  }

  const token = db.createToken(user.id, null)
  return { token, user, tenant: null }
})
