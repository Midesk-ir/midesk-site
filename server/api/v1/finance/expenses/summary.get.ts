export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'finance:dashboard:view')
  return { data: db.phase3.getExpenseSummary() }
})
