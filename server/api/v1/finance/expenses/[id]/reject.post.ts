export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event).catch(() => ({}))
  const { db, permissions, isAdmin } = requireAuth(event)

  const canReject = isAdmin
    || permissions.includes('finance:expenses:approve')
    || permissions.includes('finance:expenses:pay')

  if (!canReject) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const expense = db.phase3.rejectExpense(id, body.reason)
  return { data: expense }
})
