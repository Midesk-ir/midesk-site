export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!
  const { db, user } = requireAuthWithPermission(event, 'finance:expenses:create')
  const expense = db.phase3.submitExpense(id, user.id)
  return { data: expense }
})
