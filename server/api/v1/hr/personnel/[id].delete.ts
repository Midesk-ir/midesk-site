export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:personnel:delete')
  const id = getRouterParam(event, 'id')!
  db.phase2.deletePersonnel(id)
  return { success: true }
})
