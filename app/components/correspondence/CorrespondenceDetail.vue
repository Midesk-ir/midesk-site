<script setup lang="ts">
import type { Correspondence } from '~/types/phase5'

defineProps<{ item: Correspondence }>()
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-3">
    <UCard class="midesk-glass border-[var(--color-midesk-border)] lg:col-span-2">
      <div class="prose prose-invert max-w-none whitespace-pre-wrap text-sm">{{ item.body }}</div>
    </UCard>
    <div class="space-y-4">
      <UCard class="midesk-glass border-[var(--color-midesk-border)]">
        <CorrespondenceRoutingTimeline :routing="item.routing" />
      </UCard>
    </div>
  </div>
</template>
