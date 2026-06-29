<template>
  <div
    class="midesk-app-shell midesk-layout-grid"
    :class="uiStore.sidebarCollapsed && !isMobileNav ? 'midesk-layout-collapsed' : ''"
  >
    <Transition name="midesk-sidebar-backdrop">
      <button
        v-if="uiStore.sidebarMobileOpen && isMobileNav"
        type="button"
        class="midesk-sidebar-backdrop"
        :aria-label="t('common.close')"
        @click="closeMobileSidebar"
      />
    </Transition>

    <LayoutAppSidebar />

    <LayoutAppTopbar />

    <main class="midesk-main px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
      <div class="mx-auto w-full min-w-0">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const uiStore = useUiStore()
const route = useRoute()
const { t } = useI18n()
const { isMobileNav, closeMobileSidebar } = useAppLayout()

watch(() => route.path, closeMobileSidebar)
</script>
