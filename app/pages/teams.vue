<script setup lang="ts">
import type { Team } from '~/types'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const { api } = useApi()

const teams = ref<Team[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api<{ data: Team[] }>('/teams')
    teams.value = data.data
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <LayoutMideskPageHeader :title="t('teams.title')" />

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2">
      <USkeleton v-for="i in 2" :key="i" class="h-32" />
    </div>

    <UiEmptyState
      v-else-if="!teams.length"
      :title="t('teams.emptyTitle')"
      :description="t('teams.emptyDesc')"
      icon="i-lucide-users"
    />

    <div v-else class="grid gap-4 sm:grid-cols-2">
      <UCard
        v-for="team in teams"
        :key="team.id"
        class="midesk-glass border-[var(--color-midesk-border)]"
      >
        <h3 class="font-semibold">{{ team.name }}</h3>
        <p v-if="team.description" class="mt-1 text-sm text-muted">{{ team.description }}</p>
        <p class="mt-3 text-xs text-muted">
          {{ team.members_count }} {{ t('teams.members') }}
        </p>
      </UCard>
    </div>
  </div>
</template>
