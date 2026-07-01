<script setup lang="ts">
import type { ReportChartType } from '~/types/phase5'

defineProps<{ modelValue: ReportChartType }>()
const emit = defineEmits<{ 'update:modelValue': [value: ReportChartType], next: [], back: [] }>()
const { t } = useI18n()

const types: { value: ReportChartType, icon: string, label: string }[] = [
  { value: 'table', icon: 'i-lucide-table', label: t('reports.types.table') },
  { value: 'bar', icon: 'i-lucide-bar-chart-3', label: t('reports.types.bar') },
  { value: 'line', icon: 'i-lucide-line-chart', label: t('reports.types.line') },
  { value: 'pie', icon: 'i-lucide-pie-chart', label: t('reports.types.pie') }
]
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-3 sm:grid-cols-4">
      <button
        v-for="item in types"
        :key="item.value"
        type="button"
        class="midesk-card flex flex-col items-center gap-2 rounded-xl p-4"
        :class="modelValue === item.value ? 'ring-2 ring-[var(--color-midesk-accent)]' : ''"
        @click="emit('update:modelValue', item.value)"
      >
        <UIcon :name="item.icon" class="size-8" />
        <span class="text-sm">{{ item.label }}</span>
      </button>
    </div>
    <div class="flex gap-2">
      <UButton variant="outline" @click="emit('back')">{{ t('common.back') }}</UButton>
      <UButton color="primary" @click="emit('next')">{{ t('reports.preview') }}</UButton>
    </div>
  </div>
</template>
