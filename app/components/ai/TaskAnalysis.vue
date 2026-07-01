<script setup lang="ts">
const emit = defineEmits<{ run: [type: string, prompt: string] }>()
const { t } = useI18n()
</script>

<template>
  <UButton variant="soft" color="primary" icon="i-lucide-list-todo" @click="emit('run', 'task_analysis', t('ai.shortcuts.taskAnalysisPrompt'))">
    {{ t('ai.shortcuts.taskAnalysis') }}
  </UButton>
</template>
