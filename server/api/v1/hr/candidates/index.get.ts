export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:recruitment:view')
  const query = getQuery(event)
  return { data: db.phase2.listCandidates(query.requisition_id as string) }
})
