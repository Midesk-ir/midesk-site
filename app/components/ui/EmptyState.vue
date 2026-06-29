<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon?: string
}>()
</script>

<template>
  <div class="midesk-glass flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-midesk-border)] px-6 py-12 text-center">
    <UIcon v-if="icon" :name="icon" class="mb-4 size-12 text-[var(--color-midesk-muted)]" />
    <h3 class="text-lg font-medium text-[var(--color-midesk-text)]">
      {{ title }}
    </h3>
    <p v-if="description" class="mt-2 max-w-sm text-sm text-[var(--color-midesk-muted)]">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>
