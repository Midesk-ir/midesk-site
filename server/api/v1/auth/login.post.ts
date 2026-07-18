export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event)
  assertMotionCaptchaToken(body?.captchaToken)

  const { captchaToken: _captcha, ...rest } = body ?? {}
  return proxyToBackend(event, { body: rest })
})
