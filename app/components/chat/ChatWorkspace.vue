<script setup lang="ts">
import type { ChatChannel, ChatChannelType, ChatMessage } from '~/types/phase4'
import type { User } from '~/types'
import { readApiError } from '~/utils/api-fetch'

const props = defineProps<{
  channelId?: string
}>()

const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const authStore = useAuthStore()
const chatStore = useChatStore()
const { api } = useApi()
const { listenToChat } = useRealtime()

const activeTab = ref<'all' | ChatChannelType>('all')
const showCreate = ref(false)
const createFormKey = ref(0)
const createType = ref<ChatChannelType>('group')
const creating = ref(false)
const members = ref<User[]>([])
const replyTo = ref<ChatMessage | null>(null)
const hasMore = ref(true)

const channelId = computed(() => props.channelId ?? (route.params.channelId as string | undefined))

const activeChannel = computed(() =>
  channelId.value ? chatStore.channels.find(c => c.id === channelId.value) ?? null : null
)

const filteredChannels = computed(() => {
  if (activeTab.value === 'all') return chatStore.channels
  return chatStore.channels.filter(c => c.type === activeTab.value)
})

const tabItems = computed(() => [
  { label: t('chat.tabs.all'), value: 'all' as const, icon: 'i-lucide-layout-grid' },
  { label: t('chat.tabs.dm'), value: 'dm' as const, icon: 'i-lucide-user' },
  { label: t('chat.tabs.group'), value: 'group' as const, icon: 'i-lucide-users' },
  { label: t('chat.tabs.channel'), value: 'channel' as const, icon: 'i-lucide-hash' }
])

const createModalTitle = computed(() => {
  switch (createType.value) {
    case 'dm':
      return t('chat.createDm')
    case 'group':
      return t('chat.createGroup')
    default:
      return t('chat.createChannel')
  }
})

function openCreateModal() {
  createType.value = activeTab.value === 'all' ? 'group' : activeTab.value
  createFormKey.value += 1
  showCreate.value = true
}

const inputDisabled = computed(() => {
  if (!activeChannel.value?.is_readonly) return false
  return !['OWNER', 'ADMIN'].includes(authStore.user?.role ?? '')
})

function channelLabel(ch: ChatChannel) {
  if (ch.name) return ch.name
  if (ch.type === 'dm') {
    const otherId = ch.member_ids.find(id => id !== authStore.user?.id)
    const member = members.value.find(m => m.id === otherId)
    return member?.name ?? t('chat.unnamed')
  }
  return t('chat.unnamed')
}

async function loadChannel() {
  if (!channelId.value) return
  chatStore.setActiveChannel(channelId.value)
  await chatStore.fetchMessages(channelId.value)
  await chatStore.markRead(channelId.value)
  hasMore.value = chatStore.messages.length >= 50
}

async function loadMore() {
  if (!channelId.value) return
  const first = chatStore.messages[0]
  if (!first) return
  const prev = await chatStore.fetchMessages(channelId.value, first.id)
  hasMore.value = (prev?.length ?? 0) >= 50
}

