export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:recruitment:manage')
  const id = getRouterParam(event, 'id')!
  return { data: db.phase2.hireCandidate(id) }
})
