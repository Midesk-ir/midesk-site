<script setup lang="ts">
const props = defineProps<{
  projectId: string
}>()

const route = useRoute()
const { t } = useI18n()

const links = computed(() => [
  {
    label: t('projects.tabs.kanban'),
    to: `/projects/${props.projectId}`,
    active: route.path === `/projects/${props.projectId}` || route.path === `/projects/${props.projectId}/`
  },
  {
    label: t('projects.tabs.sprints'),
    to: `/projects/${props.projectId}/sprints`,
    active: route.path.startsWith(`/projects/${props.projectId}/sprints`)
  },
  {
    label: t('projects.tabs.reports'),
    to: `/projects/${props.projectId}/reports`,
    active: route.path === `/projects/${props.projectId}/reports`
  },
  {
    label: t('projects.tabs.files'),
    to: `/projects/${props.projectId}/files`,
    active: route.path === `/projects/${props.projectId}/files`
  },
  {
    label: t('projects.tabs.settings'),
    to: `/projects/${props.projectId}/settings`,
    active: route.path === `/projects/${props.projectId}/settings`
  }
])
</script>

<template>
  <nav class="midesk-subnav">
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="midesk-subnav-link"
      :class="{ 'midesk-subnav-link--active': link.active }"
    >
      {{ link.label }}
    </NuxtLink>
  </nav>
</template>
