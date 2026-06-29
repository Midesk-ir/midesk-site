import type { CreateLeaveRequestPayload } from '../../../../../app/types/phase1'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  const body = await readBody<CreateLeaveRequestPayload>(event)
  const request = db.phase1.createLeaveRequest(user.id, user.name, body)
  return { data: request }
})
