export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const { db, permissions, isAdmin } = requireAuth(event)

  const asFinance = isAdmin || permissions.includes('finance:expenses:pay')
  const canManager = isAdmin || permissions.includes('finance:expenses:approve')

  if (!asFinance && !canManager) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const expense = db.phase3.approveExpense(id, asFinance)
  return { data: expense }
})
