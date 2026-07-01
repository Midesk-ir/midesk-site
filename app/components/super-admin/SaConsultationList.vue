<script setup lang="ts">
import type { SaConsultation } from '~/types/phase5'

defineProps<{
  consultations: SaConsultation[]
  loading?: boolean
  updatingId?: string | null
}>()

const emit = defineEmits<{
  'update:status': [id: string, status: SaConsultation['status']]
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()

const statusItems = computed(() =>
  (['pending', 'contacted', 'closed'] as SaConsultation['status'][]).map(status => ({
    label: t(`superAdmin.consultations.status.${status}`),
    value: status
  }))
)

</script>

<template>
  <div class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
    <div class="border-b border-[var(--color-midesk-border)] px-5 py-4">
      <h2 class="midesk-card-header">{{ t('superAdmin.consultations.title') }}</h2>
    </div>

    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="h-10" />
    </div>

    <UiEmptyState
      v-else-if="!consultations.length"
      :title="t('superAdmin.consultations.emptyTitle')"
      :description="t('superAdmin.consultations.emptyDesc')"
      icon="i-lucide-message-circle"
    />

    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[56rem] text-sm">
        <thead>
          <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.consultations.columns.name') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.consultations.columns.email') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.consultations.columns.company') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.consultations.columns.message') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.consultations.columns.status') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.consultations.columns.created') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in consultations"
            :key="item.id"
            class="border-b border-[var(--color-midesk-border)] last:border-0"
          >
            <td class="px-4 py-3 font-medium">{{ item.name }}</td>
            <td class="px-4 py-3 midesk-ltr-field">{{ item.email }}</td>
            <td class="px-4 py-3">{{ item.company ?? '—' }}</td>
            <td class="max-w-xs truncate px-4 py-3 text-[var(--color-midesk-muted)]">{{ item.message }}</td>
            <td class="px-4 py-3">
              <USelect
                :model-value="item.status"
                :items="statusItems"
                :loading="updatingId === item.id"
                class="min-w-36"
                @update:model-value="emit('update:status', item.id, $event as SaConsultation['status'])"
              />
            </td>
            <td class="px-4 py-3 text-[var(--color-midesk-muted)]">{{ formatDate(item.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
