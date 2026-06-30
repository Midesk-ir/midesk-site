import type { OnboardingStep } from '../../../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'hr:onboarding:manage')
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ steps: OnboardingStep[] }>(event)
  return { data: db.phase2.updateOnboardingTemplate(id, body.steps) }
})
