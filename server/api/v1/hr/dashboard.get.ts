export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:dashboard:view')
  return { data: db.phase2.getDashboardSummary() }
})
