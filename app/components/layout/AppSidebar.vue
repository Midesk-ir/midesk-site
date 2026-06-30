<script setup lang="ts">
const uiStore = useUiStore()
const authStore = useAuthStore()
const route = useRoute()
const { logout } = useAuth()
const { t } = useI18n()
const { isMobileNav, closeMobileSidebar } = useAppLayout()
const { can, canAny } = usePermissions()

const hrExpanded = ref(route.path.startsWith('/hr'))

watch(() => route.path, (path) => {
  if (path.startsWith('/hr')) hrExpanded.value = true
})

const showHrNav = computed(() =>
  can('hr:dashboard:view')
  || can('hr:attendance:clock')
  || authStore.permissions.some(p => p.startsWith('hr:'))
)

const hrNavItems = computed(() => [
  { label: t('nav.hr.dashboard'), to: '/hr', icon: 'i-lucide-chart-pie', show: can('hr:dashboard:view') },
  { label: t('nav.hr.personnel'), to: '/hr/personnel', icon: 'i-lucide-id-card', show: can('hr:personnel:view') },
  {
    label: t('nav.hr.attendance'),
    to: can('hr:attendance:view') ? '/hr/attendance' : '/hr/attendance/my',
    icon: 'i-lucide-calendar-clock',
    show: can('hr:attendance:view') || can('hr:attendance:clock')
  },
  { label: t('nav.hr.contracts'), to: '/hr/contracts', icon: 'i-lucide-file-signature', show: can('hr:contracts:view') },
  { label: t('nav.hr.documents'), to: '/hr/documents', icon: 'i-lucide-archive', show: can('hr:documents:view') },
  {
    label: t('nav.hr.missions'),
    to: '/hr/missions',
    icon: 'i-lucide-route',
    show: canAny(['hr:missions:view', 'hr:missions:request'])
  },
  { label: t('nav.hr.recruitment'), to: '/hr/recruitment', icon: 'i-lucide-user-search', show: can('hr:recruitment:view') },
  { label: t('nav.hr.onboarding'), to: '/hr/onboarding', icon: 'i-lucide-clipboard-list', show: can('hr:onboarding:view') },
  { label: t('nav.hr.settings'), to: '/hr/settings', icon: 'i-lucide-sliders-horizontal', show: can('hr:settings:manage') }
].filter(item => item.show))

const hrDropdownItems = computed(() => [
  hrNavItems.value.map(item => ({
    label: item.label,
    icon: item.icon,
    to: item.to,
    onSelect: () => onNavigate()
  }))
])

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
  if (path === '/hr') {
    return route.path === '/hr'
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

function isHrActive() {
  return route.path === '/hr' || route.path.startsWith('/hr/')
}

function onNavigate() {
  if (isMobileNav.value) closeMobileSidebar()
}

function toggleHr() {
  hrExpanded.value = !hrExpanded.value
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

      <!-- HR cascading menu -->
      <div v-if="showHrNav" class="pt-1">
        <UDropdownMenu
          v-if="showCompact"
          :items="hrDropdownItems"
          :content="{ side: 'right', align: 'start', sideOffset: 8 }"
        >
          <button
            type="button"
            :title="t('nav.hr.section')"
            class="flex w-full items-center justify-center rounded-xl p-2.5 transition-all duration-150"
            :class="isHrActive()
              ? 'bg-[var(--color-midesk-accent)] text-white shadow-[0_0_20px_var(--color-midesk-accent-glow)]'
              : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.06] hover:text-[var(--color-midesk-text)]'"
          >
            <UIcon name="i-lucide-building-2" class="size-5 shrink-0" />
          </button>
        </UDropdownMenu>

        <template v-else>
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
            :class="isHrActive()
              ? 'bg-white/[0.04] text-[var(--color-midesk-text)]'
              : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.06] hover:text-[var(--color-midesk-text)]'"
            :aria-expanded="hrExpanded"
            @click="toggleHr"
          >
            <UIcon name="i-lucide-building-2" class="size-5 shrink-0" />
            <span class="flex-1 truncate text-start">{{ t('nav.hr.section') }}</span>
            <UIcon
              name="i-lucide-chevron-down"
              class="size-4 shrink-0 transition-transform duration-200"
              :class="{ 'rotate-180': hrExpanded }"
            />
          </button>

          <div
            class="grid transition-[grid-template-rows] duration-200 ease-out"
            :class="hrExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          >
            <div class="overflow-hidden">
              <div
                class="ms-5 mt-1 space-y-0.5 border-s border-[var(--color-midesk-border)] ps-2"
                role="group"
                :aria-label="t('nav.hr.section')"
              >
                <NuxtLink
                  v-for="item in hrNavItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150"
                  :class="isActive(item.to)
                    ? 'bg-[var(--color-midesk-accent-soft)] font-medium text-[var(--color-midesk-accent)]'
                    : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.04] hover:text-[var(--color-midesk-text)]'"
                  @click="onNavigate"
                >
                  <UIcon :name="item.icon" class="size-[1.125rem] shrink-0" />
                  <span class="truncate">{{ item.label }}</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
      </div>
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
