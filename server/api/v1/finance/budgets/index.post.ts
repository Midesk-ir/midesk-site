export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'finance:budgets:manage')
  const body = await readBody(event)
  const budget = db.phase3.createBudget(body)
  return { data: budget }
})
