<script setup lang="ts">
import type { Task, TaskPriority } from '~/types'

const PRIORITY_BADGE_COLORS = {
  low: 'neutral',
  medium: 'info',
  high: 'warning',
  critical: 'error'
} as const

const props = defineProps<{
  task: Task
}>()

defineEmits<{
  click: [id: string]
}>()

const { t } = useI18n()
const { formatDate, isOverdue } = useCalendar()

const checklistPercent = computed(() => {
  if (!props.task.checklist.length) return 0
  const done = props.task.checklist.filter(c => c.is_done).length
  return Math.round((done / props.task.checklist.length) * 100)
})

const priorityColor = computed(() => PRIORITY_BADGE_COLORS[props.task.priority as TaskPriority])
</script>

<template>
  <button
    type="button"
    class="midesk-glass w-full rounded-lg border border-[var(--color-midesk-border)] p-3 text-start transition hover:border-[var(--color-midesk-accent)]/40"
    @click="$emit('click', task.id)"
  >
    <div class="flex items-start justify-between gap-2">
      <span class="text-sm font-medium leading-snug text-[var(--color-midesk-text)]">
        {{ task.title }}
      </span>
      <UBadge :color="priorityColor" size="xs" variant="subtle">
        {{ t(`task.priorities.${task.priority}`) }}
      </UBadge>
    </div>

    <div v-if="task.labels.length" class="mt-2 flex flex-wrap gap-1">
      <span
        v-for="label in task.labels"
        :key="label.id"
        class="rounded px-2 py-0.5 text-xs font-medium"
        :style="{ backgroundColor: `${label.color}22`, color: label.color }"
      >
        {{ label.name }}
      </span>
    </div>

    <div class="mt-3 flex items-center justify-between gap-2 text-xs text-[var(--color-midesk-muted)]">
      <div class="flex items-center gap-2">
        <UAvatar
          v-if="task.assignee"
          :alt="task.assignee.name"
          size="2xs"
          icon="i-lucide-user"
        />
        <span v-if="task.due_date" :class="{ 'text-red-400': isOverdue(task.due_date) }">
          {{ formatDate(task.due_date) }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="task.checklist.length" class="flex items-center gap-1">
          <UIcon name="i-lucide-check-square" class="size-3" />
          {{ checklistPercent }}%
        </span>
        <span v-if="task.comments_count" class="flex items-center gap-1">
          <UIcon name="i-lucide-message-square" class="size-3" />
          {{ task.comments_count }}
        </span>
      </div>
    </div>
  </button>
</template>
