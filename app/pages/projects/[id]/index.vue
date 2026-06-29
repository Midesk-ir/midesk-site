<script setup lang="ts">
import type { Task } from '~/types'

const route = useRoute()
const { t } = useI18n()
const { api } = useApi()

const projectId = inject<ComputedRef<string>>('projectId')!
const openProjectTask = inject<(id: string) => void>('openProjectTask')!

const newTaskTitle = ref('')

async function createTask() {
  if (!newTaskTitle.value.trim()) return
  const task = await api<Task>(`/projects/${projectId.value}/tasks`, {
    method: 'POST',
    body: { title: newTaskTitle.value }
  })
  newTaskTitle.value = ''
  openProjectTask(task.id)
}
</script>

<template>
  <div>
    <div class="mb-4 flex justify-end gap-2">
      <UInput v-model="newTaskTitle" :placeholder="t('kanban.newTask')" class="w-48" />
      <UButton color="primary" icon="i-lucide-plus" @click="createTask">
        {{ t('kanban.newTask') }}
      </UButton>
    </div>

    <KanbanBoard
      :project-id="route.params.id as string"
      @open-task="openProjectTask"
    />
  </div>
</template>
