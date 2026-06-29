<script setup lang="ts">
import type { WeekSummaryDay } from '~/stores/worklog'

const props = defineProps<{
  weekSummary: WeekSummaryDay[]
  monthMinutes?: number
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()

const todayIso = new Date().toISOString().slice(0, 10)

const todayMinutes = computed(() =>
  props.weekSummary.find(d => d.date === todayIso)?.minutes ?? 0
)

const weekMinutes = computed(() =>
  props.weekSummary.reduce((sum, d) => sum + d.minutes, 0)
)

function formatHours(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}
</script>

<template>
  <div class="midesk-card p-5">
    <h2 class="midesk-card-header">{{ t('worklog.summary.title') }}</h2>

    <div class="mb-5 grid gap-3 sm:grid-cols-3">
      <div class="rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.03] p-4">
        <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('worklog.summary.today') }}</p>
        <p class="mt-1 text-2xl font-bold mb-1">{{ formatHours(todayMinutes) }}</p>
      </div>
      <div class="rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.03] p-4">
        <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('worklog.summary.thisWeek') }}</p>
        <p class="mt-1 text-2xl font-bold mb-1">{{ formatHours(weekMinutes) }}</p>
      </div>
      <div class="rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.03] p-4">
        <p class="text-xs text-[var(--color-midesk-muted)]">{{ t('worklog.summary.total') }}</p>
        <p class="mt-1 text-2xl font-bold mb-1">{{ formatHours(monthMinutes ?? weekMinutes) }}</p>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="day in weekSummary"
        :key="day.date"
        class="rounded-lg border p-2 text-center transition"
        :class="day.date === todayIso
          ? 'border-[var(--color-midesk-accent)] bg-[var(--color-midesk-accent-soft)]'
          : 'border-[var(--color-midesk-border)] bg-white/[0.02]'"
      >
        <p class="text-xs text-[var(--color-midesk-muted)]">{{ formatDate(day.date, 'MM/DD') }}</p>
        <p class="mt-1 text-sm font-semibold">{{ formatHours(day.minutes) }}</p>
      </div>
    </div>
  </div>
</template>
