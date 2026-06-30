<script setup lang="ts">
import type { Contract, ContractStatus, ContractType } from '~/types/phase2'

defineProps<{
  contracts: Contract[]
  loading?: boolean
}>()

const emit = defineEmits<{
  renew: [id: string]
}>()

const { t } = useI18n()
const { formatDate, formatCurrency } = useCalendar()

const typeColor: Record<ContractType, 'primary' | 'info' | 'warning' | 'neutral'> = {
  permanent: 'primary',
  fixed_term: 'info',
  trial: 'warning',
  intern: 'neutral'
}

const statusColor: Record<ContractStatus, 'success' | 'error' | 'warning' | 'neutral'> = {
  active: 'success',
  expired: 'error',
  terminated: 'error',
  renewed: 'neutral'
}
</script>

<template>
  <div class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="h-10" />
    </div>

    <UiEmptyState
      v-else-if="!contracts.length"
      :title="t('hr.contracts.emptyTitle')"
      :description="t('hr.contracts.emptyDesc')"
      icon="i-lucide-file-text"
    />

    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[40rem] text-sm">
        <thead>
          <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.contracts.columns.employee') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.contracts.columns.type') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.contracts.columns.startDate') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.contracts.columns.endDate') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.contracts.columns.salary') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('hr.contracts.columns.status') }}</th>
            <th class="px-4 py-3 text-end font-medium" />
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--color-midesk-border)]">
          <tr
            v-for="contract in contracts"
            :key="contract.id"
            class="transition hover:bg-white/[0.02]"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <UAvatar :alt="contract.user.name" size="xs" icon="i-lucide-user" />
                <span>{{ contract.user.name }}</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <UBadge :color="typeColor[contract.type]" variant="subtle" size="xs">
                {{ t(`hr.contracts.type.${contract.type}`) }}
              </UBadge>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(contract.start_date) }}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(contract.end_date) }}</td>
            <td class="px-4 py-3">{{ formatCurrency(contract.base_salary, contract.currency) }}</td>
            <td class="px-4 py-3">
              <UBadge :color="statusColor[contract.status]" variant="subtle" size="xs">
                {{ t(`hr.contracts.status.${contract.status}`) }}
              </UBadge>
            </td>
            <td class="px-4 py-3">
              <div class="flex justify-end">
                <UButton
                  v-if="contract.status === 'active' && contract.end_date"
                  size="xs"
                  variant="soft"
                  color="primary"
                  icon="i-lucide-refresh-cw"
                  @click="emit('renew', contract.id)"
                >
                  {{ t('hr.contracts.renew') }}
                </UButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
