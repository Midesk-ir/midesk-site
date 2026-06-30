import type { CreateRequisitionPayload } from '../../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'hr:recruitment:manage')
  const body = await readBody<CreateRequisitionPayload>(event)
  return { data: db.phase2.createRequisition(body) }
})
