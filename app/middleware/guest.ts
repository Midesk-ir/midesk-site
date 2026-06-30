export default defineNuxtRouteMiddleware((to) => {
  if (!hasAuthSession()) return

  // Logged-in users can open /login (switch account). Register/verify-otp still redirect.
  if (to.path === '/login') return

  const tenantId = getTenantIdCookie().value
  if (tenantId) {
    return navigateTo('/dashboard', { replace: true })
  }

  return navigateTo('/onboarding', { replace: true })
})
