import { ensureSessionBootstrap } from '~/utils/session-bootstrap'

export default defineNuxtPlugin({
  name: 'auth-bootstrap',
  dependsOn: ['pinia'],
  setup(nuxtApp) {
    nuxtApp.hook('app:mounted', () => {
      if (!hasAuthSession()) return
      void ensureSessionBootstrap().catch((error: unknown) => {
        const status = (error as { statusCode?: number })?.statusCode
        if (status !== 401) return

        const pinia = ensureActivePinia()
        if (!pinia) return

        useAuthStore(pinia).clearAuth()
        useTenantStore(pinia).clearTenant()
      })
    })
  }
})
