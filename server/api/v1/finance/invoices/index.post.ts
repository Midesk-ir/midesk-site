import type { CreateInvoicePayload } from '../../../../../app/types/phase3'

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateInvoicePayload>(event)
  const { db } = requireAuthWithPermission(event, 'finance:invoices:view')
  return { data: db.phase3.createInvoice(body) }
})
