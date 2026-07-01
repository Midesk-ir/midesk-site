import type {
  AuthResponse,
  CreateOrgPayload,
  Tenant
} from '~/types'
import { apiFetch, bootstrapSession, buildApiContext } from '~/utils/api-fetch'

function rollbackAuth() {
  useAuthStore().clearAuth()
  useTenantStore().clearTenant()
}

export function useAuth() {
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()

  async function login(credentials: { email?: string, phone?: string, password: string }) {
    const data = await apiFetch<AuthResponse>(buildApiContext(), '/auth/login', {
      method: 'POST',
      body: credentials
    })
    authStore.setAuth(data)
    if (data.tenant) tenantStore.setTenant(data.tenant)
    try {
      await bootstrapSession(
        buildApiContext({ token: data.token, tenantId: data.tenant?.id ?? null }),
        authStore,
        tenantStore
      )
    } catch (error) {
      rollbackAuth()
      throw error
    }
    return data
  }

  async function loginOtp(payload: { phone: string }) {
    return apiFetch<{ message: string }>(buildApiContext(), '/auth/login/otp', {
      method: 'POST',
      body: payload
    })
  }

  async function register(payload: { name: string, email?: string, phone?: string, password: string }) {
    return apiFetch<{ message: string, phone?: string }>(buildApiContext(), '/auth/register', {
      method: 'POST',
      body: payload
    })
  }

  async function verifyOtp(payload: { phone: string, code: string }) {
    const data = await apiFetch<AuthResponse>(buildApiContext(), '/auth/verify-otp', {
      method: 'POST',
      body: payload
    })
    authStore.setAuth(data)
    if (data.tenant) tenantStore.setTenant(data.tenant)
    try {
      await bootstrapSession(
        buildApiContext({ token: data.token, tenantId: data.tenant?.id ?? null }),
        authStore,
        tenantStore
      )
    } catch (error) {
      rollbackAuth()
      throw error
    }
    return data
  }

  async function bootstrap() {
    return bootstrapSession(buildApiContext(), authStore, tenantStore)
  }

  async function createOrg(payload: CreateOrgPayload) {
    const tenant = await apiFetch<Tenant>(buildApiContext(), '/orgs', {
      method: 'POST',
      body: payload
    })
    tenantStore.setTenant(tenant)
    await bootstrapSession(buildApiContext(), authStore, tenantStore)
    return tenant
  }

  async function logout() {
    try {
      await apiFetch(buildApiContext(), '/auth/logout', { method: 'POST' })
    } finally {
      authStore.clearAuth()
      tenantStore.clearTenant()
      await navigateTo('/login', { replace: true })
    }
  }

  return {
    login,
    loginOtp,
    register,
    verifyOtp,
    bootstrap,
    createOrg,
    logout
  }
}
