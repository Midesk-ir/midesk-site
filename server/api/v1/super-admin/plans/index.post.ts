import { randomUUID } from 'node:crypto'
import type { SubscriptionPlan } from '../../../../../app/types/phase5'

export default defineEventHandler(async (event) => {
  const { db } = requireSaAuth(event)
  const body = await readBody<Omit<SubscriptionPlan, 'id'> & { id?: string }>(event)
  const plan: SubscriptionPlan = {
    id: body.id ?? randomUUID(),
    code: body.code,
    name: body.name,
    features: body.features ?? [],
    price_monthly: body.price_monthly,
    price_yearly: body.price_yearly,
    max_users: body.max_users,
    max_projects: body.max_projects
  }
  return { data: db.saCreatePlan(plan) }
})
