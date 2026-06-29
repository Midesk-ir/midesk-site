<script setup lang="ts">
import type { SwimlaneMode } from '~/types/phase1'

const model = defineModel<SwimlaneMode>({ default: 'none' })

const { t } = useI18n()

const items = computed(() => [
  { label: t('swimlane.none'), value: 'none' as const },
  { label: t('swimlane.assignee'), value: 'assignee' as const },
  { label: t('swimlane.priority'), value: 'priority' as const }
])
</script>

<template>
  <USelect
    v-model="model"
    :items="items"
    :placeholder="t('swimlane.mode')"
    class="w-44"
  />
</template>
