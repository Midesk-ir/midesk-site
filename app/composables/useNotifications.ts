import type { Notification } from '~/types'

export function useNotifications() {
  const { api } = useApi()
  const count = ref(0)
  const notifications = ref<Notification[]>([])
  const loading = ref(false)

  async function fetchCount() {
    const data = await api<{ count: number }>('/notifications/count')
    count.value = data.count
    return data.count
  }

  async function fetchNotifications() {
    loading.value = true
    try {
      const data = await api<{ data: Notification[] }>('/notifications')
      notifications.value = data.data
      return data.data
    } finally {
      loading.value = false
    }
  }

  async function markRead(id: string) {
    await api(`/notifications/${id}/read`, { method: 'PATCH' })
    const item = notifications.value.find(n => n.id === id)
    if (item) item.read_at = new Date().toISOString()
    count.value = Math.max(0, count.value - 1)
  }

  async function markAllRead() {
    await api('/notifications/read-all', { method: 'POST' })
    notifications.value.forEach((n) => { n.read_at = new Date().toISOString() })
    count.value = 0
  }

  function prependNotification(n: Notification) {
    if (!notifications.value.some(x => x.id === n.id)) {
      notifications.value.unshift(n)
    }
    if (!n.read_at) count.value += 1
  }

  return {
    count,
    notifications,
    loading,
    fetchCount,
    fetchNotifications,
    markRead,
    markAllRead,
    prependNotification
  }
}
