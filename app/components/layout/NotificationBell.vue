<script setup lang="ts">
const { count, fetchCount, notifications, fetchNotifications, markRead } = useNotifications()
const { t, locale } = useI18n()
const { formatRelative } = useCalendar()

const badgeText = computed(() => (count.value > 99 ? '99+' : count.value))

const chipPosition = computed(() => (locale.value === 'fa' ? 'top-left' : 'top-right'))

onMounted(() => {
  fetchCount()
})

async function onOpen() {
  await fetchNotifications()
}

async function handleClick(id: string, url: string | null) {
  await markRead(id)
  if (url) navigateTo(url)
}
</script>

<template>
  <UPopover @update:open="(v: boolean) => v && onOpen()">
    <UChip
      :show="count > 0"
      :text="badgeText"
      color="error"
      :position="chipPosition"
      :ui="{
        base: 'min-w-[1.25rem] h-[1.25rem] flex justify-center items-center text-xs font-semibold text-white ring-0'
      }"
    >
      <UButton color="neutral" variant="ghost" icon="i-lucide-bell" aria-label="Notifications" />
    </UChip>

    <template #content>
      <div class="w-80 p-2">
        <div class="mb-2 flex items-center justify-between px-2">
          <span class="text-sm font-medium">{{ t('notifications.title') }}</span>
          <UButton to="/notifications" size="xs" variant="link" color="primary">
            {{ t('common.edit') }}
          </UButton>
        </div>

        <div v-if="!notifications.length" class="px-2 py-6 text-center text-sm text-muted">
          {{ t('notifications.emptyTitle') }}
        </div>

        <button
          v-for="n in notifications.slice(0, 5)"
          :key="n.id"
          type="button"
          class="flex w-full flex-col gap-1 rounded-lg px-2 py-2 text-start hover:bg-white/5"
          :class="{ 'opacity-60': n.read_at }"
          @click="handleClick(n.id, n.action_url)"
        >
          <span class="text-sm font-medium">{{ n.title }}</span>
          <span class="text-xs text-muted">{{ n.body }}</span>
          <span class="text-xs text-muted">{{ formatRelative(n.created_at) }}</span>
        </button>
      </div>
    </template>
  </UPopover>
</template>
