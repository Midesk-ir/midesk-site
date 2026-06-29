export default defineEventHandler((event) => {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  return { data: db.phase1.getLeaveBalances(user.id) }
})
