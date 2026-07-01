<script setup lang="ts">
import type { ProjectFile, ProjectFolder } from '~/types/phase5'
import { storeApi } from '~/utils/api-client'

const route = useRoute()
const projectId = computed(() => route.params.id as string)

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
</script>

<template>
  <div class="space-y-6">
    <ProjectProjectSubNav :project-id="projectId" />
    <FilesFileManager :project-id="projectId" />
  </div>
</template>
