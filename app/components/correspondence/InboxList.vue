<script setup lang="ts">
import type { Correspondence, CorrespondenceRouting } from '~/types/phase5'

defineProps<{ items: Array<{ correspondence: Correspondence, routing: CorrespondenceRouting }> }>()
const emit = defineEmits<{ complete: [corrId: string, routingId: string] }>()
const { t } = useI18n()
</script>

<template>
  <div class="space-y-3">
    <div v-for="{ correspondence: c, routing: r } in items" :key="r.id" class="midesk-card flex items-center justify-between p-4">
      <div>
        <p class="font-medium">{{ c.subject }}</p>
        <p class="text-sm text-[var(--color-midesk-muted)]">{{ c.number }} · {{ t(`correspondence.routingStatuses.${r.status}`) }}</p>
      </div>
      <UButton v-if="r.status !== 'completed'" size="sm" @click="emit('complete', c.id, r.id)">
        {{ t('correspondence.markComplete') }}
      </UButton>
    </div>
    <p v-if="!items.length" class="text-center text-sm text-[var(--color-midesk-muted)]">{{ t('correspondence.inboxEmpty') }}</p>
  </div>
</template>
