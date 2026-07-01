<script setup lang="ts">
import type { SidebarNavGroupItem } from '~/components/layout/SidebarNavGroup.vue'

const uiStore = useUiStore()
const authStore = useAuthStore()
const route = useRoute()
const { logout } = useAuth()
const { t, localeProperties } = useI18n()
const { isMobileNav, closeMobileSidebar } = useAppLayout()
const { can, canAny } = usePermissions()
const chatStore = useChatStore()

const workExpanded = ref(false)
const collabExpanded = ref(false)
const businessExpanded = ref(false)
const hrExpanded = ref(false)
const financeExpanded = ref(false)
const orgExpanded = ref(false)

watch(() => route.path, (path) => {
  if (path.startsWith('/worklog') || path.startsWith('/calendar') || path.startsWith('/leave')) {
    workExpanded.value = true
  }
  if (path.startsWith('/chat') || path.startsWith('/meetings') || path === '/ai' || path.startsWith('/notes')) {
    collabExpanded.value = true
  }
  if (path.startsWith('/correspondence') || path.startsWith('/surveys') || path.startsWith('/crm')
    || path.startsWith('/reports') || path.startsWith('/performance')) {
    businessExpanded.value = true
  }
  if (path.startsWith('/hr')) hrExpanded.value = true
  if (path.startsWith('/finance') || path === '/my-finance') financeExpanded.value = true
  if (path.startsWith('/teams') || path.startsWith('/members') || path.startsWith('/settings')
    || path.startsWith('/subscription')) {
    orgExpanded.value = true
  }
}, { immediate: true })

const isRtl = computed(() => localeProperties.value.dir === 'rtl')
const showCompact = computed(() => uiStore.sidebarCollapsed && !isMobileNav.value)
const chatUnread = computed(() => chatStore.unreadTotal)

const navItemsPrimary = computed(() => [
  { label: t('nav.dashboard'), to: '/dashboard', icon: 'i-lucide-layout-dashboard' },
  { label: t('nav.projects'), to: '/projects', icon: 'i-lucide-folder-kanban' }
])

const workNavItems = computed<SidebarNavGroupItem[]>(() => [
  { label: t('nav.worklog'), to: '/worklog', icon: 'i-lucide-clock' },
  { label: t('nav.calendar'), to: '/calendar', icon: 'i-lucide-calendar' },
  { label: t('nav.leave'), to: '/leave', icon: 'i-lucide-tree-palm' }
])

const collabNavItems = computed<SidebarNavGroupItem[]>(() => [
  { label: t('nav.chat'), to: '/chat', icon: 'i-lucide-message-square', badge: chatUnread.value },
  { label: t('nav.meetings'), to: '/meetings', icon: 'i-lucide-video' },
  { label: t('nav.ai'), to: '/ai', icon: 'i-lucide-sparkles' },
  { label: t('nav.notes'), to: '/notes', icon: 'i-lucide-sticky-note' }
])

const businessNavItems = computed<SidebarNavGroupItem[]>(() => [
  { label: t('nav.correspondence'), to: '/correspondence', icon: 'i-lucide-mail', show: can('correspondence:view') },
  { label: t('nav.surveys'), to: '/surveys', icon: 'i-lucide-clipboard-list', show: can('surveys:view') },
  { label: t('nav.crm'), to: '/crm', icon: 'i-lucide-handshake', show: can('crm:view') },
  { label: t('nav.reportBuilder'), to: '/reports', icon: 'i-lucide-bar-chart-4', show: can('reports:view') },
  { label: t('nav.performance'), to: '/performance', icon: 'i-lucide-gauge', show: can('performance:dashboard:view') }
].filter(item => item.show).map(({ label, to, icon }) => ({ label, to, icon })))

const showHrNav = computed(() => {
  if (!authStore.isAuthenticated) return false
  return can('hr:dashboard:view')
    || can('hr:attendance:clock')
    || authStore.permissions.some((p: string) => p.startsWith('hr:'))
})

const hrNavItems = computed<SidebarNavGroupItem[]>(() => [
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
].filter(item => item.show).map(({ label, to, icon }) => ({ label, to, icon })))

const showFinanceNav = computed(() => {
  if (!authStore.isAuthenticated) return false
  return authStore.permissions.some((p: string) => p.startsWith('finance:'))
})

