<script setup lang="ts">
import type { DashboardSummary } from '~/types'
import type { HrDashboardSummary } from '~/types/phase2'
import type { ClockStatus } from '~/types/phase2'

definePageMeta({ layout: 'default', middleware: ['auth', 'tenant'] })

const { t } = useI18n()
const { api } = useApi()
const { formatRelative } = useCalendar()
const toast = useToast()
const authStore = useAuthStore()
const leaveStore = useLeaveStore()
const { can, hasLeaveModule } = usePermissions()

const summary = ref<DashboardSummary | null>(null)
const hrSummary = ref<HrDashboardSummary | null>(null)
const clockStatus = ref<ClockStatus | null>(null)
const loading = ref(true)
const error = ref(false)

const isManager = computed(() => {
  const role = authStore.user?.role
  return role === 'OWNER' || role === 'ADMIN' || role === 'MANAGER'
})

const weekHours = computed(() => {
  const minutes = summary.value?.week_worklog_minutes ?? 0
  return (minutes / 60).toFixed(1)
})

const totalLeaveRemaining = computed(() =>
  leaveStore.balances.reduce((sum, b) => sum + b.remaining, 0)
)

const stats = computed(() => [
  {
    label: t('dashboard.myTasks'),
    value: summary.value?.my_tasks.length ?? 0,
    icon: 'i-lucide-list-todo'
  },
  {
    label: t('dashboard.overdueTasks'),
    value: summary.value?.overdue_tasks.length ?? 0,
    icon: 'i-lucide-clock-alert'
  },
  {
    label: t('dashboard.activeProjects'),
    value: summary.value?.active_projects.length ?? 0,
    icon: 'i-lucide-folder-kanban'
  },
  {
    label: t('dashboard.unreadNotifications'),
    value: summary.value?.notifications_unread ?? 0,
    icon: 'i-lucide-bell',
    to: '/notifications'
  }
])

const quickLinks = computed(() => [
  { label: t('nav.worklog'), to: '/worklog', icon: 'i-lucide-clock', show: true },
  { label: t('nav.calendar'), to: '/calendar', icon: 'i-lucide-calendar', show: true },
  { label: t('nav.leave'), to: '/leave', icon: 'i-lucide-tree-palm', show: hasLeaveModule.value },
  { label: t('nav.chat'), to: '/chat', icon: 'i-lucide-message-square', show: can('chat:view') },
  { label: t('nav.meetings'), to: '/meetings', icon: 'i-lucide-video', show: can('meetings:view') },
  { label: t('nav.ai'), to: '/ai', icon: 'i-lucide-sparkles', show: can('ai:view') },
  { label: t('nav.notes'), to: '/notes', icon: 'i-lucide-sticky-note', show: can('notes:view') },
  { label: t('nav.correspondence'), to: '/correspondence', icon: 'i-lucide-mail', show: can('correspondence:view') },
  { label: t('nav.surveys'), to: '/surveys', icon: 'i-lucide-clipboard-list', show: can('surveys:view') },
  { label: t('nav.crm'), to: '/crm', icon: 'i-lucide-handshake', show: can('crm:view') },
  { label: t('nav.reportBuilder'), to: '/reports', icon: 'i-lucide-bar-chart-4', show: can('reports:view') },
  { label: t('nav.performance'), to: '/performance', icon: 'i-lucide-gauge', show: can('performance:dashboard:view') },
  { label: t('nav.hr.dashboard'), to: '/hr', icon: 'i-lucide-building-2', show: can('hr:dashboard:view') },
  { label: t('nav.finance.dashboard'), to: '/finance', icon: 'i-lucide-wallet', show: can('finance:dashboard:view') },
  { label: t('nav.finance.myFinance'), to: '/my-finance', icon: 'i-lucide-banknote', show: can('finance:my:view') && !can('finance:dashboard:view') },
  { label: t('nav.teams'), to: '/teams', icon: 'i-lucide-users', show: true },
  { label: t('nav.settings'), to: '/settings', icon: 'i-lucide-settings', show: true },
  { label: t('nav.subscription'), to: '/subscription', icon: 'i-lucide-credit-card', show: authStore.isOwner }
].filter(item => item.show))

