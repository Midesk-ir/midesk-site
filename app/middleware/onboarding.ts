import { hasTenantContext } from '~/utils/auth-redirect'

export default defineNuxtRouteMiddleware(() => {
  if (!hasAuthSession()) return

  if (hasTenantContext()) {
    return navigateTo('/dashboard', { replace: true })
  }
})
