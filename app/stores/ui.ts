import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)
  const sidebarMobileOpen = ref(false)
  const taskModalOpen = ref(false)
  const activeTaskId = ref<string | null>(null)

  function openTaskModal(taskId: string) {
    activeTaskId.value = taskId
    taskModalOpen.value = true
  }

  function closeTaskModal() {
    taskModalOpen.value = false
    activeTaskId.value = null
  }

  return {
    sidebarCollapsed,
    sidebarMobileOpen,
    taskModalOpen,
    activeTaskId,
    openTaskModal,
    closeTaskModal
  }
})
