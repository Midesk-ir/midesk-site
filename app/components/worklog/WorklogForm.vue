<script setup lang="ts">
import type { CreateWorklogPayload, Worklog } from '~/types/phase1'
import type { Project, Task } from '~/types'

const props = defineProps<{
  worklog?: Worklog | null
  presetProjectId?: string
  presetTaskId?: string
  compact?: boolean
}>()

const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const { t } = useI18n()
const { api } = useApi()
const worklogStore = useWorklogStore()
const toast = useToast()

const projects = ref<Project[]>([])
const tasks = ref<Task[]>([])
const loadingTasks = ref(false)
const submitting = ref(false)

const form = reactive({
  project_id: '',
  task_id: undefined as string | undefined,
  hours: 0,
  minutes: 0,
  logged_date: new Date().toISOString().slice(0, 10),
  description: ''
})

const isEdit = computed(() => !!props.worklog)

async function loadProjects() {
  const data = await api<{ data: Project[] }>('/projects')
  projects.value = data.data
}

async function loadTasks(projectId: string) {
  if (!projectId) {
    tasks.value = []
    return
  }
  loadingTasks.value = true
  try {
    const data = await api<{ data: Task[] }>(`/projects/${projectId}/tasks`)
    tasks.value = data.data
  } finally {
    loadingTasks.value = false
  }
}

function resetForm() {
  form.project_id = ''
  form.task_id = undefined
  form.hours = 0
  form.minutes = 0
  form.logged_date = new Date().toISOString().slice(0, 10)
  form.description = ''
}

function fillFromWorklog(wl: Worklog) {
  form.project_id = wl.project_id
  form.task_id = wl.task_id ?? undefined
  form.hours = Math.floor(wl.duration_minutes / 60)
  form.minutes = wl.duration_minutes % 60
  form.logged_date = wl.logged_date
  form.description = wl.description ?? ''
}

watch(() => props.worklog, (wl) => {
  if (wl) fillFromWorklog(wl)
  else resetForm()
  applyPresets()
}, { immediate: true })

function applyPresets() {
  if (props.presetProjectId && !props.worklog) {
    form.project_id = props.presetProjectId
  }
  if (props.presetTaskId && !props.worklog) {
    form.task_id = props.presetTaskId
  }
}

watch(() => [props.presetProjectId, props.presetTaskId], applyPresets)

watch(() => form.project_id, (id) => {
  if (!props.presetTaskId) {
    form.task_id = undefined
  }
  if (id) loadTasks(id)
  else tasks.value = []
})

async function submit() {
  if (!form.project_id) return
  const duration_minutes = form.hours * 60 + form.minutes
  if (duration_minutes <= 0) return

  const payload: CreateWorklogPayload = {
    project_id: form.project_id,
    task_id: form.task_id,
    duration_minutes,
    logged_date: form.logged_date,
    description: form.description || undefined
  }

  submitting.value = true
  try {
    if (isEdit.value && props.worklog) {
      await worklogStore.update(props.worklog.id, payload)
    } else {
      await worklogStore.log(payload)
    }
    await worklogStore.fetchWeekSummary()
    if (!isEdit.value) {
      resetForm()
      applyPresets()
    }
    emit('saved')
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    submitting.value = false
  }
}

onMounted(loadProjects)
</script>

<template>
  <div :class="compact ? 'space-y-3' : 'midesk-card p-5'">
    <h2 v-if="!compact" class="midesk-card-header">
      {{ isEdit ? t('common.edit') : t('worklog.form.title') }}
    </h2>
    <form class="midesk-form-fields" @submit.prevent="submit">
      <MideskFormField
        v-if="!presetProjectId"
        :label="t('worklog.form.project')"
        :model-value="form.project_id"
        required
      >
        <USelectMenu
          v-model="form.project_id"
          value-key="value"
          :items="projects.map(p => ({ label: p.name, value: p.id }))"
        />
      </MideskFormField>

      <MideskFormField
        v-if="!presetTaskId"
        :label="t('worklog.form.task')"
        :model-value="form.task_id"
      >
        <USelectMenu
          v-model="form.task_id"
          value-key="value"
          :items="tasks.map(task => ({ label: task.title, value: task.id }))"
          :loading="loadingTasks"
          :disabled="!form.project_id"
        />
      </MideskFormField>

      <div class="grid gap-4 sm:grid-cols-2">
        <MideskFormField :label="t('worklog.form.date')" :model-value="form.logged_date" field-class="midesk-ltr-field" required>
          <MideskDatePicker v-model="form.logged_date" />
        </MideskFormField>
        <MideskFormField
          :label="t('worklog.form.duration')"
          :model-value="form.hours || form.minutes"
          required
          field-class="midesk-ltr-field"
        >
          <div class="flex gap-2">
            <UInput
              v-model.number="form.hours"
              type="number"
              min="0"
              placeholder=" "
            />
            <UInput
              v-model.number="form.minutes"
              type="number"
              min="0"
              max="59"
              placeholder=" "
            />
          </div>
        </MideskFormField>
      </div>

      <MideskFormField :label="t('worklog.form.description')" :model-value="form.description">
        <UTextarea v-model="form.description" :rows="3" placeholder=" " />
      </MideskFormField>

      <div class="flex justify-end gap-2">
        <UButton v-if="isEdit" variant="ghost" type="button" @click="emit('cancel')">
          {{ t('common.cancel') }}
        </UButton>
        <UButton type="submit" color="primary" :loading="submitting">
          {{ isEdit ? t('common.save') : t('worklog.form.submit') }}
        </UButton>
      </div>
    </form>
  </div>
</template>
