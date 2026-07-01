<script setup lang="ts">
import type { FinanceDashboardSummary } from '~/types/phase3'

const props = defineProps<{
  summary: FinanceDashboardSummary | null
  loading?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  retry: []
}>()

const { t } = useI18n()
const { formatCurrency } = useCalendar()
const { can, canAny } = usePermissions()

const statCards = computed(() => {
  const s = props.summary
  if (!s) return []

  return [
    {
      key: 'pending',
      label: t('finance.dashboard.pendingExpenses'),
      value: s.expense_summary.pending_count,
      hint: formatCurrency(s.expense_summary.pending_amount, s.currency),
      icon: 'i-lucide-receipt',
      to: '/finance/expenses',
      linkLabel: t('nav.finance.expenses')
    },
    {
      key: 'invoices',
      label: t('finance.dashboard.overdueInvoices'),
      value: s.overdue_invoices_count,
      hint: formatCurrency(s.overdue_invoices_amount, s.currency),
      icon: 'i-lucide-file-warning',
      iconClass: 'text-amber-400',
      to: '/finance/invoices?status=overdue',
      linkLabel: t('nav.finance.invoices')
    },
    {
      key: 'payroll',
      label: t('finance.dashboard.payrollStatus'),
      value: t(`finance.dashboard.payroll.${s.payroll_status}`),
      hint: null,
      icon: 'i-lucide-banknote',
      valueClass: 'text-xl sm:text-2xl',
      to: '/finance/payroll',
      linkLabel: t('nav.finance.payroll')
    },
    {
      key: 'centers',
      label: t('finance.dashboard.budgetCenters'),
      value: s.budget_overview.length,
      hint: null,
      icon: 'i-lucide-pie-chart',
      to: '/finance/budgets',
      linkLabel: t('nav.finance.budgets')
    }
  ]
})

const quickLinks = computed(() => [
  { label: t('nav.finance.expenses'), to: '/finance/expenses', icon: 'i-lucide-receipt', show: canAny(['finance:expenses:view', 'finance:expenses:create', 'finance:expenses:approve', 'finance:expenses:pay']) },
  { label: t('nav.finance.budgets'), to: '/finance/budgets', icon: 'i-lucide-pie-chart', show: can('finance:budgets:view') },
  { label: t('nav.finance.invoices'), to: '/finance/invoices', icon: 'i-lucide-file-text', show: can('finance:invoices:view') },
  { label: t('nav.finance.purchaseRequests'), to: '/finance/purchase-requests', icon: 'i-lucide-shopping-cart', show: canAny(['finance:expenses:create', 'finance:expenses:view']) },
  { label: t('nav.finance.payroll'), to: '/finance/payroll', icon: 'i-lucide-banknote', show: can('finance:payroll:view') },
  { label: t('nav.finance.myFinance'), to: '/my-finance', icon: 'i-lucide-wallet', show: can('finance:my:view') }
].filter(item => item.show))
</script>

<template>
  <div v-if="loading" class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <USkeleton v-for="i in 4" :key="i" class="midesk-skeleton-stat" />
    </div>
    <USkeleton class="midesk-skeleton-card-lg h-72 w-full" />
  </div>

  <div v-else-if="summary" class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div
        v-for="card in statCards"
        :key="card.key"
        class="midesk-stat-card"
      >
        <div class="mb-3 flex items-center justify-between gap-2">
          <span class="text-sm text-[var(--color-midesk-muted)]">{{ card.label }}</span>
          <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-midesk-accent-soft)]">
            <UIcon :name="card.icon" class="size-4" :class="card.iconClass ?? 'text-[var(--color-midesk-accent)]'" />
          </div>
        </div>
        <p
          class="font-bold tracking-tight text-[var(--color-midesk-text)]"
          :class="card.valueClass ?? 'text-3xl'"
        >
          {{ card.value }}
        </p>
        <p v-if="card.hint" class="mt-1 text-sm text-[var(--color-midesk-muted)]">{{ card.hint }}</p>
        <NuxtLink v-if="card.to" :to="card.to" class="midesk-link mt-2 inline-block text-sm">
          {{ card.linkLabel }}
        </NuxtLink>
      </div>
    </div>

    <FinanceBudgetOverview :items="summary.budget_overview" />

    <section v-if="quickLinks.length" class="midesk-card p-5">
      <h2 class="midesk-card-header">{{ t('finance.dashboard.quickLinks') }}</h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="flex w-full items-center gap-3 rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.02] px-4 py-3 text-sm font-medium text-[var(--color-midesk-text)] transition hover:border-[var(--color-midesk-accent)] hover:bg-white/[0.04]"
        >
          <UIcon :name="link.icon" class="size-5 shrink-0 text-[var(--color-midesk-accent)]" />
          {{ link.label }}
        </NuxtLink>
      </div>
    </section>
  </div>

  <UiEmptyState
    v-else-if="error"
    :title="t('common.error')"
    icon="i-lucide-circle-alert"
  >
    <template #action>
      <UButton color="primary" @click="emit('retry')">{{ t('common.retry') }}</UButton>
    </template>
  </UiEmptyState>

  <UiEmptyState
    v-else
    :title="t('finance.dashboard.emptyTitle')"
    :description="t('finance.dashboard.emptyDesc')"
    icon="i-lucide-wallet"
  />
</template>
