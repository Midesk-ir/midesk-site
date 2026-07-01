<script setup lang="ts">
import type { CreateExpensePayload, Expense } from '~/types/phase3'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'finance'] })

const { t } = useI18n()
const { api } = useApi()
const financeStore = useFinanceStore()
const toast = useToast()
const authStore = useAuthStore()

const loading = ref(true)
const myExpenses = ref<Expense[]>([])
const selectedExpense = ref<Expense | null>(null)
const showDetail = ref(false)

async function load() {
  loading.value = true
  try {
    await Promise.all([
      api<{ data: Expense[] }>('/my-finance/expenses').then(r => { myExpenses.value = r.data }),
      financeStore.fetchCostCenters(),
      financeStore.fetchBudgets(new Date().getFullYear())
    ])
  } finally {
    loading.value = false
  }
}

async function onCreate(payload: CreateExpensePayload) {
  try {
    await financeStore.createExpense(payload)
    toast.add({ title: t('finance.expenses.actions.created'), color: 'success' })
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onSubmit(id: string) {
  try {
    await financeStore.submitExpense(id)
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

function onSelect(expense: Expense) {
  selectedExpense.value = expense
  showDetail.value = true
}

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <div>
        <h1 class="midesk-page-title">{{ t('finance.expenses.myExpenses') }}</h1>
      </div>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton
          v-if="authStore.hasPermission('finance:expenses:view')"
          to="/finance/expenses"
          icon="i-lucide-list"
        >
          {{ t('nav.finance.expenses') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <section class="midesk-card mb-6 p-5">
      <h2 class="midesk-card-header">{{ t('finance.expenses.newExpense') }}</h2>
      <FinanceExpenseForm
        :cost-centers="financeStore.costCenters"
        :budgets="financeStore.budgets"
        @submit="onCreate"
      />
    </section>

    <FinanceExpenseList
      :expenses="myExpenses"
      :loading="loading"
      @submit="onSubmit"
      @select="onSelect"
    />

    <MideskModal v-model:open="showDetail" :title="t('finance.expenses.detail')">
      <FinanceExpenseApprovalFlow
        v-if="selectedExpense"
        :status="selectedExpense.status"
      />
    </MideskModal>
  </div>
</template>
