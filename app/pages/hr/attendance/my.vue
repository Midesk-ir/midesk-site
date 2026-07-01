<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const attendanceStore = useAttendanceStore()

const loading = ref(true)
const monthStart = computed(() => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
})
const monthEnd = computed(() => new Date().toISOString().slice(0, 10))

const historyStats = computed(() => {
  const history = attendanceStore.myHistory
  return {
    present: history.filter(r => r.status === 'present' || r.status === 'late').length,
    late: history.filter(r => r.status === 'late').length,
    absent: history.filter(r => r.status === 'absent').length,
    overtime_minutes: history.reduce((sum, r) => sum + r.overtime_minutes, 0)
  }
})

async function load() {
  loading.value = true
  try {
    await attendanceStore.fetchMy(monthStart.value, monthEnd.value)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader
      back-to="/hr/attendance"
      :back-label="t('nav.hr.attendance')"
      :title="t('hr.attendance.myAttendance')"
    />

    <div class="space-y-6">
      <HrAttendanceClock />

      <HrAttendanceSummary :history-stats="historyStats" />

      <section class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
        <div class="border-b border-[var(--color-midesk-border)] px-5 py-4">
          <h2 class="midesk-card-header mb-0">{{ t('hr.attendance.history') }}</h2>
        </div>
        <HrAttendanceTable
          :records="attendanceStore.myHistory"
          :loading="loading"
        />
      </section>
    </div>
  </div>
</template>
