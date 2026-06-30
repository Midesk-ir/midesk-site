import type { CandidateStatus } from '../../../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'hr:recruitment:manage')
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ status: CandidateStatus }>(event)
  return { data: db.phase2.moveCandidateStatus(id, body.status) }
})
