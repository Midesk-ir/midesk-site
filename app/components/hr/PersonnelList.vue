<script setup lang="ts">
import type { Personnel, PersonnelFilters, PersonnelStatus } from '~/types/phase2'

const props = defineProps<{
  personnel: Personnel[]
  loading?: boolean
}>()

const emit = defineEmits<{
  edit: [person: Personnel]
  delete: [id: string]
  'update:filters': [filters: PersonnelFilters]
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()
const { can } = usePermissions()

const filters = reactive<PersonnelFilters>({
  status: undefined,
  department: undefined,
  search: ''
})

const statusItems = computed(() => [
  { label: t('hr.personnel.filters.allStatus'), value: undefined },
  ...(['active', 'on_leave', 'terminated'] as PersonnelStatus[]).map(s => ({
    label: t(`hr.personnel.status.${s}`),
    value: s
  }))
])

const departments = computed(() => {
  const set = new Set<string>()
  props.personnel.forEach(p => {
    if (p.department) set.add(p.department)
  })
  return [
    { label: t('hr.personnel.filters.allDepartments'), value: undefined },
    ...[...set].sort().map(d => ({ label: d, value: d }))
  ]
})

const statusColor: Record<PersonnelStatus, 'success' | 'warning' | 'error'> = {
  active: 'success',
  on_leave: 'warning',
  terminated: 'error'
}

watch(filters, (val) => {
  emit('update:filters', { ...val })
}, { deep: true, immediate: true })
</script>

<template>
  <div class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
    <div class="border-b border-[var(--color-midesk-border)] px-5 py-4">
      <h2 class="midesk-card-header mb-4">{{ t('hr.personnel.title') }}</h2>
      <div class="midesk-filter-bar">
        <UInput
          v-model="filters.search"
          :placeholder="t('hr.personnel.filters.search')"
          icon="i-lucide-search"
          class="sm:flex-1"
        />
        <USelect
          v-model="filters.status"
          :items="statusItems"
          class="sm:w-44"
        />
        <USelect
          v-model="filters.department"
          :items="departments"
          class="sm:w-44"
        />
      </div>
    </div>

    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 5" :key="i" class="h-10" />
    </div>

    <UiEmptyState
      v-else-if="!personnel.length"
      :title="t('hr.personnel.emptyTitle')"
      :description="t('hr.personnel.emptyDesc')"
      icon="i-lucide-users"
    />

    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[48rem] text-sm">
        <thead>
          <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.personnel.columns.name') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.personnel.columns.code') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.personnel.columns.department') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.personnel.columns.jobTitle') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.personnel.columns.hireDate') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.personnel.columns.status') }}</th>
            <th class="px-4 py-3 text-end font-medium" />
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--color-midesk-border)]">
          <tr
            v-for="person in personnel"
            :key="person.id"
            class="transition hover:bg-white/[0.02]"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <UAvatar :alt="person.user.name" size="xs" icon="i-lucide-user" />
                <span class="font-medium">{{ person.user.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3 font-mono text-[var(--color-midesk-muted)]">{{ person.employee_code }}</td>
            <td class="px-4 py-3">{{ person.department ?? '—' }}</td>
            <td class="px-4 py-3">{{ person.job_title ?? '—' }}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(person.hire_date) }}</td>
            <td class="px-4 py-3">
              <UBadge :color="statusColor[person.status]" variant="subtle">
                {{ t(`hr.personnel.status.${person.status}`) }}
              </UBadge>
            </td>
            <td class="px-4 py-3">
              <div v-if="can('hr:personnel:update') || can('hr:personnel:delete')" class="flex justify-end gap-1">
                <UButton
                  v-if="can('hr:personnel:update')"
                  icon="i-lucide-pencil"
                  size="xs"
                  variant="ghost"
                  color="neutral"
                  :aria-label="t('common.edit')"
                  @click="emit('edit', person)"
                />
                <UButton
                  v-if="can('hr:personnel:delete')"
                  icon="i-lucide-trash-2"
                  size="xs"
                  variant="ghost"
                  color="error"
                  :aria-label="t('common.delete')"
                  @click="emit('delete', person.id)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
