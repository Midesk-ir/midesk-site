export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ reason: string }>(event)
  const request = db.phase1.rejectLeave(id, body.reason)
  return { data: request }
})
