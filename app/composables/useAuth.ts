import type {
  AuthResponse,
  CreateOrgPayload,
  Tenant
} from '~/types'
import { apiFetch, bootstrapSession, bootstrapSessionIfTenant, buildApiContext } from '~/utils/api-fetch'

function rollbackAuth() {
  useAuthStore().clearAuth()
  useTenantStore().clearTenant()
}

export function useAuth() {
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()

  async function login(credentials: { email?: string, phone?: string, password: string, captchaToken?: string }) {
    const data = await apiFetch<AuthResponse>(buildApiContext(), '/auth/login', {
      method: 'POST',
      body: credentials
    })
    authStore.setAuth(data)
    if (data.tenant) tenantStore.setTenant(data.tenant)
    try {
      await bootstrapSessionIfTenant(
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

  async function loginOtp(payload: { phone: string, captchaToken?: string }) {
    return apiFetch<{ message: string }>(buildApiContext(), '/auth/login/otp', {
      method: 'POST',
      body: payload
    })
  }

  async function register(payload: { name: string, email?: string, phone?: string, password: string, captchaToken?: string }) {
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
      await bootstrapSessionIfTenant(
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
    const data = await apiFetch<{ tenant: Tenant, token: string }>(buildApiContext(), '/orgs', {
      method: 'POST',
      body: payload
    })
    if (authStore.user) {
      authStore.setAuth({ token: data.token, user: authStore.user })
    } else {
      authStore.token = data.token
    }
    tenantStore.setTenant(data.tenant)
    await bootstrapSession(buildApiContext(), authStore, tenantStore)
    return data.tenant
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
