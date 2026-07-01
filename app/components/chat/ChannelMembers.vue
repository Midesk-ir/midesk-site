<script setup lang="ts">
import type { UserBrief } from '~/types/phase1'

defineProps<{ members: UserBrief[] }>()
</script>

<template>
  <ul class="flex flex-wrap gap-2">
    <li
      v-for="m in members"
      :key="m.id"
      class="flex items-center gap-2 rounded-full border border-[var(--color-midesk-border)] px-3 py-1 text-sm"
    >
      <UAvatar :alt="m.name" size="2xs" icon="i-lucide-user" />
      {{ m.name }}
    </li>
  </ul>
</template>
