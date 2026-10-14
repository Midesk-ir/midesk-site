import { defineStore } from 'pinia'
import type { BootstrapData, User } from '~/types'
import { clearBootstrapCache, readBootstrapCache, writeBootstrapCache } from '~/utils/auth-session'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('midesk_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: import.meta.env.PROD
  })

  const cachedBootstrap = import.meta.client ? readBootstrapCache() : null

  const user = ref<User | null>(cachedBootstrap?.user ?? null)
  const permissions = ref<string[]>(cachedBootstrap?.permissions ?? [])
  const bootstrapped = ref(!!cachedBootstrap)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => {
    const role = user.value?.role
    return role === 'OWNER' || role === 'ADMIN'
  })

  const isOwner = computed(() => user.value?.role === 'OWNER')

  function setAuth(data: { token: string, user: User }) {
    token.value = data.token
    user.value = data.user
  }

  function setBootstrap(data: BootstrapData) {
    user.value = data.user
    permissions.value = data.permissions
    bootstrapped.value = true
    writeBootstrapCache({ user: data.user, permissions: data.permissions })
  }

  function clearAuth() {
    token.value = null
    user.value = null
    permissions.value = []
    bootstrapped.value = false
    clearBootstrapCache()
  }

  function hasPermission(permission: string) {
    return permissions.value.includes(permission)
  }

  return {
    token,
    user,
    permissions,
    bootstrapped,
    isAuthenticated,
    isAdmin,
    isOwner,
    setAuth,
    setBootstrap,
    clearAuth,
    hasPermission
  }
})
