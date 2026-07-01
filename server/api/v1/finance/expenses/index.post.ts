export default defineEventHandler(async (event) => {
  const { db, user } = requireAuthWithPermission(event, 'finance:expenses:create')
  const body = await readBody(event)
  const expense = db.phase3.createExpense(user.id, body)
  return { data: expense }
})
