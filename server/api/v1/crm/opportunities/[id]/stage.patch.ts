export default defineEventHandler(async (event) => {
  requireAuthWithPermission(event, 'crm:manage')
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ stage: string }>(event)
  const db = useMockDb()
  return { data: db.phase5.updateOpportunityStage(id, body.stage as 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost') }
})
