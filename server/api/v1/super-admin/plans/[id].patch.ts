import type { SubscriptionPlan } from '../../../../../app/types/phase5'

export default defineEventHandler(async (event) => {
  const { db } = requireSaAuth(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing id' })
  const body = await readBody<Partial<SubscriptionPlan>>(event)
  return { data: db.saUpdatePlan(id, body) }
})
