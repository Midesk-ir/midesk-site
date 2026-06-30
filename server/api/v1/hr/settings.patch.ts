import type { HrSettings } from '../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'hr:settings:manage')
  const body = await readBody<Partial<HrSettings>>(event)
  return { data: db.phase2.updateSettings(body) }
})
