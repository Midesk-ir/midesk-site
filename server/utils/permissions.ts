import type { UserRole } from '../../app/types'

/** Spatie-style permission strings (resource:action) */
export const PERMISSIONS = {
  // Core (phase 0)
  'project:read': 'project:read',
  'project:write': 'project:write',
  'task:read': 'task:read',
  'task:write': 'task:write',
  'member:invite': 'member:invite',
  // HR (phase 2)
  'hr:dashboard:view': 'hr:dashboard:view',
  'hr:personnel:view': 'hr:personnel:view',
  'hr:personnel:create': 'hr:personnel:create',
  'hr:personnel:update': 'hr:personnel:update',
  'hr:personnel:delete': 'hr:personnel:delete',
  'hr:attendance:view': 'hr:attendance:view',
  'hr:attendance:manage': 'hr:attendance:manage',
  'hr:attendance:clock': 'hr:attendance:clock',
  'hr:contracts:view': 'hr:contracts:view',
  'hr:contracts:manage': 'hr:contracts:manage',
  'hr:documents:view': 'hr:documents:view',
  'hr:documents:manage': 'hr:documents:manage',
  'hr:missions:view': 'hr:missions:view',
  'hr:missions:request': 'hr:missions:request',
  'hr:missions:approve': 'hr:missions:approve',
  'hr:recruitment:view': 'hr:recruitment:view',
  'hr:recruitment:manage': 'hr:recruitment:manage',
  'hr:onboarding:view': 'hr:onboarding:view',
  'hr:onboarding:manage': 'hr:onboarding:manage',
  'hr:settings:manage': 'hr:settings:manage',
  'leave:policies:view': 'leave:policies:view',
  'leave:policies:manage': 'leave:policies:manage',
  'leave:report:view': 'leave:report:view',
  // Finance (phase 3)
  'finance:dashboard:view': 'finance:dashboard:view',
  'finance:expenses:view': 'finance:expenses:view',
  'finance:expenses:create': 'finance:expenses:create',
  'finance:expenses:approve': 'finance:expenses:approve',
  'finance:expenses:pay': 'finance:expenses:pay',
  'finance:budgets:view': 'finance:budgets:view',
  'finance:budgets:manage': 'finance:budgets:manage',
  'finance:invoices:view': 'finance:invoices:view',
  'finance:payroll:view': 'finance:payroll:view',
  'finance:my:view': 'finance:my:view',
  // Collaboration (phase 4)
  'chat:view': 'chat:view',
  'chat:manage': 'chat:manage',
  'meetings:view': 'meetings:view',
  'meetings:manage': 'meetings:manage',
  'ai:view': 'ai:view',
  'ai:query': 'ai:query',
  'notes:view': 'notes:view',
  'notes:manage': 'notes:manage',
  'notifications:preferences': 'notifications:preferences',
  'performance:dashboard:view': 'performance:dashboard:view',
  'performance:indicators:view': 'performance:indicators:view',
  'performance:indicators:manage': 'performance:indicators:manage',
  'performance:scores:view': 'performance:scores:view',
  'performance:scores:manage': 'performance:scores:manage',
  'performance:objectives:view': 'performance:objectives:view',
  'performance:objectives:manage': 'performance:objectives:manage',
  'performance:reviews:view': 'performance:reviews:view',
  'performance:reviews:manage': 'performance:reviews:manage'
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

const ALL_PERMISSIONS = Object.values(PERMISSIONS)

const HR_ADMIN_PERMISSIONS: Permission[] = [
  PERMISSIONS['hr:dashboard:view'],
  PERMISSIONS['hr:personnel:view'],
  PERMISSIONS['hr:personnel:create'],
  PERMISSIONS['hr:personnel:update'],
  PERMISSIONS['hr:personnel:delete'],
  PERMISSIONS['hr:attendance:view'],
  PERMISSIONS['hr:attendance:manage'],
  PERMISSIONS['hr:contracts:view'],
  PERMISSIONS['hr:contracts:manage'],
  PERMISSIONS['hr:documents:view'],
  PERMISSIONS['hr:documents:manage'],
  PERMISSIONS['hr:missions:view'],
  PERMISSIONS['hr:missions:approve'],
  PERMISSIONS['hr:recruitment:view'],
  PERMISSIONS['hr:recruitment:manage'],
  PERMISSIONS['hr:onboarding:view'],
  PERMISSIONS['hr:onboarding:manage'],
  PERMISSIONS['hr:settings:manage'],
  PERMISSIONS['leave:policies:view'],
  PERMISSIONS['leave:policies:manage'],
  PERMISSIONS['leave:report:view']
]

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  OWNER: ALL_PERMISSIONS,
  ADMIN: [
    ...ALL_PERMISSIONS.filter(p => !p.startsWith('member:')),
    PERMISSIONS['member:invite']
  ],
  MANAGER: [
    PERMISSIONS['project:read'],
    PERMISSIONS['project:write'],
    PERMISSIONS['task:read'],
    PERMISSIONS['task:write'],
    PERMISSIONS['hr:dashboard:view'],
    PERMISSIONS['hr:attendance:view'],
    PERMISSIONS['hr:missions:view'],
    PERMISSIONS['hr:missions:approve'],
    PERMISSIONS['leave:report:view'],
    PERMISSIONS['finance:expenses:view'],
    PERMISSIONS['finance:expenses:create'],
    PERMISSIONS['finance:expenses:approve'],
    PERMISSIONS['finance:my:view'],
    PERMISSIONS['chat:view'],
    PERMISSIONS['chat:manage'],
    PERMISSIONS['meetings:view'],
    PERMISSIONS['meetings:manage'],
    PERMISSIONS['ai:view'],
    PERMISSIONS['ai:query'],
    PERMISSIONS['notes:view'],
    PERMISSIONS['notes:manage'],
    PERMISSIONS['notifications:preferences'],
    PERMISSIONS['performance:dashboard:view'],
    PERMISSIONS['performance:scores:view'],
    PERMISSIONS['performance:objectives:view'],
    PERMISSIONS['performance:reviews:view']
  ],
  MEMBER: [
    PERMISSIONS['project:read'],
    PERMISSIONS['task:read'],
    PERMISSIONS['task:write'],
    PERMISSIONS['hr:attendance:clock'],
    PERMISSIONS['hr:attendance:view'],
    PERMISSIONS['hr:missions:view'],
    PERMISSIONS['hr:missions:request'],
    PERMISSIONS['finance:expenses:create'],
    PERMISSIONS['finance:my:view'],
    PERMISSIONS['chat:view'],
    PERMISSIONS['meetings:view'],
    PERMISSIONS['ai:view'],
    PERMISSIONS['ai:query'],
    PERMISSIONS['notes:view'],
    PERMISSIONS['notes:manage'],
    PERMISSIONS['notifications:preferences'],
    PERMISSIONS['performance:dashboard:view'],
    PERMISSIONS['performance:objectives:view'],
    PERMISSIONS['performance:reviews:view']
  ]
}

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}

export function hasPermission(
  userPermissions: string[],
  permission: Permission | Permission[],
  isAdmin = false
): boolean {
  if (isAdmin) return true
  const required = Array.isArray(permission) ? permission : [permission]
  return required.some(p => userPermissions.includes(p))
}

export function requirePermission(
  userPermissions: string[],
  permission: Permission | Permission[],
  isAdmin = false
) {
  if (!hasPermission(userPermissions, permission, isAdmin)) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }
}
