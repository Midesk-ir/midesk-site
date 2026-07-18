export default defineEventHandler((event) => {
  const swimlane = String(getQuery(event).swimlane ?? 'none')

  return proxyToBackend(event, {
    transformResponse: body => transformBoardResponse(body, swimlane)
  })
})
