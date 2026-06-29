<script setup lang="ts">
const uiStore = useUiStore()
const authStore = useAuthStore()
const route = useRoute()
const { logout } = useAuth()
const { t } = useI18n()
const { isMobileNav, closeMobileSidebar } = useAppLayout()

const navItems = computed(() => [
  { label: t('nav.dashboard'), to: '/dashboard', icon: 'i-lucide-layout-dashboard' },
  { label: t('nav.projects'), to: '/projects', icon: 'i-lucide-folder-kanban' },
  { label: t('nav.worklog'), to: '/worklog', icon: 'i-lucide-clock' },
  { label: t('nav.calendar'), to: '/calendar', icon: 'i-lucide-calendar' },
  { label: t('nav.leave'), to: '/leave', icon: 'i-lucide-tree-palm' },
  { label: t('nav.teams'), to: '/teams', icon: 'i-lucide-users' },
  ...(authStore.isAdmin ? [{ label: t('nav.members'), to: '/members', icon: 'i-lucide-user-cog' }] : []),
  { label: t('nav.settings'), to: '/settings', icon: 'i-lucide-settings' }
])

const showCompact = computed(() => uiStore.sidebarCollapsed && !isMobileNav.value)

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function onNavigate() {
  if (isMobileNav.value) closeMobileSidebar()
}
</script>

<template>
  <aside
    class="midesk-sidebar-column midesk-glass"
    :class="{ 'midesk-sidebar-open': uiStore.sidebarMobileOpen }"
    :aria-hidden="isMobileNav && !uiStore.sidebarMobileOpen"
  >
    <!-- Logo -->
    <div
      class="midesk-sidebar-brand shrink-0"
      :class="showCompact ? 'midesk-sidebar-brand-collapsed' : 'midesk-sidebar-brand-expanded'"
    >
      <AppLogo :compact="showCompact" />
      <UButton
        v-if="isMobileNav"
        color="neutral"
        variant="ghost"
        icon="i-lucide-x"
        size="sm"
        class="ms-auto shrink-0 text-[var(--color-midesk-muted)]"
        :aria-label="t('common.close')"
        @click="closeMobileSidebar"
      />
    </div>

    <!-- Nav -->
    <nav class="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :title="showCompact ? item.label : undefined"
        class="flex items-center rounded-xl text-sm font-medium transition-all duration-150"
        :class="[
          showCompact ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
          isActive(item.to)
            ? 'bg-[var(--color-midesk-accent)] text-white shadow-[0_0_20px_var(--color-midesk-accent-glow)]'
            : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.06] hover:text-[var(--color-midesk-text)]'
        ]"
        @click="onNavigate"
      >
        <UIcon :name="item.icon" class="size-5 shrink-0" />
        <span v-if="!showCompact" class="truncate">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Footer -->
    <div
      class="shrink-0 space-y-1 border-t border-[var(--color-midesk-border)] p-3"
      :class="showCompact ? 'flex flex-col items-center' : ''"
    >
      <NuxtLink
        to="/notifications"
        :title="t('nav.notifications')"
        class="flex items-center rounded-xl text-sm transition-all duration-150"
        :class="[
          showCompact ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5',
          isActive('/notifications')
            ? 'bg-[var(--color-midesk-accent)] text-white'
            : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.06] hover:text-[var(--color-midesk-text)]'
        ]"
        @click="onNavigate"
      >
        <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
        <span v-if="!showCompact">{{ t('nav.notifications') }}</span>
      </NuxtLink>

      <button
        type="button"
        class="flex w-full items-center rounded-xl text-sm text-[var(--color-midesk-muted)] transition hover:bg-white/[0.06] hover:text-[var(--color-midesk-text)]"
        :class="showCompact ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5'"
        @click="logout"
      >
        <UIcon name="i-lucide-log-out" class="size-5 shrink-0" />
        <span v-if="!showCompact">{{ t('nav.logout') }}</span>
      </button>

      <div
        v-if="authStore.user"
        class="midesk-glass mt-2 flex items-center rounded-xl border border-[var(--color-midesk-border)]"
        :class="showCompact ? 'justify-center p-2' : 'gap-3 p-2'"
      >
        <UAvatar
          :alt="authStore.user.name"
          size="sm"
          icon="i-lucide-user"
          class="ring-2 ring-[var(--color-midesk-border)]"
        />
        <div v-if="!showCompact" class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-[var(--color-midesk-text)]">
            {{ authStore.user.name }}
          </p>
          <p class="truncate text-xs text-[var(--color-midesk-muted)]">
            {{ authStore.user.email }}
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>
