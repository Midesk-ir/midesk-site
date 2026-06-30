<script setup lang="ts">
import type { AttendanceRecord, AttendanceStatus } from '~/types/phase2'

defineProps<{
  records: AttendanceRecord[]
  loading?: boolean
  showMember?: boolean
}>()

const { t } = useI18n()
const { formatDate, formatDateTime } = useCalendar()

const statusColor: Record<AttendanceStatus, 'success' | 'warning' | 'error' | 'info' | 'neutral'> = {
  present: 'success',
  late: 'warning',
  absent: 'error',
  half_day: 'warning',
  on_leave: 'info',
  mission: 'info',
  holiday: 'neutral'
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}
</script>

<template>
  <div class="overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 4" :key="i" class="h-10" />
    </div>

    <UiEmptyState
      v-else-if="!records.length"
      :title="t('hr.attendance.emptyTitle')"
      :description="t('hr.attendance.emptyDesc')"
      icon="i-lucide-clock"
    />

    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[44rem] text-sm">
        <thead>
          <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
            <th v-if="showMember" class="px-4 py-3 text-start font-medium">{{ t('hr.attendance.columns.member') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.attendance.columns.date') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.attendance.columns.checkIn') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.attendance.columns.checkOut') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.attendance.columns.effective') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.attendance.columns.overtime') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.attendance.columns.status') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--color-midesk-border)]">
          <tr
            v-for="record in records"
            :key="record.id"
            class="transition hover:bg-white/[0.02]"
          >
            <td v-if="showMember" class="px-4 py-3">
              <div v-if="record.user" class="flex items-center gap-2">
                <UAvatar :alt="record.user.name" size="xs" icon="i-lucide-user" />
                <span>{{ record.user.name }}</span>
              </div>
              <span v-else>—</span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(record.date) }}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ formatDateTime(record.check_in_at) }}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ formatDateTime(record.check_out_at) }}</td>
            <td class="px-4 py-3">{{ formatMinutes(record.effective_minutes) }}</td>
            <td class="px-4 py-3">{{ formatMinutes(record.overtime_minutes) }}</td>
            <td class="px-4 py-3">
              <UBadge :color="statusColor[record.status]" variant="subtle" size="xs">
                {{ t(`hr.attendance.status.${record.status}`) }}
              </UBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
