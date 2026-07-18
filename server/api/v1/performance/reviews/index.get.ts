export default defineEventHandler((event) => proxyToBackend(event, { path: '/reviews' }))
