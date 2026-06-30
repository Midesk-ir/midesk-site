import { getActivePinia } from 'pinia'

export function getAuthTokenCookie() {
  return useCookie<string | null>('midesk_token')
}

export function getTenantIdCookie() {
  return useCookie<string | null>('midesk_tenant_id')
}

export function hasAuthSession() {
  return !!getAuthTokenCookie().value
}

export function hasActivePinia() {
  return !!getActivePinia()
}

export function safeAuthStore() {
  if (!hasActivePinia()) return null
  return useAuthStore()
}

export function safeTenantStore() {
  if (!hasActivePinia()) return null
  return useTenantStore()
}
