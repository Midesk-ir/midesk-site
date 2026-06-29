import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const body = await readBody<{ email?: string, phone?: string, role: string }>(event)

  const user = {
    id: randomUUID(),
    name: body.email?.split('@')[0] ?? 'Member',
    email: body.email ?? null,
    phone: body.phone ?? null,
    avatar_url: null,
    role: body.role as 'MEMBER'
  }
  db.users.push(user)
  return { message: 'Invited', user }
})
