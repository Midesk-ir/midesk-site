<script setup lang="ts">
import type { CreateSprintPayload } from '~/types/phase1'
import type { Task } from '~/types'
import { storeToRefs } from 'pinia'

definePageMeta({ middleware: ['auth', 'tenant'] })

const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const sprintStore = useSprintStore()
const { sprints, backlog, loading } = storeToRefs(sprintStore)

const projectId = inject<ComputedRef<string>>('projectId', computed(() => route.params.id as string))
const openProjectTask = inject<(id: string) => void>('openProjectTask')
const pageLoading = ref(true)

const showCreateForm = ref(false)
const creatingSprint = ref(false)

const showActivateModal = ref(false)
const activateTargetId = ref('')
const showCloseModal = ref(false)
const closeTargetId = ref('')
const closeMoveTo = ref<'backlog' | string>('backlog')
const actionLoading = ref(false)

const taskModalOpen = ref(false)
const activeTaskId = ref('')

const sortedSprints = computed(() =>
  [...sprints.value]
    .filter((sprint): sprint is NonNullable<typeof sprint> => Boolean(sprint?.id))
    .sort((a, b) => Date.parse(b.start_date) - Date.parse(a.start_date))
)

const nextPlanningSprint = computed(() =>
  sprints.value.find(s => s.status === 'planning' && s.id !== closeTargetId.value)
)

async function load() {
  pageLoading.value = true
  try {
    await Promise.all([
      sprintStore.fetchSprints(projectId.value),
      sprintStore.fetchBacklog(projectId.value)
    ])
  } finally {
    pageLoading.value = false
  }
}

