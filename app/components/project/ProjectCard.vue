<script setup lang="ts">
import type { Project } from '~/types'

defineProps<{
  project: Project
}>()
</script>

<template>
  <NuxtLink
    :to="`/projects/${project.id}`"
    class="midesk-glass group block rounded-2xl border border-[var(--color-midesk-border)] p-5 transition hover:border-[var(--color-midesk-accent)]/40 hover:shadow-[0_0_24px_var(--color-midesk-accent-glow)]"
  >
    <div class="flex items-start justify-between gap-3">
      <h3 class="font-semibold text-[var(--color-midesk-text)] group-hover:text-[var(--color-midesk-accent)]">
        {{ project.name }}
      </h3>
      <UBadge color="primary" variant="subtle">
        {{ project.progress }}%
      </UBadge>
    </div>
    <p v-if="project.description" class="mt-2 line-clamp-2 text-sm text-[var(--color-midesk-muted)]">
      {{ project.description }}
    </p>
    <div class="mt-4 flex gap-4 text-xs text-[var(--color-midesk-muted)]">
      <span class="flex items-center gap-1">
        <UIcon name="i-lucide-list-todo" class="size-3.5" />
        {{ project.tasks_count }}
      </span>
      <span class="flex items-center gap-1">
        <UIcon name="i-lucide-users" class="size-3.5" />
        {{ project.members_count }}
      </span>
    </div>
    <UProgress :model-value="project.progress" color="primary" size="xs" class="mt-4" />
  </NuxtLink>
</template>
