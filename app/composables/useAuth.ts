import type {
  AuthResponse,
  CreateOrgPayload,
  Tenant
} from '~/types'
import { apiFetch, bootstrapSession, createApiContext } from '~/utils/api-fetch'

export function useAuth() {
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()
  const getContext = createApiContext()

  async function login(credentials: { email?: string, phone?: string, password: string }) {
    const data = await apiFetch<AuthResponse>(getContext(), '/auth/login', {
      method: 'POST',
      body: credentials
    })
    authStore.setAuth(data)
    if (data.tenant) tenantStore.setTenant(data.tenant)
    await bootstrapSession(getContext(), authStore, tenantStore)
    return data
  }

  async function loginOtp(payload: { phone: string }) {
    return apiFetch<{ message: string }>(getContext(), '/auth/login/otp', {
      method: 'POST',
      body: payload
    })
  }

  async function register(payload: { name: string, email?: string, phone?: string, password: string }) {
    return apiFetch<{ message: string, phone?: string }>(getContext(), '/auth/register', {
      method: 'POST',
      body: payload
    })
  }

  async function verifyOtp(payload: { phone: string, code: string }) {
    const data = await apiFetch<AuthResponse>(getContext(), '/auth/verify-otp', {
      method: 'POST',
      body: payload
    })
    authStore.setAuth(data)
    if (data.tenant) tenantStore.setTenant(data.tenant)
    await bootstrapSession(getContext(), authStore, tenantStore)
    return data
  }

  async function bootstrap() {
    return bootstrapSession(getContext(), authStore, tenantStore)
  }

  async function createOrg(payload: CreateOrgPayload) {
    const tenant = await apiFetch<Tenant>(getContext(), '/orgs', {
      method: 'POST',
      body: payload
    })
    tenantStore.setTenant(tenant)
    await bootstrapSession(getContext(), authStore, tenantStore)
    return tenant
  }

  async function logout() {
    try {
      await apiFetch(getContext(), '/auth/logout', { method: 'POST' })
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
