<script setup lang="ts">
const { t } = useI18n()
const { backIcon } = useDirectionalIcons()
</script>

<template>
  <div class="midesk-chat-shell">
    <header class="midesk-chat-topbar midesk-glass">
      <UButton
        to="/dashboard"
        variant="ghost"
        color="neutral"
        :icon="backIcon"
        size="sm"
        :aria-label="t('nav.dashboard')"
      />
      <AppLogo compact />
      <span class="text-sm font-medium text-[var(--color-midesk-muted)]">{{ t('nav.chat') }}</span>
      <div class="flex-1" />
      <LayoutNotificationBell />
    </header>
    <div class="midesk-chat-body">
      <slot />
    </div>
  </div>
</template>
