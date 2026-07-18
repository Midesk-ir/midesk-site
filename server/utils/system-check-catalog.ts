import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import type { SystemCheckApiEndpoint, SystemCheckFlow, SystemCheckModuleMeta } from '../../app/types/system-check'
import { SYSTEM_CHECK_ENDPOINTS } from '../data/system-check-endpoints'
import { SYSTEM_CHECK_FLOWS } from '../data/system-check-flows'

function resolveApiRoot(): string | null {
  const candidates = [
    join(process.cwd(), 'server/api/v1'),
    join(process.cwd(), 'midesk-site/server/api/v1')
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate
  }

  return null
}

const MODULE_META: Record<string, Omit<SystemCheckModuleMeta, 'id' | 'endpointCount' | 'flowCount'>> = {
  auth: { label: 'Auth', icon: 'i-lucide-key-round', group: 'core', pages: ['/login', '/register', '/verify-otp'] },
  core: { label: 'Core', icon: 'i-lucide-home', group: 'core', pages: ['/dashboard', '/settings', '/onboarding'] },
  dashboard: { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', group: 'core', pages: ['/dashboard'] },
  orgs: { label: 'Organizations', icon: 'i-lucide-building-2', group: 'core', pages: ['/settings', '/onboarding'] },
  projects: { label: 'Projects', icon: 'i-lucide-folder-kanban', group: 'work', pages: ['/projects'] },
  tasks: { label: 'Tasks', icon: 'i-lucide-check-square', group: 'work', pages: ['/projects'] },
  sprints: { label: 'Sprints', icon: 'i-lucide-flag', group: 'work', pages: ['/projects'] },
  worklogs: { label: 'Worklogs', icon: 'i-lucide-clock', group: 'work', pages: ['/worklog'] },
  calendar: { label: 'Calendar', icon: 'i-lucide-calendar', group: 'work', pages: ['/calendar'] },
  leave: { label: 'Leave', icon: 'i-lucide-tree-palm', group: 'work', pages: ['/leave'] },
  hr: { label: 'HR', icon: 'i-lucide-id-card', group: 'hr', pages: ['/hr'] },
  finance: { label: 'Finance', icon: 'i-lucide-landmark', group: 'finance', pages: ['/finance'] },
  'my-finance': { label: 'My Finance', icon: 'i-lucide-wallet', group: 'finance', pages: ['/my-finance'] },
  chat: { label: 'Chat', icon: 'i-lucide-message-square', group: 'collaboration', pages: ['/chat'] },
  meetings: { label: 'Meetings', icon: 'i-lucide-video', group: 'collaboration', pages: ['/meetings'] },
  ai: { label: 'AI', icon: 'i-lucide-sparkles', group: 'collaboration', pages: ['/ai'] },
  notes: { label: 'Notes', icon: 'i-lucide-sticky-note', group: 'collaboration', pages: ['/notes'] },
  notifications: { label: 'Notifications', icon: 'i-lucide-bell', group: 'core', pages: ['/notifications'] },
  'notification-preferences': { label: 'Notification Prefs', icon: 'i-lucide-bell-ring', group: 'core', pages: ['/settings/notifications'] },
  members: { label: 'Members', icon: 'i-lucide-users', group: 'org', pages: ['/members'] },
  teams: { label: 'Teams', icon: 'i-lucide-users-round', group: 'org', pages: ['/teams'] },
  guests: { label: 'Guests', icon: 'i-lucide-user-plus', group: 'org', pages: ['/members'] },
  roles: { label: 'Roles', icon: 'i-lucide-shield', group: 'org', pages: ['/settings'] },
  correspondences: { label: 'Correspondence', icon: 'i-lucide-mail', group: 'business', pages: ['/correspondence'] },
  surveys: { label: 'Surveys', icon: 'i-lucide-clipboard-list', group: 'business', pages: ['/surveys'] },
  crm: { label: 'CRM', icon: 'i-lucide-handshake', group: 'business', pages: ['/crm'] },
  reports: { label: 'Reports', icon: 'i-lucide-bar-chart-4', group: 'business', pages: ['/reports'] },
  performance: { label: 'Performance', icon: 'i-lucide-gauge', group: 'business', pages: ['/performance'] },
  subscription: { label: 'Subscription', icon: 'i-lucide-credit-card', group: 'org', pages: ['/subscription'] },
  broadcasting: { label: 'Broadcasting', icon: 'i-lucide-radio', group: 'infra', pages: [] },
  'super-admin': { label: 'Super Admin', icon: 'i-lucide-shield-alert', group: 'platform', pages: ['/super-admin/dashboard'] }
}

function segmentToPath(segment: string) {
  if (segment.startsWith('[') && segment.endsWith(']')) {
    return `:${segment.slice(1, -1)}`
  }
  return segment
}

function scanApiDir(dir: string, segments: string[] = []): SystemCheckApiEndpoint[] {
  const endpoints: SystemCheckApiEndpoint[] = []

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      endpoints.push(...scanApiDir(fullPath, [...segments, entry]))
      continue
    }

    const match = entry.match(/^(.*)\.(get|post|patch|put|delete)\.ts$/)
    if (!match) continue

    const name = match[1]
    const methodRaw = match[2]
    if (!name || !methodRaw) continue

    const method = methodRaw.toUpperCase()
    const pathSegments = [...segments]

    if (name !== 'index') {
      pathSegments.push(name)
    }

    const path = `/${pathSegments.map(segmentToPath).join('/')}`.replace(/\/+/g, '/')
    const module = segments[0] || 'root'
    const hasParams = path.includes(':')

    endpoints.push({
      method,
      path,
      module,
      hasParams,
      safeGet: method === 'GET' && !hasParams
    })
  }

  return endpoints.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method))
}

export function buildSystemCheckCatalog() {
  const apiRoot = resolveApiRoot()
  const endpoints: SystemCheckApiEndpoint[] = apiRoot
    ? scanApiDir(apiRoot)
    : [...SYSTEM_CHECK_ENDPOINTS]
  const flows = SYSTEM_CHECK_FLOWS

  const moduleIds = new Set([
    ...endpoints.map(endpoint => endpoint.module),
    ...flows.map(flow => flow.module)
  ])

  const modules: SystemCheckModuleMeta[] = [...moduleIds]
    .sort((a, b) => a.localeCompare(b))
    .map((id) => {
      const meta = MODULE_META[id] ?? {
        label: id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        icon: 'i-lucide-box',
        group: 'other',
        pages: [] as string[]
      }

      return {
        id,
        ...meta,
        endpointCount: endpoints.filter(endpoint => endpoint.module === id).length,
        flowCount: flows.filter(flow => flow.module === id).length
      }
    })

  return { modules, endpoints, flows }
}

export function getModuleLabel(moduleId: string) {
  return MODULE_META[moduleId]?.label ?? moduleId
}

export function getModuleEndpoints(moduleId: string) {
  return buildSystemCheckCatalog().endpoints.filter(endpoint => endpoint.module === moduleId)
}

export function getModuleFlows(moduleId: string): SystemCheckFlow[] {
  return SYSTEM_CHECK_FLOWS.filter(flow => flow.module === moduleId)
}
