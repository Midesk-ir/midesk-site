export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'hr:contracts:manage')
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ end_date: string, base_salary?: number }>(event)
  return { data: db.phase2.renewContract(id, body) }
})
