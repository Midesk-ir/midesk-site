<script setup lang="ts">
defineProps<{ body: string, sender: string }>()
const emit = defineEmits<{ clear: [] }>()
const { t } = useI18n()
</script>

<template>
  <div class="flex items-start gap-2 rounded-lg border border-[var(--color-midesk-border)] bg-white/[0.03] px-3 py-2 text-sm">
    <UIcon name="i-lucide-reply" class="mt-0.5 size-4 shrink-0 text-[var(--color-midesk-muted)]" />
    <div class="min-w-0 flex-1">
      <p class="font-medium text-[var(--color-midesk-accent)]">{{ sender }}</p>
      <p class="truncate text-[var(--color-midesk-muted)]">{{ body }}</p>
    </div>
    <UButton size="xs" variant="ghost" icon="i-lucide-x" :aria-label="t('common.cancel')" @click="emit('clear')" />
  </div>
</template>
