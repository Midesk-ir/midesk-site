import { defineStore } from 'pinia'
import type { BootstrapData, User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('midesk_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    secure: import.meta.env.PROD
  })

  const user = ref<User | null>(null)
  const permissions = ref<string[]>([])
  const bootstrapped = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => {
    const role = user.value?.role
    return role === 'OWNER' || role === 'ADMIN'
  })

  function setAuth(data: { token: string, user: User }) {
    token.value = data.token
    user.value = data.user
  }

  function setBootstrap(data: BootstrapData) {
    user.value = data.user
    permissions.value = data.permissions
    bootstrapped.value = true
  }

  function clearAuth() {
    token.value = null
    user.value = null
    permissions.value = []
    bootstrapped.value = false
  }

  function hasPermission(permission: string) {
    return permissions.value.includes(permission) || isAdmin.value
  }

  return {
    token,
    user,
    permissions,
    bootstrapped,
    isAuthenticated,
    isAdmin,
    setAuth,
    setBootstrap,
    clearAuth,
    hasPermission
  }
})
