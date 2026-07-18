import { defineStore } from 'pinia'
import type {
  ChatChannel,
  ChatMessage,
  CreateChatChannelPayload,
  SendChatMessagePayload
} from '~/types/phase4'
import { storeApi } from '~/utils/api-client'
import { normalizeChatChannel } from '~/utils/chat-channel'
import { normalizeChatMessage, type RawChatMessage } from '~/utils/chat-message'

type RawChannel = Parameters<typeof normalizeChatChannel>[0]

function currentUserId() {
  const pinia = ensureActivePinia()
  return pinia ? useAuthStore(pinia).user?.id ?? null : null
}

function normalizeMessages(items: RawChatMessage[]) {
  const userId = currentUserId()
  return items.map(item => normalizeChatMessage(item, userId))
}

export const useChatStore = defineStore('chat', () => {
  const channels = ref<ChatChannel[]>([])
  const messages = ref<ChatMessage[]>([])
  const activeChannelId = ref<string | null>(null)
  const unreadTotal = ref(0)
  const loading = ref(false)
  const messagesLoading = ref(false)

  async function fetchChannels() {
    loading.value = true
    try {
      const res = await storeApi<{ data: RawChannel[] }>('/chat/channels')
      channels.value = (res.data ?? []).map(ch => normalizeChatChannel(ch))
      return channels.value
    } finally {
      loading.value = false
    }
  }

  async function fetchUnreadTotal() {
    const res = await storeApi<{ count: number }>('/chat/channels/unread')
    unreadTotal.value = res.count
    return res.count
  }

  async function createDm(userId: string) {
    const raw = await storeApi<RawChannel>('/chat/dm', {
      method: 'POST',
      body: { user_id: userId }
    })
    const channel = normalizeChatChannel(raw)
    await fetchChannels()
    return channel
  }

  async function createChannel(payload: CreateChatChannelPayload) {
    if (payload.type === 'dm') {
      const userId = payload.member_ids[0]
      if (!userId) throw new Error('DM requires a user')
      return createDm(userId)
    }

    const raw = await storeApi<RawChannel>('/chat/channels', {
      method: 'POST',
      body: {
        type: payload.type,
        name: payload.name,
        description: payload.description,
        member_ids: payload.member_ids
      }
    })
    const channel = normalizeChatChannel(raw)
    await fetchChannels()
    return channel
  }

  async function fetchMessages(channelId: string, before?: string) {
    messagesLoading.value = true
    try {
      const qs = before ? `?before=${before}&limit=50` : '?limit=50'
      const res = await storeApi<{ data: RawChatMessage[] }>(`/chat/channels/${channelId}/messages${qs}`)
      const normalized = normalizeMessages(res.data ?? [])
      if (before) {
        messages.value = [...normalized, ...messages.value]
      } else {
        messages.value = normalized
      }
      return normalized
    } finally {
      messagesLoading.value = false
    }
  }

  async function sendMessage(channelId: string, payload: SendChatMessagePayload) {
    const res = await storeApi<RawChatMessage>(`/chat/channels/${channelId}/messages`, {
      method: 'POST',
      body: payload
    })
    const message = normalizeChatMessage(res, currentUserId())
    if (activeChannelId.value === channelId) {
      messages.value.push(message)
    }
    await fetchChannels()
    const { emitChatMessage } = useRealtime()
    emitChatMessage(channelId, message)
    return message
  }

  async function markRead(channelId: string) {
    const lastMessage = messages.value[messages.value.length - 1]
    if (!lastMessage) return

    await storeApi(`/chat/channels/${channelId}/read`, {
      method: 'POST',
      body: { last_read_message_id: lastMessage.id }
    })
    await fetchUnreadTotal()
    await fetchChannels()
  }

  async function addReaction(messageId: string, emoji: string) {
    await storeApi(`/chat/messages/${messageId}/reactions`, {
      method: 'POST',
      body: { emoji }
    })

    const idx = messages.value.findIndex(m => m.id === messageId)
    if (idx < 0) return

    const message = messages.value[idx]
    const existing = message.reactions.find(r => r.emoji === emoji)
    if (existing) {
      existing.count += 1
      existing.reacted_by_me = true
    } else {
      message.reactions.push({ emoji, count: 1, reacted_by_me: true })
    }
  }

  function setActiveChannel(id: string | null) {
    activeChannelId.value = id
  }

  function appendMessage(msg: ChatMessage | RawChatMessage) {
    const normalized = normalizeChatMessage(msg as RawChatMessage, currentUserId())

    if (activeChannelId.value === normalized.channel_id && !messages.value.some(m => m.id === normalized.id)) {
      messages.value.push(normalized)
    }
  }

  return {
    channels,
    messages,
    activeChannelId,
    unreadTotal,
    loading,
    messagesLoading,
    fetchChannels,
    fetchUnreadTotal,
    createChannel,
    createDm,
    fetchMessages,
    sendMessage,
    markRead,
    addReaction,
    setActiveChannel,
    appendMessage
  }
})
