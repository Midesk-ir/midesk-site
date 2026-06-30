export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:recruitment:view')
  return { data: db.phase2.listRequisitions() }
})
