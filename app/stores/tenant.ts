import { defineStore } from 'pinia'
import type { Tenant } from '~/types'

export const useTenantStore = defineStore('tenant', () => {
  const tenantId = useCookie<string | null>('midesk_tenant_id', {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: import.meta.env.PROD
  })

  const tenant = ref<Tenant | null>(null)

  const hasTenant = computed(() => !!tenantId.value)
  const isIran = computed(() => tenant.value?.region === 'IR')
  const calendarType = computed(() => tenant.value?.calendar_type ?? 'jalali')

  function setTenant(data: Tenant | null) {
    tenant.value = data
    tenantId.value = data?.id ?? null
  }

  function clearTenant() {
    tenant.value = null
    tenantId.value = null
  }

  return {
    tenantId,
    tenant,
    hasTenant,
    isIran,
    calendarType,
    setTenant,
    clearTenant
  }
})
