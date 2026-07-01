<script setup lang="ts">
import type { PersonnelDetail } from '~/types/phase2'

const props = defineProps<{
  detail: PersonnelDetail
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()
const { can } = usePermissions()

const activeTab = ref('personal')

const tabs = computed(() => [
  { label: t('hr.personnel.tabs.personal'), value: 'personal', icon: 'i-lucide-user' },
  { label: t('hr.personnel.tabs.job'), value: 'job', icon: 'i-lucide-briefcase' },
  { label: t('hr.personnel.tabs.contracts'), value: 'contracts', icon: 'i-lucide-file-text', badge: props.detail.contracts.length },
  { label: t('hr.personnel.tabs.documents'), value: 'documents', icon: 'i-lucide-folder', badge: props.detail.documents.length },
  { label: t('hr.personnel.tabs.attendance'), value: 'attendance', icon: 'i-lucide-clock' },
  { label: t('hr.personnel.tabs.leave'), value: 'leave', icon: 'i-lucide-plane' }
])

const attendanceStats = computed(() => {
  const records = props.detail.recent_attendance
  return {
    present: records.filter(r => r.status === 'present' || r.status === 'late').length,
    late: records.filter(r => r.status === 'late').length,
    absent: records.filter(r => r.status === 'absent').length,
    overtime_minutes: records.reduce((sum, r) => sum + r.overtime_minutes, 0)
  }
})

const statusColor: Record<string, 'warning' | 'success' | 'error' | 'neutral'> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  cancelled: 'neutral'
}
</script>

