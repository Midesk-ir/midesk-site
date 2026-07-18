export const LANDING_PRODUCT_METRICS = {
  modules: 17,
  sections: 6,
  languages: 2,
  setupMinutes: 5
} as const

export type LandingSectionKey =
  | 'onboarding'
  | 'projects'
  | 'work'
  | 'collab'
  | 'hr'
  | 'finance'

export type LandingSection = {
  key: LandingSectionKey
  icon: string
  accent: string
  featureKeys: readonly string[]
}

export const LANDING_PRODUCT_SECTIONS: readonly LandingSection[] = [
  {
    key: 'onboarding',
    icon: 'i-lucide-rocket',
    accent: 'violet',
    featureKeys: ['register', 'org', 'dashboard', 'settings', 'invite', 'roles']
  },
  {
    key: 'projects',
    icon: 'i-lucide-folder-kanban',
    accent: 'orange',
    featureKeys: ['kanban', 'sprints', 'backlog', 'reports', 'files', 'settings']
  },
  {
    key: 'work',
    icon: 'i-lucide-clock',
    accent: 'cyan',
    featureKeys: ['worklog', 'calendar', 'leave', 'teams', 'shifts', 'notifications']
  },
  {
    key: 'collab',
    icon: 'i-lucide-messages-square',
    accent: 'pink',
    featureKeys: ['chat', 'meetings', 'ai', 'notes', 'channels', 'mentions']
  },
  {
    key: 'hr',
    icon: 'i-lucide-building-2',
    accent: 'emerald',
    featureKeys: ['personnel', 'attendance', 'contracts', 'recruitment', 'onboarding', 'documents']
  },
  {
    key: 'finance',
    icon: 'i-lucide-wallet',
    accent: 'amber',
    featureKeys: ['expenses', 'budgets', 'invoices', 'payroll', 'crm', 'correspondence']
  }
] as const

export const LANDING_MODULE_KEYS = [
  'kanban',
  'sprints',
  'worklog',
  'dashboard',
  'hr',
  'calendar',
  'teams',
  'performance',
  'finance',
  'crm',
  'correspondence',
  'surveys',
  'chat',
  'meetings',
  'ai',
  'notes',
  'reports'
] as const

export type LandingStat = {
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  labelKey: string
}

/** User-facing hero metrics only — no technical internals. */
export const LANDING_HERO_STATS: LandingStat[] = [
  { value: LANDING_PRODUCT_METRICS.modules, suffix: '+', labelKey: 'landing.stats.modules' },
  { value: LANDING_PRODUCT_METRICS.sections, labelKey: 'landing.stats.sections' },
  { value: LANDING_PRODUCT_METRICS.setupMinutes, suffix: 'm', labelKey: 'landing.stats.setup' },
  { value: LANDING_PRODUCT_METRICS.languages, labelKey: 'landing.stats.languages' }
]

export function landingSectionAnchor(key: LandingSectionKey) {
  return `section-${key}`
}
