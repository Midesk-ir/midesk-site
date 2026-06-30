export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:onboarding:view')
  return { data: db.phase2.listOnboardingTemplates() }
})
