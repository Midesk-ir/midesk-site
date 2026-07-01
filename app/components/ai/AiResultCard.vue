<script setup lang="ts">
import type { AiRequest } from '~/types/phase4'

defineProps<{ request: AiRequest }>()
const emit = defineEmits<{ copy: [] }>()

const { t } = useI18n()
const { render } = useMarkdown()
</script>

<template>
  <article class="midesk-card space-y-3 p-5">
    <div class="flex items-center justify-between gap-3">
      <UBadge variant="subtle" :color="request.status === 'completed' ? 'success' : request.status === 'failed' ? 'error' : 'primary'">
        {{ t(`ai.status.${request.status}`) }}
      </UBadge>
      <UButton v-if="request.result" size="xs" variant="ghost" icon="i-lucide-copy" @click="emit('copy')">
        {{ t('ai.copy') }}
      </UButton>
    </div>
    <p class="text-sm text-[var(--color-midesk-muted)]">{{ request.prompt }}</p>
    <div
      v-if="request.result"
      class="prose prose-invert max-w-none rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.02] p-4 text-sm"
      v-html="render(request.result)"
    />
    <div v-else-if="request.status === 'processing' || request.status === 'queued'" class="flex items-center gap-2 text-sm text-[var(--color-midesk-muted)]">
      <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
      {{ t('ai.processing') }}
    </div>
  </article>
</template>
