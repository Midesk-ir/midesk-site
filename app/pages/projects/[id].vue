<script setup lang="ts">
import type { Project } from '~/types'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const route = useRoute()
const { api } = useApi()

const projectId = computed(() => route.params.id as string)
const project = ref<Project | null>(null)
const loading = ref(true)

const taskModalOpen = ref(false)
const activeTaskId = ref('')

provide('projectId', projectId)
provide('openProjectTask', (id: string) => {
  activeTaskId.value = id
  taskModalOpen.value = true
})

async function loadProject() {
  loading.value = true
  try {
    project.value = await api<Project>(`/projects/${projectId.value}`)
  } finally {
    loading.value = false
  }
}

watch(projectId, loadProject)
onMounted(loadProject)
</script>

<template>
  <div>
    <div v-if="loading">
      <USkeleton class="mb-4 h-10 w-1/3" />
      <USkeleton class="h-96 w-full" />
    </div>

    <template v-else-if="project">
      <div class="mb-6 min-w-0">
        <h1 class="midesk-page-title">{{ project.name }}</h1>
        <p v-if="project.description" class="mt-1 text-sm text-muted">{{ project.description }}</p>
      </div>

      <ProjectSubNav :project-id="projectId" />

      <NuxtPage />

      <TaskModal
        v-if="taskModalOpen"
        v-model:open="taskModalOpen"
        :task-id="activeTaskId"
      />
    </template>
  </div>
</template>
