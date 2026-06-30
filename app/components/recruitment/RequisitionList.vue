<script setup lang="ts">
import type { Requisition, RequisitionPriority, RequisitionStatus } from '~/types/phase2'

defineProps<{
  requisitions: Requisition[]
  loading?: boolean
}>()

const { t } = useI18n()
const { formatRelative } = useCalendar()

const priorityColor: Record<RequisitionPriority, 'neutral' | 'info' | 'warning' | 'error'> = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  urgent: 'error'
}

const statusColor: Record<RequisitionStatus, 'success' | 'neutral' | 'error'> = {
  open: 'success',
  filled: 'neutral',
  cancelled: 'error'
}
</script>

<template>
  <div class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 4" :key="i" class="h-10" />
    </div>

    <UiEmptyState
      v-else-if="!requisitions.length"
      :title="t('recruitment.requisitions.emptyTitle')"
      :description="t('recruitment.requisitions.emptyDesc')"
      icon="i-lucide-briefcase"
    />

    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[40rem] text-sm">
        <thead>
          <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
            <th class="px-4 py-3 text-start font-medium">{{ t('recruitment.requisitions.columns.title') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('recruitment.requisitions.columns.department') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('recruitment.requisitions.columns.positions') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('recruitment.requisitions.columns.priority') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('recruitment.requisitions.columns.candidates') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('recruitment.requisitions.columns.status') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('recruitment.requisitions.columns.created') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--color-midesk-border)]">
          <tr
            v-for="req in requisitions"
            :key="req.id"
            class="cursor-pointer transition hover:bg-white/[0.02]"
          >
            <td class="px-4 py-3">
              <NuxtLink
                :to="`/hr/recruitment/${req.id}`"
                class="font-medium text-[var(--color-midesk-accent)] hover:underline"
              >
                {{ req.title }}
              </NuxtLink>
            </td>
            <td class="px-4 py-3">{{ req.department ?? '—' }}</td>
            <td class="px-4 py-3">{{ req.positions_count }}</td>
            <td class="px-4 py-3">
              <UBadge :color="priorityColor[req.priority]" variant="subtle" size="xs">
                {{ t(`recruitment.priority.${req.priority}`) }}
              </UBadge>
            </td>
            <td class="px-4 py-3">{{ req.candidates_count }}</td>
            <td class="px-4 py-3">
              <UBadge :color="statusColor[req.status]" variant="subtle" size="xs">
                {{ t(`recruitment.requisitions.status.${req.status}`) }}
              </UBadge>
            </td>
            <td class="px-4 py-3 text-[var(--color-midesk-muted)]">{{ formatRelative(req.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
