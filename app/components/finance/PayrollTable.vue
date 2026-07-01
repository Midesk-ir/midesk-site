<script setup lang="ts">
import type { PayrollRecord, PayrollStatus } from '~/types/phase3'

const props = defineProps<{
  records: PayrollRecord[]
  loading?: boolean
  selectedIds?: string[]
}>()

const emit = defineEmits<{
  'update:selectedIds': [ids: string[]]
  approve: [id: string]
  select: [id: string]
}>()

const { t } = useI18n()
const { can } = usePermissions()

const selected = computed({
  get: () => props.selectedIds ?? [],
  set: value => emit('update:selectedIds', value)
})

const statusColor: Record<PayrollStatus, 'neutral' | 'warning' | 'success' | 'error' | 'info' | 'primary'> = {
  draft: 'neutral',
  calculated: 'info',
  approved: 'warning',
  paid: 'success'
}

function toggle(id: string, checked?: boolean) {
  const set = new Set(selected.value)
  const isChecked = checked ?? !set.has(id)
  if (isChecked) set.add(id)
  else set.delete(id)
  selected.value = [...set]
}

function canApprove(record: PayrollRecord) {
  return record.status === 'calculated' && can('finance:payroll:view')
}

function canSelect(record: PayrollRecord) {
  return record.status === 'approved'
}

function deductionsTotal(record: PayrollRecord) {
  return record.deductions.reduce((sum, item) => sum + item.amount, 0)
}
</script>

<template>
  <section class="midesk-card overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 4" :key="i" class="h-14" />
    </div>

    <UiEmptyState
      v-else-if="!records.length"
      :title="t('finance.payroll.emptyTitle')"
      :description="t('finance.payroll.emptyDesc')"
      icon="i-lucide-banknote"
    />

    <div v-else class="overflow-x-auto">
      <table class="midesk-table w-full min-w-[880px]">
        <thead>
          <tr>
            <th class="w-10" />
            <th>{{ t('finance.payroll.columns.employee') }}</th>
            <th>{{ t('finance.payroll.columns.period') }}</th>
            <th>{{ t('finance.payroll.columns.base') }}</th>
            <th>{{ t('finance.payroll.columns.overtime') }}</th>
            <th>{{ t('finance.payroll.columns.deductions') }}</th>
            <th>{{ t('finance.payroll.columns.net') }}</th>
            <th>{{ t('finance.payroll.columns.status') }}</th>
            <th class="text-end">{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in records"
            :key="record.id"
            class="cursor-pointer hover:bg-[var(--color-midesk-surface-hover)]"
            @click="emit('select', record.id)"
          >
            <td @click.stop>
              <UCheckbox
                v-if="canSelect(record)"
                :model-value="selected.includes(record.id)"
                @update:model-value="toggle(record.id, $event as boolean)"
              />
            </td>
            <td class="font-medium text-[var(--color-midesk-text)]">{{ record.user.name }}</td>
            <td class="whitespace-nowrap text-[var(--color-midesk-text)]">{{ record.period }}</td>
            <td class="text-[var(--color-midesk-text)]">
              <MideskCurrency :amount="record.base_salary" :currency="record.currency" />
            </td>
            <td class="text-[var(--color-midesk-text)]">
              <MideskCurrency :amount="record.overtime_amount" :currency="record.currency" />
            </td>
            <td class="text-red-400">
              -<MideskCurrency :amount="deductionsTotal(record)" :currency="record.currency" />
            </td>
            <td class="font-semibold text-[var(--color-midesk-text)]">
              <MideskCurrency :amount="record.net_amount" :currency="record.currency" />
            </td>
            <td>
              <UBadge variant="subtle" :color="statusColor[record.status]" size="sm">
                {{ t(`finance.payroll.status.${record.status}`) }}
              </UBadge>
            </td>
            <td class="text-end" @click.stop>
              <UButton
                v-if="canApprove(record)"
                size="xs"
                color="success"
                variant="soft"
                icon="i-lucide-check"
                @click="emit('approve', record.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
