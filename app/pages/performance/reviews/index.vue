<script setup lang="ts">
import type { PerformanceReview } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })
const { t } = useI18n()
const reviews = ref<PerformanceReview[]>([])

onMounted(async () => {
  reviews.value = (await storeApi<{ data: PerformanceReview[] }>('/performance/reviews')).data
})
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader :title="t('performance.reviews')" />
    <div class="midesk-card overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
            <th class="px-4 py-3 text-start">{{ t('performance.employee') }}</th>
            <th class="px-4 py-3 text-start">{{ t('performance.period') }}</th>
            <th class="px-4 py-3 text-start">{{ t('performance.reviewStatus') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in reviews" :key="r.id" class="border-b border-[var(--color-midesk-border)]">
            <td class="px-4 py-3">{{ r.employee.name }}</td>
            <td class="px-4 py-3">{{ r.period }}</td>
            <td class="px-4 py-3">{{ t(`performance.reviewStatuses.${r.status}`) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
