export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'hr:onboarding:manage')
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ step_id: string }>(event)
  return { data: db.phase2.completeOnboardingStep(id, body.step_id) }
})
