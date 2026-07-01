<script setup lang="ts">
import type { SaTenant } from '~/types/phase5'

const props = defineProps<{
  tenants: SaTenant[]
  loading?: boolean
  suspendingId?: string | null
}>()

const emit = defineEmits<{
  suspend: [id: string]
  'update:search': [value: string]
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()

const search = ref('')

watch(search, (val) => {
  emit('update:search', val)
})

const statusColor: Record<SaTenant['status'], 'success' | 'warning' | 'error'> = {
  active: 'success',
  trial: 'warning',
  suspended: 'error'
}
</script>

<template>
  <div class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
    <div class="border-b border-[var(--color-midesk-border)] px-5 py-4">
      <h2 class="midesk-card-header mb-4">{{ t('superAdmin.tenants.title') }}</h2>
      <UInput
        v-model="search"
        :placeholder="t('superAdmin.tenants.search')"
        icon="i-lucide-search"
        class="max-w-md"
      />
    </div>

    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 4" :key="i" class="h-10" />
    </div>

    <UiEmptyState
      v-else-if="!tenants.length"
      :title="t('superAdmin.tenants.emptyTitle')"
      :description="t('superAdmin.tenants.emptyDesc')"
      icon="i-lucide-building"
    />

    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[48rem] text-sm">
        <thead>
          <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.tenants.columns.name') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.tenants.columns.plan') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.tenants.columns.status') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.tenants.columns.users') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.tenants.columns.mrr') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.tenants.columns.created') }}</th>
            <th class="px-4 py-3 text-end font-medium" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="tenant in tenants"
            :key="tenant.id"
            class="border-b border-[var(--color-midesk-border)] last:border-0"
          >
            <td class="px-4 py-3 font-medium">{{ tenant.name }}</td>
            <td class="px-4 py-3">
              <UBadge variant="subtle">{{ tenant.plan_code }}</UBadge>
            </td>
            <td class="px-4 py-3">
              <UBadge :color="statusColor[tenant.status]" variant="subtle">
                {{ t(`superAdmin.tenants.status.${tenant.status}`) }}
              </UBadge>
            </td>
            <td class="px-4 py-3">{{ tenant.users_count }}</td>
            <td class="px-4 py-3">
              <MideskCurrency :amount="tenant.mrr" currency="IRR" />
            </td>
            <td class="px-4 py-3 text-[var(--color-midesk-muted)]">{{ formatDate(tenant.created_at) }}</td>
            <td class="px-4 py-3 text-end">
              <UButton
                v-if="tenant.status !== 'suspended'"
                size="sm"
                color="error"
                variant="soft"
                :loading="suspendingId === tenant.id"
                @click="emit('suspend', tenant.id)"
              >
                {{ t('superAdmin.tenants.suspend') }}
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
