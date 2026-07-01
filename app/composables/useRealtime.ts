import type { AiRequest, ChatMessage, Notification } from '~/types'

export function useRealtime() {
  const { $echo } = useNuxtApp()
  const authStore = useAuthStore()

  function listenToChat(channelId: string, handler: (msg: ChatMessage) => void) {
    return $echo.private(`chat.${channelId}`).listen('ChatMessageSent', handler as (p: unknown) => void)
  }

  function listenToNotifications(handler: (n: Notification) => void) {
    if (!authStore.user?.id) return null
    return $echo.private(`user.${authStore.user.id}`).listen('NotificationReceived', handler as (p: unknown) => void)
  }

  function listenToAi(handler: (r: AiRequest) => void) {
    if (!authStore.user?.id) return null
    return $echo.private(`user.${authStore.user.id}`).listen('AiRequestCompleted', handler as (p: unknown) => void)
  }

  function emitChatMessage(channelId: string, message: ChatMessage) {
    $echo.emit(`chat.${channelId}`, 'ChatMessageSent', message)
  }

  function emitNotification(notification: Notification) {
    if (!authStore.user?.id) return
    $echo.emit(`user.${authStore.user.id}`, 'NotificationReceived', notification)
  }

  function emitAiCompleted(request: AiRequest) {
    if (!authStore.user?.id) return
    $echo.emit(`user.${authStore.user.id}`, 'AiRequestCompleted', request)
  }

  return {
    listenToChat,
    listenToNotifications,
    listenToAi,
    emitChatMessage,
    emitNotification,
    emitAiCompleted
  }
}
