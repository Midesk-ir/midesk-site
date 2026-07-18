import { bootstrapSessionIfTenant, buildApiContext } from '~/utils/api-fetch'

let pendingBootstrap: Promise<void> | null = null

export async function ensureSessionBootstrap(): Promise<void> {
  if (!hasAuthSession()) return

  const pinia = ensureActivePinia()
  if (!pinia) {
    throw new Error('Pinia not ready')
  }

  const authStore = useAuthStore(pinia)
  const tenantStore = useTenantStore(pinia)
  const tenantId = tenantStore.tenantId || getTenantIdCookie().value

  if (!tenantId) {
    if (authStore.user && !authStore.bootstrapped) {
      authStore.setBootstrap({
        user: authStore.user,
        tenant: null,
        permissions: []
      })
    }
    return
  }

  const sessionReady = authStore.bootstrapped
    && !!authStore.user
    && !!tenantStore.tenant

  if (sessionReady) {
    return
  }

  if (pendingBootstrap) {
    return pendingBootstrap
  }

  pendingBootstrap = (async () => {
    await bootstrapSessionIfTenant(buildApiContext(), authStore, tenantStore)
  })().finally(() => {
    pendingBootstrap = null
  })

  return pendingBootstrap
}
