<script setup lang="ts">
import type { Budget, CostCenter } from '~/types/phase3'

defineProps<{
  node: CostCenter
  budgets?: Budget[]
  depth: number
}>()

const { formatNumber } = useLocaleDigits()
const { t } = useI18n()

function budgetForCenter(budgets: Budget[] | undefined, centerId: string) {
  return budgets?.find(b => b.cost_center.id === centerId)
}
</script>

<template>
  <li>
    <div
      class="flex flex-wrap items-center justify-between gap-2 rounded-lg px-3 py-2 hover:bg-[var(--color-midesk-surface-hover)]"
      :style="{ paddingInlineStart: `${depth * 1.25 + 0.75}rem` }"
    >
      <div class="flex min-w-0 items-center gap-2">
        <UIcon name="i-lucide-folder" class="size-4 shrink-0 text-[var(--color-midesk-accent)]" />
        <div class="min-w-0">
          <p class="truncate font-medium text-[var(--color-midesk-text)]">{{ node.name }}</p>
          <p class="text-xs text-[var(--color-midesk-muted)]">{{ node.code }}</p>
        </div>
      </div>

      <div v-if="budgetForCenter(budgets, node.id)" class="text-end text-sm">
        <p class="font-semibold tabular-nums text-[var(--color-midesk-text)]">
          <MideskCurrency :amount="budgetForCenter(budgets, node.id)!.amount" />
        </p>
        <p class="text-xs text-[var(--color-midesk-muted)]">
          {{ formatNumber(budgetForCenter(budgets, node.id)!.utilization_percent) }}% {{ t('finance.budgets.utilized') }}
        </p>
      </div>
    </div>

    <ul v-if="node.children?.length" class="space-y-1">
      <FinanceCostCenterTreeItem
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :budgets="budgets"
        :depth="depth + 1"
      />
    </ul>
  </li>
</template>