const financeNavItems = computed<SidebarNavGroupItem[]>(() => [
  { label: t('nav.finance.dashboard'), to: '/finance', icon: 'i-lucide-chart-pie', show: can('finance:dashboard:view') },
  { label: t('nav.finance.expenses'), to: '/finance/expenses', icon: 'i-lucide-receipt', show: canAny(['finance:expenses:view', 'finance:expenses:create', 'finance:expenses:approve', 'finance:expenses:pay']) },
  { label: t('nav.finance.budgets'), to: '/finance/budgets', icon: 'i-lucide-pie-chart', show: can('finance:budgets:view') },
  { label: t('nav.finance.invoices'), to: '/finance/invoices', icon: 'i-lucide-file-text', show: can('finance:invoices:view') },
  { label: t('nav.finance.purchaseRequests'), to: '/finance/purchase-requests', icon: 'i-lucide-shopping-cart', show: canAny(['finance:expenses:create', 'finance:expenses:view', 'finance:invoices:view']) },
  { label: t('nav.finance.purchaseOrders'), to: '/finance/purchase-orders', icon: 'i-lucide-package', show: can('finance:invoices:view') },
  { label: t('nav.finance.vendors'), to: '/finance/vendors', icon: 'i-lucide-truck', show: can('finance:invoices:view') },
  { label: t('nav.finance.payroll'), to: '/finance/payroll', icon: 'i-lucide-banknote', show: can('finance:payroll:view') },
  { label: t('nav.finance.myFinance'), to: '/my-finance', icon: 'i-lucide-wallet', show: can('finance:my:view') }
].filter(item => item.show).map(({ label, to, icon }) => ({ label, to, icon })))

const orgNavItems = computed<SidebarNavGroupItem[]>(() => [
  { label: t('nav.teams'), to: '/teams', icon: 'i-lucide-users' },
  ...(authStore.isAdmin ? [{ label: t('nav.members'), to: '/members', icon: 'i-lucide-user-cog' }] : []),
  { label: t('nav.settings'), to: '/settings', icon: 'i-lucide-settings' },
  ...(authStore.isOwner ? [{ label: t('nav.subscription'), to: '/subscription', icon: 'i-lucide-credit-card' }] : [])
])

function isActive(path: string) {
  if (path === '/hr' || path === '/finance') {
    return route.path === path
  }
  if (path === '/chat') {
    return route.path === '/chat' || route.path.startsWith('/chat/')
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}

function isWorkActive() {
  return route.path.startsWith('/worklog')
    || route.path.startsWith('/calendar')
    || route.path.startsWith('/leave')
}

function isCollabActive() {
  return route.path.startsWith('/chat')
    || route.path.startsWith('/meetings')
    || route.path === '/ai'
    || route.path.startsWith('/notes')
}

function isBusinessActive() {
  return route.path.startsWith('/correspondence')
    || route.path.startsWith('/surveys')
    || route.path.startsWith('/crm')
    || route.path.startsWith('/reports')
    || route.path.startsWith('/performance')
}

function isHrActive() {
  return route.path === '/hr' || route.path.startsWith('/hr/')
}

function isFinanceActive() {
  return route.path === '/finance' || route.path.startsWith('/finance/') || route.path === '/my-finance'
}

function isOrgActive() {
  return route.path.startsWith('/teams')
    || route.path.startsWith('/members')
    || route.path.startsWith('/settings')
    || route.path.startsWith('/subscription')
}

function onNavigate() {
  if (isMobileNav.value) closeMobileSidebar()
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

      

      <LayoutSidebarNavGroup
        v-model:expanded="workExpanded"
        :label="t('nav.workSection')"
        icon="i-lucide-briefcase"
        :items="workNavItems"
        :show-compact="showCompact"
        :is-rtl="isRtl"
        :is-group-active="isWorkActive()"
        :is-item-active="isActive"
        @navigate="onNavigate"
      />

      <LayoutSidebarNavGroup
        v-model:expanded="collabExpanded"
        :label="t('nav.collabSection')"
        icon="i-lucide-message-square"
        :items="collabNavItems"
        :show-compact="showCompact"
        :is-rtl="isRtl"
        :is-group-active="isCollabActive()"
        :is-item-active="isActive"
        @navigate="onNavigate"
      />

      <LayoutSidebarNavGroup
        v-if="businessNavItems.length"
        v-model:expanded="businessExpanded"
        :label="t('nav.businessSection')"
        icon="i-lucide-layers"
        :items="businessNavItems"
        :show-compact="showCompact"
        :is-rtl="isRtl"
        :is-group-active="isBusinessActive()"
        :is-item-active="isActive"
        @navigate="onNavigate"
      />

      <LayoutSidebarNavGroup
        v-if="showHrNav && hrNavItems.length"
        v-model:expanded="hrExpanded"
        :label="t('nav.hr.section')"
        icon="i-lucide-building-2"
        :items="hrNavItems"
        :show-compact="showCompact"
        :is-rtl="isRtl"
        :is-group-active="isHrActive()"
        :is-item-active="isActive"
        @navigate="onNavigate"
      />

      <LayoutSidebarNavGroup
        v-if="showFinanceNav && financeNavItems.length"
        v-model:expanded="financeExpanded"
        :label="t('nav.finance.section')"
        icon="i-lucide-wallet"
        :items="financeNavItems"
        :show-compact="showCompact"
        :is-rtl="isRtl"
        :is-group-active="isFinanceActive()"
        :is-item-active="isActive"
        @navigate="onNavigate"
      />

      <LayoutSidebarNavGroup
        v-model:expanded="orgExpanded"
        :label="t('nav.orgSection')"
        icon="i-lucide-building"
        :items="orgNavItems"
        :show-compact="showCompact"
        :is-rtl="isRtl"
        :is-group-active="isOrgActive()"
        :is-item-active="isActive"
        @navigate="onNavigate"
      />
    </nav>

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
