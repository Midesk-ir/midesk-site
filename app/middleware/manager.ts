export default defineNuxtRouteMiddleware(async (to) => {
  if (!hasAuthSession()) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, { replace: true })
  }

  if (!ensureActivePinia()) {
    return navigateTo('/leave', { replace: true })
  }

  try {
    await ensureSessionBootstrap()
  } catch {
    return navigateTo('/leave', { replace: true })
  }

  const pinia = ensureActivePinia()
  if (!pinia) {
    return navigateTo('/leave', { replace: true })
  }

  const authStore = useAuthStore(pinia)
  const role = authStore.user?.role
  const canManage = role === 'OWNER' || role === 'ADMIN' || role === 'MANAGER'

  if (!canManage) {
    return navigateTo('/leave', { replace: true })
  }
})
