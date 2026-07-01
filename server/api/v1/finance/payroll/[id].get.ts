export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!
  const { db } = requireAuthWithPermission(event, 'finance:payroll:view')
  return { data: db.phase3.getPayrollDetail(id) }
})
