export default defineNuxtRouteMiddleware(() => {
  if (!hasAuthSession()) return

  const tenantId = getTenantIdCookie().value
  if (tenantId) return

  return navigateTo('/onboarding', { replace: true })
})
