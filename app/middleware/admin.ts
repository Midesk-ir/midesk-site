export default defineNuxtRouteMiddleware(async (to) => {
  if (!hasAuthSession()) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, { replace: true })
  }

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
  if (!authStore.isAdmin) {
    return navigateTo('/dashboard', { replace: true })
  }
})
