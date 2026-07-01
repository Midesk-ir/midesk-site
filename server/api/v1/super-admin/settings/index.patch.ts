import type { SaPlatformSettings } from '../../../../../app/types/phase5'

export default defineEventHandler(async (event) => {
  const { db } = requireSaAuth(event)
  const body = await readBody<Partial<SaPlatformSettings>>(event)
  return { data: db.saUpdateSettings(body) }
})
