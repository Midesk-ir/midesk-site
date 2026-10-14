import { getActivePinia, setActivePinia, type Pinia } from 'pinia'
import { tryUseNuxtApp } from '#app'

const BOOTSTRAP_CACHE_KEY = 'midesk_bootstrap'
export const BOOTSTRAP_CACHE_VERSION = 3

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
  return !!ensureActivePinia()
}

/** Resolve Nuxt Pinia and mark it active for store access outside component setup. */
export function ensureActivePinia(): Pinia | null {
  const nuxtApp = tryUseNuxtApp()
  const pinia = nuxtApp?.$pinia ?? getActivePinia() ?? null
  if (pinia) setActivePinia(pinia)
  return pinia
}

export function readBootstrapCache(): { user: import('~/types').User, permissions: string[] } | null {
  if (!import.meta.client || !hasAuthSession()) return null
  try {
    const raw = sessionStorage.getItem(BOOTSTRAP_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as {
      v?: number
      user: import('~/types').User
      permissions: string[]
    }
    if (parsed.v !== BOOTSTRAP_CACHE_VERSION) {
      sessionStorage.removeItem(BOOTSTRAP_CACHE_KEY)
      return null
    }
    return { user: parsed.user, permissions: parsed.permissions }
  } catch {
    sessionStorage.removeItem(BOOTSTRAP_CACHE_KEY)
    return null
  }
}

export function writeBootstrapCache(data: { user: import('~/types').User, permissions: string[] }) {
  if (!import.meta.client) return
  sessionStorage.setItem(BOOTSTRAP_CACHE_KEY, JSON.stringify({ ...data, v: BOOTSTRAP_CACHE_VERSION }))
}

export function clearBootstrapCache() {
  if (!import.meta.client) return
  sessionStorage.removeItem(BOOTSTRAP_CACHE_KEY)
}

export function safeAuthStore() {
  const pinia = ensureActivePinia()
  return pinia ? useAuthStore(pinia) : null
}

export function safeTenantStore() {
  const pinia = ensureActivePinia()
  return pinia ? useTenantStore(pinia) : null
}
