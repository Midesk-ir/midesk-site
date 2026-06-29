<script setup lang="ts">
const { t } = useI18n()
const { formatDate } = useCalendar()
const calendarStore = useCalendarStore()
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-2">
    <section class="midesk-card p-5">
      <h2 class="midesk-card-header">{{ t('calendar.holidays') }}</h2>
      <UiEmptyState
        v-if="!calendarStore.holidays.length"
        :title="t('common.noResults')"
        icon="i-lucide-calendar-off"
      />
      <ul v-else class="divide-y divide-[var(--color-midesk-border)]">
        <li
          v-for="holiday in calendarStore.holidays"
          :key="holiday.id"
          class="flex items-center justify-between py-3 text-sm"
        >
          <span>{{ holiday.name }}</span>
          <span class="text-[var(--color-midesk-muted)]">{{ formatDate(holiday.date) }}</span>
        </li>
      </ul>
    </section>

    <section class="midesk-card p-5">
      <h2 class="midesk-card-header">{{ t('calendar.shifts') }}</h2>
      <UiEmptyState
        v-if="!calendarStore.shifts.length"
        :title="t('common.noResults')"
        icon="i-lucide-clock"
      />
      <ul v-else class="divide-y divide-[var(--color-midesk-border)]">
        <li
          v-for="shift in calendarStore.shifts"
          :key="shift.id"
          class="flex items-center justify-between py-3 text-sm"
        >
          <div>
            <p class="font-medium">{{ shift.name }}</p>
            <p class="text-xs text-[var(--color-midesk-muted)]">
              {{ shift.start_time }} – {{ shift.end_time }}
            </p>
          </div>
          <span class="text-[var(--color-midesk-muted)]">{{ formatDate(shift.date) }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
