import { bootstrapSession } from '~/utils/api-fetch'

let pendingBootstrap: Promise<void> | null = null

export async function ensureSessionBootstrap(): Promise<void> {
  if (!hasAuthSession()) return

  if (!ensureActivePinia()) {
    throw new Error('Pinia not ready')
  }

  const authStore = useAuthStore()
  const tenantStore = useTenantStore()

  const sessionReady = authStore.bootstrapped
    && !!authStore.user
    && (!tenantStore.tenantId || !!tenantStore.tenant)

  if (sessionReady) {
    return
  }

  if (pendingBootstrap) {
    return pendingBootstrap
  }

  pendingBootstrap = (async () => {
    await bootstrapSession(buildApiContext(), authStore, tenantStore)
  })().finally(() => {
    pendingBootstrap = null
  })

  return pendingBootstrap
}
