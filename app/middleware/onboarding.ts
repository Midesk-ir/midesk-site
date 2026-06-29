export default defineNuxtRouteMiddleware(() => {
  const tenantStore = useTenantStore()

  if (tenantStore.hasTenant) {
    return navigateTo('/dashboard', { replace: true })
  }
})
