import type { CreateLeavePolicyPayload } from '../../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'leave:policies:manage')
  const id = getRouterParam(event, 'id')!
  const body = await readBody<Partial<CreateLeavePolicyPayload>>(event)
  return { data: db.phase2.updateLeavePolicy(id, body) }
})
