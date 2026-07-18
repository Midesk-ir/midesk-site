export default defineEventHandler(async (event) => {
  const colId = getRouterParam(event, 'colId')!
  const body = await readBody(event)
  return proxyToBackend(event, {
    method: 'PATCH',
    path: `/columns/${colId}`,
    body
  })
})
