<script setup lang="ts">
withDefaults(defineProps<{
  rows?: number
  rowClass?: string
  showTitle?: boolean
}>(), {
  rows: 3,
  rowClass: 'midesk-skeleton-row',
  showTitle: true
})
</script>

<template>
  <div class="midesk-card p-5">
    <USkeleton v-if="showTitle" class="midesk-skeleton-line mb-4 h-5 w-36" />
    <div class="space-y-3">
      <USkeleton
        v-for="i in rows"
        :key="i"
        :class="rowClass"
      />
    </div>
  </div>
</template>
