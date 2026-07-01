export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!
  const { db, user } = requireAuthWithPermission(event, 'finance:my:view')
  return { data: db.phase3.getPayslipDetail(id, user.id) }
})
