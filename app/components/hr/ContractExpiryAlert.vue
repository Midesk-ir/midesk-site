<script setup lang="ts">
import type { Contract } from '~/types/phase2'

const props = defineProps<{
  contracts: Contract[]
  alertDays?: number
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()

const thresholdDays = computed(() => props.alertDays ?? 30)

function daysUntilEnd(endDate?: string) {
  if (!endDate) return Infinity
  const end = new Date(endDate)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

const expiring = computed(() =>
  props.contracts.filter(c =>
    c.status === 'active'
    && c.end_date
    && daysUntilEnd(c.end_date) <= thresholdDays.value
    && daysUntilEnd(c.end_date) >= 0
  )
)
</script>

<template>
  <div
    v-if="expiring.length"
    class="midesk-glass rounded-xl border border-red-500/30 bg-red-500/5 p-4"
  >
    <div class="mb-3 flex items-center gap-2">
      <UIcon name="i-lucide-triangle-alert" class="size-5 text-red-400" />
      <h3 class="font-semibold text-red-300">{{ t('hr.contracts.expiryAlert.title') }}</h3>
      <UBadge color="error" variant="solid" size="xs">{{ expiring.length }}</UBadge>
    </div>

    <ul class="space-y-2">
      <li
        v-for="contract in expiring"
        :key="contract.id"
        class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm"
      >
        <div class="flex items-center gap-2">
          <UAvatar :alt="contract.user.name" size="2xs" icon="i-lucide-user" />
          <span>{{ contract.user.name }}</span>
          <UBadge color="error" variant="subtle" size="xs">
            {{ t('hr.contracts.expiryAlert.daysLeft', { days: daysUntilEnd(contract.end_date) }) }}
          </UBadge>
        </div>
        <span class="text-[var(--color-midesk-muted)]">
          {{ t('hr.contracts.fields.endDate') }}: {{ formatDate(contract.end_date) }}
        </span>
      </li>
    </ul>
  </div>
</template>
