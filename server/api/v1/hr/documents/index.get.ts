export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:documents:view')
  const query = getQuery(event)
  return {
    data: db.phase2.listDocuments({
      personnel_id: query.personnel_id as string,
      category: query.category as string
    })
  }
})
