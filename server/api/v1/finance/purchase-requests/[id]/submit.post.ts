export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!
  const { db, user } = requireAuthWithPermission(event, 'finance:expenses:create')
  return { data: db.phase3.submitPurchaseRequest(id, user.id) }
})
