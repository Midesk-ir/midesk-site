<script setup lang="ts">
import type { CrmOpportunity } from '~/types/phase5'

defineProps<{ opportunity: CrmOpportunity }>()

const { t } = useI18n()
const { formatDate } = useCalendar()

const stageColors = {
  lead: 'neutral',
  qualified: 'info',
  proposal: 'primary',
  negotiation: 'warning',
  won: 'success',
  lost: 'error'
} as const
</script>

<template>
  <div
    class="midesk-glass cursor-grab rounded-lg border border-[var(--color-midesk-border)] p-3 text-sm transition hover:border-[var(--color-midesk-accent)]/40 active:cursor-grabbing"
  >
    <div class="flex items-start justify-between gap-2">
      <p class="font-medium leading-snug">{{ opportunity.title }}</p>
      <UBadge :color="stageColors[opportunity.stage]" size="xs" variant="subtle">
        {{ t(`crm.stages.${opportunity.stage}`) }}
      </UBadge>
    </div>
    <p class="mt-1 truncate text-xs text-[var(--color-midesk-muted)]">
      {{ opportunity.contact.name }}
    </p>
    <p class="mt-2 font-semibold">
      <MideskCurrency :amount="opportunity.value" :currency="opportunity.currency" />
    </p>
    <div class="mt-2 flex items-center justify-between gap-2 text-xs text-[var(--color-midesk-muted)]">
      <span>{{ t('crm.probability') }}: {{ opportunity.probability }}%</span>
      <span v-if="opportunity.expected_close_date">
        {{ formatDate(opportunity.expected_close_date) }}
      </span>
    </div>
    <UProgress :value="opportunity.probability" size="xs" class="mt-2" />
  </div>
</template>
