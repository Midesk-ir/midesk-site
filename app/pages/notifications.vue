<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const { notifications, loading, fetchNotifications, markRead, markAllRead } = useNotifications()
const { formatRelative } = useCalendar()

onMounted(fetchNotifications)

async function handleClick(id: string, url: string | null) {
  await markRead(id)
  if (url) navigateTo(url)
}
</script>

<template>
  <div>
    <div class="midesk-page-header">
      <h1 class="midesk-page-title">{{ t('notifications.title') }}</h1>
      <UButton variant="outline" size="sm" class="shrink-0" @click="markAllRead">
        {{ t('notifications.markAllRead') }}
      </UButton>
    </div>

    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="i in 4" :key="i" class="h-20" />
    </div>

    <UiEmptyState
      v-else-if="!notifications.length"
      :title="t('notifications.emptyTitle')"
      :description="t('notifications.emptyDesc')"
      icon="i-lucide-bell"
    />

    <div v-else class="space-y-2">
      <button
        v-for="n in notifications"
        :key="n.id"
        type="button"
        class="flex w-full flex-col gap-1 rounded-xl border midesk-glass border-[var(--color-midesk-border)] p-4 text-start transition hover:border-[var(--color-midesk-accent)]/40"
        :class="{ 'opacity-60': n.read_at }"
        @click="handleClick(n.id, n.action_url)"
      >
        <span class="font-medium">{{ n.title }}</span>
        <span class="text-sm text-muted">{{ n.body }}</span>
        <span class="text-xs text-muted">{{ formatRelative(n.created_at) }}</span>
      </button>
    </div>
  </div>
</template>
