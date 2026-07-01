<script setup lang="ts">
const emit = defineEmits<{ sign: [] }>()
const { t } = useI18n()
</script>

<template>
  <UButton icon="i-lucide-pen-line" variant="outline" @click="emit('sign')">
    {{ t('correspondence.sign') }}
  </UButton>
</template>
