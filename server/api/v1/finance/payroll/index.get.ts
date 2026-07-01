export default defineEventHandler((event) => {
  const query = getQuery(event)
  const period = query.period as string | undefined
  const { db } = requireAuthWithPermission(event, 'finance:payroll:view')
  return { data: db.phase3.listPayroll(period) }
})