async function load() {
  loading.value = true
  error.value = false
  try {
    summary.value = await api<DashboardSummary>('/dashboard/summary')

    if (hasLeaveModule.value) {
      await leaveStore.fetchAll().catch(() => {
        toast.add({ title: t('leave.balance.title'), description: t('common.error'), color: 'warning' })
      })
    }

    if (can('hr:attendance:clock')) {
      await api<{ data: { clock_status: ClockStatus } }>('/hr/attendance/my').then(res => {
        clockStatus.value = res.data.clock_status
      }).catch(() => {
        toast.add({ title: t('dashboard.attendanceToday'), description: t('common.error'), color: 'warning' })
      })
    }

    if (can('hr:dashboard:view')) {
      await api<{ data: HrDashboardSummary }>('/hr/dashboard').then(res => {
        hrSummary.value = res.data
      }).catch(() => {
        toast.add({ title: t('hr.dashboard.title'), description: t('common.error'), color: 'warning' })
      })
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <LayoutMideskPageHeader
      :title="t('dashboard.title')"
      :subtitle="t('app.tagline')"
    />

    <div v-if="loading" class="space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <USkeleton v-for="i in 4" :key="i" class="midesk-skeleton-stat" />
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <USkeleton v-for="i in 3" :key="`widget-${i}`" class="midesk-skeleton-card" />
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <UiSkeletonCard :rows="4" row-class="h-10 rounded-lg" :show-title="true" />
        <UiSkeletonCard :rows="4" row-class="h-10 rounded-lg" :show-title="true" />
      </div>

      <UiSkeletonCard :rows="2" row-class="midesk-skeleton-card-lg" />
      <UiSkeletonCard :rows="5" row-class="h-10 rounded-lg" />
    </div>

    <UiEmptyState
      v-else-if="error || !summary"
      :title="t('common.error')"
      icon="i-lucide-circle-alert"
    >
      <template #action>
        <UButton color="primary" @click="load">{{ t('common.retry') }}</UButton>
      </template>
    </UiEmptyState>

    <div v-else class="space-y-6">
      <!-- Stats -->
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <component
          :is="stat.to ? 'NuxtLink' : 'div'"
          v-for="stat in stats"
          :key="stat.label"
          :to="stat.to"
          class="midesk-stat-card block transition hover:ring-1 hover:ring-[var(--color-midesk-border)]"
          :class="{ 'cursor-pointer': stat.to }"
        >
          <div class="mb-3 flex items-center justify-between">
            <span class="text-sm text-[var(--color-midesk-muted)]">{{ stat.label }}</span>
            <div class="flex size-9 items-center justify-center rounded-lg bg-[var(--color-midesk-accent-soft)]">
              <UIcon :name="stat.icon" class="size-4 text-[var(--color-midesk-accent)]" />
            </div>
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ stat.value }}
          </p>
        </component>
      </div>

      <!-- Quick links -->
      <section v-if="quickLinks.length" class="midesk-card p-5">
        <h2 class="midesk-card-header">{{ t('dashboard.quickLinks') }}</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <NuxtLink
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="flex w-full items-center gap-3 rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.02] px-4 py-3 text-sm font-medium transition hover:border-[var(--color-midesk-accent)] hover:bg-white/[0.04]"
          >
            <UIcon :name="link.icon" class="size-5 shrink-0 text-[var(--color-midesk-accent)]" />
            <span class="truncate">{{ link.label }}</span>
          </NuxtLink>
        </div>
      </section>

      <!-- Phase 1 widgets -->
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <section class="midesk-card p-5">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('dashboard.activeSprint') }}</h2>
            <UIcon name="i-lucide-zap" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <template v-if="summary.active_sprint">
            <NuxtLink
              :to="`/projects/${summary.active_sprint.project_id}/sprints`"
              class="midesk-link text-lg font-semibold"
            >
              {{ summary.active_sprint.name }}
            </NuxtLink>
            <p class="mt-1 text-sm text-muted">{{ summary.active_sprint.project_name }}</p>
            <p class="mt-2 text-sm text-[var(--color-midesk-text)]">
              {{ t('sprint.daysRemaining', { days: summary.active_sprint.days_remaining }) }}
            </p>
          </template>
          <p v-else class="text-sm text-muted">{{ t('sprint.noActive') }}</p>
        </section>

        <section class="midesk-card p-5">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('dashboard.weekHours') }}</h2>
            <UIcon name="i-lucide-clock" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ weekHours }}h
          </p>
          <NuxtLink to="/worklog" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.worklog') }}
          </NuxtLink>
        </section>

        <section v-if="hasLeaveModule && isManager && summary.pending_leave_count != null" class="midesk-card p-5">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('dashboard.pendingLeave') }}</h2>
            <UIcon name="i-lucide-tree-palm" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ summary.pending_leave_count }}
          </p>
          <NuxtLink to="/leave" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.leave') }}
          </NuxtLink>
        </section>

        <section v-if="hasLeaveModule && leaveStore.balances.length" class="midesk-card p-5">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('leave.balance.title') }}</h2>
            <UIcon name="i-lucide-tree-palm" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ totalLeaveRemaining }}
            <span class="text-base font-normal text-[var(--color-midesk-muted)]">{{ t('leave.balance.days') }}</span>
          </p>
          <NuxtLink to="/leave" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.leave') }}
          </NuxtLink>
        </section>

        <section v-if="clockStatus" class="midesk-card p-5">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('dashboard.attendanceToday') }}</h2>
            <UIcon name="i-lucide-clock" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-lg font-semibold text-[var(--color-midesk-text)]">
            {{ t(`hr.attendance.clockStatus.${clockStatus}`) }}
          </p>
          <NuxtLink to="/hr/attendance/my" class="midesk-link mt-2 inline-block text-sm">
            {{ t('hr.attendance.myAttendance') }}
          </NuxtLink>
        </section>

        <section v-if="hrSummary?.expiring_contracts.length" class="midesk-card p-5">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('hr.dashboard.expiringContracts') }}</h2>
            <UIcon name="i-lucide-file-warning" class="size-5 text-red-400" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ hrSummary.expiring_contracts.length }}
          </p>
          <NuxtLink to="/hr/contracts" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.hr.contracts') }}
          </NuxtLink>
        </section>

        <section v-if="hrSummary && hrSummary.new_candidates_count > 0" class="midesk-card p-5">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('hr.dashboard.newCandidates') }}</h2>
            <UIcon name="i-lucide-user-plus" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ hrSummary.new_candidates_count }}
          </p>
          <NuxtLink to="/hr/recruitment" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.hr.recruitment') }}
          </NuxtLink>
        </section>

        <section v-if="hrSummary?.active_onboarding.length" class="midesk-card p-5">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('hr.dashboard.activeOnboarding') }}</h2>
            <UIcon name="i-lucide-user-check" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ hrSummary.active_onboarding.length }}
          </p>
          <NuxtLink to="/hr/onboarding" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.hr.onboarding') }}
          </NuxtLink>
        </section>

        <section
          v-if="summary.finance_widget?.pending_expenses_count != null"
          class="midesk-card p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('finance.dashboard.pendingExpenses') }}</h2>
            <UIcon name="i-lucide-receipt" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ summary.finance_widget.pending_expenses_count }}
          </p>
          <p class="mt-1 text-sm text-[var(--color-midesk-muted)]">
            <MideskCurrency
              :amount="summary.finance_widget.pending_expenses_amount ?? 0"
              :currency="summary.finance_widget.currency"
            />
          </p>
          <NuxtLink to="/finance/expenses" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.finance.expenses') }}
          </NuxtLink>
        </section>

        <section
          v-if="summary.finance_widget?.overdue_invoices_count != null"
          class="midesk-card p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('finance.dashboard.overdueInvoices') }}</h2>
            <UIcon name="i-lucide-file-warning" class="size-5 text-amber-400" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ summary.finance_widget.overdue_invoices_count }}
          </p>
          <NuxtLink to="/finance/invoices?status=overdue" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.finance.invoices') }}
          </NuxtLink>
        </section>

        <section
          v-if="summary.finance_widget?.latest_payslip"
          class="midesk-card p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('finance.dashboard.latestPayslip') }}</h2>
            <UIcon name="i-lucide-file-text" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-lg font-semibold text-[var(--color-midesk-text)]">
            {{ summary.finance_widget.latest_payslip.period }}
          </p>
          <p class="mt-1 text-2xl font-bold text-[var(--color-midesk-text)]">
            <MideskCurrency
              :amount="summary.finance_widget.latest_payslip.net_amount"
              :currency="summary.finance_widget.latest_payslip.currency"
            />
          </p>
          <NuxtLink to="/my-finance" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.finance.myFinance') }}
          </NuxtLink>
        </section>

        <section
          v-if="summary.finance_widget?.my_pending_expenses_count != null"
          class="midesk-card p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('finance.dashboard.myPendingExpenses') }}</h2>
            <UIcon name="i-lucide-wallet" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ summary.finance_widget.my_pending_expenses_count }}
          </p>
          <NuxtLink to="/my-finance" class="midesk-link mt-2 inline-block text-sm">
            {{ t('finance.expenses.myExpenses') }}
          </NuxtLink>
        </section>

        <section
          v-if="summary.collab_widget?.chat_unread != null && summary.collab_widget.chat_unread > 0"
          class="midesk-card p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('dashboard.chatUnread') }}</h2>
            <UIcon name="i-lucide-message-square" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ summary.collab_widget.chat_unread }}
          </p>
          <NuxtLink to="/chat" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.chat') }}
          </NuxtLink>
        </section>

        <section
          v-if="summary.collab_widget?.meetings_today != null"
          class="midesk-card p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('dashboard.meetingsToday') }}</h2>
            <UIcon name="i-lucide-video" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ summary.collab_widget.meetings_today }}
          </p>
          <p v-if="summary.collab_widget.meetings_upcoming" class="mt-1 text-sm text-[var(--color-midesk-muted)]">
            {{ t('dashboard.meetingsUpcoming') }}: {{ summary.collab_widget.meetings_upcoming }}
          </p>
          <NuxtLink to="/meetings" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.meetings') }}
          </NuxtLink>
        </section>

        <section
          v-if="summary.correspondence_widget?.inbox_pending != null"
          class="midesk-card p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('dashboard.correspondenceInbox') }}</h2>
            <UIcon name="i-lucide-inbox" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ summary.correspondence_widget.inbox_pending }}
          </p>
          <NuxtLink to="/correspondence/inbox" class="midesk-link mt-2 inline-block text-sm">
            {{ t('correspondence.inbox') }}
          </NuxtLink>
        </section>

        <section
          v-if="summary.crm_widget?.hot_opportunities != null"
          class="midesk-card p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('dashboard.crmHotDeals') }}</h2>
            <UIcon name="i-lucide-flame" class="size-5 text-orange-400" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ summary.crm_widget.hot_opportunities }}
          </p>
          <p class="mt-1 text-sm text-[var(--color-midesk-muted)]">
            {{ summary.crm_widget.open_opportunities }} {{ t('dashboard.crmOpenDeals') }}
            · {{ summary.crm_widget.contacts_count }} {{ t('dashboard.crmContacts') }}
          </p>
          <NuxtLink to="/crm" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.crm') }}
          </NuxtLink>
        </section>

        <section
          v-if="summary.surveys_widget?.active_count != null"
          class="midesk-card p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('dashboard.activeSurveys') }}</h2>
            <UIcon name="i-lucide-clipboard-list" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ summary.surveys_widget.active_count }}
          </p>
          <p v-if="summary.surveys_widget.draft_count" class="mt-1 text-sm text-[var(--color-midesk-muted)]">
            {{ summary.surveys_widget.draft_count }} {{ t('dashboard.draftSurveys') }}
          </p>
          <NuxtLink to="/surveys" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.surveys') }}
          </NuxtLink>
        </section>

        <section
          v-if="summary.performance_widget?.objectives_at_risk != null"
          class="midesk-card p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('dashboard.objectivesAtRisk') }}</h2>
            <UIcon name="i-lucide-alert-triangle" class="size-5 text-amber-400" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ summary.performance_widget.objectives_at_risk }}
          </p>
          <p v-if="summary.performance_widget.upcoming_reviews" class="mt-1 text-sm text-[var(--color-midesk-muted)]">
            {{ summary.performance_widget.upcoming_reviews }} {{ t('dashboard.upcomingReviews') }}
          </p>
          <NuxtLink to="/performance" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.performance') }}
          </NuxtLink>
        </section>

        <section
          v-if="summary.reports_widget?.saved_count != null"
          class="midesk-card p-5"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="midesk-card-header mb-0">{{ t('dashboard.savedReports') }}</h2>
            <UIcon name="i-lucide-bar-chart-4" class="size-5 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight text-[var(--color-midesk-text)]">
            {{ summary.reports_widget.saved_count }}
          </p>
          <NuxtLink to="/reports" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.reportBuilder') }}
          </NuxtLink>
        </section>
      </div>

      <!-- Tasks row -->
      <div class="grid gap-4 lg:grid-cols-2">
        <section class="midesk-card p-5">
          <h2 class="midesk-card-header">{{ t('dashboard.myTasks') }}</h2>
          <ul class="space-y-2">
            <li
              v-for="task in summary.my_tasks"
              :key="task.id"
              class="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition hover:bg-white/[0.03]"
            >
              <NuxtLink :to="`/projects/${task.project_id}`" class="midesk-link truncate text-sm">
                {{ task.title }}
              </NuxtLink>
              <UBadge color="primary" size="xs" variant="subtle">
                {{ t(`kanban.columns.${task.status}`) }}
              </UBadge>
            </li>
          </ul>
        </section>

        <section class="midesk-card p-5">
          <h2 class="midesk-card-header">{{ t('dashboard.overdueTasks') }}</h2>
          <ul v-if="summary.overdue_tasks.length" class="space-y-2">
            <li
              v-for="task in summary.overdue_tasks"
              :key="task.id"
              class="rounded-lg px-2 py-2 text-sm text-red-400"
            >
              {{ task.title }}
            </li>
          </ul>
          <p v-else class="text-sm text-[var(--color-midesk-muted)]">—</p>
        </section>
      </div>

      <!-- Projects -->
      <section class="midesk-card p-5">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="midesk-card-header mb-0">{{ t('dashboard.activeProjects') }}</h2>
          <UButton to="/projects" size="sm" variant="soft" color="primary">
            {{ t('nav.projects') }}
          </UButton>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <ProjectCard
            v-for="project in summary.active_projects"
            :key="project.id"
            :project="project"
          />
        </div>
        <UiEmptyState
          v-if="!summary.active_projects.length"
          :title="t('dashboard.emptyTitle')"
          :description="t('dashboard.emptyDesc')"
          icon="i-lucide-folder-plus"
          class="py-8"
        >
          <template #action>
            <UButton to="/projects" color="primary">{{ t('dashboard.createProject') }}</UButton>
          </template>
        </UiEmptyState>
      </section>

      <!-- Activity -->
      <section class="midesk-card p-5">
        <h2 class="midesk-card-header">{{ t('dashboard.recentActivity') }}</h2>
        <ul class="space-y-3">
          <li
            v-for="item in summary.recent_activity"
            :key="item.id"
            class="flex items-center justify-between gap-4 rounded-lg px-2 py-2 text-sm transition hover:bg-white/[0.03]"
          >
            <span class="text-[var(--color-midesk-text)]">{{ item.message }}</span>
            <span class="shrink-0 text-[var(--color-midesk-muted)]">{{ formatRelative(item.created_at) }}</span>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
