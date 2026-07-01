<script setup lang="ts">
import type { ExpenseStatus } from '~/types/phase3'

const props = defineProps<{
  status: ExpenseStatus
}>()

const { t } = useI18n()

const steps = computed(() => [
  { key: 'draft', label: t('finance.expenses.flow.draft') },
  { key: 'submitted', label: t('finance.expenses.flow.submitted') },
  { key: 'manager_review', label: t('finance.expenses.flow.manager') },
  { key: 'finance_review', label: t('finance.expenses.flow.finance') },
  { key: 'ready_to_pay', label: t('finance.expenses.flow.approved') },
  { key: 'paid', label: t('finance.expenses.flow.paid') }
] as const)

const flowOrder: ExpenseStatus[] = [
  'draft',
  'submitted',
  'manager_review',
  'finance_review',
  'approved',
  'ready_to_pay',
  'paid'
]

const currentIndex = computed(() => {
  if (props.status === 'rejected') return -1
  const idx = flowOrder.indexOf(props.status)
  if (props.status === 'approved') return flowOrder.indexOf('ready_to_pay')
  return idx
})

function stepState(index: number): 'done' | 'current' | 'upcoming' | 'rejected' {
  if (props.status === 'rejected') return 'rejected'
  if (index < currentIndex.value) return 'done'
  if (index === currentIndex.value) return 'current'
  return 'upcoming'
}
</script>

<template>
  <div class="expense-approval-flow rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.02] p-4">
    <div v-if="status === 'rejected'" class="mb-3 flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
      <UIcon name="i-lucide-x-circle" class="size-4 shrink-0" />
      {{ t('finance.expenses.flow.rejected') }}
    </div>

    <ol class="flex flex-wrap items-start gap-2 sm:gap-0">
      <li
        v-for="(step, index) in steps"
        :key="step.key"
        class="relative flex min-w-[4.5rem] flex-1 flex-col items-center sm:min-w-0"
      >
        <div
          v-if="index < steps.length - 1"
          class="expense-approval-flow__line hidden sm:block"
          :class="stepState(index) === 'done' ? 'expense-approval-flow__line--done' : ''"
          aria-hidden="true"
        />

        <div
          class="expense-approval-flow__node"
          :class="[
            stepState(index) === 'done' ? 'expense-approval-flow__node--done' : '',
            stepState(index) === 'current' ? 'expense-approval-flow__node--current' : '',
            stepState(index) === 'rejected' ? 'expense-approval-flow__node--rejected' : ''
          ]"
        >
          <UIcon
            v-if="stepState(index) === 'done'"
            name="i-lucide-check"
            class="size-3.5"
          />
          <span v-else class="text-xs font-semibold">{{ index + 1 }}</span>
        </div>

        <span
          class="mt-2 max-w-[5rem] text-center text-[11px] leading-tight sm:text-xs"
          :class="stepState(index) === 'current'
            ? 'font-semibold text-[var(--color-midesk-text)]'
            : stepState(index) === 'done'
              ? 'text-[var(--color-midesk-accent)]'
              : 'text-[var(--color-midesk-muted)]'"
        >
          {{ step.label }}
        </span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.expense-approval-flow__line {
  position: absolute;
  top: 0.875rem;
  inset-inline-start: 50%;
  width: 100%;
  height: 2px;
  background: var(--color-midesk-border);
}

.expense-approval-flow__line--done {
  background: var(--color-midesk-accent);
}

.expense-approval-flow__node {
  position: relative;
  z-index: 1;
  display: flex;
  width: 1.75rem;
  height: 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  border: 2px solid var(--color-midesk-border);
  background: var(--color-midesk-card);
  color: var(--color-midesk-muted);
}

.expense-approval-flow__node--done {
  border-color: var(--color-midesk-accent);
  background: var(--color-midesk-accent);
  color: white;
}

.expense-approval-flow__node--current {
  border-color: var(--color-midesk-accent);
  background: var(--color-midesk-accent-soft);
  color: var(--color-midesk-accent);
  box-shadow: 0 0 0 4px rgba(255, 92, 0, 0.12);
}

.expense-approval-flow__node--rejected {
  border-color: rgba(239, 68, 68, 0.4);
  color: rgba(239, 68, 68, 0.6);
  opacity: 0.65;
}
</style>
