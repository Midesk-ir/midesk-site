<script setup lang="ts">
import type { CorrespondenceRouting } from '~/types/phase5'

defineProps<{ routing: CorrespondenceRouting[] }>()
const { t } = useI18n()
</script>

<template>
  <ul class="space-y-3">
    <li v-for="r in routing" :key="r.id" class="border-s-2 border-[var(--color-midesk-accent)] ps-3 text-sm">
      <p class="font-medium">{{ r.from.name }} → {{ r.to.name }}</p>
      <p class="text-xs text-[var(--color-midesk-muted)]">
        {{ t(`correspondence.actions.${r.action}`) }} · {{ t(`correspondence.routingStatuses.${r.status}`) }}
      </p>
    </li>
    <li v-if="!routing.length" class="text-sm text-[var(--color-midesk-muted)]">{{ t('correspondence.noRouting') }}</li>
  </ul>
</template>
