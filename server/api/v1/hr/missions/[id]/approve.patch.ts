export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:missions:approve')
  const id = getRouterParam(event, 'id')!
  return { data: db.phase2.approveMission(id) }
})
