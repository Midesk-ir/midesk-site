export function usePermissions() {
  const authStore = useAuthStore()

  function can(permission: string | string[]) {
    const required = Array.isArray(permission) ? permission : [permission]
    return required.some(p => authStore.hasPermission(p))
  }

  function canAny(permissions: string[]) {
    return permissions.some(p => authStore.hasPermission(p))
  }

  function canAll(permissions: string[]) {
    return permissions.every(p => authStore.hasPermission(p))
  }

  const isHrAdmin = computed(() =>
    canAny([
      'hr:personnel:view',
      'hr:recruitment:manage',
      'hr:onboarding:manage'
    ])
  )

  return { can, canAny, canAll, isHrAdmin }
}
