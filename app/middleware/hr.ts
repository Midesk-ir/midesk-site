function hrPermissionsForPath(path: string): string[] | null {
  if (path === '/hr') return ['hr:dashboard:view']
  if (path.startsWith('/hr/personnel')) return ['hr:personnel:view']
  if (path === '/hr/attendance/my') return ['hr:attendance:clock', 'hr:attendance:view']
  if (path.startsWith('/hr/attendance')) return ['hr:attendance:view']
  if (path.startsWith('/hr/contracts')) return ['hr:contracts:view']
  if (path.startsWith('/hr/documents')) return ['hr:documents:view']
  if (path.startsWith('/hr/missions')) return ['hr:missions:view', 'hr:missions:request']
  if (path.startsWith('/hr/recruitment')) return ['hr:recruitment:view']
  if (path.startsWith('/hr/onboarding')) return ['hr:onboarding:view']
  if (path === '/hr/settings') return ['hr:settings:manage']
  return null
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (!hasAuthSession()) return

  if (!ensureActivePinia()) {
    return navigateTo('/dashboard', { replace: true })
  }

  try {
    await ensureSessionBootstrap()
  } catch {
    return navigateTo('/dashboard', { replace: true })
  }

  const authStore = useAuthStore()
  const metaPermission = to.meta.permission as string | string[] | undefined
  const required = metaPermission
    ? (Array.isArray(metaPermission) ? metaPermission : [metaPermission])
    : hrPermissionsForPath(to.path)

  if (!required) return

  const allowed = required.some(p => authStore.hasPermission(p))
  if (allowed) return

  if (to.path === '/hr') {
    if (authStore.hasPermission('hr:attendance:clock') || authStore.hasPermission('hr:attendance:view')) {
      return navigateTo('/hr/attendance/my', { replace: true })
    }
  }

  const hasAnyHr = authStore.permissions.some(p => p.startsWith('hr:'))
    || authStore.hasPermission('hr:attendance:clock')

  if (!hasAnyHr) {
    return navigateTo('/dashboard', { replace: true })
  }

  return navigateTo('/hr', { replace: true })
})
