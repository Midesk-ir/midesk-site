export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return proxyToBackend(event, {
    body: transformCloseSprintBody(body)
  })
})
