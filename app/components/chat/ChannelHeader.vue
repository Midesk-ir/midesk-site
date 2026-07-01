<script setup lang="ts">
import type { ChatChannel } from '~/types/phase4'

defineProps<{ channel: ChatChannel | null, title?: string }>()
const { t } = useI18n()
</script>

<template>
  <header v-if="channel" class="midesk-messenger-chat__head">
    <div class="min-w-0">
      <h2 class="truncate text-base font-semibold text-[var(--color-midesk-text)]">
        {{ title ?? channel.name ?? t('chat.unnamed') }}
      </h2>
      <p class="text-xs text-[var(--color-midesk-muted)]">
        {{ channel.members_count }} {{ t('chat.members') }}
        · {{ t(`chat.types.${channel.type}`) }}
      </p>
    </div>
    <UBadge v-if="channel.is_readonly" variant="subtle" size="sm">{{ t('chat.readonly') }}</UBadge>
  </header>
</template>
