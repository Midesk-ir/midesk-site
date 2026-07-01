import { defineStore } from 'pinia'
import type {
  ChatChannel,
  ChatMessage,
  CreateChatChannelPayload,
  SendChatMessagePayload
} from '~/types/phase4'
import { storeApi } from '~/utils/api-client'

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
      const res = await storeApi<{ data: ChatChannel[] }>('/chat/channels')
      channels.value = res.data
      return res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchUnreadTotal() {
    const res = await storeApi<{ count: number }>('/chat/channels/unread')
    unreadTotal.value = res.count
    return res.count
  }

  async function createChannel(payload: CreateChatChannelPayload) {
    const res = await storeApi<{ data: ChatChannel }>('/chat/channels', { method: 'POST', body: payload })
    await fetchChannels()
    return res.data
  }

  async function fetchMessages(channelId: string, before?: string) {
    messagesLoading.value = true
    try {
      const qs = before ? `?before=${before}&limit=50` : '?limit=50'
      const res = await storeApi<{ data: ChatMessage[] }>(`/chat/channels/${channelId}/messages${qs}`)
      if (before) {
        messages.value = [...res.data, ...messages.value]
      } else {
        messages.value = res.data
      }
      return res.data
    } finally {
      messagesLoading.value = false
    }
  }

  async function sendMessage(channelId: string, payload: SendChatMessagePayload) {
    const res = await storeApi<{ data: ChatMessage }>(`/chat/channels/${channelId}/messages`, {
      method: 'POST',
      body: payload
    })
    if (activeChannelId.value === channelId) {
      messages.value.push(res.data)
    }
    await fetchChannels()
    const { emitChatMessage } = useRealtime()
    emitChatMessage(channelId, res.data)
    return res.data
  }

  async function markRead(channelId: string) {
    await storeApi(`/chat/channels/${channelId}/read`, { method: 'POST' })
    await fetchUnreadTotal()
    await fetchChannels()
  }

  async function addReaction(messageId: string, emoji: string) {
    const res = await storeApi<{ data: ChatMessage }>(`/chat/messages/${messageId}/reactions`, {
      method: 'POST',
      body: { emoji }
    })
    const idx = messages.value.findIndex(m => m.id === messageId)
    if (idx >= 0) messages.value[idx] = res.data
    return res.data
  }

  function setActiveChannel(id: string | null) {
    activeChannelId.value = id
  }

  function appendMessage(msg: ChatMessage) {
    if (activeChannelId.value === msg.channel_id && !messages.value.some(m => m.id === msg.id)) {
      messages.value.push(msg)
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
    fetchMessages,
    sendMessage,
    markRead,
    addReaction,
    setActiveChannel,
    appendMessage
  }
})
