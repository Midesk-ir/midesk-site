export default defineNuxtRouteMiddleware(async (to) => {
  if (!hasAuthSession()) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, { replace: true })
  }

  if (!ensureActivePinia()) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, { replace: true })
  }

  try {
    await ensureSessionBootstrap()
  } catch (error: unknown) {
    const authStore = useAuthStore()
    const tenantStore = useTenantStore()
    const status = (error as { statusCode?: number })?.statusCode

    if (status === 401) {
      authStore.clearAuth()
      tenantStore.clearTenant()
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, { replace: true })
    }

    if (!authStore.bootstrapped) {
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, { replace: true })
    }
  }
})
