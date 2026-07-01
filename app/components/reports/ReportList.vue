<script setup lang="ts">
import type { CustomReport } from '~/types/phase5'

defineProps<{ reports: CustomReport[], loading?: boolean }>()
const { t } = useI18n()
</script>

<template>
  <div class="midesk-card overflow-hidden">
    <div v-if="loading" class="p-6"><USkeleton class="h-24 w-full" /></div>
    <div v-else-if="!reports.length" class="p-8 text-center text-sm text-[var(--color-midesk-muted)]">
      {{ t('reports.empty') }}
    </div>
    <table v-else class="w-full text-sm">
      <thead>
        <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
          <th class="px-4 py-3 text-start">{{ t('reports.name') }}</th>
          <th class="px-4 py-3 text-start">{{ t('reports.dataSource') }}</th>
          <th class="px-4 py-3 text-start">{{ t('reports.chartType') }}</th>
          <th class="px-4 py-3 text-end">{{ t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in reports" :key="r.id" class="border-b border-[var(--color-midesk-border)]">
          <td class="px-4 py-3">{{ r.name }}</td>
          <td class="px-4 py-3">{{ r.data_source }}</td>
          <td class="px-4 py-3">{{ r.chart_type }}</td>
          <td class="px-4 py-3 text-end">
            <UButton :to="`/reports/${r.id}`" size="xs" variant="outline">{{ t('reports.run') }}</UButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
