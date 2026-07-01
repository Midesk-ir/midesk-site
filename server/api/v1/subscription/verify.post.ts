export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const body = await readBody<{ status?: string }>(event)
  return { data: db.phase5.verifyPayment(body.status ?? 'failed') }
})
