<script setup lang="ts">
import type { LeaveRequest } from '~/types/phase1'

const props = defineProps<{
  leaveRequests?: LeaveRequest[]
}>()

const emit = defineEmits<{
  dayClick: [date: string]
}>()

const { t } = useI18n()
const { formatDate, calendarType } = useCalendar()
const calendarStore = useCalendarStore()

const viewDate = ref(new Date())

const year = computed(() => viewDate.value.getFullYear())
const month = computed(() => viewDate.value.getMonth() + 1)

const monthLabel = computed(() => formatDate(viewDate.value, 'YYYY/MM'))

const weekdayLabels = computed(() => {
  const base = calendarType.value === 'jalali'
    ? ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
    : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  return base
})

interface CalendarCell {
  date: string
  dayLabel: string
  isCurrentMonth: boolean
  isToday: boolean
  isHoliday: boolean
  isLeave: boolean
  shifts: typeof calendarStore.shifts
  events: typeof calendarStore.events
}

const todayIso = new Date().toISOString().slice(0, 10)

function dateInRange(date: string, start: string, end: string) {
  const d = date.slice(0, 10)
  return d >= start.slice(0, 10) && d <= end.slice(0, 10)
}

const cells = computed((): CalendarCell[] => {
  const first = new Date(year.value, month.value - 1, 1)
  const startPad = first.getDay()
  const daysInMonth = new Date(year.value, month.value, 0).getDate()
  const total = Math.ceil((startPad + daysInMonth) / 7) * 7

  return Array.from({ length: total }, (_, i) => {
    const dayOffset = i - startPad
    const d = new Date(year.value, month.value - 1, 1 + dayOffset)
    const date = d.toISOString().slice(0, 10)
    const isCurrentMonth = d.getMonth() === month.value - 1

    return {
      date,
      dayLabel: formatDate(date, 'D'),
      isCurrentMonth,
      isToday: date === todayIso,
      isHoliday: calendarStore.holidays.some(h => h.date === date),
      isLeave: (props.leaveRequests ?? []).some(
        r => r.status === 'approved' && dateInRange(date, r.start_date, r.end_date)
      ),
      shifts: calendarStore.shifts.filter(s => s.date === date),
      events: calendarStore.events.filter(e => dateInRange(date, e.start_date, e.end_date))
    }
  })
})

async function loadMonth() {
  await calendarStore.fetchMonth(year.value, month.value)
}

function prevMonth() {
  viewDate.value = new Date(year.value, month.value - 2, 1)
}

function nextMonth() {
  viewDate.value = new Date(year.value, month.value, 1)
}

function goToday() {
  viewDate.value = new Date()
}

watch([year, month], loadMonth, { immediate: true })
</script>

<template>
  <div class="midesk-card overflow-hidden p-3 sm:p-5">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h2 class="midesk-card-header mb-0">{{ monthLabel }}</h2>
      <div class="flex items-center gap-2">
        <UButton size="sm" variant="ghost" icon="i-lucide-chevron-left" @click="prevMonth" />
        <UButton size="sm" variant="soft" @click="goToday">{{ t('calendar.today') }}</UButton>
        <UButton size="sm" variant="ghost" icon="i-lucide-chevron-right" @click="nextMonth" />
      </div>
    </div>

    <div v-if="calendarStore.loading" class="grid grid-cols-7 gap-1">
      <USkeleton v-for="i in 35" :key="i" class="aspect-square rounded-lg" />
    </div>

    <div v-else>
      <div class="mb-1 grid grid-cols-7 gap-1">
        <div
          v-for="label in weekdayLabels"
          :key="label"
          class="py-2 text-center text-xs font-medium text-[var(--color-midesk-muted)]"
        >
          {{ label }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="cell in cells"
          :key="cell.date"
          type="button"
          class="group relative flex min-h-16 flex-col rounded-lg border p-1 text-start transition hover:border-[var(--color-midesk-accent)]/50 sm:min-h-20 sm:p-1.5 lg:min-h-24"
          :class="[
            cell.isCurrentMonth ? '' : 'opacity-40',
            cell.isHoliday ? 'bg-white/10' : '',
            cell.isLeave ? 'bg-blue-500/15' : '',
            cell.isToday ? 'border-[var(--color-midesk-accent)] ring-1 ring-[var(--color-midesk-accent)]/30' : 'border-[var(--color-midesk-border)]'
          ]"
          @click="emit('dayClick', cell.date)"
        >
          <div
            v-for="shift in cell.shifts"
            :key="shift.id"
            class="mb-1 truncate rounded px-1.5 py-0.5 text-xs font-medium text-white"
            style="background: var(--color-midesk-accent)"
            :title="`${shift.name} ${shift.start_time}–${shift.end_time}`"
          >
            {{ shift.name }}
          </div>

          <span
            class="text-sm font-semibold"
            :class="cell.isToday ? 'text-[var(--color-midesk-accent)]' : ''"
          >
            {{ cell.dayLabel }}
          </span>

          <ul class="mt-1 flex-1 space-y-0.5 overflow-hidden">
            <li
              v-for="event in cell.events.slice(0, 2)"
              :key="event.id"
              class="truncate rounded px-1.5 py-0.5 text-xs"
              :style="{ backgroundColor: `${event.color ?? 'var(--color-midesk-accent)'}33` }"
            >
              {{ event.title }}
            </li>
            <li
              v-if="cell.events.length > 2"
              class="text-xs text-[var(--color-midesk-muted)]"
            >
              +{{ cell.events.length - 2 }}
            </li>
          </ul>
        </button>
      </div>

      <div class="mt-4 flex flex-wrap gap-4 text-xs text-[var(--color-midesk-muted)]">
        <span class="flex items-center gap-1.5">
          <span class="size-3 rounded bg-white/10" /> {{ t('calendar.holidays') }}
        </span>
        <span class="flex items-center gap-1.5">
          <span class="size-3 rounded bg-blue-500/15 ring-1 ring-blue-500/30" /> {{ t('leave.title') }}
        </span>
        <span class="flex items-center gap-1.5">
          <span class="size-3 rounded bg-[var(--color-midesk-accent)]" /> {{ t('calendar.shifts') }}
        </span>
      </div>
    </div>
  </div>
</template>
