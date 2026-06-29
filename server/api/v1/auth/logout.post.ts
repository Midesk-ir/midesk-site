export default defineEventHandler((event) => {
  const db = useMockDb()
  const auth = db.getAuth(event)
  if (auth) db.sessions.delete(auth.token)
  return { message: 'Logged out' }
})
