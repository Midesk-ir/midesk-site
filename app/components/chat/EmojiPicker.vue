<script setup lang="ts">
const emojis = ['👍', '❤️', '😂', '🎉', '✅', '👀', '🔥', '🙏']
const emit = defineEmits<{ pick: [emoji: string] }>()
</script>

<template>
  <div class="flex flex-wrap gap-1 rounded-lg border border-[var(--color-midesk-border)] bg-[var(--color-midesk-surface)] p-2">
    <button
      v-for="e in emojis"
      :key="e"
      type="button"
      class="rounded-md px-2 py-1 text-lg hover:bg-white/10"
      @click="emit('pick', e)"
    >
      {{ e }}
    </button>
  </div>
</template>
