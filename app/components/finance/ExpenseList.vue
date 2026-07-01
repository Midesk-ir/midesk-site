<script setup lang="ts">
import type { Expense, ExpenseCategory, ExpenseStatus } from '~/types/phase3'

defineProps<{
  expenses: Expense[]
  loading?: boolean
  showUser?: boolean
}>()

const emit = defineEmits<{
  submit: [id: string]
  approve: [id: string]
  reject: [id: string]
  pay: [id: string]
  select: [expense: Expense]
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()
const { can } = usePermissions()
const authStore = useAuthStore()

const statusColor: Record<ExpenseStatus, 'neutral' | 'warning' | 'success' | 'error' | 'info' | 'primary'> = {
  draft: 'neutral',
  submitted: 'info',
  manager_review: 'warning',
  finance_review: 'warning',
  approved: 'success',
  ready_to_pay: 'primary',
  paid: 'success',
  rejected: 'error'
}

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
  <section class="midesk-card overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="h-14" />
    </div>

    <UiEmptyState
      v-else-if="!expenses.length"
      :title="t('finance.expenses.emptyTitle')"
      :description="t('finance.expenses.emptyDesc')"
      icon="i-lucide-receipt"
    />

    <div v-else class="overflow-x-auto">
      <table class="midesk-table w-full min-w-[640px]">
        <thead>
          <tr>
            <th>{{ t('finance.expenses.columns.date') }}</th>
            <th v-if="showUser">{{ t('finance.expenses.columns.user') }}</th>
            <th>{{ t('finance.expenses.columns.category') }}</th>
            <th>{{ t('finance.expenses.columns.amount') }}</th>
            <th>{{ t('finance.expenses.columns.status') }}</th>
            <th class="text-end">{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="expense in expenses"
            :key="expense.id"
            class="cursor-pointer hover:bg-[var(--color-midesk-surface-hover)]"
            @click="emit('select', expense)"
          >
            <td class="whitespace-nowrap text-[var(--color-midesk-text)]">{{ formatDate(expense.expense_date) }}</td>
            <td v-if="showUser" class="text-[var(--color-midesk-text)]">{{ expense.user.name }}</td>
            <td class="text-[var(--color-midesk-muted)]">{{ t(categoryLabels[expense.category]) }}</td>
            <td class="font-semibold text-[var(--color-midesk-text)]">
              <MideskCurrency :amount="expense.amount" :currency="expense.currency" />
            </td>
            <td>
              <UBadge :color="statusColor[expense.status]" variant="subtle" size="sm">
                {{ t(`finance.expenses.status.${expense.status}`) }}
              </UBadge>
            </td>
            <td class="text-end" @click.stop>
              <div class="flex flex-wrap justify-end gap-1">
                <UButton
                  v-if="canSubmit(expense)"
                  size="xs"
                  color="primary"
                  variant="soft"
                  @click="emit('submit', expense.id)"
                >
                  {{ t('finance.expenses.actions.submit') }}
                </UButton>
                <UButton
                  v-if="canApprove(expense)"
                  size="xs"
                  color="success"
                  variant="soft"
                  icon="i-lucide-check"
                  @click="emit('approve', expense.id)"
                />
                <UButton
                  v-if="canFinanceApprove(expense)"
                  size="xs"
                  color="success"
                  variant="soft"
                  icon="i-lucide-check-check"
                  @click="emit('approve', expense.id)"
                />
                <UButton
                  v-if="canPay(expense)"
                  size="xs"
                  color="primary"
                  variant="soft"
                  icon="i-lucide-banknote"
                  @click="emit('pay', expense.id)"
                />
                <UButton
                  v-if="canReject(expense)"
                  size="xs"
                  color="error"
                  variant="soft"
                  icon="i-lucide-x"
                  @click="emit('reject', expense.id)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
