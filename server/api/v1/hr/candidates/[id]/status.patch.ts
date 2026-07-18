export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ status: string }>(event)
  return proxyToBackend(event, {
    method: 'PATCH',
    path: `/hr/candidates/${id}`,
    body: { status: body.status }
  })
})
