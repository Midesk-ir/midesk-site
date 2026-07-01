<script setup lang="ts">
import draggable from 'vuedraggable'
import type { KanbanColumn as KanbanColumnMeta, Task, TaskStatus } from '~/types'

const props = defineProps<{
  column: KanbanColumnMeta
  projectId: string
}>()

const emit = defineEmits<{
  'update:tasks': [tasks: Task[]]
  move: [payload: { taskId: string, status: TaskStatus, orderIndex: number }]
  open: [taskId: string]
  created: [task: Task]
}>()

const { api } = useApi()
const { t } = useI18n()
const toast = useToast()

const adding = ref(false)
const newTitle = ref('')
const submitting = ref(false)
const titleInput = ref<HTMLTextAreaElement | null>(null)

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

function openAddForm() {
  adding.value = true
  nextTick(() => titleInput.value?.focus())
}

function closeAddForm() {
  adding.value = false
  newTitle.value = ''
}

function onAddKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeAddForm()
    return
  }
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    submitCard()
  }
}

async function submitCard() {
  const title = newTitle.value.trim()
  if (!title || submitting.value) return

  submitting.value = true
  try {
    const task = await api<Task>(`/projects/${props.projectId}/tasks`, {
      method: 'POST',
      body: { title, status: props.column.slug }
    })
    newTitle.value = ''
    emit('created', task)
    nextTick(() => titleInput.value?.focus())
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="kanban-column">
    <div class="kanban-column-header">
      <div class="kanban-column-heading">
        <span
          v-if="column.color"
          class="kanban-column-dot"
          :style="{ backgroundColor: column.color }"
        />
        <h3 class="kanban-column-title">
          {{ column.name }}
        </h3>
        <span class="kanban-column-count">{{ column.current_count }}</span>
      </div>
      <KanbanWipIndicator
        :current="column.current_count"
        :limit="column.wip_limit"
      />
    </div>

    <draggable
      v-model="localTasks"
      item-key="id"
      group="kanban"
      class="kanban-column-body"
      ghost-class="kanban-card-ghost"
      drag-class="kanban-card-dragging"
      chosen-class="kanban-card-chosen"
      :animation="180"
      @change="onChange"
      @add="onDragAdd"
    >
      <template #item="{ element }">
        <KanbanCard :task="element" @click="$emit('open', element.id)" />
      </template>
    </draggable>

    <div class="kanban-column-footer">
      <button
        v-if="!adding"
        type="button"
        class="kanban-add-trigger"
        @click="openAddForm"
      >
        <UIcon name="i-lucide-plus" class="size-4" />
        {{ t('kanban.addCard') }}
      </button>

      <div v-else class="kanban-add-form">
        <textarea
          ref="titleInput"
          v-model="newTitle"
          rows="2"
          class="kanban-add-input"
          :placeholder="t('kanban.addCardPlaceholder')"
          :disabled="submitting"
          @keydown="onAddKeydown"
        />
        <div class="kanban-add-actions">
          <UButton
            size="sm"
            color="primary"
            :loading="submitting"
            :disabled="!newTitle.trim()"
            @click="submitCard"
          >
            {{ t('kanban.addCardSubmit') }}
          </UButton>
          <button
            type="button"
            class="kanban-add-cancel"
            :disabled="submitting"
            @click="closeAddForm"
          >
            {{ t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
