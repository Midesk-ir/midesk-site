<script setup lang="ts">
import type { ChatMessage } from '~/types/phase4'

const props = defineProps<{
  disabled?: boolean
  replyTo?: ChatMessage | null
}>()

const emit = defineEmits<{
  send: [payload: { body: string, reply_to_id?: string }]
  clearReply: []
}>()

const { t } = useI18n()
const text = ref('')
const showEmoji = ref(false)

function onSubmit() {
  if (!text.value.trim() || props.disabled) return
  emit('send', {
    body: text.value.trim(),
    reply_to_id: props.replyTo?.id
  })
  text.value = ''
  emit('clearReply')
}

function onEmoji(emoji: string) {
  text.value += emoji
  showEmoji.value = false
}
</script>

<template>
  <div class="midesk-messenger-input">
    <ChatReplyPreview
      v-if="replyTo"
      :body="replyTo.body ?? ''"
      :sender="replyTo.sender.name"
      @clear="emit('clearReply')"
    />
    <form class="midesk-messenger-input__row" @submit.prevent="onSubmit">
      <UButton
        type="button"
        variant="ghost"
        color="neutral"
        icon="i-lucide-smile"
        :disabled="disabled"
        @click="showEmoji = !showEmoji"
      />
      <div class="relative min-w-0 flex-1">
        <UTextarea
          v-model="text"
          :rows="1"
          autoresize
          :disabled="disabled"
          :placeholder="t('chat.inputPlaceholder')"
          class="midesk-messenger-input__field w-full"
          @keydown.enter.exact.prevent="onSubmit"
        />
        <div v-if="showEmoji" class="absolute bottom-full z-10 mb-2 start-0">
          <ChatEmojiPicker @pick="onEmoji" />
        </div>
      </div>
      <UButton
        type="submit"
        color="primary"
        icon="i-lucide-send"
        :disabled="disabled || !text.trim()"
      />
    </form>
  </div>
</template>
