<script setup lang="ts">
import type { AiRequest } from '~/types/phase4'

defineProps<{
  requests: AiRequest[]
  loading?: boolean
}>()

const emit = defineEmits<{ select: [id: string], copy: [text: string] }>()
const { t } = useI18n()
</script>

<template>
  <div class="space-y-4">
    <h2 class="midesk-card-header">{{ t('ai.history') }}</h2>
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="i in 3" :key="i" class="h-32 rounded-xl" />
    </div>
    <UiEmptyState v-else-if="!requests.length" :title="t('ai.emptyTitle')" icon="i-lucide-sparkles" />
    <div v-else class="space-y-3">
      <AiResultCard
        v-for="req in requests"
        :key="req.id"
        :request="req"
        @copy="req.result && emit('copy', req.result)"
      />
    </div>
  </div>
</template>
