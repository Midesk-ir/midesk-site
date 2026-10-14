import {
  beginRouteLoading,
  endRouteLoading
} from '~/utils/app-loading'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  router.beforeEach((to, from) => {
    if (to.fullPath === from.fullPath) return
    beginRouteLoading()
  })

  router.afterEach(() => {
    endRouteLoading()
  })

  router.onError(() => {
    endRouteLoading()
  })

  nuxtApp.hook('page:loading:start', () => {
    beginRouteLoading()
  })

  nuxtApp.hook('page:loading:end', () => {
    endRouteLoading()
  })

  nuxtApp.hook('app:error', () => {
    endRouteLoading()
  })
})
