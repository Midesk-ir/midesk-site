export default defineEventHandler((event) => {
  const { db, user } = requireAuthWithPermission(event, 'finance:my:view')
  return { data: db.phase3.listMyPayslips(user.id) }
})
