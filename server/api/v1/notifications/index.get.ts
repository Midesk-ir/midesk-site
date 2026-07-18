export default defineEventHandler((event) =>
  proxyToBackend(event, { transformResponse: normalizeNotifications })
)
