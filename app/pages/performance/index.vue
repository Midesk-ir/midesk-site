<script setup lang="ts">
import type { PerformanceDashboard } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })
const { t } = useI18n()
const dashboard = ref<PerformanceDashboard | null>(null)

onMounted(async () => {
  dashboard.value = (await storeApi<{ data: PerformanceDashboard }>('/performance/dashboard')).data
})
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader :title="t('nav.performance')" :subtitle="t('performance.pageSubtitle')">
      <template #actions>
        <LayoutMideskPageHeaderButton to="/performance/objectives" icon="i-lucide-target">{{ t('performance.objectives') }}</LayoutMideskPageHeaderButton>
        <LayoutMideskPageHeaderButton to="/performance/reviews" icon="i-lucide-clipboard-check">{{ t('performance.reviews') }}</LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>
    <div v-if="dashboard" class="grid gap-4 md:grid-cols-4">
      <UCard v-for="(count, key) in dashboard.objectives_summary" :key="key" class="midesk-glass border-[var(--color-midesk-border)] text-center">
        <p class="text-2xl font-bold">{{ count }}</p>
        <p class="text-sm text-[var(--color-midesk-muted)]">{{ t(`performance.summary.${key}`) }}</p>
      </UCard>
    </div>
    <UCard v-if="dashboard" class="midesk-glass border-[var(--color-midesk-border)]">
      <template #header><p class="font-semibold">{{ t('performance.kpis') }}</p></template>
      <ul class="space-y-2 text-sm">
        <li v-for="k in dashboard.indicators" :key="k.id">
          {{ k.name }}: {{ k.current }} / {{ k.target }} {{ k.unit }}
        </li>
      </ul>
    </UCard>
  </div>
</template>
