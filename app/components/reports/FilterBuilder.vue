<script setup lang="ts">
import type { ReportFilter } from '~/types/phase5'

defineProps<{ filters: ReportFilter[], fields: string[] }>()
defineEmits<{ add: [] }>()
const { t } = useI18n()
</script>

<template>
  <div class="space-y-3">
    <div v-for="(f, i) in filters" :key="i" class="flex flex-wrap gap-2">
      <USelect v-model="f.field" :items="fields.map(x => ({ label: x, value: x }))" class="min-w-32" />
      <USelect
        v-model="f.operator"
        :items="[
          { label: '=', value: 'eq' },
          { label: '≠', value: 'neq' },
          { label: '>', value: 'gt' },
          { label: '<', value: 'lt' },
          { label: t('reports.contains'), value: 'contains' }
        ]"
        class="min-w-24"
      />
      <UInput v-model="f.value" class="min-w-40" />
    </div>
    <UButton size="sm" variant="outline" icon="i-lucide-plus" @click="$emit('add')">
      {{ t('reports.addFilter') }}
    </UButton>
  </div>
</template>
