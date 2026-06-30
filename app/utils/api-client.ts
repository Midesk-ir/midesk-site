import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { ApiError } from '~/types'
import { apiFetch, createApiContext } from '~/utils/api-fetch'

/** API helper safe to call from Pinia actions (not at store setup time). */
export async function storeApi<T>(
  url: string,
  options: NitroFetchOptions<NitroFetchRequest> = {}
): Promise<T> {
  const getContext = createApiContext()

  try {
    return await apiFetch<T>(getContext(), url, options)
  } catch (error: unknown) {
    const fetchError = error as { statusCode?: number, data?: ApiError }
    if (fetchError.statusCode === 401) {
      const authStore = useAuthStore()
      const tenantStore = useTenantStore()
      authStore.clearAuth()
      tenantStore.clearTenant()
      if (!url.startsWith('/auth/') && import.meta.client) {
        await navigateTo('/login', { replace: true })
      }
    }
    throw error
  }
}
