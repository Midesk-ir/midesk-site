<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

const links = computed(() => [
  { label: t('superAdmin.nav.dashboard'), to: '/super-admin/dashboard', icon: 'i-lucide-layout-dashboard' },
  { label: t('superAdmin.nav.tenants'), to: '/super-admin/tenants', icon: 'i-lucide-building' },
  { label: t('superAdmin.nav.plans'), to: '/super-admin/plans', icon: 'i-lucide-credit-card' },
  { label: t('superAdmin.nav.financial'), to: '/super-admin/financial', icon: 'i-lucide-trending-up' },
  { label: t('superAdmin.nav.consultations'), to: '/super-admin/consultations', icon: 'i-lucide-message-circle' },
  { label: t('superAdmin.nav.systemCheck'), to: '/super-admin/system-check', icon: 'i-lucide-activity' },
  { label: t('superAdmin.nav.settings'), to: '/super-admin/settings', icon: 'i-lucide-settings' }
])

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<template>
  <aside class="midesk-sidebar-column midesk-glass hidden md:flex md:flex-col">
    <div class="midesk-sidebar-brand midesk-sidebar-brand-expanded shrink-0">
      <NuxtLink to="/super-admin/dashboard" class="flex items-center gap-2">
        <UIcon name="i-lucide-shield" class="size-6 text-red-500" />
        <span class="font-semibold text-[var(--color-midesk-text)]">Midesk SA</span>
      </NuxtLink>
    </div>
    <nav class="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
      <NuxtLink
        v-for="item in links"
        :key="item.to"
        :to="item.to"
        class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
        :class="isActive(item.to)
          ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)]'
          : 'text-[var(--color-midesk-muted)] hover:bg-white/[0.06] hover:text-[var(--color-midesk-text)]'"
      >
        <UIcon :name="item.icon" class="size-5 shrink-0" />
        <span class="truncate">{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </aside>
</template>
