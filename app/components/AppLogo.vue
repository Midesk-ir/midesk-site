<script setup lang="ts">
defineProps<{
  compact?: boolean
}>()
</script>

<template>
  <div
    class="flex items-center"
    :class="compact ? 'justify-center' : 'gap-2.5'"
  >
    <div
      class="flex shrink-0 items-center justify-center rounded-xl bg-[var(--color-midesk-accent)] shadow-[0_0_24px_var(--color-midesk-accent-glow)]"
      :class="compact ? 'size-10' : 'size-9'"
    >
      <UIcon name="i-lucide-layout-grid" class="size-5 text-white" />
    </div>
    <span
      v-if="!compact"
      class="text-lg font-bold tracking-tight text-[var(--color-midesk-text)]"
    >
      Midesk
    </span>
  </div>
</template>
