export default defineNuxtRouteMiddleware((to) => {
  if (!hasAuthSession()) return

  const authStore = safeAuthStore()
  if (!authStore) return

  const required = to.meta.permission as string | string[] | undefined

  if (!required) {
    if (to.path === '/hr' || to.path.startsWith('/hr/')) {
      const hasHrAccess = authStore.hasPermission('hr:dashboard:view')
        || authStore.hasPermission('hr:attendance:clock')
        || authStore.permissions.some(p => p.startsWith('hr:'))
      if (!hasHrAccess) {
        return navigateTo('/dashboard', { replace: true })
      }
    }
    return
  }

  const permissions = Array.isArray(required) ? required : [required]
  if (!permissions.some(p => authStore.hasPermission(p))) {
    return navigateTo('/dashboard', { replace: true })
  }
})
