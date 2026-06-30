import { bootstrapSession } from '~/utils/api-fetch'

export default defineNuxtRouteMiddleware(async () => {
  if (!hasAuthSession()) {
    return navigateTo('/login', { replace: true })
  }

  if (!hasActivePinia()) return

  const authStore = useAuthStore()
  const tenantStore = useTenantStore()
  const config = useRuntimeConfig()
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

  const role = authStore.user?.role
  const canManage = role === 'OWNER' || role === 'ADMIN' || role === 'MANAGER'

  if (!canManage) {
    return navigateTo('/leave', { replace: true })
  }
})
