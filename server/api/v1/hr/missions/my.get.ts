export default defineEventHandler((event) => {
  const { db, user } = requireAuthWithPermission(event, ['hr:missions:view', 'hr:missions:request'])
  return { data: db.phase2.listMyMissions(user.id) }
})
