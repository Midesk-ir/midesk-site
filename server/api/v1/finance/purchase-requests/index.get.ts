export default defineEventHandler((event) => {
  const { db, user, permissions, isAdmin } = requireAuth(event)
  const canViewAll = isAdmin
    || permissions.includes('finance:expenses:view')
    || permissions.includes('finance:expenses:approve')
    || permissions.includes('finance:expenses:pay')
    || permissions.includes('finance:invoices:view')

  if (!canViewAll && !permissions.includes('finance:expenses:create')) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  return { data: db.phase3.listPurchaseRequests(user.id, canViewAll) }
})
