<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { ChecklistItem, Comment, Project, Task, TaskPriority, TaskStatus, User } from '~/types'
import type { Sprint } from '~/types/phase1'

const PRIORITY_META: Record<TaskPriority, { color: string, icon: string }> = {
  low: { color: '#6b7280', icon: 'i-lucide-arrow-down' },
  medium: { color: '#3b82f6', icon: 'i-lucide-minus' },
  high: { color: '#f59e0b', icon: 'i-lucide-arrow-up' },
  critical: { color: '#ef4444', icon: 'i-lucide-alert-triangle' }
}

const props = defineProps<{
  taskId: string
}>()

const open = defineModel<boolean>('open', { default: false })

const { api } = useApi()
const { t } = useI18n()
const { formatDate, formatDateTime, formatRelative, isOverdue } = useCalendar()
const { loadMembers, loadColumns, loadProject } = useTaskModalMeta()
const authStore = useAuthStore()
const toast = useToast()

const task = ref<Task | null>(null)
const project = ref<Project | null>(null)
const sprint = ref<Sprint | null>(null)
const sprints = ref<Sprint[]>([])
const columns = ref<Array<{ slug: string, name: string, color: string }>>([])
const comments = ref<Comment[]>([])
const members = ref<User[]>([])
const loading = ref(false)
const newComment = ref('')
const newChecklistItem = ref('')
const showWorklogForm = ref(false)
const mobileDetailsOpen = ref(false)
const titleDraft = ref('')
const descriptionDraft = ref('')
const commentSubmitting = ref(false)
const checklistSubmitting = ref(false)
const saveState = ref<'idle' | 'saving' | 'saved'>('idle')

const statusItems = computed(() =>
  columns.value.map(c => ({ label: c.name, value: c.slug }))
)

const statusColor = computed(() =>
  columns.value.find(c => c.slug === task.value?.status)?.color ?? '#6b7280'
)

const statusName = computed(() =>
  columns.value.find(c => c.slug === task.value?.status)?.name ?? task.value?.status ?? ''
)

const isDone = computed(() => task.value?.status === 'done')

const shortTaskId = computed(() => props.taskId.slice(0, 8).toUpperCase())

const checklistDone = computed(() =>
  task.value?.checklist.filter(c => c.is_done).length ?? 0
)

const checklistPercent = computed(() => {
  if (!task.value?.checklist.length) return 0
  return Math.round((checklistDone.value / task.value.checklist.length) * 100)
})

const priorityMeta = computed(() =>
  task.value ? PRIORITY_META[task.value.priority as TaskPriority] : PRIORITY_META.medium
)

const currentUser = computed(() => authStore.user)

function unwrapList<T>(payload: T[] | { data: T[] } | null | undefined): T[] {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.data)) return payload.data
  return []
}

function normalizeComment(raw: unknown): Comment {
  const r = raw as Record<string, unknown>
  const author = (r.user ?? r.author) as Record<string, unknown> | null | undefined
  const name = author?.name ?? author?.full_name ?? '—'
  return {
    id: String(r.id ?? ''),
    body: String(r.body ?? ''),
    created_at: String(r.created_at ?? ''),
    mentions: (r.mentions as string[] | undefined) ?? [],
    user: {
      id: String(author?.id ?? ''),
      name: String(name),
      avatar_url: (author?.avatar_url as string | null) ?? null
    }
  }
}

