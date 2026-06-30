export default defineEventHandler((event) => {
  const { db, user } = requireAuthWithPermission(event, 'hr:attendance:clock')
  return { data: db.phase2.clockAction(user.id, 'check_in') }
})
