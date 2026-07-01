<template>
  <div class="midesk-app-shell midesk-layout-grid midesk-sa-shell">
    <LayoutSuperAdminSidebar />
    <header class="midesk-sa-topbar midesk-glass flex items-center justify-between px-6 py-4">
      <p class="text-sm font-medium text-[var(--color-midesk-muted)]">
        {{ $t('superAdmin.panelTitle') }}
      </p>
      <UButton color="neutral" variant="ghost" icon="i-lucide-log-out" size="sm" @click="logout">
        {{ $t('nav.logout') }}
      </UButton>
    </header>
    <main class="midesk-sa-main px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div class="mx-auto w-full min-w-0 max-w-7xl">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const saStore = useSuperAdminStore()
const router = useRouter()

async function logout() {
  saStore.logout()
  await router.push('/super-admin/login')
}
</script>

<style scoped>
.midesk-sa-shell {
  --color-midesk-accent: #ef4444;
  --color-midesk-accent-glow: rgba(239, 68, 68, 0.35);
  --color-midesk-accent-soft: rgba(239, 68, 68, 0.12);
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'sidebar topbar'
    'sidebar main';
}
.midesk-sa-topbar { grid-area: topbar; }
.midesk-sa-main { grid-area: main; }
@media (max-width: 768px) {
  .midesk-sa-shell {
    grid-template-columns: 1fr;
    grid-template-areas: 'topbar' 'main';
  }
}
</style>
