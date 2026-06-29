<script setup lang="ts">
import type { Task } from '~/types'
import type { Sprint } from '~/types/phase1'

definePageMeta({ middleware: ['auth', 'tenant'] })

const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const { api } = useApi()
const { formatDate } = useCalendar()
const sprintStore = useSprintStore()

const projectId = inject<ComputedRef<string>>('projectId', computed(() => route.params.id as string))
const openProjectTask = inject<(id: string) => void>('openProjectTask')

const sprintId = computed(() => route.params.sprintId as string)

const sprint = ref<Sprint | null>(null)
const tasks = ref<Task[]>([])
const loading = ref(true)

const taskModalOpen = ref(false)
const activeTaskId = ref('')

async function load() {
  loading.value = true
  try {
    const detail = await api<{ data: { sprint: Sprint, tasks: Task[] } }>(
      `/projects/${projectId.value}/sprints/${sprintId.value}`
    )
    sprint.value = detail.data.sprint
    tasks.value = detail.data.tasks
  } finally {
    loading.value = false
  }
}

async function handleRemoveFromSprint(taskId: string) {
  try {
    await sprintStore.assignTask(taskId, null)
    tasks.value = tasks.value.filter(t => t.id !== taskId)
    const updated = await api<{ data: { sprint: Sprint, tasks: Task[] } }>(
      `/projects/${projectId.value}/sprints/${sprintId.value}`
    )
    sprint.value = updated.data.sprint
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
    await load()
  }
}

function openTask(id: string) {
  if (openProjectTask) {
    openProjectTask(id)
    return
  }
  activeTaskId.value = id
  taskModalOpen.value = true
}

const progressPercent = computed(() => {
  if (!sprint.value?.total_points) return 0
  return Math.round((sprint.value.completed_points / sprint.value.total_points) * 100)
})

watch(sprintId, load)
onMounted(load)
</script>

<template>
  <div>
    <div v-if="loading">
      <USkeleton class="mb-4 h-10 w-1/3" />
      <USkeleton class="h-96 w-full" />
    </div>

    <template v-else-if="sprint">
      <div class="mb-6">
        <UButton
          :to="`/projects/${projectId}/sprints`"
          variant="ghost"
          size="sm"
          icon="i-lucide-arrow-left"
          class="mb-3"
        >
          {{ t('sprint.title') }}
        </UButton>
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-lg font-semibold">{{ sprint.name }}</h2>
              <UBadge
                :color="sprint.status === 'active' ? 'success' : 'neutral'"
                variant="subtle"
              >
                {{ t(`sprint.${sprint.status}`) }}
              </UBadge>
            </div>
            <p v-if="sprint.goal" class="mt-1 text-sm text-[var(--color-midesk-muted)]">
              {{ sprint.goal }}
            </p>
            <p class="mt-2 text-sm text-[var(--color-midesk-muted)]">
              {{ formatDate(sprint.start_date) }} – {{ formatDate(sprint.end_date) }}
            </p>
          </div>
          <div class="text-end text-sm">
            <p class="font-medium">
              {{ sprint.completed_points }}/{{ sprint.total_points }} {{ t('sprint.points') }}
            </p>
            <div class="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
              <div
                class="h-full rounded-full bg-[var(--color-midesk-accent)]"
                :style="{ width: `${progressPercent}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <section class="midesk-card p-5">
        <h2 class="midesk-card-header">
          {{ t('sprint.tasks') }}
          <UBadge color="neutral" variant="subtle" size="xs" class="ms-2">
            {{ tasks.length }}
          </UBadge>
        </h2>
        <SprintBoard
          :tasks="tasks"
          @remove-from-sprint="handleRemoveFromSprint"
          @open-task="openTask"
        />
      </section>

      <TaskModal
        v-if="taskModalOpen && !openProjectTask"
        v-model:open="taskModalOpen"
        :task-id="activeTaskId"
      />
    </template>
  </div>
</template>
