export default defineEventHandler((event) => {
  const query = getQuery(event)
  const year = query.year ? Number(query.year) : undefined
  const { db } = requireAuthWithPermission(event, 'finance:budgets:view')
  return { data: db.phase3.listBudgets(year) }
})
