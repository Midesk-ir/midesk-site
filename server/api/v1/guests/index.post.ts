export default defineEventHandler(async (event) => {
  requireAuthWithPermission(event, 'guests:manage')
  const body = await readBody(event)
  const db = useMockDb()
  return { data: db.phase5.inviteGuest(body) }
})
