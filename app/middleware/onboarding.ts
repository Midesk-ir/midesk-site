export default defineNuxtRouteMiddleware(() => {
  if (!hasAuthSession()) return

  const tenantStore = safeTenantStore()
  if (tenantStore?.hasTenant) {
    return navigateTo('/dashboard', { replace: true })
  }
})
