export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')!
  return proxyToBackend(event, {
    method: 'POST',
    path: `/hr/contracts/${id}/renew`
  })
})
