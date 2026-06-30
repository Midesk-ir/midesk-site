import type { InterviewStatus } from '../../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'hr:recruitment:manage')
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ score?: number, feedback?: string, status?: InterviewStatus }>(event)
  return { data: db.phase2.updateInterview(id, body) }
})
