<script setup lang="ts">
import type { LeaveRequest } from '~/types/phase1'

defineProps<{
  requests: LeaveRequest[]
  loading?: boolean
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()

const statusColor: Record<LeaveRequest['status'], 'warning' | 'success' | 'error' | 'neutral'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  cancelled: 'neutral'
}
</script>

<template>
  <div class="midesk-card overflow-hidden">
    <div class="border-b border-[var(--color-midesk-border)] px-5 py-4">
      <h2 class="midesk-card-header mb-0">{{ t('leave.request.title') }}</h2>
    </div>

    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="midesk-skeleton-row" />
    </div>

    <UiEmptyState
      v-else-if="!requests.length"
      :title="t('leave.request.emptyTitle')"
      :description="t('leave.request.emptyDesc')"
      icon="i-lucide-plane"
    />

    <ul v-else class="divide-y divide-[var(--color-midesk-border)]">
      <li
        v-for="req in requests"
        :key="req.id"
        class="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
      >
        <div class="min-w-0">
          <p class="font-medium">{{ req.leave_type.name }}</p>
          <p class="text-sm text-[var(--color-midesk-muted)]">
            {{ formatDate(req.start_date) }} – {{ formatDate(req.end_date) }}
            · {{ req.duration_days }} {{ t('leave.balance.days') }}
          </p>
          <p v-if="req.note" class="mt-1 truncate text-sm text-[var(--color-midesk-muted)]">
            {{ req.note }}
          </p>
          <p v-if="req.reject_reason" class="mt-1 text-sm text-red-400">
            {{ req.reject_reason }}
          </p>
        </div>
        <UBadge :color="statusColor[req.status]" variant="subtle">
          {{ t(`leave.status.${req.status}`) }}
        </UBadge>
      </li>
    </ul>
  </div>
</template>
