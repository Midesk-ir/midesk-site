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
    const pinia = ensureActivePinia()
    if (!pinia) {
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, { replace: true })
    }

    const authStore = useAuthStore(pinia)
    const tenantStore = useTenantStore(pinia)
    const status = (error as { statusCode?: number })?.statusCode

    if (status === 401) {
      authStore.clearAuth()
      tenantStore.clearTenant()
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, { replace: true })
    }

    if (status === 400 && !hasTenantContext()) {
      return navigateTo('/onboarding', { replace: true })
    }

    if (!authStore.bootstrapped) {
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, { replace: true })
    }
  }
})
