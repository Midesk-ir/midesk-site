<script setup lang="ts">
import type { ChecklistItem, Comment, Task, User } from '~/types'
import type { Sprint } from '~/types/phase1'

const props = defineProps<{
  taskId: string
}>()

const open = defineModel<boolean>('open', { default: false })

const { api } = useApi()
const { t } = useI18n()
const { formatDateTime } = useCalendar()
const toast = useToast()

const task = ref<Task | null>(null)
const sprint = ref<Sprint | null>(null)
const columns = ref<Array<{ slug: string, name: string }>>([])
const comments = ref<Comment[]>([])
const members = ref<User[]>([])
const labels = ref<Array<{ id: string, name: string, color: string }>>([])
const loading = ref(false)
const newComment = ref('')
const newChecklistItem = ref('')
const showWorklogForm = ref(false)

const statusItems = computed(() =>
  columns.value.map(c => ({ label: c.name, value: c.slug }))
)

const modalTitle = computed(() => {
  if (loading.value) return t('common.loading')
  return task.value?.title ?? t('task.details')
})

async function load() {
  loading.value = true
  try {
    const taskData = await api<Task>(`/tasks/${props.taskId}`)
    const [commentsData, membersData, labelsData, columnsData] = await Promise.all([
      api<{ data: Comment[] }>(`/tasks/${props.taskId}/comments`),
      api<{ data: User[] }>('/members'),
      api<{ data: typeof labels.value }>('/tasks/labels/all'),
      api<{ data: Array<{ slug: string, name: string }> }>(`/projects/${taskData.project_id}/columns`)
    ])
    task.value = taskData
    comments.value = commentsData.data
    members.value = membersData.data
    labels.value = labelsData.data
    columns.value = columnsData.data

    if (taskData.sprint_id) {
      try {
        const sprintData = await api<{ data: { sprint: Sprint } }>(
          `/projects/${taskData.project_id}/sprints/${taskData.sprint_id}`
        )
        sprint.value = sprintData.data.sprint
      } catch {
        sprint.value = null
      }
    } else {
      sprint.value = null
    }
  } finally {
    loading.value = false
  }
}