async function onSend(payload: { body: string, reply_to_id?: string }) {
  if (!channelId.value) return
  try {
    await chatStore.sendMessage(channelId.value, payload)
    replyTo.value = null
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

async function onReact(id: string, emoji: string) {
  await chatStore.addReaction(id, emoji)
}

async function loadMembers() {
  try {
    const res = await api<{ data: User[] }>('/members')
    members.value = res.data
  } catch {
    members.value = []
  }
}

async function onCreate(payload: Parameters<typeof chatStore.createChannel>[0]) {
  creating.value = true
  try {
    const ch = await chatStore.createChannel(payload)
    showCreate.value = false
    await navigateTo(`/chat/${ch.id}`)
  } catch (error: unknown) {
    toast.add({ title: readApiError(error) || t('common.error'), color: 'error' })
  } finally {
    creating.value = false
  }
}

watch(channelId, loadChannel, { immediate: true })

watch(channelId, (id, _, onCleanup) => {
  if (!id) return
  const sub = listenToChat(id, (msg) => {
    chatStore.appendMessage(msg as ChatMessage)
  })
  onCleanup(() => sub?.stopListening?.('ChatMessageSent'))
}, { immediate: true })

onMounted(async () => {
  await Promise.all([chatStore.fetchChannels(), chatStore.fetchUnreadTotal(), loadMembers()])
})
</script>

<template>
  <div class="space-y-4">
    <LayoutMideskPageHeader :title="t('nav.chat')" :subtitle="t('chat.pageSubtitle')">
      <template #actions>
        <LayoutMideskPageHeaderButton variant="primary" icon="i-lucide-plus" @click="openCreateModal">
          {{ t('chat.create') }}
        </LayoutMideskPageHeaderButton>
      </template>
    </LayoutMideskPageHeader>

    <div class="midesk-messenger">
      <!-- RTL: roster appears on the right -->
      <aside class="midesk-messenger-roster">
        <div class="midesk-messenger-roster__head">
          <h2 class="text-sm font-semibold text-[var(--color-midesk-text)]">{{ t('chat.conversations') }}</h2>
          <UButton size="xs" variant="soft" icon="i-lucide-plus" @click="openCreateModal" />
        </div>

        <div class="midesk-messenger-tabs">
          <button
            v-for="tab in tabItems"
            :key="tab.value"
            type="button"
            class="midesk-messenger-tab"
            :class="{ 'is-active': activeTab === tab.value }"
            @click="activeTab = tab.value"
          >
            <UIcon :name="tab.icon" class="size-3.5" />
            <span>{{ tab.label }}</span>
          </button>
        </div>

        <div v-if="chatStore.loading" class="space-y-2 p-3">
          <USkeleton v-for="i in 4" :key="i" class="h-14 rounded-xl" />
        </div>

        <nav v-else class="midesk-messenger-roster__list">
          <NuxtLink
            v-for="ch in filteredChannels"
            :key="ch.id"
            :to="`/chat/${ch.id}`"
            class="midesk-messenger-roster-item"
            :class="{ 'is-active': channelId === ch.id }"
          >
            <UAvatar
              :alt="channelLabel(ch)"
              size="sm"
              :icon="ch.type === 'dm' ? 'i-lucide-user' : ch.type === 'group' ? 'i-lucide-users' : 'i-lucide-hash'"
              class="shrink-0 ring-2 ring-[var(--color-midesk-border)]"
            />
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <span class="truncate font-medium text-[var(--color-midesk-text)]">
                  {{ channelLabel(ch) }}
                </span>
                <UBadge v-if="ch.unread_count" color="error" size="xs">{{ ch.unread_count }}</UBadge>
              </div>
              <p v-if="ch.last_message?.body" class="truncate text-xs text-[var(--color-midesk-muted)]">
                {{ ch.last_message.body }}
              </p>
              <p v-else class="text-xs text-[var(--color-midesk-muted)]">
                {{ t(`chat.types.${ch.type}`) }}
              </p>
            </div>
          </NuxtLink>

          <p v-if="!filteredChannels.length" class="px-4 py-8 text-center text-sm text-[var(--color-midesk-muted)]">
            {{ t('chat.emptyRoster') }}
          </p>
        </nav>
      </aside>

      <!-- RTL: conversation appears on the left -->
      <section class="midesk-messenger-chat">
        <template v-if="activeChannel">
          <ChatChannelHeader
            v-if="activeChannel"
            :channel="activeChannel"
            :title="channelLabel(activeChannel)"
          />
          <ChatMessageList
            :messages="chatStore.messages"
            :loading="chatStore.messagesLoading"
            :has-more="hasMore"
            @reply="replyTo = $event"
            @react="onReact"
            @load-more="loadMore"
          />
          <ChatMessageInput
            :disabled="inputDisabled"
            :reply-to="replyTo"
            @send="onSend"
            @clear-reply="replyTo = null"
          />
        </template>

        <div v-else class="midesk-messenger-empty">
          <div class="text-center">
            <div class="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[var(--color-midesk-accent-soft)]">
              <UIcon name="i-lucide-message-square" class="size-8 text-[var(--color-midesk-accent)]" />
            </div>
            <h3 class="text-lg font-semibold text-[var(--color-midesk-text)]">{{ t('chat.selectChannel') }}</h3>
            <p class="mt-2 max-w-sm text-sm text-[var(--color-midesk-muted)]">{{ t('chat.selectChannelDesc') }}</p>
          </div>
        </div>
      </section>
    </div>

    <MideskModal v-model:open="showCreate" :title="createModalTitle">
      <ChatChannelForm
        :key="createFormKey"
        :members="members"
        :default-type="createType"
        :loading="creating"
        @update:type="createType = $event"
        @submit="onCreate"
        @cancel="showCreate = false"
      />
    </MideskModal>
  </div>
</template>
