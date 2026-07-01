import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { ApiError } from '~/types'
import { apiFetch, buildApiContext } from '~/utils/api-fetch'

/** API helper safe to call from Pinia actions (not at store setup time). */
export async function storeApi<T>(
  url: string,
  options: NitroFetchOptions<NitroFetchRequest> = {}
): Promise<T> {
  try {
    return await apiFetch<T>(buildApiContext(), url, options)
  } catch (error: unknown) {
    const fetchError = error as { statusCode?: number, data?: ApiError }
    if (fetchError.statusCode === 401) {
      const authStore = useAuthStore()
      const tenantStore = useTenantStore()
      authStore.clearAuth()
      tenantStore.clearTenant()
      if (!url.startsWith('/auth/') && import.meta.client) {
        const route = useRoute()
        await navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`, { replace: true })
      }
    } else if (fetchError.statusCode === 403 || (fetchError.statusCode && fetchError.statusCode >= 500)) {
      useToast().add({
        title: fetchError.data?.message || 'Error',
        color: 'error'
      })
    }
    throw error
  }
}
