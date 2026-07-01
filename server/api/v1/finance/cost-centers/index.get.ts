export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'finance:budgets:view')
  return { data: db.phase3.listCostCenters() }
})
