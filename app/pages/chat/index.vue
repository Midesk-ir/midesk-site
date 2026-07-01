<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })
</script>

<template>
  <ChatWorkspace />
</template>
