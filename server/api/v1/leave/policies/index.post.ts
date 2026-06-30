import type { CreateLeavePolicyPayload } from '../../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'leave:policies:manage')
  const body = await readBody<CreateLeavePolicyPayload>(event)
  return { data: db.phase2.createLeavePolicy(body) }
})
