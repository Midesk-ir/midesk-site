<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const authStore = useAuthStore()
const leaveStore = useLeaveStore()
const calendarStore = useCalendarStore()

const showEventForm = ref(false)
const selectedDate = ref<string>('')

async function load() {
  await leaveStore.fetchAll()
}

function onDayClick(date: string) {
  selectedDate.value = date
  showEventForm.value = true
}

async function onEventSaved() {
  const now = new Date()
  await calendarStore.fetchMonth(now.getFullYear(), now.getMonth() + 1)
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader :title="t('calendar.title')" />

    <div class="space-y-6">
      <CalendarView
        :leave-requests="leaveStore.myRequests"
        @day-click="onDayClick"
      />

      <HolidayShiftManager v-if="authStore.isAdmin" />

      <EventForm
        v-model:open="showEventForm"
        :initial-date="selectedDate"
        @saved="onEventSaved"
      />
    </div>
  </div>
</template>
