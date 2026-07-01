<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth', 'tenant', 'hr'] })

const { t } = useI18n()
const hrStore = useHrStore()
const { can } = usePermissions()

const loading = ref(true)

const quickLinks = computed(() => [
  { label: t('nav.hr.personnel'), to: '/hr/personnel', icon: 'i-lucide-users', show: can('hr:personnel:view') },
  { label: t('nav.hr.attendance'), to: '/hr/attendance', icon: 'i-lucide-clock', show: can('hr:attendance:view') },
  { label: t('nav.hr.contracts'), to: '/hr/contracts', icon: 'i-lucide-file-text', show: can('hr:contracts:view') },
  { label: t('nav.hr.documents'), to: '/hr/documents', icon: 'i-lucide-folder', show: can('hr:documents:view') },
  { label: t('nav.hr.missions'), to: '/hr/missions', icon: 'i-lucide-map-pin', show: can('hr:missions:view') || can('hr:missions:request') },
  { label: t('nav.hr.recruitment'), to: '/hr/recruitment', icon: 'i-lucide-briefcase', show: can('hr:recruitment:view') },
  { label: t('nav.hr.onboarding'), to: '/hr/onboarding', icon: 'i-lucide-user-check', show: can('hr:onboarding:view') },
  { label: t('nav.hr.settings'), to: '/hr/settings', icon: 'i-lucide-settings', show: can('hr:settings:manage') }
].filter(item => item.show))

async function load() {
  loading.value = true
  try {
    if (can('hr:dashboard:view')) {
      await hrStore.fetchDashboard()
    }
  } finally {
    loading.value = false
  }
}

onMounted(load)

const dashboard = computed(() => hrStore.dashboard)
const attendance = computed(() => dashboard.value?.attendance_today)
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="midesk-page-title">{{ t('hr.dashboard.title') }}</h1>
      <p class="midesk-page-subtitle">{{ t('app.tagline') }}</p>
    </div>

    <div v-if="loading" class="space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <USkeleton v-for="i in 4" :key="i" class="midesk-skeleton-stat" />
      </div>
      <USkeleton class="midesk-skeleton-card h-48" />
    </div>

    <div v-else class="space-y-6">
      <div v-if="dashboard" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="midesk-stat-card">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-sm text-[var(--color-midesk-muted)]">{{ t('hr.dashboard.personnelCount') }}</span>
            <UIcon name="i-lucide-users" class="size-4 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight">{{ dashboard.active_personnel_count }}</p>
          <NuxtLink to="/hr/personnel" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.hr.personnel') }}
          </NuxtLink>
        </div>

        <div class="midesk-stat-card">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-sm text-[var(--color-midesk-muted)]">{{ t('hr.dashboard.attendanceToday') }}</span>
            <UIcon name="i-lucide-clock" class="size-4 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight">{{ attendance?.present ?? 0 }}</p>
          <p class="mt-1 text-xs text-[var(--color-midesk-muted)]">
            {{ t('hr.dashboard.present') }} · {{ attendance?.absent ?? 0 }} {{ t('hr.dashboard.absent') }}
            · {{ attendance?.on_leave ?? 0 }} {{ t('hr.dashboard.onLeave') }}
            · {{ attendance?.on_mission ?? 0 }} {{ t('hr.dashboard.onMission') }}
          </p>
          <NuxtLink to="/hr/attendance" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.hr.attendance') }}
          </NuxtLink>
        </div>

        <div class="midesk-stat-card">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-sm text-[var(--color-midesk-muted)]">{{ t('hr.dashboard.newCandidates') }}</span>
            <UIcon name="i-lucide-user-plus" class="size-4 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight">{{ dashboard.new_candidates_count }}</p>
          <NuxtLink to="/hr/recruitment" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.hr.recruitment') }}
          </NuxtLink>
        </div>

        <div class="midesk-stat-card">
          <div class="mb-3 flex items-center justify-between">
            <span class="text-sm text-[var(--color-midesk-muted)]">{{ t('hr.dashboard.activeOnboarding') }}</span>
            <UIcon name="i-lucide-user-check" class="size-4 text-[var(--color-midesk-accent)]" />
          </div>
          <p class="text-3xl font-bold tracking-tight">{{ dashboard.active_onboarding.length }}</p>
          <NuxtLink to="/hr/onboarding" class="midesk-link mt-2 inline-block text-sm">
            {{ t('nav.hr.onboarding') }}
          </NuxtLink>
        </div>
      </div>

      <HrContractExpiryAlert
        v-if="dashboard?.expiring_contracts.length"
        :contracts="dashboard.expiring_contracts"
      />

      <OnboardingList
        v-if="dashboard?.active_onboarding.length"
        :onboardings="dashboard.active_onboarding"
        @select="navigateTo('/hr/onboarding')"
      />

      <section v-if="quickLinks.length" class="midesk-card p-5">
        <h2 class="midesk-card-header">{{ t('hr.dashboard.quickLinks') }}</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <NuxtLink
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="flex w-full items-center gap-3 rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.02] px-4 py-3 text-sm font-medium transition hover:border-[var(--color-midesk-accent)] hover:bg-white/[0.04]"
          >
            <UIcon :name="link.icon" class="size-5 text-[var(--color-midesk-accent)]" />
            {{ link.label }}
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
