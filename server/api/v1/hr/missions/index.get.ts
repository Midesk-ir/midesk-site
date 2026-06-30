export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:missions:view')
  return { data: db.phase2.listMissions() }
})
