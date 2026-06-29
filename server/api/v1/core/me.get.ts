export default defineEventHandler((event) => {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  return user
})
