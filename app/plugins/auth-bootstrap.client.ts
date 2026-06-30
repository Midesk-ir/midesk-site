import { bootstrapSession } from '~/utils/api-fetch'

const PUBLIC_PATHS = new Set(['/', '/login', '/register', '/verify-otp'])

export default defineNuxtPlugin({
  name: 'auth-bootstrap',
  dependsOn: ['pinia'],
  setup(nuxtApp) {
    nuxtApp.hook('app:mounted', async () => {
      if (!hasAuthSession() || !hasActivePinia()) return

      const route = useRoute()
      if (PUBLIC_PATHS.has(route.path)) return

      const authStore = useAuthStore()
      if (authStore.bootstrapped) return

      const tenantStore = useTenantStore()
      const config = useRuntimeConfig()
      const localeCookie = useCookie<string>('i18n_locale', { default: () => 'fa' })

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
        await navigateTo('/login', { replace: true })
      }
    })
  }
})
