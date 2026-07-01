export default defineNuxtRouteMiddleware((to) => {
  const saToken = useCookie<string | null>('midesk_sa_token')
  if (!saToken.value && to.path !== '/super-admin/login') {
    return navigateTo('/super-admin/login', { replace: true })
  }
})
