<template>
  <div
    class="midesk-app-shell midesk-layout-grid"
    :class="uiStore.sidebarCollapsed && !isMobileNav ? 'midesk-layout-collapsed' : ''"
    :dir="layoutDir"
  >
    <Teleport to="body">
      <Transition name="midesk-sidebar-backdrop">
        <button
          v-if="uiStore.sidebarMobileOpen && isMobileNav"
          type="button"
          class="midesk-sidebar-backdrop"
          :aria-label="t('common.close')"
          @click="closeMobileSidebar"
        />
      </Transition>
    </Teleport>

    <LayoutAppSidebar />

    <LayoutAppTopbar />

    <main class="midesk-main px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
      <div class="mx-auto w-full min-w-0 max-w-full">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const uiStore = useUiStore()
const route = useRoute()
const { t, localeProperties } = useI18n()
const { isMobileNav, closeMobileSidebar } = useAppLayout()

const layoutDir = computed(() => (localeProperties.value.dir === 'ltr' ? 'ltr' : 'rtl'))

watch(() => route.path, closeMobileSidebar)
</script>
