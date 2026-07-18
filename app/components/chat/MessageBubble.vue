<script setup lang="ts">
import type { ChatMessage } from '~/types/phase4'

const props = defineProps<{
  message: ChatMessage
  isOwn?: boolean
}>()

const emit = defineEmits<{ reply: [message: ChatMessage], react: [id: string, emoji: string] }>()

const authStore = useAuthStore()
const { formatDateTime } = useCalendar()

const showEmoji = ref(false)
const isOwn = computed(() => props.isOwn ?? props.message.sender?.id === authStore.user?.id)

const senderName = computed(() => props.message.sender?.name ?? '—')
</script>

<template>
  <div
    class="midesk-chat-message group"
    :class="isOwn ? 'midesk-chat-message--own' : 'midesk-chat-message--other'"
  >
    <UAvatar
      v-if="!isOwn"
      :alt="senderName"
      size="xs"
      icon="i-lucide-user"
      class="mt-1 shrink-0 ring-1 ring-[var(--color-midesk-border)]"
    />
    <div class="midesk-chat-message-content">
      <div v-if="!isOwn" class="midesk-chat-message-meta">
        <span class="font-medium text-[var(--color-midesk-text)]">{{ senderName }}</span>
        <span>{{ formatDateTime(message.created_at) }}</span>
      </div>

      <div
        v-if="message.type === 'system'"
        class="midesk-chat-system"
      >
        {{ message.body }}
      </div>

      <template v-else>
        <div
          class="midesk-chat-bubble"
          :class="isOwn ? 'midesk-chat-bubble--own' : 'midesk-chat-bubble--other'"
        >
          <p v-if="message.reply_to" class="midesk-chat-reply">
            {{ message.reply_to.sender }}: {{ message.reply_to.body }}
          </p>
          <p v-if="message.body" class="whitespace-pre-wrap">{{ message.body }}</p>
          <ChatFileAttachment
            v-if="message.file_path"
            :file-name="message.file_name"
            :file-path="message.file_path"
            class="mt-2"
          />
        </div>

        <div class="midesk-chat-message-toolbar">
          <div class="midesk-chat-bubble-actions">
            <button
              type="button"
              class="midesk-chat-action-btn"
              :aria-label="$t('chat.actions.reply')"
              @click="emit('reply', message)"
            >
              <UIcon name="i-lucide-reply" class="size-3.5" />
            </button>
            <button
              type="button"
              class="midesk-chat-action-btn"
              :aria-label="$t('chat.actions.react')"
              @click="showEmoji = !showEmoji"
            >
              <UIcon name="i-lucide-smile" class="size-3.5" />
            </button>
          </div>
          <span v-if="isOwn" class="midesk-chat-bubble-time">{{ formatDateTime(message.created_at) }}</span>
        </div>
      </template>

      <div v-if="message.reactions?.length" class="mt-1 flex flex-wrap gap-1">
        <button
          v-for="r in message.reactions"
          :key="r.emoji"
          type="button"
          class="midesk-chat-reaction"
          :class="{ 'is-mine': r.reacted_by_me }"
          @click="emit('react', message.id, r.emoji)"
        >
          {{ r.emoji }} {{ r.count }}
        </button>
      </div>

      <ChatEmojiPicker
        v-if="showEmoji"
        class="mt-2"
        @pick="emit('react', message.id, $event); showEmoji = false"
      />
    </div>
  </div>
</template>
