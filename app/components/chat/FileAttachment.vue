<script setup lang="ts">
defineProps<{ fileName?: string, filePath?: string }>()
</script>

<template>
  <a
    v-if="filePath"
    :href="filePath"
    target="_blank"
    rel="noopener"
    class="inline-flex items-center gap-2 rounded-lg border border-[var(--color-midesk-border)] px-3 py-2 text-sm text-[var(--color-midesk-accent)] hover:bg-white/5"
  >
    <UIcon name="i-lucide-paperclip" class="size-4" />
    {{ fileName ?? 'file' }}
  </a>
</template>
