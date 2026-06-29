export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  return {
    data: db.users.map(u => ({
      id: u.id,
      user: { id: u.id, name: u.name, email: u.email, avatar_url: u.avatar_url },
      role: u.role,
      joined_at: '2026-01-15T08:00:00Z'
    }))
  }
})
