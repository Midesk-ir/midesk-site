export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()

  if (!authStore.isAuthenticated) return

  if (!tenantStore.hasTenant) {
    return navigateTo('/onboarding', { replace: true })
  }
})
