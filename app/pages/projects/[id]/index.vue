<script setup lang="ts">
const route = useRoute()

const openProjectTask = inject<(id: string) => void>('openProjectTask')!
</script>

<template>
  <KanbanBoard
    :project-id="route.params.id as string"
    @open-task="openProjectTask"
  />
</template>
