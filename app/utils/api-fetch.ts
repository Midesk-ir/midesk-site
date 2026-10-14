import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { BootstrapData } from '~/types'
import { beginDataLoading, endDataLoading, isSilentLoadingUrl } from '~/utils/app-loading'

export type ApiContext = {
  baseURL: string
  token: string | null
  tenantId: string | null
  locale: string
}

function buildHeaders(ctx: ApiContext, extra?: Record<string, string>) {
  return {
    Accept: 'application/json',
    ...extra,
    ...(ctx.token ? { Authorization: `Bearer ${ctx.token}` } : {}),
    ...(ctx.tenantId ? { 'X-Tenant-Id': ctx.tenantId } : {}),
    'Accept-Language': ctx.locale
  }
}

export function readApiError(err: unknown, field?: string): string | undefined {
  const data = (err as {
    data?: {
      error?: {
        message?: string
        details?: Array<{ field: string, msg: string }>
      }
    }
  }).data

  if (field) {
    return data?.error?.details?.find(detail => detail.field === field)?.msg
  }

  return data?.error?.message
}

export async function apiFetch<T>(
  ctx: ApiContext,
  url: string,
  options: NitroFetchOptions<NitroFetchRequest> = {}
): Promise<T> {
  const trackLoading = import.meta.client && !isSilentLoadingUrl(url)
  if (trackLoading) beginDataLoading()

  try {
    return await $fetch<T>(url, {
      baseURL: ctx.baseURL,
      ...options,
      headers: buildHeaders(ctx, options.headers as Record<string, string> | undefined)
    }) as T
  } finally {
    if (trackLoading) endDataLoading()
  }
}

export async function bootstrapSession(
  ctx: ApiContext,
  authStore: ReturnType<typeof useAuthStore>,
  tenantStore: ReturnType<typeof useTenantStore>
) {
  const data = await apiFetch<BootstrapData>(ctx, '/core/bootstrap')
  authStore.setBootstrap(data)
  tenantStore.setTenant(data.tenant)
  return data
}

export async function bootstrapSessionIfTenant(
  ctx: ApiContext,
  authStore: ReturnType<typeof useAuthStore>,
  tenantStore: ReturnType<typeof useTenantStore>
) {
  const tenantId = ctx.tenantId ?? tenantStore.tenantId

  if (!tenantId) {
    if (authStore.user) {
      authStore.setBootstrap({
        user: authStore.user,
        tenant: null,
        permissions: []
      })
    }
    return null
  }

  return bootstrapSession(ctx, authStore, tenantStore)
}

/** Always reads the latest token/tenant from Pinia (or cookies as fallback). */
export function buildApiContext(overrides: Partial<ApiContext> = {}): ApiContext {
  const config = useRuntimeConfig()
  const localeCookie = useCookie<string>('i18n_locale', { default: () => 'fa' })

  let token: string | null = null
  let tenantId: string | null = null

  const pinia = ensureActivePinia()
  if (pinia) {
    const authStore = useAuthStore(pinia)
    const tenantStore = useTenantStore(pinia)
    token = toValue(authStore.token)
    tenantId = toValue(tenantStore.tenantId)
  } else {
    token = getAuthTokenCookie().value
    tenantId = getTenantIdCookie().value
  }

  return {
    baseURL: config.public.apiBase,
    token,
    tenantId,
    locale: localeCookie.value || 'fa',
    ...overrides
  }
}

export function createApiContext() {
  return () => buildApiContext()
}
