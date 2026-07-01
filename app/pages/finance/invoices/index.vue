<script setup lang="ts">
import type { CreateInvoicePayload, InvoiceStatus } from '~/types/phase3'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'finance'] })

const { t } = useI18n()
const financeStore = useFinanceStore()
const toast = useToast()
const route = useRoute()
const { can } = usePermissions()

const loading = ref(true)
const filters = reactive<{ status?: InvoiceStatus | 'overdue' }>({
  status: (route.query.status as InvoiceStatus | 'overdue' | undefined) ?? undefined
})

const statusOptions = computed(() => [
  { value: undefined as InvoiceStatus | 'overdue' | undefined, label: t('finance.invoices.filters.allStatuses') },
  ...(['sent', 'overdue', 'paid', 'cancelled'] as const).map(s => ({
    value: s as InvoiceStatus | 'overdue',
    label: t(`finance.invoices.status.${s}`)
  }))
])

async function load() {
  loading.value = true
  try {
    await Promise.all([
      financeStore.fetchInvoices(filters),
      financeStore.fetchVendors()
    ])
  } finally {
    loading.value = false
  }
}

watch(filters, load, { deep: true })

async function onCreate(payload: CreateInvoicePayload) {
  try {
    await financeStore.createInvoice(payload)
    toast.add({ title: t('finance.invoices.actions.created'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onPay(id: string) {
  try {
    await financeStore.payInvoice(id)
    toast.add({ title: t('finance.invoices.actions.paid'), color: 'success' })
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
        <h1 class="midesk-page-title">{{ t('nav.finance.invoices') }}</h1>
        <p class="midesk-page-subtitle">{{ t('finance.invoices.pageSubtitle') }}</p>
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
        <h2 class="midesk-card-header">{{ t('finance.invoices.newInvoice') }}</h2>
        <FinanceInvoiceForm :vendors="financeStore.vendors" @submit="onCreate" />
      </section>

      <div class="midesk-finance-filters">
        <USelect
          v-model="filters.status"
          :items="statusOptions"
          value-key="value"
          label-key="label"
          class="min-w-40"
          :placeholder="t('finance.invoices.filters.status')"
        />
      </div>

      <FinanceInvoiceList
        :invoices="financeStore.invoices"
        :loading="loading"
        @pay="onPay"
      />
    </div>
  </div>
</template>
