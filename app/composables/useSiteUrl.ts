export function useSiteUrl() {
  const config = useRuntimeConfig()

  return computed(() => {
    const configured = config.public.siteUrl as string | undefined
    if (configured) {
      return configured.replace(/\/$/, '')
    }
    if (import.meta.client) {
      return window.location.origin
    }
    return 'https://midesk.io'
  })
}
