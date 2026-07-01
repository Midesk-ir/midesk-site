<script setup lang="ts">
import type { Budget, CostCenter } from '~/types/phase3'

defineProps<{
  nodes: CostCenter[]
  budgets?: Budget[]
}>()

const { t } = useI18n()
</script>

<template>
  <section class="midesk-card p-5">
    <div class="mb-4 flex items-center justify-between gap-3">
      <h2 class="midesk-card-header mb-0">{{ t('finance.budgets.costCenters') }}</h2>
      <UIcon name="i-lucide-folder-tree" class="size-5 text-[var(--color-midesk-accent)]" />
    </div>

    <UiEmptyState
      v-if="!nodes.length"
      :title="t('finance.budgets.noCostCenters')"
      icon="i-lucide-folder-tree"
      class="py-8"
    />

    <ul v-else class="space-y-1">
      <FinanceCostCenterTreeItem
        v-for="node in nodes"
        :key="node.id"
        :node="node"
        :budgets="budgets"
        :depth="0"
      />
    </ul>
  </section>
</template>
