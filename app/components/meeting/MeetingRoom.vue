<script setup lang="ts">
defineProps<{ roomUrl: string }>()
const emit = defineEmits<{ leave: [] }>()
const { t } = useI18n()
</script>

<template>
  <div class="flex h-full flex-col bg-black">
    <header class="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
      <span class="text-sm font-medium text-white">{{ t('meetings.room') }}</span>
      <UButton color="error" variant="soft" icon="i-lucide-phone-off" @click="emit('leave')">
        {{ t('meetings.leave') }}
      </UButton>
    </header>
    <iframe
      :src="roomUrl"
      class="min-h-0 flex-1 w-full border-0"
      allow="camera; microphone; display-capture; fullscreen"
      allowfullscreen
    />
  </div>
</template>
