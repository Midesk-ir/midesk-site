<script setup lang="ts">
import draggable from 'vuedraggable'
import type { Task } from '~/types'

const props = withDefaults(defineProps<{
  tasks?: Task[]
  loading?: boolean
}>(), {
  tasks: () => [],
  loading: false
})

const emit = defineEmits<{
  'update:tasks': [tasks: Task[]]
  removeFromSprint: [taskId: string]
  openTask: [id: string]
}>()

const { t } = useI18n()

const taskList = computed(() => props.tasks ?? [])

const localTasks = computed({
  get: () => taskList.value,
  set: (val: Task[]) => emit('update:tasks', val)
})

function onAdd(evt: { added?: { element: Task } }) {
  if (evt.added) {
    emit('removeFromSprint', evt.added.element.id)
  }
}
</script>

<template>
  <section class="midesk-card flex flex-col p-5">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="midesk-card-header mb-0">{{ t('sprint.backlog') }}</h2>
      <UBadge color="neutral" variant="subtle" size="xs">
        {{ taskList.length }}
      </UBadge>
    </div>

    <div v-if="loading" class="space-y-2">
      <USkeleton v-for="i in 5" :key="i" class="midesk-skeleton-row" />
    </div>

    <UiEmptyState
      v-else-if="!taskList.length"
      :title="t('sprint.backlog')"
      icon="i-lucide-inbox"
    />

    <ClientOnly v-else>
      <draggable
        v-model="localTasks"
        item-key="id"
        group="sprint-tasks"
        class="flex min-h-[200px] flex-col gap-2"
        ghost-class="opacity-40"
        :animation="200"
        @add="onAdd"
      >
        <template #item="{ element }">
          <button
            type="button"
            class="midesk-glass w-full rounded-lg border border-[var(--color-midesk-border)] p-3 text-start transition hover:border-[var(--color-midesk-accent)]/40"
            @click="emit('openTask', element.id)"
          >
            <p class="text-sm font-medium">{{ element.title }}</p>
            <div class="mt-1 flex items-center gap-2 text-xs text-[var(--color-midesk-muted)]">
              <UBadge size="xs" variant="subtle" color="neutral">
                {{ t(`kanban.columns.${element.status}`) }}
              </UBadge>
              <span v-if="element.story_points != null">
                {{ element.story_points }} {{ t('sprint.points') }}
              </span>
            </div>
          </button>
        </template>
      </draggable>
    </ClientOnly>
  </section>
</template>
