<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const attendanceStore = useAttendanceStore()
const { can } = usePermissions()

const loading = ref(true)
const reportMonth = ref(new Date().toISOString().slice(0, 7))

async function load() {
  loading.value = true
  try {
    await attendanceStore.fetchMy()
    const tasks: Promise<unknown>[] = []
    if (can('hr:attendance:view')) {
      tasks.push(attendanceStore.fetchToday())
    }
    tasks.push(attendanceStore.fetchReport(reportMonth.value))
    await Promise.all(tasks)
  } finally {
    loading.value = false
  }
}

watch(reportMonth, (month) => {
  attendanceStore.fetchReport(month)
})

onMounted(load)
</script>

<template>
  <div>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 class="midesk-page-title">{{ t('nav.hr.attendance') }}</h1>
      <UButton
        to="/hr/attendance/my"
        variant="soft"
        color="primary"
        icon="i-lucide-user"
      >
        {{ t('hr.attendance.myAttendance') }}
      </UButton>
    </div>

    <div class="space-y-6">
      <HrAttendanceClock />

      <section v-if="can('hr:attendance:view')" class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
        <div class="border-b border-[var(--color-midesk-border)] px-5 py-4">
          <h2 class="midesk-card-header mb-0">{{ t('hr.attendance.todayOverview') }}</h2>
          <div v-if="attendanceStore.todaySummary" class="mt-2 flex flex-wrap gap-3 text-sm text-[var(--color-midesk-muted)]">
            <span>{{ t('hr.dashboard.present') }}: {{ attendanceStore.todaySummary.present }}</span>
            <span>{{ t('hr.dashboard.absent') }}: {{ attendanceStore.todaySummary.absent }}</span>
            <span>{{ t('hr.dashboard.onLeave') }}: {{ attendanceStore.todaySummary.on_leave }}</span>
            <span>{{ t('hr.dashboard.onMission') }}: {{ attendanceStore.todaySummary.on_mission }}</span>
          </div>
        </div>
        <HrAttendanceTable
          :records="attendanceStore.todaySummary?.records ?? []"
          :loading="loading"
          show-member
        />
      </section>

      <div class="flex flex-wrap items-end gap-3">
        <MideskFormField
          :label="t('hr.attendance.reportMonth')"
          :model-value="reportMonth"
          field-class="midesk-ltr-field"
        >
          <UInput v-model="reportMonth" type="month" />
        </MideskFormField>
      </div>

      <HrAttendanceSummary
        v-if="attendanceStore.report.length === 1"
        :report-row="attendanceStore.report[0]"
      />

      <section v-if="can('hr:attendance:view') && attendanceStore.report.length" class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
        <div class="border-b border-[var(--color-midesk-border)] px-5 py-4">
          <h2 class="midesk-card-header mb-0">{{ t('hr.attendance.monthlyReport') }}</h2>
        </div>
        <div class="overflow-x-auto p-4">
          <table class="w-full min-w-[32rem] text-sm">
            <thead>
              <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
                <th class="px-3 py-2 text-start font-medium">{{ t('hr.attendance.columns.member') }}</th>
                <th class="px-3 py-2 text-start font-medium">{{ t('hr.attendance.summary.present') }}</th>
                <th class="px-3 py-2 text-start font-medium">{{ t('hr.attendance.summary.late') }}</th>
                <th class="px-3 py-2 text-start font-medium">{{ t('hr.attendance.summary.absent') }}</th>
                <th class="px-3 py-2 text-start font-medium">{{ t('hr.attendance.summary.overtime') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--color-midesk-border)]">
              <tr v-for="row in attendanceStore.report" :key="row.user.id">
                <td class="px-3 py-2">{{ row.user.name }}</td>
                <td class="px-3 py-2">{{ row.summary.present }}</td>
                <td class="px-3 py-2">{{ row.summary.late }}</td>
                <td class="px-3 py-2">{{ row.summary.absent }}</td>
                <td class="px-3 py-2">{{ Math.floor(row.summary.overtime_minutes / 60) }}h</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>
