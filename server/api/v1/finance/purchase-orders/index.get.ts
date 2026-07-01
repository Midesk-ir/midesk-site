export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'finance:invoices:view')
  return { data: db.phase3.listPurchaseOrders() }
})
