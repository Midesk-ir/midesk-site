<script setup lang="ts">
const emit = defineEmits<{ run: [type: string, prompt: string] }>()
const { t } = useI18n()
</script>

<template>
  <UButton variant="soft" color="neutral" icon="i-lucide-file-text" @click="emit('run', 'document_generator', t('ai.shortcuts.documentPrompt'))">
    {{ t('ai.shortcuts.document') }}
  </UButton>
</template>
