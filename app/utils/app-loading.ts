import { computed, ref } from 'vue'

const routeLoading = ref(false)
const dataPending = ref(0)

const SILENT_PATH_PREFIXES = [
  '/api/captcha',
  '/captcha',
  '/notifications/unread'
]

export function isSilentLoadingUrl(url: string): boolean {
  const path = url.split('?')[0] || url
  return SILENT_PATH_PREFIXES.some(prefix => path.includes(prefix))
}

export function beginRouteLoading() {
  if (!import.meta.client) return
  routeLoading.value = true
}

export function endRouteLoading() {
  if (!import.meta.client) return
  routeLoading.value = false
}

export function beginDataLoading() {
  if (!import.meta.client) return
  dataPending.value += 1
}

export function endDataLoading() {
  if (!import.meta.client) return
  dataPending.value = Math.max(0, dataPending.value - 1)
}

export async function withDataLoading<T>(task: () => Promise<T>): Promise<T> {
  beginDataLoading()
  try {
    return await task()
  } finally {
    endDataLoading()
  }
}

export function useAppLoading() {
  const isLoading = computed(() => routeLoading.value || dataPending.value > 0)
  const isRouteLoading = computed(() => routeLoading.value)
  const isDataLoading = computed(() => dataPending.value > 0)

  return {
    isLoading,
    isRouteLoading,
    isDataLoading,
    pendingCount: computed(() => dataPending.value)
  }
}
