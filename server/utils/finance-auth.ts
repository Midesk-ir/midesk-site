import type { H3Event } from 'h3'
import { getPermissionsForRole } from './permissions'

export function requireAuth(event: H3Event) {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  const permissions = getPermissionsForRole(user.role)
  const isAdmin = user.role === 'OWNER' || user.role === 'ADMIN'
  return { db, user, permissions, isAdmin }
}
