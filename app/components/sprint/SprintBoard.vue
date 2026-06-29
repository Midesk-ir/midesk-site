<script setup lang="ts">
import type { Task } from '~/types'

defineProps<{
  tasks: Task[]
  loading?: boolean
}>()

const emit = defineEmits<{
  openTask: [id: string]
  removeFromSprint: [taskId: string]
}>()

const { t } = useI18n()
</script>

<template>
  <div>
    <div v-if="loading" class="space-y-2">
      <USkeleton v-for="i in 4" :key="i" class="h-16 rounded-lg" />
    </div>

    <UiEmptyState
      v-else-if="!tasks.length"
      :title="t('sprint.emptyTitle')"
      :description="t('sprint.backlog')"
      icon="i-lucide-list-todo"
    />

    <ul v-else class="space-y-2">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="midesk-glass group flex items-center gap-3 rounded-lg border border-[var(--color-midesk-border)] p-3 transition hover:border-[var(--color-midesk-accent)]/40"
      >
        <button
          type="button"
          class="min-w-0 flex-1 text-start"
          @click="emit('openTask', task.id)"
        >
          <p class="truncate text-sm font-medium">{{ task.title }}</p>
          <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--color-midesk-muted)]">
            <UBadge size="xs" variant="subtle" color="neutral">
              {{ t(`kanban.columns.${task.status}`) }}
            </UBadge>
            <span v-if="task.story_points != null">
              {{ task.story_points }} {{ t('sprint.points') }}
            </span>
            <span v-if="task.assignee">{{ task.assignee.name }}</span>
          </div>
        </button>
        <UButton
          size="xs"
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-left"
          class="opacity-0 transition group-hover:opacity-100"
          :title="t('sprint.removeFromSprint')"
          @click="emit('removeFromSprint', task.id)"
        />
      </li>
    </ul>
  </div>
</template>