async function handleCreate(payload: CreateSprintPayload) {
  if (creatingSprint.value) return
  creatingSprint.value = true
  try {
    await sprintStore.createSprint(projectId.value, {
      ...payload,
      start_date: `${payload.start_date}T00:00:00Z`,
      end_date: `${payload.end_date}T00:00:00Z`
    })
    showCreateForm.value = false
    await nextTick()
    toast.add({ title: t('sprint.created'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    creatingSprint.value = false
  }
}

async function handleAssign(taskId: string, sprintId: string) {
  try {
    await sprintStore.assignTask(taskId, sprintId)
    await sprintStore.fetchSprints(projectId.value)
  } catch {
    await Promise.all([
      sprintStore.fetchBacklog(projectId.value),
      sprintStore.fetchSprints(projectId.value)
    ])
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function handleRemoveFromSprint(taskId: string) {
  try {
    await sprintStore.assignTask(taskId, null)
    await sprintStore.fetchSprints(projectId.value)
  } catch {
    await sprintStore.fetchBacklog(projectId.value)
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function confirmActivate() {
  if (!activateTargetId.value) return
  actionLoading.value = true
  try {
    await sprintStore.activate(projectId.value, activateTargetId.value)
    showActivateModal.value = false
    activateTargetId.value = ''
    toast.add({ title: t('sprint.activate'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    actionLoading.value = false
  }
}

async function confirmClose() {
  if (!closeTargetId.value) return
  actionLoading.value = true
  try {
    await sprintStore.close(projectId.value, closeTargetId.value, {
      move_to: closeMoveTo.value
    })
    showCloseModal.value = false
    closeTargetId.value = ''
    await Promise.all([
      sprintStore.fetchSprints(projectId.value),
      sprintStore.fetchBacklog(projectId.value)
    ])
    toast.add({ title: t('sprint.close'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    actionLoading.value = false
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

function startActivate(sprintId: string) {
  activateTargetId.value = sprintId
  if (sprintStore.activeSprint && sprintStore.activeSprint.id !== sprintId) {
    showActivateModal.value = true
  } else {
    confirmActivate()
  }
}

function startClose(sprintId: string) {
  closeTargetId.value = sprintId
  closeMoveTo.value = 'backlog'
  showCloseModal.value = true
}

function updateBacklog(tasks: Task[]) {
  backlog.value = tasks
}

onMounted(load)
</script>

<template>
  <div>
    <div v-if="pageLoading" class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <USkeleton class="midesk-skeleton-line h-7 w-40" />
        <USkeleton class="midesk-skeleton-line h-9 w-28 rounded-lg" />
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <UiSkeletonCard :rows="3" row-class="h-36 rounded-xl" />
        <div class="midesk-card p-5">
          <div class="mb-4 flex items-center justify-between">
            <USkeleton class="midesk-skeleton-line h-5 w-24" />
            <USkeleton class="midesk-skeleton-line h-5 w-8 rounded-full" />
          </div>
          <div class="space-y-2">
            <USkeleton v-for="i in 5" :key="i" class="midesk-skeleton-row" />
          </div>
        </div>
      </div>
    </div>

    <template v-else>
      <div class="midesk-page-header">
        <h2 class="text-lg font-semibold">{{ t('sprint.title') }}</h2>
        <LayoutMideskPageHeaderActions>
          <LayoutMideskPageHeaderButton
            variant="primary"
            icon="i-lucide-plus"
            @click="showCreateForm = true"
          >
            {{ t('sprint.create') }}
          </LayoutMideskPageHeaderButton>
        </LayoutMideskPageHeaderActions>
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <section class="midesk-card p-5">
          <div v-if="loading" class="space-y-3">
            <USkeleton v-for="i in 3" :key="i" class="h-36 rounded-xl" />
          </div>

          <UiEmptyState
            v-else-if="!sortedSprints.length"
            :title="t('sprint.emptyTitle')"
            :description="t('sprint.emptyDesc')"
            icon="i-lucide-zap"
          >
            <template #action>
              <UButton color="primary" @click="showCreateForm = true">
                {{ t('sprint.create') }}
              </UButton>
            </template>
          </UiEmptyState>

          <div v-else class="space-y-3">
            <SprintCard
              v-for="sprint in sortedSprints"
              :key="sprint.id"
              :sprint="sprint"
              droppable
              @assign="handleAssign($event, sprint.id)"
              @activate="startActivate(sprint.id)"
              @close="startClose(sprint.id)"
            />
          </div>
        </section>

        <SprintBacklogList
          :tasks="backlog"
          :loading="loading"
          @update:tasks="updateBacklog"
          @remove-from-sprint="handleRemoveFromSprint"
          @open-task="openTask"
        />
      </div>
    </template>

    <SprintForm
      v-if="!pageLoading"
      v-model:open="showCreateForm"
      :loading="creatingSprint"
      @save="handleCreate"
    />

    <MideskModal
      v-if="!pageLoading"
      v-model:open="showActivateModal"
      :title="t('sprint.activate')"
      :description="t('sprint.confirmActivate')"
      :ui="{ content: 'sm:max-w-md' }"
    >
      <template #footer>
        <UButton variant="ghost" @click="showActivateModal = false">
          {{ t('common.cancel') }}
        </UButton>
        <UButton :loading="actionLoading" color="primary" @click="confirmActivate">
          {{ t('sprint.activate') }}
        </UButton>
      </template>
    </MideskModal>

    <MideskModal
      v-if="!pageLoading"
      v-model:open="showCloseModal"
      :title="t('sprint.close')"
      :description="t('sprint.confirmClose')"
      :ui="{ content: 'sm:max-w-md' }"
    >
      <MideskFormField :label="t('sprint.moveToBacklog')" :model-value="closeMoveTo">
        <USelect
          v-model="closeMoveTo"
          :items="[
            { label: t('sprint.backlog'), value: 'backlog' },
            ...(nextPlanningSprint
              ? [{ label: nextPlanningSprint.name, value: nextPlanningSprint.id }]
              : [])
          ]"
        />
      </MideskFormField>
      <template #footer>
        <UButton variant="ghost" @click="showCloseModal = false">
          {{ t('common.cancel') }}
        </UButton>
        <UButton :loading="actionLoading" color="primary" @click="confirmClose">
          {{ t('sprint.close') }}
        </UButton>
      </template>
    </MideskModal>

    <TaskModal
      v-if="!pageLoading && taskModalOpen && !openProjectTask"
      v-model:open="taskModalOpen"
      :task-id="activeTaskId"
    />
  </div>
</template>
