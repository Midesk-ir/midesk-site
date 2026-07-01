<script setup lang="ts">
import type { Vendor } from '~/types/phase3'

defineProps<{
  vendors: Vendor[]
  loading?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <section class="midesk-card overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="h-14" />
    </div>

    <UiEmptyState
      v-else-if="!vendors.length"
      :title="t('finance.vendors.emptyTitle')"
      :description="t('finance.vendors.emptyDesc')"
      icon="i-lucide-truck"
    />

    <div v-else class="overflow-x-auto">
      <table class="midesk-table w-full min-w-[640px]">
        <thead>
          <tr>
            <th>{{ t('finance.vendors.columns.name') }}</th>
            <th>{{ t('finance.vendors.columns.code') }}</th>
            <th>{{ t('finance.vendors.columns.contact') }}</th>
            <th>{{ t('finance.vendors.columns.email') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="vendor in vendors"
            :key="vendor.id"
            class="hover:bg-[var(--color-midesk-surface-hover)]"
          >
            <td class="font-medium text-[var(--color-midesk-text)]">{{ vendor.name }}</td>
            <td class="text-[var(--color-midesk-muted)]">{{ vendor.code || '—' }}</td>
            <td class="text-[var(--color-midesk-text)]">{{ vendor.contact_name || '—' }}</td>
            <td class="text-[var(--color-midesk-muted)]">{{ vendor.email || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
