export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!
  const { db } = requireAuthWithPermission(event, 'finance:expenses:pay')
  const expense = db.phase3.payExpense(id)
  return { data: expense }
})
