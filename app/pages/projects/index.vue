<script setup lang="ts">
import type { Project } from '~/types'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const { api } = useApi()

const projects = ref<Project[]>([])
const loading = ref(true)
const showCreate = ref(false)
const creating = ref(false)
const newProject = reactive({ name: '', description: '' })

async function load() {
  loading.value = true
  try {
    const data = await api<{ data: Project[] }>('/projects')
    projects.value = data.data
  } finally {
    loading.value = false
  }
}

async function createProject() {
  creating.value = true
  try {
    const project = await api<Project>('/projects', {
      method: 'POST',
      body: newProject
    })
    projects.value.unshift(project)
    showCreate.value = false
    newProject.name = ''
    newProject.description = ''
  } finally {
    creating.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <h1 class="midesk-page-title">{{ t('projects.title') }}</h1>
      <LayoutMideskPageHeaderActions>
        <LayoutMideskPageHeaderButton variant="primary" icon="i-lucide-plus" @click="showCreate = true">
          {{ t('projects.create') }}
        </LayoutMideskPageHeaderButton>
      </LayoutMideskPageHeaderActions>
    </div>

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <USkeleton v-for="i in 3" :key="i" class="h-40" />
    </div>

    <UiEmptyState
      v-else-if="!projects.length"
      :title="t('projects.emptyTitle')"
      :description="t('projects.emptyDesc')"
      icon="i-lucide-folder"
    >
      <template #action>
        <UButton color="primary" @click="showCreate = true">{{ t('projects.create') }}</UButton>
      </template>
    </UiEmptyState>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ProjectCard v-for="project in projects" :key="project.id" :project="project" />
    </div>

    <MideskModal v-model:open="showCreate" :title="t('projects.create')">
      <div class="midesk-form-fields midesk-form-panel">
        <MideskFormField :label="t('projects.name')" :model-value="newProject.name">
          <UInput v-model="newProject.name" placeholder=" " />
        </MideskFormField>
        <MideskFormField :label="t('projects.description')" :model-value="newProject.description">
          <UTextarea v-model="newProject.description" placeholder=" " />
        </MideskFormField>
      </div>
      <template #footer>
        <UButton variant="ghost" @click="showCreate = false">{{ t('common.cancel') }}</UButton>
        <UButton :loading="creating" color="primary" @click="createProject">
          {{ t('common.create') }}
        </UButton>
      </template>
    </MideskModal>
  </div>
</template>
