export default defineEventHandler(async (event) => {
  const body = await readBody<{ ids: string[] }>(event)
  const { db } = requireAuthWithPermission(event, 'finance:payroll:view')
  return { data: db.phase3.bulkPayPayroll(body.ids ?? []) }
})
