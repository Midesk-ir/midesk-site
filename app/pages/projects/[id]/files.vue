<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const route = useRoute()
const projectId = computed(() => route.params.id as string)
</script>

<template>
  <div class="space-y-6">
    <ProjectProjectSubNav :project-id="projectId" />
    <FilesFileManager :project-id="projectId" />
  </div>
</template>
