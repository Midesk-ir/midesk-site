export default defineEventHandler((event) => {
  const sprintId = getRouterParam(event, 'sprintId')!

  return proxyToBackend(event, {
    path: `/sprints/${sprintId}`,
    transformResponse: transformSprintDetail
  })
})
