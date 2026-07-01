<script setup lang="ts">
import type { CreateVendorPayload } from '~/types/phase3'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'finance'] })

const { t } = useI18n()
const financeStore = useFinanceStore()
const toast = useToast()
const { can } = usePermissions()

const loading = ref(true)

async function load() {
  loading.value = true
  try {
    await financeStore.fetchVendors()
  } finally {
    loading.value = false
  }
}

async function onCreate(payload: CreateVendorPayload) {
  try {
    await financeStore.createVendor(payload)
    toast.add({ title: t('finance.vendors.actions.created'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <div>
        <h1 class="midesk-page-title">{{ t('nav.finance.vendors') }}</h1>
        <p class="midesk-page-subtitle">{{ t('finance.vendors.pageSubtitle') }}</p>
      </div>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton to="/finance" back>
          {{ t('nav.finance.dashboard') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <FinanceSubNav />

    <div class="space-y-6">
      <section v-if="can('finance:invoices:view')" class="midesk-card p-5">
        <h2 class="midesk-card-header">{{ t('finance.vendors.newVendor') }}</h2>
        <FinanceVendorForm @submit="onCreate" />
      </section>

      <FinanceVendorList :vendors="financeStore.vendors" :loading="loading" />
    </div>
  </div>
</template>
