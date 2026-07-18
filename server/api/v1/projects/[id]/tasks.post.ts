export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'id')!
  const body = await readBody<Record<string, unknown>>(event)
  return proxyToBackend(event, {
    method: 'POST',
    path: '/tasks',
    body: { ...body, project_id: projectId }
  })
})
