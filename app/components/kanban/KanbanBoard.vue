<script setup lang="ts">
import type { KanbanColumn as KanbanColumnType, Task, TaskPriority, TaskStatus } from '~/types'
import type { SwimlaneMode } from '~/types/phase1'

const props = defineProps<{
  projectId: string
}>()

const { api } = useApi()
const toast = useToast()
const { t } = useI18n()

interface BoardLane {
  id: string
  label: string
  columns: KanbanColumnType[]
}

const lanes = ref<BoardLane[]>([])
const swimlane = ref<SwimlaneMode>('none')
const loading = ref(true)
const error = ref(false)

const filterPriority = ref<TaskPriority | 'all'>('all')
const filterSearch = ref('')

const wipConfirmOpen = ref(false)
const pendingMove = ref<{ taskId: string, status: TaskStatus, orderIndex: number } | null>(null)

function laneLabel(lane: BoardLane) {
  if (swimlane.value === 'assignee') {
    return lane.id === 'unassigned' ? t('swimlane.labels.unassigned') : lane.label
  }
  if (swimlane.value === 'priority') {
    return t(`swimlane.labels.${lane.id}`)
  }
  return lane.label
}

function filterTasks(tasks: Task[]) {
  let result = tasks
  if (filterPriority.value !== 'all') {
    result = result.filter(t => t.priority === filterPriority.value)
  }
  if (filterSearch.value) {
    const q = filterSearch.value.toLowerCase()
    result = result.filter(t => t.title.toLowerCase().includes(q))
  }
  return result
}

const filteredLanes = computed(() =>
  lanes.value.map(lane => ({
    ...lane,
    columns: lane.columns.map(col => ({
      ...col,
      tasks: filterTasks(col.tasks)
    }))
  }))
)

async function loadBoard() {
  loading.value = true
  error.value = false
  try {
    const data = await api<{ data: { swimlane: SwimlaneMode, lanes: BoardLane[] } }>(
      `/projects/${props.projectId}/board`,
      { query: { swimlane: swimlane.value } }
    )
    lanes.value = data.data.lanes
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

function findColumn(slug: TaskStatus) {
  for (const lane of lanes.value) {
    const col = lane.columns.find(c => c.slug === slug)
    if (col) return col
  }
  return null
}

function isWipFull(slug: TaskStatus, excludeTaskId?: string) {
  const col = findColumn(slug)
  if (!col || col.wip_limit == null) return false
  const count = col.tasks.filter(t => t.id !== excludeTaskId).length
  return count >= col.wip_limit
}

async function executeMove(payload: { taskId: string, status: TaskStatus, orderIndex: number }) {
  const snapshot = JSON.parse(JSON.stringify(lanes.value)) as BoardLane[]

  let movedTask: Task | undefined
  lanes.value.forEach((lane) => {
    lane.columns.forEach((col) => {
      const idx = col.tasks.findIndex(t => t.id === payload.taskId)
      if (idx >= 0) {
        movedTask = col.tasks.splice(idx, 1)[0]
        col.current_count = col.tasks.length
      }
    })
  })

  if (movedTask) {
    movedTask.status = payload.status
    movedTask.order_index = payload.orderIndex
    for (const lane of lanes.value) {
      const target = lane.columns.find(c => c.slug === payload.status)
      if (target) {
        target.tasks.push(movedTask)
        target.tasks.sort((a, b) => a.order_index - b.order_index)
        target.current_count = target.tasks.length
        break
      }
    }
  }

  try {
    await api(`/tasks/${payload.taskId}/move`, {
      method: 'PATCH',
      body: { status: payload.status, order_index: payload.orderIndex }
    })
  } catch {
    lanes.value = snapshot
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

function handleMove(payload: { taskId: string, status: TaskStatus, orderIndex: number }) {
  if (isWipFull(payload.status, payload.taskId)) {
    pendingMove.value = payload
    wipConfirmOpen.value = true
    return
  }
  executeMove(payload)
}

function confirmWipMove() {
  if (pendingMove.value) {
    executeMove(pendingMove.value)
    pendingMove.value = null
  }
  wipConfirmOpen.value = false
}

function updateColumnTasks(slug: TaskStatus, tasks: Task[]) {
  for (const lane of lanes.value) {
    const col = lane.columns.find(c => c.slug === slug)
    if (col) {
      col.tasks = tasks
      col.current_count = tasks.length
      break
    }
  }
}

watch(swimlane, loadBoard)

const emit = defineEmits<{
  openTask: [id: string]
}>()

onMounted(loadBoard)

defineExpose({ loadBoard })
</script>

<template>
  <div class="space-y-4">
  <div class="midesk-filter-bar">
      <UInput
        v-model="filterSearch"
        :placeholder="t('kanban.search')"
        icon="i-lucide-search"
        class="sm:w-48"
      />
      <USelect
        v-model="filterPriority"
        :items="[
          { label: t('kanban.all'), value: 'all' },
          { label: t('task.priorities.low'), value: 'low' },
          { label: t('task.priorities.medium'), value: 'medium' },
          { label: t('task.priorities.high'), value: 'high' },
          { label: t('task.priorities.critical'), value: 'critical' }
        ]"
        class="sm:w-40"
      />
      <KanbanSwimlanePicker v-model="swimlane" class="sm:w-auto" />
    </div>

    <div v-if="loading" class="flex gap-4 overflow-x-auto pb-4">
      <USkeleton v-for="i in 5" :key="i" class="h-[28rem] w-[17.5rem] shrink-0 rounded-xl" />
    </div>

    <UiEmptyState
      v-else-if="error"
      :title="t('common.error')"
      icon="i-lucide-circle-alert"
    >
      <template #action>
        <UButton @click="loadBoard">
          {{ t('common.retry') }}
        </UButton>
      </template>
    </UiEmptyState>

    <ClientOnly v-else>
      <div class="space-y-6">
        <div
          v-for="lane in filteredLanes"
          :key="lane.id"
          class="space-y-2"
        >
          <h3
            v-if="swimlane !== 'none'"
            class="text-sm font-semibold text-[var(--color-midesk-muted)]"
          >
            {{ laneLabel(lane) }}
          </h3>
          <div class="kanban-scroll flex gap-4 overflow-x-auto pb-4">
            <KanbanColumn
              v-for="col in lane.columns"
              :key="`${lane.id}-${col.slug}`"
              :column="col"
              :project-id="projectId"
              @update:tasks="updateColumnTasks(col.slug as TaskStatus, $event)"
              @move="handleMove"
              @open="(id: string) => emit('openTask', id)"
              @created="loadBoard"
            />
          </div>
        </div>
      </div>
    </ClientOnly>

    <MideskModal
      v-model:open="wipConfirmOpen"
      :title="t('kanban.wipConfirmTitle')"
      :description="t('kanban.wipConfirmBody')"
    >
      <template #footer>
        <UButton variant="ghost" @click="wipConfirmOpen = false">
          {{ t('common.cancel') }}
        </UButton>
        <UButton color="warning" @click="confirmWipMove">
          {{ t('kanban.wipConfirmAction') }}
        </UButton>
      </template>
    </MideskModal>
  </div>
</template>
