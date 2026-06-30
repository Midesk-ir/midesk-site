<script setup lang="ts">
import type { AttendanceReportRow } from '~/types/phase2'

const props = defineProps<{
  reportRow?: AttendanceReportRow | null
  historyStats?: {
    present: number
    late: number
    absent: number
    overtime_minutes: number
  } | null
}>()

const { t } = useI18n()

const summary = computed(() => {
  if (props.reportRow) return props.reportRow.summary
  return props.historyStats ?? { present: 0, late: 0, absent: 0, overtime_minutes: 0 }
})

const memberName = computed(() => props.reportRow?.user.name)

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

const cards = computed(() => [
  { key: 'present', label: t('hr.attendance.summary.present'), value: summary.value.present, color: 'text-green-400' },
  { key: 'late', label: t('hr.attendance.summary.late'), value: summary.value.late, color: 'text-amber-400' },
  { key: 'absent', label: t('hr.attendance.summary.absent'), value: summary.value.absent, color: 'text-red-400' },
  { key: 'overtime', label: t('hr.attendance.summary.overtime'), value: formatMinutes(summary.value.overtime_minutes), color: 'text-[var(--color-midesk-accent)]' }
])
</script>

<template>
  <div class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5">
    <h2 class="midesk-card-header">
      {{ t('hr.attendance.summary.title') }}
      <span v-if="memberName" class="font-normal text-[var(--color-midesk-muted)]"> — {{ memberName }}</span>
    </h2>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="card in cards"
        :key="card.key"
        class="rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.03] p-4"
      >
        <p class="text-xs text-[var(--color-midesk-muted)]">{{ card.label }}</p>
        <p class="mt-1 text-2xl font-bold" :class="card.color">{{ card.value }}</p>
      </div>
    </div>
  </div>
</template>