async function saveField(field: Partial<Task>) {
  if (!task.value) return
  try {
    task.value = await api<Task>(`/tasks/${props.taskId}`, {
      method: 'PATCH',
      body: field
    })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function addComment() {
  if (!newComment.value.trim()) return
  const comment = await api<Comment>(`/tasks/${props.taskId}/comments`, {
    method: 'POST',
    body: { body: newComment.value }
  })
  comments.value.push(comment)
  newComment.value = ''
  if (task.value) task.value.comments_count++
}

async function addChecklistItem() {
  if (!newChecklistItem.value.trim() || !task.value) return
  const item = await api<ChecklistItem>(`/tasks/${props.taskId}/checklist`, {
    method: 'POST',
    body: { title: newChecklistItem.value }
  })
  task.value.checklist.push(item)
  newChecklistItem.value = ''
}

watch(() => props.taskId, () => {
  if (open.value) load()
})

watch(open, (v) => {
  if (v) {
    showWorklogForm.value = false
    task.value = null
    loading.value = true
    load()
  }
}, { immediate: true })
</script>

<template>
  <MideskModal
    v-model:open="open"
    :title="modalTitle"
    :ui="{ content: 'sm:max-w-2xl' }"
  >
    <div v-if="loading || !task" class="space-y-4">
      <USkeleton class="h-8 w-2/3" />
      <USkeleton class="h-32 w-full" />
    </div>

    <div v-else class="space-y-6">
        <MideskFormField :label="t('task.title')" :model-value="task.title">
          <UInput
            :model-value="task.title"
            placeholder=" "
            @blur="(e: FocusEvent) => saveField({ title: (e.target as HTMLInputElement).value })"
          />
        </MideskFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <MideskFormField :label="t('task.status')" :model-value="task.status">
            <USelect
              :model-value="task.status"
              :items="statusItems.length ? statusItems : [{ label: task.status, value: task.status }]"
              @update:model-value="saveField({ status: $event as Task['status'] })"
            />
          </MideskFormField>

          <MideskFormField :label="t('task.priority')" :model-value="task.priority">
            <USelect
              :model-value="task.priority"
              :items="(['low','medium','high','critical'] as const).map(p => ({
                label: t(`task.priorities.${p}`),
                value: p
              }))"
              @update:model-value="saveField({ priority: $event as Task['priority'] })"
            />
          </MideskFormField>

          <MideskFormField :label="t('task.assignee')" :model-value="task.assignee?.id ?? 'none'">
            <USelect
              :model-value="task.assignee?.id ?? 'none'"
              :items="[
                { label: t('task.unassigned'), value: 'none' },
                ...members.map(m => ({ label: m.name, value: m.id }))
              ]"
              @update:model-value="(v: string) => {
                const user = members.find(m => m.id === v)
                saveField({ assignee: user ? { id: user.id, name: user.name, avatar_url: user.avatar_url } : null })
              }"
            />
          </MideskFormField>

          <MideskFormField
            :label="t('task.dueDate')"
            :model-value="task.due_date?.slice(0, 10)"
            field-class="midesk-ltr-field"
          >
            <UInput
              type="date"
              :model-value="task.due_date?.slice(0, 10) ?? ''"
              @update:model-value="saveField({ due_date: $event ? `${$event}T00:00:00Z` : null })"
            />
          </MideskFormField>

          <MideskFormField
            :label="t('task.storyPoints')"
            :model-value="task.story_points != null ? String(task.story_points) : ''"
            field-class="midesk-ltr-field"
          >
            <UInput
              type="number"
              min="0"
              placeholder=" "
              :model-value="task.story_points != null ? String(task.story_points) : ''"
              @update:model-value="(v: string | number) => saveField({
                story_points: v === '' || v == null ? null : Number(v)
              })"
            />
          </MideskFormField>

          <MideskFormField :label="t('task.sprint')" :model-value="sprint?.name">
            <div class="flex min-h-10 items-center pt-1">
              <NuxtLink
                v-if="sprint"
                :to="`/projects/${task.project_id}/sprints`"
                class="midesk-link inline-flex items-center gap-1 text-sm"
              >
                <UIcon name="i-lucide-zap" class="size-4" />
                {{ sprint.name }}
              </NuxtLink>
              <span v-else class="text-sm text-muted">—</span>
            </div>
          </MideskFormField>
        </div>

        <div class="mb-6">
          <UButton
            icon="i-lucide-clock"
            variant="soft"
            size="sm"
            @click="showWorklogForm = !showWorklogForm"
          >
            {{ t('task.logTime') }}
          </UButton>

          <WorklogForm
            v-if="showWorklogForm"
            compact
            :preset-project-id="task.project_id"
            :preset-task-id="task.id"
            class="mt-3"
            @saved="showWorklogForm = false"
            @cancel="showWorklogForm = false"
          />
        </div>

        <MideskFormField :label="t('task.description')" :model-value="task.description" field-class="mb-6">
          <UTextarea
            :model-value="task.description ?? ''"
            :rows="3"
            placeholder=" "
            @blur="(e: FocusEvent) => saveField({ description: (e.target as HTMLTextAreaElement).value })"
          />
        </MideskFormField>

        <div class="mb-6">
          <h4 class="mb-2 text-sm font-medium">{{ t('task.checklist') }}</h4>
          <div class="space-y-2">
            <label
              v-for="item in task.checklist"
              :key="item.id"
              class="flex items-center gap-2 text-sm"
            >
              <UCheckbox :model-value="item.is_done" disabled />
              {{ item.title }}
            </label>
          </div>
          <div class="mt-2 flex gap-2">
            <UInput v-model="newChecklistItem" size="sm" :placeholder="t('task.addChecklistItem')" />
            <UButton size="sm" @click="addChecklistItem">
              {{ t('common.create') }}
            </UButton>
          </div>
        </div>

        <div>
          <h4 class="mb-2 text-sm font-medium">{{ t('task.comments') }}</h4>
          <div class="space-y-3 mb-4">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="rounded-lg bg-white/5 p-3"
            >
              <div class="mb-1 flex items-center gap-2 text-xs text-muted">
                <span class="font-medium text-[var(--color-midesk-text)]">{{ comment.user.name }}</span>
                <span>{{ formatDateTime(comment.created_at) }}</span>
              </div>
              <p class="text-sm">{{ comment.body }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <UInput v-model="newComment" :placeholder="t('task.addComment')" class="flex-1" />
            <UButton @click="addComment">
              {{ t('common.save') }}
            </UButton>
          </div>
        </div>
      </div>
  </MideskModal>
</template>
