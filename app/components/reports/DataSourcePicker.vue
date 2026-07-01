<script setup lang="ts">
import type { DataSourceInfo } from '~/types/phase5'

defineProps<{ sources: DataSourceInfo[], modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const { t } = useI18n()
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    <button
      v-for="src in sources"
      :key="src.id"
      type="button"
      class="midesk-card rounded-xl p-4 text-start transition hover:ring-2 hover:ring-[var(--color-midesk-accent)]"
      :class="modelValue === src.id ? 'ring-2 ring-[var(--color-midesk-accent)]' : ''"
      @click="emit('update:modelValue', src.id)"
    >
      <p class="font-medium">{{ src.label }}</p>
      <p class="mt-1 text-xs text-[var(--color-midesk-muted)]">{{ src.columns.length }} {{ t('reports.columns') }}</p>
    </button>
  </div>
</template>
