<script setup lang="ts">
const authStore = useAuthStore()
const { locale, locales, setLocale } = useI18n()
const { t } = useI18n()
const { toggleSidebar } = useAppLayout()

const localeOptions = computed(() =>
  locales.value.map(l => ({ label: l.name, value: l.code }))
)
</script>

<template>
  <header
    class="midesk-topbar midesk-glass sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-[var(--color-midesk-border)] px-4 sm:gap-3 sm:px-6 lg:px-8"
  >
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-panel-left"
      :aria-label="t('nav.menu')"
      class="shrink-0 text-[var(--color-midesk-muted)] hover:text-[var(--color-midesk-text)]"
      @click="toggleSidebar"
    />

    <div class="min-w-0 flex-1" />

    <USelect
      :model-value="locale"
      :items="localeOptions"
      size="sm"
      class="w-24 shrink-0 sm:w-28"
      @update:model-value="setLocale($event as 'fa' | 'en')"
    />

    <LayoutNotificationBell />

    <UDropdownMenu
      :items="[[{ label: t('nav.settings'), icon: 'i-lucide-settings', to: '/settings' }]]"
    >
      <UButton
        color="neutral"
        variant="ghost"
        class="shrink-0 gap-2 text-[var(--color-midesk-muted)] hover:text-[var(--color-midesk-text)]"
      >
        <UAvatar
          :alt="authStore.user?.name"
          size="xs"
          icon="i-lucide-user"
        />
        <span class="hidden max-w-[8rem] truncate text-sm md:inline">{{ authStore.user?.name }}</span>
      </UButton>
    </UDropdownMenu>
  </header>
</template>
