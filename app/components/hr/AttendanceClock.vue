<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'

const attendanceStore = useAttendanceStore()
const { t } = useI18n()
const { formatDateTime } = useCalendar()
const toast = useToast()

const acting = ref(false)
const now = ref(Date.now())

if (import.meta.client) {
  useIntervalFn(() => {
    now.value = Date.now()
  }, 30_000)
}

const durationLabel = computed(() => {
  const checkIn = attendanceStore.todayRecord?.check_in_at
  if (!checkIn || attendanceStore.clockStatus === 'not_started') return null

  const start = new Date(checkIn).getTime()
  const end = attendanceStore.todayRecord?.check_out_at
    ? new Date(attendanceStore.todayRecord.check_out_at).getTime()
    : now.value
  const minutes = Math.max(0, Math.floor((end - start) / 60_000))
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours && mins) return `${hours}h ${mins}m`
  if (hours) return `${hours}h`
  return `${mins}m`
})

async function runAction(action: () => Promise<void>) {
  acting.value = true
  try {
    await action()
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    acting.value = false
  }
}

const statusLabel = computed(() => {
  const status = attendanceStore.clockStatus
  return t(`hr.attendance.clockStatus.${status}`)
})

const statusIcon = computed(() => {
  switch (attendanceStore.clockStatus) {
    case 'checked_in': return 'i-lucide-log-in'
    case 'on_break': return 'i-lucide-coffee'
    case 'checked_out': return 'i-lucide-log-out'
    default: return 'i-lucide-clock'
  }
})
</script>

<template>
  <div class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-6 text-center">
    <div class="mb-6">
      <UIcon :name="statusIcon" class="mx-auto mb-3 size-12 text-[var(--color-midesk-accent)]" />
      <p class="text-sm text-[var(--color-midesk-muted)]">{{ t('hr.attendance.clock.title') }}</p>
      <p class="mt-1 text-xl font-semibold">{{ statusLabel }}</p>
      <p v-if="durationLabel && attendanceStore.clockStatus !== 'not_started'" class="mt-2 text-sm font-medium text-[var(--color-midesk-accent)]">
        {{ t('hr.attendance.clock.duration') }}: {{ durationLabel }}
      </p>
      <p v-if="attendanceStore.todayRecord?.check_in_at" class="mt-2 text-sm text-[var(--color-midesk-muted)]">
        {{ t('hr.attendance.clock.checkInAt') }}: {{ formatDateTime(attendanceStore.todayRecord.check_in_at) }}
      </p>
      <p v-if="attendanceStore.todayRecord?.check_out_at" class="text-sm text-[var(--color-midesk-muted)]">
        {{ t('hr.attendance.clock.checkOutAt') }}: {{ formatDateTime(attendanceStore.todayRecord.check_out_at) }}
      </p>
    </div>

    <div class="flex flex-wrap justify-center gap-3">
      <UButton
        v-if="attendanceStore.clockStatus === 'not_started'"
        size="xl"
        color="primary"
        icon="i-lucide-log-in"
        class="min-w-40"
        :loading="acting"
        @click="runAction(() => attendanceStore.checkIn())"
      >
        {{ t('hr.attendance.clock.checkIn') }}
      </UButton>

      <template v-if="attendanceStore.clockStatus === 'checked_in'">
        <UButton
          size="xl"
          color="warning"
          variant="soft"
          icon="i-lucide-coffee"
          class="min-w-36"
          :loading="acting"
          @click="runAction(() => attendanceStore.startBreak())"
        >
          {{ t('hr.attendance.clock.startBreak') }}
        </UButton>
        <UButton
          size="xl"
          color="error"
          variant="soft"
          icon="i-lucide-log-out"
          class="min-w-36"
          :loading="acting"
          @click="runAction(() => attendanceStore.checkOut())"
        >
          {{ t('hr.attendance.clock.checkOut') }}
        </UButton>
      </template>

      <UButton
        v-if="attendanceStore.clockStatus === 'on_break'"
        size="xl"
        color="primary"
        icon="i-lucide-play"
        class="min-w-40"
        :loading="acting"
        @click="runAction(() => attendanceStore.endBreak())"
      >
        {{ t('hr.attendance.clock.endBreak') }}
      </UButton>

      <p v-if="attendanceStore.clockStatus === 'checked_out'" class="text-sm text-[var(--color-midesk-muted)]">
        {{ t('hr.attendance.clock.doneForToday') }}
      </p>
    </div>
  </div>
</template>
