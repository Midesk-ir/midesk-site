import type { H3Event } from 'h3'
import { getPermissionsForRole, hasPermission, requirePermission, type Permission } from './permissions'

export function requireAuthWithPermission(event: H3Event, permission: Permission | Permission[]) {
  const db = useMockDb()
  const { user } = db.requireAuth(event)
  const permissions = getPermissionsForRole(user.role)
  const isAdmin = user.role === 'OWNER' || user.role === 'ADMIN'
  requirePermission(permissions, permission, isAdmin)
  return { db, user, permissions, isAdmin }
}
