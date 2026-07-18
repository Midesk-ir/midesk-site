export default defineEventHandler(async (event) => {
  const body = await readBody<{
    id?: string
    seal?: string
    angle?: number
    durationMs?: number
  }>(event)

  const id = body?.id
  const seal = body?.seal
  const angle = Number(body?.angle)
  const durationMs = Number(body?.durationMs)

  if (!id || !seal || !Number.isFinite(angle) || !Number.isFinite(durationMs)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid captcha payload',
      data: { message: 'captcha_invalid' }
    })
  }

  const ok = verifyMotionCaptchaAlignment({ id, seal, angle, durationMs })
  if (!ok) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Captcha failed',
      data: { message: 'captcha_failed' }
    })
  }

  return {
    token: issueMotionCaptchaToken(id)
  }
})
