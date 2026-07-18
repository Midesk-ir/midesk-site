<script setup lang="ts">
withDefaults(defineProps<{
  statCount?: number
  cardCount?: number
}>(), {
  statCount: 4,
  cardCount: 3
})
</script>

<template>
  <div class="space-y-6">
    <USkeleton class="h-8 w-48 rounded-lg" />
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <USkeleton
        v-for="i in statCount"
        :key="`stat-${i}`"
        class="midesk-skeleton-stat"
      />
    </div>
    <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <USkeleton
        v-for="i in cardCount"
        :key="`card-${i}`"
        class="midesk-skeleton-card h-40 rounded-xl"
      />
    </div>
  </div>
</template>
