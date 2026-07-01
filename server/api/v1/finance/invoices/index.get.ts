import type { InvoiceStatus } from '../../../../../app/types/phase3'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const { db } = requireAuthWithPermission(event, 'finance:invoices:view')
  const status = query.status as InvoiceStatus | 'overdue' | undefined
  return { data: db.phase3.listInvoices(status ? { status } : {}) }
})
