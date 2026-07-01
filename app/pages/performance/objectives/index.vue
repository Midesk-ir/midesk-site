<script setup lang="ts">
import type { PerformanceObjective } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })
const { t } = useI18n()
const objectives = ref<PerformanceObjective[]>([])

onMounted(async () => {
  objectives.value = (await storeApi<{ data: PerformanceObjective[] }>('/performance/objectives')).data
})
</script>

<template>
  <div class="space-y-6">
    <LayoutMideskPageHeader :title="t('performance.objectives')" />
    <div class="space-y-4">
      <UCard v-for="o in objectives" :key="o.id" class="midesk-glass border-[var(--color-midesk-border)]">
        <div class="flex items-center justify-between">
          <p class="font-semibold">{{ o.title }}</p>
          <UBadge>{{ t(`performance.statuses.${o.status}`) }}</UBadge>
        </div>
        <UProgress :value="o.progress" class="mt-3" />
      </UCard>
    </div>
  </div>
</template>