async function load() {
  loading.value = true
  try {
    const taskData = await api<Task>(`/tasks/${props.taskId}`)
    const [commentsData, membersData, columnsData, projectData, sprintsData] = await Promise.all([
      api<{ data: Comment[] }>(`/tasks/${props.taskId}/comments`),
      loadMembers(),
      loadColumns(taskData.project_id),
      loadProject(taskData.project_id),
      api<Sprint[] | { data: Sprint[] }>(`/projects/${taskData.project_id}/sprints`).catch(() => [])
    ])

    task.value = {
      ...taskData,
      checklist: taskData.checklist ?? [],
      labels: taskData.labels ?? [],
      comments_count: taskData.comments_count ?? (taskData as Task & { comment_count?: number }).comment_count ?? 0
    }
    project.value = projectData
    titleDraft.value = taskData.title
    descriptionDraft.value = taskData.description ?? ''
    comments.value = unwrapList(commentsData).map(normalizeComment)
    members.value = membersData
    columns.value = columnsData
    sprints.value = unwrapList(sprintsData)
    sprint.value = sprints.value.find(s => s.id === taskData.sprint_id) ?? null
  } finally {
    loading.value = false
  }
}

async function saveField(field: Partial<Task>) {
  if (!task.value) return
  saveState.value = 'saving'
  try {
    task.value = await api<Task>(`/tasks/${props.taskId}`, {
      method: 'PATCH',
      body: field
    })
    saveState.value = 'saved'
    setTimeout(() => {
      if (saveState.value === 'saved') saveState.value = 'idle'
    }, 1800)
  } catch {
    saveState.value = 'idle'
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function assignSprint(sprintId: string | null) {
  if (!task.value) return
  saveState.value = 'saving'
  const previousSprintId = task.value.sprint_id
  const previousSprint = sprint.value
  task.value = { ...task.value, sprint_id: sprintId }
  sprint.value = sprintId ? sprints.value.find(s => s.id === sprintId) ?? null : null
  try {
    const updated = await api<Task | { data: Task }>(`/tasks/${props.taskId}/sprint`, {
      method: 'PATCH',
      body: { sprint_id: sprintId }
    })
    const nextTask = unwrapTask(updated)
    task.value = {
      ...task.value,
      ...nextTask,
      checklist: nextTask.checklist ?? task.value.checklist ?? [],
      labels: nextTask.labels ?? task.value.labels ?? []
    }
    sprint.value = sprintId ? sprints.value.find(s => s.id === sprintId) ?? sprint.value : null
    saveState.value = 'saved'
    setTimeout(() => {
      if (saveState.value === 'saved') saveState.value = 'idle'
    }, 1800)
  } catch {
    task.value = { ...task.value, sprint_id: previousSprintId }
    sprint.value = previousSprint
    saveState.value = 'idle'
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

function saveTitle() {
  if (!task.value || titleDraft.value.trim() === task.value.title) return
  saveField({ title: titleDraft.value.trim() })
}

const debouncedSaveDescription = useDebounceFn((value: string) => {
  if (!task.value || value === (task.value.description ?? '')) return
  saveField({ description: value })
}, 650)

watch(descriptionDraft, value => debouncedSaveDescription(value))

async function toggleComplete() {
  if (!task.value) return
  const next: TaskStatus = isDone.value ? 'todo' : 'done'
  await saveField({ status: next })
}

function unwrapTask(payload: Task | { data: Task }): Task {
  return 'data' in payload && payload.data ? payload.data : payload as Task
}

async function toggleChecklistItem(item: ChecklistItem, isDone: boolean) {
  if (!task.value || checklistSubmitting.value) return
  if (item.is_done === isDone) return

  checklistSubmitting.value = true
  const previous = task.value.checklist.map(c => ({ ...c }))
  task.value.checklist = task.value.checklist.map(c =>
    c.id === item.id ? { ...c, is_done: isDone } : c
  )

  try {
    const updated = await api<Task | { data: Task }>(`/tasks/${props.taskId}/checklist`, {
      method: 'PATCH',
      body: { id: item.id, is_done: isDone }
    })
    const nextTask = unwrapTask(updated)
    if (Array.isArray(nextTask.checklist)) {
      task.value.checklist = nextTask.checklist
    }
  } catch {
    task.value.checklist = previous
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    checklistSubmitting.value = false
  }
}

async function addComment() {
  if (!newComment.value.trim() || commentSubmitting.value) return
  commentSubmitting.value = true
  try {
    const comment = await api<Comment>(`/tasks/${props.taskId}/comments`, {
      method: 'POST',
      body: { body: newComment.value }
    })
    comments.value.push(normalizeComment(comment))
    newComment.value = ''
    if (task.value) task.value.comments_count++
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    commentSubmitting.value = false
  }
}

async function addChecklistItem() {
  if (!newChecklistItem.value.trim() || !task.value || checklistSubmitting.value) return
  checklistSubmitting.value = true
  const title = newChecklistItem.value.trim()
  newChecklistItem.value = ''
  try {
    const updated = await api<Task | { data: Task }>(`/tasks/${props.taskId}/checklist`, {
      method: 'POST',
      body: { title }
    })
    const nextTask = unwrapTask(updated)
    if (Array.isArray(nextTask.checklist)) {
      task.value.checklist = nextTask.checklist
    }
  } catch {
    newChecklistItem.value = title
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    checklistSubmitting.value = false
  }
}

watch(() => props.taskId, () => {
  if (open.value) load()
})

watch(open, (v) => {
  if (v) {
    showWorklogForm.value = false
    mobileDetailsOpen.value = false
    task.value = null
    project.value = null
    sprint.value = null
    sprints.value = []
    titleDraft.value = ''
    descriptionDraft.value = ''
    saveState.value = 'idle'
    loading.value = true
    load()
  }
}, { immediate: true })
</script>

<template>
  <MideskModal
    v-model:open="open"
    :title="task?.title ?? t('task.details')"
    :ui="{
      content: 'midesk-task-modal',
      body: 'midesk-task-modal-body',
      header: 'midesk-task-modal-header'
    }"
  >
    <template #header>
      <div v-if="loading" class="task-modal-toolbar w-full">
        <USkeleton class="h-4 w-40" />
      </div>
      <div v-else class="task-modal-toolbar w-full">
        <div class="task-modal-toolbar-start">
          <NuxtLink
            v-if="project"
            :to="`/projects/${project.id}`"
            class="task-modal-project-link"
            @click.stop
          >
            <UIcon name="i-lucide-kanban-square" class="size-3.5 shrink-0" />
            <span class="truncate">{{ project.name }}</span>
          </NuxtLink>
          <span class="task-modal-task-id">#{{ shortTaskId }}</span>
        </div>
        <p v-if="task" class="task-modal-toolbar-meta">
          {{ formatRelative(task.updated_at) }}
        </p>
      </div>
    </template>

    <div v-if="loading || !task" class="task-modal-loading">
      <div class="task-modal-loading-hero">
        <USkeleton class="size-7 rounded-full" />
        <USkeleton class="h-8 w-2/3" />
      </div>
      <div class="task-modal-loading-grid">
        <div class="space-y-3">
          <USkeleton class="h-24 w-full rounded-lg" />
          <USkeleton class="h-32 w-full rounded-lg" />
        </div>
        <USkeleton class="hidden h-64 rounded-lg md:block" />
      </div>
    </div>

    <div
      v-else
      class="task-modal-content"
      :style="{ '--task-status-color': statusColor }"
    >
      <div class="task-modal-hero">
        <button
          type="button"
          class="task-modal-complete"
          :class="{ 'task-modal-complete--done': isDone }"
          :title="isDone ? t('task.markIncomplete') : t('task.markComplete')"
          @click="toggleComplete"
        >
          <UIcon
            :name="isDone ? 'i-lucide-check-circle-2' : 'i-lucide-circle'"
            class="size-7"
          />
        </button>

        <div class="task-modal-hero-body">
          <textarea
            v-model="titleDraft"
            rows="1"
            class="task-modal-title"
            :placeholder="t('task.title')"
            @blur="saveTitle"
            @keydown.enter.prevent="($event.target as HTMLTextAreaElement).blur()"
          />

          <div class="task-modal-hero-meta">
            <span
              class="task-modal-status-badge"
              :style="{
                color: statusColor,
                backgroundColor: `color-mix(in srgb, ${statusColor} 18%, transparent)`,
                borderColor: `color-mix(in srgb, ${statusColor} 40%, transparent)`
              }"
            >
              {{ statusName }}
            </span>

            <span
              v-if="task.assignee"
              class="task-modal-meta-chip"
            >
              <UAvatar
                :alt="task.assignee.name"
                size="2xs"
                icon="i-lucide-user"
              />
              {{ task.assignee.name }}
            </span>

            <span
              v-if="task.due_date"
              class="task-modal-meta-chip"
              :class="{ 'task-modal-meta-chip--danger': isOverdue(task.due_date) }"
            >
              <UIcon name="i-lucide-calendar" class="size-3.5" />
              {{ formatDate(task.due_date) }}
            </span>
          </div>
        </div>
      </div>

      <div class="task-modal-body-grid">
        <div class="task-modal-main">
          <div class="task-modal-mobile-details md:hidden">
            <button
              type="button"
              class="task-modal-details-toggle"
              @click="mobileDetailsOpen = !mobileDetailsOpen"
            >
              <span class="flex items-center gap-2">
                <UIcon name="i-lucide-sliders-horizontal" class="size-4" />
                {{ t('task.detailsPanel') }}
              </span>
              <UIcon
                name="i-lucide-chevron-down"
                class="size-4 transition-transform duration-200"
                :class="{ 'rotate-180': mobileDetailsOpen }"
              />
            </button>
            <div v-show="mobileDetailsOpen" class="task-modal-details-panel">
              <TaskModalDetails
                :task="task"
                :members="members"
                :columns="columns"
                :status-items="statusItems"
                :sprint="sprint"
                :sprints="sprints"
                :priority-meta="priorityMeta"
                @save="saveField"
                @assign-sprint="assignSprint"
              />
              <UButton
                icon="i-lucide-clock"
                variant="soft"
                size="sm"
                block
                class="mt-3"
                @click="showWorklogForm = !showWorklogForm"
              >
                {{ t('task.logTime') }}
              </UButton>
              <WorklogForm
                v-if="showWorklogForm"
                compact
                :preset-project-id="task.project_id"
                :preset-task-id="task.id"
                @saved="showWorklogForm = false"
                @cancel="showWorklogForm = false"
              />
            </div>
          </div>

          <section class="task-modal-section">
            <div class="task-modal-section-icon">
              <UIcon name="i-lucide-align-right" class="size-4" />
            </div>
            <div class="task-modal-section-body">
              <div class="task-modal-section-head">
                <h3>{{ t('task.description') }}</h3>
                <span v-if="saveState !== 'idle'" class="task-modal-save-hint">
                  {{ saveState === 'saving' ? t('task.saving') : t('task.saved') }}
                </span>
              </div>
              <textarea
                v-model="descriptionDraft"
                rows="4"
                class="task-modal-description"
                :placeholder="t('task.addDescription')"
              />
            </div>
          </section>

          <section class="task-modal-section">
            <div class="task-modal-section-icon">
              <UIcon name="i-lucide-list-checks" class="size-4" />
            </div>
            <div class="task-modal-section-body">
              <div class="task-modal-section-head">
                <h3>{{ t('task.checklist') }}</h3>
                <span v-if="task.checklist.length" class="task-modal-section-count">
                  {{ checklistDone }}/{{ task.checklist.length }}
                </span>
              </div>

              <div v-if="task.checklist.length" class="task-modal-progress">
                <div
                  class="task-modal-progress-fill"
                  :style="{ width: `${checklistPercent}%` }"
                />
              </div>

              <div v-if="task.checklist.length" class="task-modal-checklist">
                <div
                  v-for="item in task.checklist"
                  :key="item.id"
                  class="task-modal-checklist-row"
                  @click="toggleChecklistItem(item, !item.is_done)"
                >
                  <UCheckbox
                    :model-value="item.is_done"
                    :disabled="checklistSubmitting"
                    tabindex="-1"
                    @click.stop
                    @update:model-value="(v: boolean | 'indeterminate') => toggleChecklistItem(item, v === true)"
                  />
                  <span :class="{ 'task-modal-checklist-done': item.is_done }">
                    {{ item.title }}
                  </span>
                </div>
              </div>
              <p v-else class="task-modal-empty">{{ t('task.noChecklist') }}</p>

              <div class="task-modal-inline-add">
                <UInput
                  v-model="newChecklistItem"
                  size="sm"
                  :placeholder="t('task.addChecklistItem')"
                  class="flex-1"
                  @keydown.enter.prevent="addChecklistItem"
                />
                <UButton
                  size="sm"
                  variant="soft"
                  icon="i-lucide-plus"
                  :disabled="!newChecklistItem.trim()"
                  @click="addChecklistItem"
                />
              </div>
            </div>
          </section>

          <section class="task-modal-section">
            <div class="task-modal-section-icon">
              <UIcon name="i-lucide-messages-square" class="size-4" />
            </div>
            <div class="task-modal-section-body">
              <div class="task-modal-section-head">
                <h3>{{ t('task.activity') }}</h3>
                <span v-if="comments.length" class="task-modal-section-count">
                  {{ comments.length }}
                </span>
              </div>

              <div v-if="comments.length" class="task-modal-activity">
                <article
                  v-for="comment in comments"
                  :key="comment.id"
                  class="task-modal-activity-item"
                >
                  <UAvatar
                    :alt="comment.user?.name ?? ''"
                    size="sm"
                    icon="i-lucide-user"
                    class="shrink-0"
                  />
                  <div class="task-modal-activity-bubble">
                    <div class="task-modal-activity-meta">
                      <span class="task-modal-activity-author">{{ comment.user?.name ?? '—' }}</span>
                      <span>{{ formatDateTime(comment.created_at) }}</span>
                    </div>
                    <p>{{ comment.body }}</p>
                  </div>
                </article>
              </div>
              <p v-else class="task-modal-empty">{{ t('task.noComments') }}</p>

              <div class="task-modal-compose">
                <UAvatar
                  v-if="currentUser"
                  :alt="currentUser.name"
                  size="sm"
                  icon="i-lucide-user"
                  class="shrink-0"
                />
                <div class="task-modal-compose-inner">
                  <textarea
                    v-model="newComment"
                    rows="2"
                    class="task-modal-compose-input"
                    :placeholder="t('task.addComment')"
                    @keydown.meta.enter.prevent="addComment"
                    @keydown.ctrl.enter.prevent="addComment"
                  />
                  <div class="task-modal-compose-foot">
                    <UButton
                      size="sm"
                      color="primary"
                      variant="soft"
                      icon="i-lucide-send"
                      class="task-modal-action-btn task-modal-action-btn--primary"
                      :loading="commentSubmitting"
                      :disabled="!newComment.trim()"
                      @click="addComment"
                    >
                      {{ t('task.postComment') }}
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside class="task-modal-aside hidden md:block">
          <p class="task-modal-aside-title">{{ t('task.detailsPanel') }}</p>
          <TaskModalDetails
            :task="task"
            :members="members"
            :columns="columns"
            :status-items="statusItems"
            :sprint="sprint"
            :sprints="sprints"
            :priority-meta="priorityMeta"
            @save="saveField"
            @assign-sprint="assignSprint"
          />

          <div class="task-modal-aside-divider" />

          <UButton
            icon="i-lucide-clock"
            variant="soft"
            size="sm"
            block
            @click="showWorklogForm = !showWorklogForm"
          >
            {{ t('task.logTime') }}
          </UButton>

          <WorklogForm
            v-if="showWorklogForm"
            compact
            :preset-project-id="task.project_id"
            :preset-task-id="task.id"
            @saved="showWorklogForm = false"
            @cancel="showWorklogForm = false"
          />
        </aside>
      </div>
    </div>
  </MideskModal>
</template>
