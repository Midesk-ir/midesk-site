<script setup lang="ts">
import draggable from 'vuedraggable'
import type { KanbanColumn as KanbanColumnMeta, Task, TaskStatus } from '~/types'

const props = defineProps<{
  column: KanbanColumnMeta
}>()

const emit = defineEmits<{
  'update:tasks': [tasks: Task[]]
  move: [payload: { taskId: string, status: TaskStatus, orderIndex: number }]
  open: [taskId: string]
}>()

const localTasks = computed({
  get: () => props.column.tasks,
  set: (val: Task[]) => emit('update:tasks', val)
})

function onChange(evt: { added?: { element: Task, newIndex: number }, moved?: { element: Task, newIndex: number } }) {
  const item = evt.added?.element ?? evt.moved?.element
  const newIndex = evt.added?.newIndex ?? evt.moved?.newIndex
  if (!item || newIndex === undefined) return

  const siblings = localTasks.value.filter(t => t.id !== item.id)
  const prev = siblings[newIndex - 1]?.order_index ?? 0
  const next = siblings[newIndex]?.order_index ?? prev + 2000
  const orderIndex = Math.round((prev + next) / 2) || 1000

  emit('move', { taskId: item.id, status: props.column.slug as TaskStatus, orderIndex })
}

function onDragAdd(evt: { added?: { element: Task, newIndex: number } }) {
  if (evt.added) onChange(evt)
}
</script>

<template>
  <div class="kanban-column midesk-glass flex shrink-0 flex-col rounded-xl border border-[var(--color-midesk-border)]">
    <div class="flex items-center justify-between border-b border-[var(--color-midesk-border)] px-3 py-2.5">
      <h3 class="truncate text-sm font-medium text-[var(--color-midesk-text)]">
        {{ column.name }}
      </h3>
      <KanbanWipIndicator
        :current="column.current_count"
        :limit="column.wip_limit"
      />
    </div>

    <draggable
      v-model="localTasks"
      item-key="id"
      group="kanban"
      class="flex min-h-[120px] flex-1 flex-col gap-2 p-2"
      ghost-class="opacity-40"
      :animation="200"
      @change="onChange"
      @add="onDragAdd"
    >
      <template #item="{ element }">
        <KanbanCard :task="element" @click="$emit('open', element.id)" />
      </template>
    </draggable>
  </div>
</template>
