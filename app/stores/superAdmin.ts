import { defineStore } from 'pinia'
import { apiFetch, buildApiContext } from '~/utils/api-fetch'

export const useSuperAdminStore = defineStore('superAdmin', () => {
  const token = useCookie<string | null>('midesk_sa_token', {
    maxAge: 60 * 60 * 8,
    sameSite: 'lax',
    secure: import.meta.env.PROD
  })

  const isAuthenticated = computed(() => !!token.value)

  function saContext() {
    return buildApiContext({ token: token.value ?? undefined })
  }

  async function login(credentials: { email: string, password: string }) {
    const data = await apiFetch<{ token: string }>(buildApiContext(), '/super-admin/auth/login', {
      method: 'POST',
      body: credentials
    })
    token.value = data.token
    return data
  }

  function logout() {
    token.value = null
  }

  async function api<T>(path: string, opts: { method?: string, body?: unknown } = {}) {
    return apiFetch<T>(saContext(), path, opts as Parameters<typeof apiFetch>[2])
  }

  return { token, isAuthenticated, login, logout, api }
})
