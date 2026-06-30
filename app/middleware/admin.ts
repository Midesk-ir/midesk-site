export default defineNuxtRouteMiddleware(() => {
  const authStore = safeAuthStore()
  if (!authStore?.isAdmin) {
    return navigateTo('/dashboard', { replace: true })
  }
})
