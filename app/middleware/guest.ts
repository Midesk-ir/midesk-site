import { hasTenantContext, resolvePostAuthTarget } from '~/utils/auth-redirect'

export default defineNuxtRouteMiddleware((to) => {
  if (!hasAuthSession()) return

  if (to.path === '/login') return

  return navigateTo(resolvePostAuthTarget(to.query.redirect as string | undefined), { replace: true })
})
