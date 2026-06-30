import type { Interview, InterviewType } from '../../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'hr:recruitment:manage')
  const body = await readBody<{
    candidate_id: string
    interviewer_id: string
    scheduled_at: string
    type: InterviewType
  }>(event)
  const interviewer = db.phase2.users.find(u => u.id === body.interviewer_id)
  if (!interviewer) throw createError({ statusCode: 422, message: 'Interviewer not found' })
  const interview: Omit<Interview, 'id'> = {
    candidate_id: body.candidate_id,
    interviewer,
    scheduled_at: body.scheduled_at,
    type: body.type,
    status: 'scheduled'
  }
  return { data: db.phase2.createInterview(interview) }
})
