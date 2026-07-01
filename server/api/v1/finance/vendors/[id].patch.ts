import type { CreateVendorPayload } from '../../../../../app/types/phase3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody<Partial<CreateVendorPayload & { is_active: boolean }>>(event)
  const { db } = requireAuthWithPermission(event, 'finance:invoices:view')
  return { data: db.phase3.updateVendor(id, body) }
})
