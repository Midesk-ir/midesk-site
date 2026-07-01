<script setup lang="ts">
import type { Expense, ExpenseCategory } from '~/types/phase3'

defineProps<{
  expense: Expense
}>()

const emit = defineEmits<{
  submit: []
  approve: []
  reject: []
  pay: []
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()
const { can } = usePermissions()
const authStore = useAuthStore()

const categoryLabels: Record<ExpenseCategory, string> = {
  travel: 'finance.expenses.categories.travel',
  office: 'finance.expenses.categories.office',
  software: 'finance.expenses.categories.software',
  meals: 'finance.expenses.categories.meals',
  equipment: 'finance.expenses.categories.equipment',
  other: 'finance.expenses.categories.other'
}

function canSubmit(expense: Expense) {
  return expense.status === 'draft' && expense.user.id === authStore.user?.id
}

function canApprove(expense: Expense) {
  return expense.status === 'manager_review' && can('finance:expenses:approve')
}

function canFinanceApprove(expense: Expense) {
  return expense.status === 'finance_review' && can('finance:expenses:pay')
}

function canPay(expense: Expense) {
  return expense.status === 'ready_to_pay' && can('finance:expenses:pay')
}

function canReject(expense: Expense) {
  if (expense.status === 'manager_review') return can('finance:expenses:approve')
  if (expense.status === 'finance_review') return can('finance:expenses:pay')
  return false
}
</script>

<template>
  <div class="space-y-5">
    <FinanceExpenseApprovalFlow :status="expense.status" />

    <dl class="grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt class="text-[var(--color-midesk-muted)]">{{ t('finance.expenses.columns.user') }}</dt>
        <dd class="mt-0.5 font-medium text-[var(--color-midesk-text)]">{{ expense.user.name }}</dd>
      </div>
      <div>
        <dt class="text-[var(--color-midesk-muted)]">{{ t('finance.expenses.columns.date') }}</dt>
        <dd class="mt-0.5 font-medium text-[var(--color-midesk-text)]">{{ formatDate(expense.expense_date) }}</dd>
      </div>
      <div>
        <dt class="text-[var(--color-midesk-muted)]">{{ t('finance.expenses.columns.category') }}</dt>
        <dd class="mt-0.5 font-medium text-[var(--color-midesk-text)]">{{ t(categoryLabels[expense.category]) }}</dd>
      </div>
      <div>
        <dt class="text-[var(--color-midesk-muted)]">{{ t('finance.expenses.columns.amount') }}</dt>
        <dd class="mt-0.5 text-lg font-bold text-[var(--color-midesk-text)]">
          <MideskCurrency :amount="expense.amount" :currency="expense.currency" />
        </dd>
      </div>
      <div v-if="expense.cost_center">
        <dt class="text-[var(--color-midesk-muted)]">{{ t('finance.expenses.fields.costCenter') }}</dt>
        <dd class="mt-0.5 font-medium text-[var(--color-midesk-text)]">{{ expense.cost_center.name }}</dd>
      </div>
      <div v-if="expense.receipt_path">
        <dt class="text-[var(--color-midesk-muted)]">{{ t('finance.expenses.fields.receipt') }}</dt>
        <dd class="mt-0.5 font-medium text-[var(--color-midesk-text)]">{{ expense.receipt_path }}</dd>
      </div>
      <div class="sm:col-span-2">
        <dt class="text-[var(--color-midesk-muted)]">{{ t('finance.expenses.fields.description') }}</dt>
        <dd class="mt-0.5 text-[var(--color-midesk-text)]">{{ expense.description }}</dd>
      </div>
    </dl>

    <p v-if="expense.rejection_reason" class="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
      {{ expense.rejection_reason }}
    </p>

    <div class="flex flex-wrap justify-end gap-2 border-t border-[var(--color-midesk-border)] pt-4">
      <UButton v-if="canSubmit(expense)" color="primary" size="sm" @click="emit('submit')">
        {{ t('finance.expenses.actions.submit') }}
      </UButton>
      <UButton v-if="canApprove(expense)" color="success" size="sm" icon="i-lucide-check" @click="emit('approve')">
        {{ t('leave.approve') }}
      </UButton>
      <UButton v-if="canFinanceApprove(expense)" color="success" size="sm" icon="i-lucide-check-check" @click="emit('approve')">
        {{ t('finance.expenses.actions.financeApprove') }}
      </UButton>
      <UButton v-if="canPay(expense)" color="primary" size="sm" icon="i-lucide-banknote" @click="emit('pay')">
        {{ t('finance.expenses.actions.pay') }}
      </UButton>
      <UButton v-if="canReject(expense)" color="error" variant="soft" size="sm" icon="i-lucide-x" @click="emit('reject')">
        {{ t('leave.reject') }}
      </UButton>
    </div>
  </div>
</template>
