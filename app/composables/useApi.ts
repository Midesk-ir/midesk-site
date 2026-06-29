import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { ApiError } from '~/types'
import { apiFetch, createApiContext } from '~/utils/api-fetch'

export function useApi() {
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()
  const getContext = createApiContext()
  const toast = useToast()

  async function api<T>(
    url: string,
    options: NitroFetchOptions<NitroFetchRequest> = {}
  ): Promise<T> {
    try {
      return await apiFetch<T>(getContext(), url, options)
    } catch (error: unknown) {
      const fetchError = error as { statusCode?: number, data?: ApiError }
      const status = fetchError.statusCode
      const data = fetchError.data

      if (status === 401) {
        authStore.clearAuth()
        tenantStore.clearTenant()
        if (!url.startsWith('/auth/')) {
          await navigateTo('/login', { replace: true })
        }
        throw error
      }

      if (status === 422 && data?.details) {
        throw error
      }

      if (status === 403 || (status && status >= 500)) {
        toast.add({
          title: data?.message || 'Error',
          color: 'error'
        })
      }

      throw error
    }
  }

  return { api }
}
