<script setup lang="ts">
const emit = defineEmits<{ run: [type: string, prompt: string] }>()
const { t } = useI18n()
</script>

<template>
  <UButton variant="soft" color="neutral" icon="i-lucide-user-search" @click="emit('run', 'resume_screener', t('ai.shortcuts.resumePrompt'))">
    {{ t('ai.shortcuts.resume') }}
  </UButton>
</template>
