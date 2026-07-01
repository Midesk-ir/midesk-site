import { ensureSessionBootstrap } from '~/utils/session-bootstrap'

export default defineNuxtPlugin({
  name: 'auth-bootstrap',
  dependsOn: ['pinia'],
  setup(nuxtApp) {
    nuxtApp.hook('app:created', () => {
      if (!hasAuthSession()) return
      void ensureSessionBootstrap().catch(() => {})
    })
  }
})
