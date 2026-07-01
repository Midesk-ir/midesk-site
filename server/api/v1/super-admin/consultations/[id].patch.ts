import type { SaConsultation } from '../../../../../app/types/phase5'

export default defineEventHandler(async (event) => {
  const { db } = requireSaAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing id' })
  const body = await readBody<{ status: SaConsultation['status'] }>(event)
  return { data: db.saUpdateConsultation(id, body.status) }
})
