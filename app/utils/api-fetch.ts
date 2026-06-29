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

export function createApiContext() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()
  const localeCookie = useCookie<string>('i18n_locale', { default: () => 'fa' })

  return (): ApiContext => ({
    baseURL: config.public.apiBase,
    token: toValue(authStore.token),
    tenantId: toValue(tenantStore.tenantId),
    locale: localeCookie.value || 'fa'
  })
}
