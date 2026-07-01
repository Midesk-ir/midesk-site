<script setup lang="ts">
import type { ChatChannel } from '~/types/phase4'

const props = defineProps<{
  channels: ChatChannel[]
  activeId?: string
  loading?: boolean
  mobileOpen?: boolean
}>()

const emit = defineEmits<{ 'update:mobileOpen': [value: boolean] }>()

const { t } = useI18n()
const search = ref('')

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return props.channels
  return props.channels.filter(c => (c.name ?? '').toLowerCase().includes(q))
})

const typeIcon: Record<string, string> = {
  dm: 'i-lucide-user',
  group: 'i-lucide-users',
  channel: 'i-lucide-hash'
}

function onNavigate() {
  if (props.mobileOpen) emit('update:mobileOpen', false)
}
</script>

<template>
  <Teleport to="body">
    <button
      v-if="mobileOpen"
      type="button"
      class="midesk-chat-sidebar-backdrop md:hidden"
      :aria-label="t('common.close')"
      @click="emit('update:mobileOpen', false)"
    />
  </Teleport>

  <aside class="midesk-chat-sidebar" :class="{ 'is-open': mobileOpen }">
    <div class="shrink-0 space-y-2 border-b border-[var(--color-midesk-border)] p-3">
      <div class="flex items-center justify-between gap-2">
        <h2 class="font-semibold text-[var(--color-midesk-text)]">{{ t('nav.chat') }}</h2>
        <slot name="create" />
      </div>
      <UInput v-model="search" icon="i-lucide-search" :placeholder="t('chat.search')" size="sm" />
    </div>
    <div v-if="loading" class="space-y-2 p-3">
      <USkeleton v-for="i in 5" :key="i" class="h-12 rounded-lg" />
    </div>
    <nav v-else class="min-h-0 flex-1 overflow-y-auto p-2">
      <NuxtLink
        v-for="ch in filtered"
        :key="ch.id"
        :to="`/chat/${ch.id}`"
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition"
        :class="activeId === ch.id
          ? 'bg-[var(--color-midesk-accent-soft)] text-[var(--color-midesk-accent)]'
          : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.04] hover:text-[var(--color-midesk-text)]'"
        @click="onNavigate"
      >
        <UIcon :name="typeIcon[ch.type] ?? 'i-lucide-message-circle'" class="size-4 shrink-0" />
        <span class="min-w-0 flex-1 truncate">{{ ch.name ?? t('chat.unnamed') }}</span>
        <UBadge v-if="ch.unread_count" color="error" size="xs">{{ ch.unread_count }}</UBadge>
      </NuxtLink>
    </nav>
  </aside>
</template>
