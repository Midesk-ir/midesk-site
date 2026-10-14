export default defineNuxtRouteMiddleware(async () => {
  if (!hasAuthSession()) return

  if (!ensureActivePinia()) {
    return navigateTo('/dashboard', { replace: true })
  }

  try {
    await ensureSessionBootstrap()
  } catch {
    return navigateTo('/dashboard', { replace: true })
  }

  const pinia = ensureActivePinia()
  if (!pinia) {
    return navigateTo('/dashboard', { replace: true })
  }

  const authStore = useAuthStore(pinia)
  const hasLeaveModule = authStore.permissions.some(
    p => p.startsWith('hr:') || p.startsWith('leave:')
  )

  if (!hasLeaveModule) {
    return navigateTo('/dashboard', { replace: true })
  }
})
