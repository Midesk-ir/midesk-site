export function useTenant() {
  const tenantStore = useTenantStore()
  const { api } = useApi()

  async function updateOrg(payload: Partial<{
    name: string
    locale: string
    calendar_type: 'jalali' | 'gregorian'
    region: 'IR' | 'INTL'
    default_currency: string
    timezone: string
  }>) {
    const tenant = await api<typeof tenantStore.tenant>('/orgs/current', {
      method: 'PATCH',
      body: payload
    })
    tenantStore.setTenant(tenant)
    return tenant
  }

  return {
    tenant: computed(() => tenantStore.tenant),
    isIran: computed(() => tenantStore.isIran),
    calendarType: computed(() => tenantStore.calendarType),
    updateOrg
  }
}
