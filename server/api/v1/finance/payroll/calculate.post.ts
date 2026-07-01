export default defineEventHandler(async (event) => {
  const body = await readBody<{ period: string }>(event)
  const { db } = requireAuthWithPermission(event, 'finance:payroll:view')
  return { data: db.phase3.calculatePayroll(body.period) }
})
