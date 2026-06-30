<script setup lang="ts">
import type { Candidate } from '~/types/phase2'

defineProps<{
  candidate: Candidate
}>()

defineEmits<{
  click: []
}>()

const { t } = useI18n()
const { formatRelative } = useCalendar()
</script>

<template>
  <button
    type="button"
    class="midesk-glass w-full rounded-lg border border-[var(--color-midesk-border)] p-3 text-start transition hover:border-[var(--color-midesk-accent)]/40"
    @click="$emit('click')"
  >
    <div class="flex items-start justify-between gap-2">
      <span class="text-sm font-medium leading-snug">{{ candidate.full_name }}</span>
      <UBadge
        v-if="candidate.average_score"
        color="primary"
        size="xs"
        variant="subtle"
      >
        {{ candidate.average_score.toFixed(1) }}
      </UBadge>
    </div>

    <p v-if="candidate.email" class="mt-1 truncate text-xs text-[var(--color-midesk-muted)]">
      {{ candidate.email }}
    </p>

    <div class="mt-3 flex items-center justify-between gap-2 text-xs text-[var(--color-midesk-muted)]">
      <span v-if="candidate.source">{{ candidate.source }}</span>
      <span v-if="candidate.interviews.length" class="flex items-center gap-1">
        <UIcon name="i-lucide-calendar" class="size-3" />
        {{ candidate.interviews.length }}
      </span>
      <span>{{ formatRelative(candidate.created_at) }}</span>
    </div>
  </button>
</template>
