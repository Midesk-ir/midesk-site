export default defineEventHandler(async (event) => {
  const db = useMockDb()
  const body = await readBody<{ phone: string }>(event)
  const code = '123456'
  db.otpCodes.set(body.phone, { code, expires: Date.now() + 120000 })
  return { message: 'OTP sent', debug_code: code }
})