<template>
  <div class="space-y-5">
    <div class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5">
      <div class="flex flex-wrap items-center gap-4">
        <UAvatar :alt="detail.user.name" size="xl" icon="i-lucide-user" />
        <div class="min-w-0 flex-1">
          <h2 class="midesk-page-title text-xl">{{ detail.user.name }}</h2>
          <p class="text-sm text-[var(--color-midesk-muted)]">
            {{ detail.job_title ?? '—' }}
            <span v-if="detail.department"> · {{ detail.department }}</span>
          </p>
          <p class="mt-1 font-mono text-xs text-[var(--color-midesk-muted)]">{{ detail.employee_code }}</p>
        </div>
        <UBadge :color="detail.status === 'active' ? 'success' : detail.status === 'on_leave' ? 'warning' : 'error'" variant="subtle">
          {{ t(`hr.personnel.status.${detail.status}`) }}
        </UBadge>
      </div>
    </div>

    <UTabs v-model="activeTab" :items="tabs" :content="false" class="w-full" />

    <div v-if="activeTab === 'personal'" class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5">
      <dl class="grid gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs text-[var(--color-midesk-muted)]">{{ t('hr.personnel.fields.email') }}</dt>
          <dd class="mt-1">{{ detail.email ?? '—' }}</dd>
        </div>
        <div>
          <dt class="text-xs text-[var(--color-midesk-muted)]">{{ t('hr.personnel.fields.phone') }}</dt>
          <dd class="mt-1">{{ detail.phone ?? '—' }}</dd>
        </div>
        <div>
          <dt class="text-xs text-[var(--color-midesk-muted)]">{{ t('hr.personnel.fields.nationalId') }}</dt>
          <dd class="mt-1">{{ detail.national_id ?? '—' }}</dd>
        </div>
        <div>
          <dt class="text-xs text-[var(--color-midesk-muted)]">{{ t('hr.personnel.fields.birthDate') }}</dt>
          <dd class="mt-1">{{ formatDate(detail.birth_date) }}</dd>
        </div>
        <div class="sm:col-span-2">
          <dt class="text-xs text-[var(--color-midesk-muted)]">{{ t('hr.personnel.fields.address') }}</dt>
          <dd class="mt-1">{{ detail.address ?? '—' }}</dd>
        </div>
        <div>
          <dt class="text-xs text-[var(--color-midesk-muted)]">{{ t('hr.personnel.fields.emergencyContact') }}</dt>
          <dd class="mt-1">{{ detail.emergency_contact ?? '—' }}</dd>
        </div>
      </dl>
    </div>

    <div v-else-if="activeTab === 'job'" class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5">
      <dl class="grid gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-xs text-[var(--color-midesk-muted)]">{{ t('hr.personnel.fields.jobTitle') }}</dt>
          <dd class="mt-1">{{ detail.job_title ?? '—' }}</dd>
        </div>
        <div>
          <dt class="text-xs text-[var(--color-midesk-muted)]">{{ t('hr.personnel.fields.department') }}</dt>
          <dd class="mt-1">{{ detail.department ?? '—' }}</dd>
        </div>
        <div>
          <dt class="text-xs text-[var(--color-midesk-muted)]">{{ t('hr.personnel.fields.employmentType') }}</dt>
          <dd class="mt-1">{{ t(`hr.personnel.employmentType.${detail.employment_type}`) }}</dd>
        </div>
        <div>
          <dt class="text-xs text-[var(--color-midesk-muted)]">{{ t('hr.personnel.fields.hireDate') }}</dt>
          <dd class="mt-1">{{ formatDate(detail.hire_date) }}</dd>
        </div>
      </dl>
    </div>

    <div v-else-if="activeTab === 'contracts'" class="space-y-3">
      <div class="flex justify-end">
        <UButton
          v-if="can('hr:contracts:manage')"
          to="/hr/contracts"
          size="sm"
          variant="soft"
          icon="i-lucide-refresh-cw"
        >
          {{ t('hr.contracts.renew') }}
        </UButton>
      </div>
      <HrContractList v-if="detail.contracts.length" :contracts="detail.contracts" />
      <UiEmptyState v-else :title="t('hr.contracts.emptyTitle')" icon="i-lucide-file-text" />
    </div>

    <div v-else-if="activeTab === 'documents'" class="space-y-3">
      <div class="flex justify-end">
        <UButton
          v-if="can('hr:documents:manage')"
          to="/hr/documents"
          size="sm"
          variant="soft"
          icon="i-lucide-upload"
        >
          {{ t('hr.documents.upload') }}
        </UButton>
      </div>
      <HrDocumentList v-if="detail.documents.length" :documents="detail.documents" />
      <UiEmptyState v-else :title="t('hr.documents.emptyTitle')" icon="i-lucide-folder" />
    </div>

    <div v-else-if="activeTab === 'attendance'" class="space-y-4">
      <HrAttendanceSummary :history-stats="attendanceStats" />
      <div class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
        <HrAttendanceTable :records="detail.recent_attendance" />
      </div>
    </div>

    <div v-else-if="activeTab === 'leave'" class="space-y-4">
      <div class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5">
        <h3 class="mb-3 text-sm font-medium">{{ t('leave.balance.title') }}</h3>
        <UiEmptyState
          v-if="!detail.leave_balances?.length"
          :title="t('leave.balance.title')"
          :description="t('common.noResults')"
          icon="i-lucide-plane"
        />
        <ul v-else class="divide-y divide-[var(--color-midesk-border)]">
          <li
            v-for="bal in detail.leave_balances"
            :key="bal.leave_type.id"
            class="flex items-center justify-between py-3"
          >
            <span class="font-medium">{{ bal.leave_type.name }}</span>
            <span class="text-[var(--color-midesk-muted)]">
              {{ bal.remaining }} {{ t('leave.balance.days') }}
            </span>
          </li>
        </ul>
      </div>

      <div class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
        <div class="border-b border-[var(--color-midesk-border)] px-5 py-4">
          <h3 class="midesk-card-header mb-0">{{ t('leave.request.title') }}</h3>
        </div>
        <UiEmptyState
          v-if="!detail.leave_requests?.length"
          :title="t('leave.request.emptyTitle')"
          icon="i-lucide-plane"
          class="py-8"
        />
        <ul v-else class="divide-y divide-[var(--color-midesk-border)]">
          <li
            v-for="req in detail.leave_requests"
            :key="req.id"
            class="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
          >
            <div>
              <p class="font-medium">{{ req.leave_type.name }}</p>
              <p class="text-sm text-[var(--color-midesk-muted)]">
                {{ formatDate(req.start_date) }} – {{ formatDate(req.end_date) }}
              </p>
            </div>
            <UBadge :color="statusColor[req.status]" variant="subtle">
              {{ t(`leave.status.${req.status}`) }}
            </UBadge>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
