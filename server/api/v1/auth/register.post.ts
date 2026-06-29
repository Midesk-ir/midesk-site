export default defineEventHandler(async (event) => {
  const body = await readBody<{ name: string, email?: string, phone?: string, password: string }>(event)
  if (!body.email && !body.phone) {
    throw createError({ statusCode: 422, data: { details: { phone: ['Email or phone required'] } } })
  }
  return { message: 'Registered. Verify OTP.', phone: body.phone }
})
