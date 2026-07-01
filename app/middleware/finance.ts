function financePermissionsForPath(path: string): string[] | null {
  if (path === '/finance') return ['finance:dashboard:view']
  if (path === '/finance/expenses/my') return ['finance:expenses:create', 'finance:my:view']
  if (path.startsWith('/finance/expenses')) return ['finance:expenses:view', 'finance:expenses:create', 'finance:expenses:approve', 'finance:expenses:pay']
  if (path.startsWith('/finance/budgets')) return ['finance:budgets:view', 'finance:budgets:manage']
  if (path.startsWith('/finance/invoices')) return ['finance:invoices:view']
  if (path.startsWith('/finance/purchase-requests')) return ['finance:expenses:create', 'finance:expenses:view']
  if (path.startsWith('/finance/purchase-orders')) return ['finance:invoices:view']
  if (path.startsWith('/finance/vendors')) return ['finance:invoices:view']
  if (path.startsWith('/finance/payroll')) return ['finance:payroll:view']
  if (path === '/my-finance') return ['finance:my:view']
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
    : financePermissionsForPath(to.path)

  if (!required) return

  const allowed = required.some(p => authStore.hasPermission(p))
  if (allowed) return

  if (to.path === '/finance') {
    if (authStore.hasPermission('finance:expenses:create')) {
      return navigateTo('/finance/expenses/my', { replace: true })
    }
    if (authStore.hasPermission('finance:my:view')) {
      return navigateTo('/my-finance', { replace: true })
    }
  }

  const hasAnyFinance = authStore.permissions.some(p => p.startsWith('finance:'))

  if (!hasAnyFinance) {
    return navigateTo('/dashboard', { replace: true })
  }

  return navigateTo('/my-finance', { replace: true })
})
