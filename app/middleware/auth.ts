import { bootstrapSession } from '~/utils/api-fetch'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!hasAuthSession()) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, { replace: true })
  }

  if (!hasActivePinia()) return

  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()
  const localeCookie = useCookie<string>('i18n_locale', { default: () => 'fa' })

  if (!authStore.bootstrapped) {
    try {
      await bootstrapSession(
        {
          baseURL: config.public.apiBase,
          token: toValue(authStore.token),
          tenantId: toValue(tenantStore.tenantId),
          locale: localeCookie.value || 'fa'
        },
        authStore,
        tenantStore
      )
    } catch {
      authStore.clearAuth()
      tenantStore.clearTenant()
      return navigateTo('/login', { replace: true })
    }
  }
})
