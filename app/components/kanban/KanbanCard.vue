<script setup lang="ts">
import type { Task, TaskPriority } from '~/types'

const PRIORITY_ACCENT: Record<TaskPriority, string> = {
  low: '#6b7280',
  medium: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444'
}

const props = defineProps<{
  task: Task
}>()

defineEmits<{
  click: [id: string]
}>()

const { formatDate, isOverdue } = useCalendar()

const checklistDone = computed(() =>
  props.task.checklist.filter(c => c.is_done).length
)

const visibleLabels = computed(() => props.task.labels.slice(0, 4))

const priorityAccent = computed(() => PRIORITY_ACCENT[props.task.priority as TaskPriority])
const dueOverdue = computed(() => props.task.due_date ? isOverdue(props.task.due_date) : false)
</script>

<template>
  <button
    type="button"
    class="kanban-card group"
    :style="{ '--kanban-priority-accent': priorityAccent }"
    @click="$emit('click', task.id)"
  >
    <div v-if="visibleLabels.length" class="kanban-card-labels">
      <span
        v-for="label in visibleLabels"
        :key="label.id"
        class="kanban-card-label"
        :style="{ backgroundColor: label.color }"
        :title="label.name"
      />
    </div>

    <p class="kanban-card-title">
      {{ task.title }}
    </p>

    <div class="kanban-card-meta">
      <div class="kanban-card-badges">
        <span
          v-if="task.due_date"
          class="kanban-card-badge"
          :class="{ 'kanban-card-badge--overdue': dueOverdue }"
        >
          <UIcon name="i-lucide-clock" class="size-3" />
          {{ formatDate(task.due_date) }}
        </span>

        <span v-if="task.story_points != null" class="kanban-card-badge">
          {{ task.story_points }}
        </span>

        <span v-if="task.checklist.length" class="kanban-card-badge">
          <UIcon name="i-lucide-check-square" class="size-3" />
          {{ checklistDone }}/{{ task.checklist.length }}
        </span>

        <span v-if="task.comments_count" class="kanban-card-badge">
          <UIcon name="i-lucide-message-square" class="size-3" />
          {{ task.comments_count }}
        </span>
      </div>

      <UAvatar
        v-if="task.assignee"
        :alt="task.assignee.name"
        size="2xs"
        icon="i-lucide-user"
        class="kanban-card-avatar"
      />
    </div>
  </button>
</template>
