<script setup lang="ts">
import type { Expense, MyPayslipBrief, MyReceipt, PayslipDetail } from '~/types/phase3'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'finance'] })

const { t } = useI18n()
const { api } = useApi()

const tab = ref<'payslips' | 'expenses' | 'receipts'>('payslips')
const loading = ref(true)
const payslips = ref<MyPayslipBrief[]>([])
const expenses = ref<Expense[]>([])
const receipts = ref<MyReceipt[]>([])
const selectedExpense = ref<Expense | null>(null)
const selectedPayslip = ref<PayslipDetail | null>(null)
const showExpenseDetail = ref(false)
const showPayslipDetail = ref(false)

const tabs = computed(() => [
  { value: 'payslips' as const, label: t('finance.my.tabs.payslips'), icon: 'i-lucide-file-text' },
  { value: 'expenses' as const, label: t('finance.my.tabs.expenses'), icon: 'i-lucide-receipt' },
  { value: 'receipts' as const, label: t('finance.my.tabs.receipts'), icon: 'i-lucide-receipt-text' }
])

async function load() {
  loading.value = true
  try {
    const [p, e, r] = await Promise.all([
      api<{ data: MyPayslipBrief[] }>('/my-finance/payslips'),
      api<{ data: Expense[] }>('/my-finance/expenses'),
      api<{ data: MyReceipt[] }>('/my-finance/receipts')
    ])
    payslips.value = p.data
    expenses.value = e.data
    receipts.value = r.data
  } finally {
    loading.value = false
  }
}

function onSelectExpense(expense: Expense) {
  selectedExpense.value = expense
  showExpenseDetail.value = true
}

async function onSelectPayslip(id: string) {
  try {
    const res = await api<{ data: PayslipDetail }>(`/my-finance/payslips/${id}`)
    selectedPayslip.value = res.data
    showPayslipDetail.value = true
  } catch {
    useToast().add({ title: t('common.error'), color: 'error' })
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <div>
        <h1 class="midesk-page-title">{{ t('nav.finance.myFinance') }}</h1>
        <p class="midesk-page-subtitle">{{ t('finance.my.subtitle') }}</p>
      </div>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton to="/finance" back>
          {{ t('nav.finance.dashboard') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <div class="mb-6 midesk-finance-tabs">
      <button
        v-for="item in tabs"
        :key="item.value"
        type="button"
        class="midesk-finance-tab"
        :class="{ 'midesk-finance-tab--active': tab === item.value }"
        @click="tab = item.value"
      >
        <UIcon :name="item.icon" class="size-4 shrink-0" />
        {{ item.label }}
      </button>
    </div>

    <MyFinanceMyPayslips
      v-if="tab === 'payslips'"
      :payslips="payslips"
      :loading="loading"
      @select="onSelectPayslip"
    />
    <MyFinanceMyExpenses
      v-else-if="tab === 'expenses'"
      :expenses="expenses"
      :loading="loading"
      @select="onSelectExpense"
    />
    <MyFinanceMyReceipts v-else :receipts="receipts" :loading="loading" />

    <MideskModal v-model:open="showExpenseDetail" :title="t('finance.expenses.detail')">
      <FinanceExpenseDetail v-if="selectedExpense" :expense="selectedExpense" />
    </MideskModal>

    <MideskModal v-model:open="showPayslipDetail" :title="t('finance.payroll.payslipTitle')">
      <FinancePayslipDetail v-if="selectedPayslip" :payslip="selectedPayslip" />
    </MideskModal>
  </div>
</template>
