<script setup lang="ts">
import type { CreateExpensePayload, Expense, ExpenseCategory, ExpenseStatus } from '~/types/phase3'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'finance'] })

const { t } = useI18n()
const financeStore = useFinanceStore()
const toast = useToast()
const { can } = usePermissions()

const loading = ref(true)
const selectedExpense = ref<Expense | null>(null)
const showDetail = ref(false)
const showReject = ref(false)
const rejectReason = ref('')
const rejectTargetId = ref<string | null>(null)

const filters = reactive({
  status: undefined as ExpenseStatus | undefined,
  category: undefined as ExpenseCategory | undefined,
  from_date: '',
  to_date: ''
})

const statusOptions = computed(() => [
  { value: undefined, label: t('finance.expenses.filters.allStatuses') },
  ...(['draft', 'submitted', 'manager_review', 'finance_review', 'ready_to_pay', 'paid', 'rejected'] as ExpenseStatus[]).map(s => ({
    value: s,
    label: t(`finance.expenses.status.${s}`)
  }))
])

const categoryOptions = computed(() => [
  { value: undefined, label: t('finance.expenses.filters.allCategories') },
  ...(['travel', 'office', 'software', 'meals', 'equipment', 'other'] as ExpenseCategory[]).map(c => ({
    value: c,
    label: t(`finance.expenses.categories.${c}`)
  }))
])

async function load() {
  loading.value = true
  try {
    await Promise.all([
      financeStore.fetchExpenses({
        status: filters.status,
        category: filters.category,
        from_date: filters.from_date || undefined,
        to_date: filters.to_date || undefined
      }),
      financeStore.fetchCostCenters(),
      financeStore.fetchBudgets(new Date().getFullYear())
    ])
  } finally {
    loading.value = false
  }
}

watch(filters, load, { deep: true })

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
    showDetail.value = false
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onApprove(id: string) {
  try {
    await financeStore.approveExpense(id)
    showDetail.value = false
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

function openReject(id: string) {
  rejectTargetId.value = id
  rejectReason.value = ''
  showReject.value = true
}

async function confirmReject() {
  if (!rejectTargetId.value) return
  try {
    await financeStore.rejectExpense(rejectTargetId.value, rejectReason.value || undefined)
    showReject.value = false
    showDetail.value = false
    await load()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onPay(id: string) {
  try {
    await financeStore.payExpense(id)
    showDetail.value = false
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
        <h1 class="midesk-page-title">{{ t('nav.finance.expenses') }}</h1>
        <p class="midesk-page-subtitle">{{ t('finance.expenses.pageSubtitle') }}</p>
      </div>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton to="/finance/expenses/my" icon="i-lucide-user">
          {{ t('finance.expenses.myExpenses') }}
        </LayoutMideskPageHeaderButton>
        <LayoutMideskPageHeaderButton to="/finance" back>
          {{ t('nav.finance.dashboard') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <FinanceSubNav />

    <div class="space-y-6">
      <section
        v-if="can('finance:expenses:create')"
        class="midesk-card p-5"
      >
        <h2 class="midesk-card-header">{{ t('finance.expenses.newExpense') }}</h2>
        <FinanceExpenseForm
          :cost-centers="financeStore.costCenters"
          :budgets="financeStore.budgets"
          @submit="onCreate"
        />
      </section>

      <div class="midesk-finance-filters">
        <USelect
          v-model="filters.status"
          :items="statusOptions"
          value-key="value"
          label-key="label"
          class="min-w-40"
          :placeholder="t('finance.expenses.filters.status')"
        />
        <USelect
          v-model="filters.category"
          :items="categoryOptions"
          value-key="value"
          label-key="label"
          class="min-w-40"
          :placeholder="t('finance.expenses.filters.category')"
        />
        <MideskDatePicker v-model="filters.from_date" :placeholder="t('finance.expenses.filters.fromDate')" />
        <MideskDatePicker v-model="filters.to_date" :placeholder="t('finance.expenses.filters.toDate')" />
      </div>

      <FinanceExpenseList
        :expenses="financeStore.expenses"
        :loading="loading"
        show-user
        @submit="onSubmit"
        @approve="onApprove"
        @reject="openReject"
        @pay="onPay"
        @select="onSelect"
      />
    </div>

    <MideskModal v-model:open="showDetail" :title="t('finance.expenses.detail')">
      <FinanceExpenseDetail
        v-if="selectedExpense"
        :expense="selectedExpense"
        @submit="onSubmit(selectedExpense.id)"
        @approve="onApprove(selectedExpense.id)"
        @reject="openReject(selectedExpense.id)"
        @pay="onPay(selectedExpense.id)"
      />
    </MideskModal>

    <MideskModal v-model:open="showReject" :title="t('finance.expenses.rejectTitle')">
      <div class="space-y-4">
        <p class="text-sm text-[var(--color-midesk-muted)]">{{ t('finance.expenses.rejectHint') }}</p>
        <MideskFormField :label="t('finance.expenses.rejectReason')" :model-value="rejectReason">
          <UTextarea v-model="rejectReason" :rows="3" placeholder=" " />
        </MideskFormField>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="showReject = false">{{ t('common.cancel') }}</UButton>
          <UButton color="error" @click="confirmReject">{{ t('leave.reject') }}</UButton>
        </div>
      </div>
    </MideskModal>
  </div>
</template>
