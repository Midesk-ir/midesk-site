<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const route = useRoute()
const channelId = computed(() => route.params.channelId as string)
</script>

<template>
  <ChatWorkspace :channel-id="channelId" />
</template>
