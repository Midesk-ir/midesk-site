import type { CreatePurchaseRequestPayload } from '../../../../../app/types/phase3'

export default defineEventHandler(async (event) => {
  const body = await readBody<CreatePurchaseRequestPayload>(event)
  const { db, user } = requireAuthWithPermission(event, 'finance:expenses:create')
  return { data: db.phase3.createPurchaseRequest(user.id, body) }
})
