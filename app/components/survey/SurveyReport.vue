<script setup lang="ts">
import type { SurveyReportItem } from '~/types/phase5'

defineProps<{ items: SurveyReportItem[] }>()
const { t } = useI18n()
</script>

<template>
  <div class="space-y-6">
    <UCard v-for="item in items" :key="item.question_id" class="midesk-glass border-[var(--color-midesk-border)]">
      <template #header><p class="font-semibold">{{ item.question_title }}</p></template>
      <div v-if="'average' in item.data" class="text-3xl font-bold">
        {{ (item.data as { average: number }).average.toFixed(1) }}
        <span class="text-sm font-normal text-[var(--color-midesk-muted)]">{{ t('surveys.avgRating') }}</span>
      </div>
      <div v-else-if="Array.isArray(item.data)" class="flex flex-wrap gap-2">
        <UBadge v-for="word in item.data" :key="word" variant="subtle">{{ word }}</UBadge>
      </div>
      <div v-else class="space-y-2">
        <div v-for="(count, label) in item.data" :key="label" class="flex items-center gap-3">
          <span class="w-32 truncate text-sm">{{ label }}</span>
          <UProgress :value="Number(count) * 10" class="flex-1" />
          <span class="text-sm">{{ count }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>
