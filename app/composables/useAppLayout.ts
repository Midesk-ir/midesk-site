import { createSharedComposable, useMediaQuery } from '@vueuse/core'

export const useAppLayout = createSharedComposable(() => {
  const uiStore = useUiStore()
  const isMobileNav = useMediaQuery('(max-width: 1023px)')

  function toggleSidebar() {
    if (isMobileNav.value) {
      uiStore.sidebarMobileOpen = !uiStore.sidebarMobileOpen
      return
    }
    uiStore.sidebarCollapsed = !uiStore.sidebarCollapsed
  }

  function closeMobileSidebar() {
    uiStore.sidebarMobileOpen = false
  }

  if (import.meta.client) {
    watch(isMobileNav, (mobile) => {
      if (!mobile) uiStore.sidebarMobileOpen = false
    })

    watch(
      () => uiStore.sidebarMobileOpen,
      (open) => {
        document.body.style.overflow = open && isMobileNav.value ? 'hidden' : ''
      }
    )
  }

  return {
    isMobileNav,
    toggleSidebar,
    closeMobileSidebar
  }
})
