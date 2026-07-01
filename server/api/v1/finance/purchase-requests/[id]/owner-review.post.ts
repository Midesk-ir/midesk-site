export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ approved: boolean, reason?: string }>(event)
  const { db, permissions, isAdmin } = requireAuth(event)

  if (!isAdmin && !permissions.includes('finance:expenses:approve')) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  return { data: db.phase3.ownerReviewPurchaseRequest(id, body.approved, body.reason) }
})
