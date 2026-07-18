import { createHmac, timingSafeEqual } from 'node:crypto'

const SECTOR_SIZE = 48
const ALIGN_TOLERANCE = 14
const MIN_INTERACTION_MS = 500
const CHALLENGE_TTL_MS = 5 * 60 * 1000
const TOKEN_TTL_MS = 3 * 60 * 1000

type ChallengePayload = {
  id: string
  targetAngle: number
  exp: number
}

type VerifiedPayload = {
  id: string
  v: 1
  exp: number
}

function captchaSecret(): string {
  const config = useRuntimeConfig()
  return (config.captchaSecret as string) || 'midesk-dev-captcha-secret'
}

function signPayload(payload: object): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', captchaSecret()).update(encoded).digest('base64url')
  return `${encoded}.${sig}`
}

function readSignedPayload<T extends { exp: number }>(seal: string): T | null {
  const [encoded, sig] = seal.split('.')
  if (!encoded || !sig) return null

  const expected = createHmac('sha256', captchaSecret()).update(encoded).digest('base64url')
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as T
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function angleDelta(a: number, b: number) {
  const d = Math.abs(normalizeAngle(a) - normalizeAngle(b)) % 360
  return Math.min(d, 360 - d)
}

export function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360
}

export function randomStartAngle(targetAngle: number) {
  for (let i = 0; i < 20; i++) {
    const candidate = Math.floor(Math.random() * 360)
    if (angleDelta(candidate, targetAngle) >= 70) return candidate
  }
  return normalizeAngle(targetAngle + 180)
}

export function issueMotionCaptchaChallenge() {
  const id = crypto.randomUUID()
  const targetAngle = Math.floor(Math.random() * 280) + 40
  const exp = Date.now() + CHALLENGE_TTL_MS
  const seal = signPayload({ id, targetAngle, exp } satisfies ChallengePayload)

  return {
    id,
    seal,
    targetAngle,
    sectorSize: SECTOR_SIZE,
    startAngle: randomStartAngle(targetAngle)
  }
}

export function verifyMotionCaptchaAlignment(input: {
  id: string
  seal: string
  angle: number
  durationMs: number
}) {
  const payload = readSignedPayload<ChallengePayload>(input.seal)
  if (!payload || payload.id !== input.id) return false
  if (input.durationMs < MIN_INTERACTION_MS) return false
  return angleDelta(input.angle, payload.targetAngle) <= ALIGN_TOLERANCE
}

export function issueMotionCaptchaToken(challengeId: string) {
  const exp = Date.now() + TOKEN_TTL_MS
  return signPayload({ id: challengeId, v: 1, exp } satisfies VerifiedPayload)
}

export function assertMotionCaptchaToken(token: unknown) {
  if (typeof token !== 'string' || !token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Captcha required',
      data: { message: 'captcha_required' }
    })
  }

  const payload = readSignedPayload<VerifiedPayload>(token)
  if (!payload || payload.v !== 1) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid captcha',
      data: { message: 'captcha_invalid' }
    })
  }
}
