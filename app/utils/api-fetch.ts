import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { BootstrapData } from '~/types'

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

export async function apiFetch<T>(
  ctx: ApiContext,
  url: string,
  options: NitroFetchOptions<NitroFetchRequest> = {}
): Promise<T> {
  return $fetch<T>(url, {
    baseURL: ctx.baseURL,
    ...options,
    headers: buildHeaders(ctx, options.headers as Record<string, string> | undefined)
  }) as T
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

/** Always reads the latest token/tenant from Pinia (or cookies as fallback). */
export function buildApiContext(overrides: Partial<ApiContext> = {}): ApiContext {
  const config = useRuntimeConfig()
  const localeCookie = useCookie<string>('i18n_locale', { default: () => 'fa' })

  let token: string | null = null
  let tenantId: string | null = null

  if (ensureActivePinia()) {
    const authStore = useAuthStore()
    const tenantStore = useTenantStore()
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
