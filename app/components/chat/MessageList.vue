<script setup lang="ts">
import type { ChatMessage } from '~/types/phase4'

const props = defineProps<{
  messages: ChatMessage[]
  loading?: boolean
  hasMore?: boolean
}>()

const emit = defineEmits<{
  reply: [message: ChatMessage]
  react: [id: string, emoji: string]
  loadMore: []
}>()

const listRef = ref<HTMLElement | null>(null)

watch(() => props.messages.length, () => {
  nextTick(() => {
    if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight
  })
}, { flush: 'post' })

function onScroll() {
  const el = listRef.value
  if (!el || el.scrollTop > 40) return
  emit('loadMore')
}
</script>

<template>
  <div ref="listRef" class="midesk-messenger-messages" @scroll="onScroll">
    <div v-if="hasMore" class="mb-4 text-center">
      <UButton size="xs" variant="ghost" :loading="loading" @click="emit('loadMore')">
        {{ $t('chat.loadOlder') }}
      </UButton>
    </div>
    <div v-if="loading && !messages.length" class="space-y-4">
      <USkeleton v-for="i in 5" :key="i" class="h-16 rounded-xl" />
    </div>
    <div v-else class="space-y-4">
      <ChatMessageBubble
        v-for="msg in messages"
        :key="msg.id"
        :message="msg"
        @reply="emit('reply', $event)"
        @react="(id, emoji) => emit('react', id, emoji)"
      />
    </div>
  </div>
</template>
