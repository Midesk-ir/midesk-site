export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!
  const { db } = requireAuthWithPermission(event, 'finance:invoices:view')
  return { data: db.phase3.payInvoice(id) }
})
