import type { ExpenseCategory, ExpenseStatus } from '../../../../../app/types/phase3'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const { db, user, permissions, isAdmin } = requireAuth(event)

  const canViewAll = isAdmin
    || permissions.includes('finance:expenses:view')
    || permissions.includes('finance:expenses:approve')
    || permissions.includes('finance:expenses:pay')

  if (!canViewAll && !permissions.includes('finance:expenses:create')) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const filters = {
    status: query.status as ExpenseStatus | undefined,
    category: query.category as ExpenseCategory | undefined,
    user_id: query.user_id as string | undefined,
    from_date: query.from_date as string | undefined,
    to_date: query.to_date as string | undefined
  }

  if (!canViewAll) {
    filters.user_id = user.id
  }

  return { data: db.phase3.listExpenses(filters) }
})
