<script setup lang="ts">
const uiStore = useUiStore()
const authStore = useAuthStore()
const route = useRoute()
const { logout } = useAuth()
const { t, localeProperties } = useI18n()
const { isMobileNav, closeMobileSidebar } = useAppLayout()
const { can, canAny } = usePermissions()

const hrExpanded = ref(true)
const financeExpanded = ref(true)

watch(() => route.path, (path) => {
  if (path.startsWith('/hr')) hrExpanded.value = true
  if (path.startsWith('/finance') || path === '/my-finance') financeExpanded.value = true
}, { immediate: true })

const isRtl = computed(() => localeProperties.value.dir === 'rtl')

const showHrNav = computed(() => {
  if (!authStore.isAuthenticated) return false
  return can('hr:dashboard:view')
    || can('hr:attendance:clock')
    || authStore.permissions.some((p: string) => p.startsWith('hr:'))
})

const hrNavItems = computed(() => [
  { label: t('nav.hr.dashboard'), to: '/hr', icon: 'i-lucide-chart-pie', show: can('hr:dashboard:view') },
  { label: t('nav.hr.personnel'), to: '/hr/personnel', icon: 'i-lucide-id-card', show: can('hr:personnel:view') },
  {
    label: t('nav.hr.attendance'),
    to: can('hr:attendance:view') ? '/hr/attendance' : '/hr/attendance/my',
    icon: 'i-lucide-calendar-clock',
    show: can('hr:attendance:view') || can('hr:attendance:clock')
  },
  { label: t('nav.hr.contracts'), to: '/hr/contracts', icon: 'i-lucide-scroll-text', show: can('hr:contracts:view') },
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

const showFinanceNav = computed(() => {
  if (!authStore.isAuthenticated) return false
  return authStore.permissions.some((p: string) => p.startsWith('finance:'))
})

const financeNavItems = computed(() => [
  { label: t('nav.finance.dashboard'), to: '/finance', icon: 'i-lucide-chart-pie', show: can('finance:dashboard:view') },
  { label: t('nav.finance.expenses'), to: '/finance/expenses', icon: 'i-lucide-receipt', show: canAny(['finance:expenses:view', 'finance:expenses:create', 'finance:expenses:approve', 'finance:expenses:pay']) },
  { label: t('nav.finance.budgets'), to: '/finance/budgets', icon: 'i-lucide-pie-chart', show: can('finance:budgets:view') },
  { label: t('nav.finance.invoices'), to: '/finance/invoices', icon: 'i-lucide-file-text', show: can('finance:invoices:view') },
  { label: t('nav.finance.purchaseRequests'), to: '/finance/purchase-requests', icon: 'i-lucide-shopping-cart', show: canAny(['finance:expenses:create', 'finance:expenses:view', 'finance:invoices:view']) },
  { label: t('nav.finance.purchaseOrders'), to: '/finance/purchase-orders', icon: 'i-lucide-package', show: can('finance:invoices:view') },
  { label: t('nav.finance.vendors'), to: '/finance/vendors', icon: 'i-lucide-truck', show: can('finance:invoices:view') },
  { label: t('nav.finance.payroll'), to: '/finance/payroll', icon: 'i-lucide-banknote', show: can('finance:payroll:view') },
  { label: t('nav.finance.myFinance'), to: '/my-finance', icon: 'i-lucide-wallet', show: can('finance:my:view') }
].filter(item => item.show))

const financeDropdownItems = computed(() => [
  financeNavItems.value.map(item => ({
    label: item.label,
    icon: item.icon,
    to: item.to,
    onSelect: () => onNavigate()
  }))
])

const navItemsCollab = computed(() => [
  { label: t('nav.chat'), to: '/chat', icon: 'i-lucide-message-square', badge: chatUnread.value },
  { label: t('nav.meetings'), to: '/meetings', icon: 'i-lucide-video' },
  { label: t('nav.ai'), to: '/ai', icon: 'i-lucide-sparkles' },
  { label: t('nav.notes'), to: '/notes', icon: 'i-lucide-sticky-note' }
])

const chatStore = useChatStore()
const chatUnread = computed(() => chatStore.unreadTotal)

const navItemsPrimary = computed(() => [
  { label: t('nav.dashboard'), to: '/dashboard', icon: 'i-lucide-layout-dashboard' },
  { label: t('nav.projects'), to: '/projects', icon: 'i-lucide-folder-kanban' },
  { label: t('nav.worklog'), to: '/worklog', icon: 'i-lucide-clock' },
  { label: t('nav.calendar'), to: '/calendar', icon: 'i-lucide-calendar' },
  { label: t('nav.leave'), to: '/leave', icon: 'i-lucide-tree-palm' }
])

const navItemsSecondary = computed(() => [
  { label: t('nav.teams'), to: '/teams', icon: 'i-lucide-users' },
  ...(authStore.isAdmin ? [{ label: t('nav.members'), to: '/members', icon: 'i-lucide-user-cog' }] : []),
  { label: t('nav.settings'), to: '/settings', icon: 'i-lucide-settings' }
])

const showCompact = computed(() => uiStore.sidebarCollapsed && !isMobileNav.value)

function isActive(path: string) {
  if (path === '/hr' || path === '/finance') {
    return route.path === path
  }
  if (path === '/chat') {
    return route.path === '/chat' || route.path.startsWith('/chat/')
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

function isHrActive() {
  return route.path === '/hr' || route.path.startsWith('/hr/')
}

function isFinanceActive() {
  return route.path === '/finance' || route.path.startsWith('/finance/') || route.path === '/my-finance'
}

function isCollabActive() {
  return route.path.startsWith('/chat')
    || route.path.startsWith('/meetings')
    || route.path === '/ai'
    || route.path.startsWith('/notes')
}

function onNavigate() {
  if (isMobileNav.value) closeMobileSidebar()
}

function toggleHr() {
  hrExpanded.value = !hrExpanded.value
}

function toggleFinance() {
  financeExpanded.value = !financeExpanded.value
}

onMounted(() => {
  if (authStore.isAuthenticated) chatStore.fetchUnreadTotal()
})
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
        v-for="item in navItemsPrimary"
        :key="item.to"
        :to="item.to"
        :title="showCompact ? item.label : undefined"
        class="flex w-full items-center rounded-xl text-sm font-medium transition-all duration-150"
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

      <NuxtLink
        v-for="item in navItemsCollab"
        :key="item.to"
        :to="item.to"
        :title="showCompact ? item.label : undefined"
        class="relative flex w-full items-center rounded-xl text-sm font-medium transition-all duration-150"
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
        <UBadge
          v-if="item.badge && item.badge > 0"
          color="error"
          size="xs"
          class="absolute top-1.5 end-1.5 min-w-[1rem]"
        >
          {{ item.badge > 99 ? '99+' : item.badge }}
        </UBadge>
      </NuxtLink>

      <!-- HR cascading menu -->
      <div v-if="showHrNav && hrNavItems.length" class="pt-1">
        <UDropdownMenu
          v-if="showCompact"
          :items="hrDropdownItems"
          :content="{ side: isRtl ? 'left' : 'right', align: 'start', sideOffset: 8 }"
        >
          <button
            type="button"
            :title="t('nav.hr.section')"
            class="relative flex w-full items-center justify-center rounded-xl p-2.5 transition-all duration-150"
            :class="isHrActive()
              ? 'bg-[var(--color-midesk-accent)] text-white shadow-[0_0_20px_var(--color-midesk-accent-glow)]'
              : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.06] hover:text-[var(--color-midesk-text)]'"
          >
            <UIcon name="i-lucide-building-2" class="size-5 shrink-0" />
            <span
              class="absolute bottom-1 end-1 flex size-3.5 items-center justify-center rounded-full bg-[var(--color-midesk-accent)] text-white"
            >
              <UIcon name="i-lucide-chevrons-up-down" class="size-2.5" />
            </span>
          </button>
        </UDropdownMenu>

        <template v-else>
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
            :class="isHrActive()
              ? 'bg-white/[0.06] text-[var(--color-midesk-text)] ring-1 ring-[var(--color-midesk-border)]'
              : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.06] hover:text-[var(--color-midesk-text)]'"
            :aria-expanded="hrExpanded"
            :aria-label="t('nav.hr.section')"
            @click="toggleHr"
          >
            <UIcon name="i-lucide-building-2" class="size-5 shrink-0" />
            <span class="min-w-0 flex-1 truncate text-start">{{ t('nav.hr.section') }}</span>
            <span
              class="flex size-6 shrink-0 items-center justify-center rounded-md border border-[var(--color-midesk-border)] bg-white/[0.04]"
              :class="hrExpanded ? 'text-[var(--color-midesk-accent)]' : 'text-[var(--color-midesk-muted)]'"
              aria-hidden="true"
            >
              <UIcon
                :name="isRtl ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"
                class="size-3.5 transition-transform duration-200"
                :class="{ 'rotate-90': hrExpanded && !isRtl, '-rotate-90': hrExpanded && isRtl }"
              />
            </span>
          </button>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-show="hrExpanded"
              class="mt-1 space-y-0.5 border-s-2 border-[var(--color-midesk-border)] ps-3 ms-3.5"
              role="group"
              :aria-label="t('nav.hr.section')"
            >
              <NuxtLink
                v-for="item in hrNavItems"
                :key="item.to"
                :to="item.to"
                class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150"
                :class="isActive(item.to)
                  ? 'bg-[var(--color-midesk-accent-soft)] font-medium text-[var(--color-midesk-accent)]'
                  : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.04] hover:text-[var(--color-midesk-text)]'"
                @click="onNavigate"
              >
                <UIcon :name="item.icon" class="size-4 shrink-0" />
                <span class="truncate">{{ item.label }}</span>
              </NuxtLink>
            </div>
          </Transition>
        </template>
      </div>

      <!-- Finance cascading menu -->
      <div v-if="showFinanceNav && financeNavItems.length" class="pt-1">
        <UDropdownMenu
          v-if="showCompact"
          :items="financeDropdownItems"
          :content="{ side: isRtl ? 'left' : 'right', align: 'start', sideOffset: 8 }"
        >
          <button
            type="button"
            :title="t('nav.finance.section')"
            class="relative flex w-full items-center justify-center rounded-xl p-2.5 transition-all duration-150"
            :class="isFinanceActive()
              ? 'bg-[var(--color-midesk-accent)] text-white shadow-[0_0_20px_var(--color-midesk-accent-glow)]'
              : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.06] hover:text-[var(--color-midesk-text)]'"
          >
            <UIcon name="i-lucide-wallet" class="size-5 shrink-0" />
            <span
              class="absolute bottom-1 end-1 flex size-3.5 items-center justify-center rounded-full bg-[var(--color-midesk-accent)] text-white"
            >
              <UIcon name="i-lucide-chevrons-up-down" class="size-2.5" />
            </span>
          </button>
        </UDropdownMenu>

        <template v-else>
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
            :class="isFinanceActive()
              ? 'bg-white/[0.06] text-[var(--color-midesk-text)] ring-1 ring-[var(--color-midesk-border)]'
              : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.06] hover:text-[var(--color-midesk-text)]'"
            :aria-expanded="financeExpanded"
            :aria-label="t('nav.finance.section')"
            @click="toggleFinance"
          >
            <UIcon name="i-lucide-wallet" class="size-5 shrink-0" />
            <span class="min-w-0 flex-1 truncate text-start">{{ t('nav.finance.section') }}</span>
            <span
              class="flex size-6 shrink-0 items-center justify-center rounded-md border border-[var(--color-midesk-border)] bg-white/[0.04]"
              :class="financeExpanded ? 'text-[var(--color-midesk-accent)]' : 'text-[var(--color-midesk-muted)]'"
              aria-hidden="true"
            >
              <UIcon
                :name="isRtl ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"
                class="size-3.5 transition-transform duration-200"
                :class="{ 'rotate-90': financeExpanded && !isRtl, '-rotate-90': financeExpanded && isRtl }"
              />
            </span>
          </button>

          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-show="financeExpanded"
              class="mt-1 space-y-0.5 border-s-2 border-[var(--color-midesk-border)] ps-3 ms-3.5"
              role="group"
              :aria-label="t('nav.finance.section')"
            >
              <NuxtLink
                v-for="item in financeNavItems"
                :key="item.to"
                :to="item.to"
                class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-all duration-150"
                :class="isActive(item.to)
                  ? 'bg-[var(--color-midesk-accent-soft)] font-medium text-[var(--color-midesk-accent)]'
                  : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.04] hover:text-[var(--color-midesk-text)]'"
                @click="onNavigate"
              >
                <UIcon :name="item.icon" class="size-4 shrink-0" />
                <span class="truncate">{{ item.label }}</span>
              </NuxtLink>
            </div>
          </Transition>
        </template>
      </div>

      <NuxtLink
        v-for="item in navItemsSecondary"
        :key="item.to"
        :to="item.to"
        :title="showCompact ? item.label : undefined"
        class="flex w-full items-center rounded-xl text-sm font-medium transition-all duration-150"
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
        class="flex w-full items-center rounded-xl text-sm transition-all duration-150"
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
        class="midesk-glass mt-2 flex w-full items-center rounded-xl border border-[var(--color-midesk-border)]"
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
