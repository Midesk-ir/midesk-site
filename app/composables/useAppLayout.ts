import { createSharedComposable, useMediaQuery } from '@vueuse/core'

export const useAppLayout = createSharedComposable(() => {
  const isMobileNav = useMediaQuery('(max-width: 1023px)')

  function uiStore() {
    return useUiStore()
  }

  function toggleSidebar() {
    const store = uiStore()
    if (isMobileNav.value) {
      store.sidebarMobileOpen = !store.sidebarMobileOpen
      return
    }
    store.sidebarCollapsed = !store.sidebarCollapsed
  }

  function closeMobileSidebar() {
    uiStore().sidebarMobileOpen = false
  }

  if (import.meta.client) {
    watch(isMobileNav, (mobile) => {
      if (!mobile) uiStore().sidebarMobileOpen = false
    })

    watch(
      () => uiStore().sidebarMobileOpen,
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
