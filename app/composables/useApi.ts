import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { ApiError } from '~/types'
import { apiFetch, buildApiContext } from '~/utils/api-fetch'

export function useApi() {
  async function api<T>(
    url: string,
    options: NitroFetchOptions<NitroFetchRequest> = {}
  ): Promise<T> {
    try {
      return await apiFetch<T>(buildApiContext(), url, options)
    } catch (error: unknown) {
      const fetchError = error as { statusCode?: number, data?: ApiError }
      const status = fetchError.statusCode
      const data = fetchError.data

      if (status === 401) {
        const authStore = useAuthStore()
        const tenantStore = useTenantStore()
        authStore.clearAuth()
        tenantStore.clearTenant()
        if (!url.startsWith('/auth/')) {
          const route = useRoute()
          await navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`, { replace: true })
        }
        throw error
      }

      if (status === 403 || (status && status >= 500)) {
        useToast().add({
          title: data?.message || 'Error',
          color: 'error'
        })
      }

      throw error
    }
  }

  return { api }
}
