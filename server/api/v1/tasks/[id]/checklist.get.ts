type TaskPayload = {
  checklist?: unknown[]
  data?: { checklist?: unknown[] }
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const task = await proxyToBackend<TaskPayload>(event, {
    path: `/tasks/${id}`,
    transformResponse: (body) => {
      const payload = body as TaskPayload
      const checklist = payload.data?.checklist ?? payload.checklist ?? []
      return { data: checklist }
    }
  })
  return task
})
