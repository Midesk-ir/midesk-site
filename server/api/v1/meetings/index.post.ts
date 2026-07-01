import type { CreateMeetingPayload } from '~/types/phase4'

export default defineEventHandler(async (event) => {
  const { user } = requireAuthWithPermission(event, 'meetings:manage')
  const db = useMockDb()
  const body = await readBody<CreateMeetingPayload>(event)
  const data = db.phase4.createMeeting(body, user.id)
  return { data }
})
