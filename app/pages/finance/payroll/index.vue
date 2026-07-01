<script setup lang="ts">
import type { PayslipDetail } from '~/types/phase3'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'finance'] })

const { t } = useI18n()
const financeStore = useFinanceStore()
const { api } = useApi()
const toast = useToast()

const loading = ref(true)
const calculating = ref(false)
const period = ref(new Date().toISOString().slice(0, 7))
const selectedIds = ref<string[]>([])
const selectedPayslip = ref<PayslipDetail | null>(null)
const showDetail = ref(false)

async function load() {
  loading.value = true
  try {
    await financeStore.fetchPayroll(period.value)
  } finally {
    loading.value = false
  }
}

async function onCalculate(p: string) {
  period.value = p
  calculating.value = true
  try {
    await financeStore.calculatePayroll(p)
    toast.add({ title: t('finance.payroll.actions.calculated'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    calculating.value = false
  }
}

async function onApprove(id: string) {
  try {
    await financeStore.approvePayroll(id)
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onBulkPay() {
  if (!selectedIds.value.length) return
  try {
    await financeStore.bulkPayPayroll(selectedIds.value)
    selectedIds.value = []
    toast.add({ title: t('finance.payroll.actions.bulkPaid'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onSelect(id: string) {
  try {
    const res = await api<{ data: PayslipDetail }>(`/finance/payroll/${id}`)
    selectedPayslip.value = res.data
    showDetail.value = true
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

watch(period, load)

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <div>
        <h1 class="midesk-page-title">{{ t('nav.finance.payroll') }}</h1>
        <p class="midesk-page-subtitle">{{ t('finance.payroll.pageSubtitle') }}</p>
      </div>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton to="/finance" back>
          {{ t('nav.finance.dashboard') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <FinanceSubNav />

    <div class="space-y-6">
      <section class="midesk-card p-5">
        <h2 class="midesk-card-header">{{ t('finance.payroll.calculateTitle') }}</h2>
        <FinancePayrollCalculateBtn :loading="calculating" @calculate="onCalculate" />
      </section>

      <div v-if="selectedIds.length" class="midesk-finance-toolbar">
        <p class="text-sm text-[var(--color-midesk-muted)]">
          {{ t('finance.payroll.selectedCount', { count: selectedIds.length }) }}
        </p>
        <UButton color="primary" icon="i-lucide-banknote" @click="onBulkPay">
          {{ t('finance.payroll.actions.bulkPay', { count: selectedIds.length }) }}
        </UButton>
      </div>

      <FinancePayrollTable
        v-model:selected-ids="selectedIds"
        :records="financeStore.payroll"
        :loading="loading"
        @approve="onApprove"
        @select="onSelect"
      />
    </div>

    <MideskModal v-model:open="showDetail" :title="t('finance.payroll.payslipTitle')">
      <FinancePayslipDetail v-if="selectedPayslip" :payslip="selectedPayslip" />
    </MideskModal>
  </div>
</template>
