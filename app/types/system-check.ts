export type SystemCheckAuthMode = 'none' | 'tenant' | 'super-admin'

export type SystemCheckTarget = 'site' | 'backend'

export type SystemCheckProbeStatus = 'pass' | 'fail' | 'skip' | 'pending'

export type SystemCheckApiEndpoint = {
  method: string
  path: string
  module: string
  hasParams: boolean
  safeGet: boolean
}

export type SystemCheckModuleMeta = {
  id: string
  label: string
  icon: string
  group: string
  pages: string[]
  endpointCount: number
  flowCount: number
}

export type SystemCheckFlowStep = {
  id: string
  label: string
  method: string
  path: string
  auth: SystemCheckAuthMode
  target?: SystemCheckTarget
  expectStatus?: number | number[]
  optional?: boolean
  skipIfParams?: boolean
}

export type SystemCheckFlow = {
  id: string
  module: string
  label: string
  description: string
  pages: string[]
  steps: SystemCheckFlowStep[]
}

export type SystemCheckProbeResult = {
  method: string
  path: string
  target: SystemCheckTarget
  status: SystemCheckProbeStatus
  httpStatus?: number
  durationMs: number
  message?: string
  preview?: string
}

export type SystemCheckFlowRunResult = {
  flowId: string
  module: string
  label: string
  status: SystemCheckProbeStatus
  durationMs: number
  steps: Array<SystemCheckProbeResult & { stepId: string, label: string }>
}

export type SystemCheckModuleRunResult = {
  module: string
  label: string
  passed: number
  failed: number
  skipped: number
  durationMs: number
  probes: SystemCheckProbeResult[]
}

export type SystemCheckHealth = {
  backend: { ok: boolean, latencyMs: number, url: string, message?: string }
  site: { ok: boolean, latencyMs: number, message?: string }
  catalog: { endpointCount: number, moduleCount: number, flowCount: number }
}

export type SystemCheckCatalog = {
  modules: SystemCheckModuleMeta[]
  endpoints: SystemCheckApiEndpoint[]
  flows: SystemCheckFlow[]
}

export type SystemCheckCredentials = {
  email?: string
  password?: string
}

export type SystemCheckProbeRequest = {
  method: string
  path: string
  target?: SystemCheckTarget
  auth?: SystemCheckAuthMode
  body?: Record<string, unknown>
  expectStatus?: number | number[]
  credentials?: SystemCheckCredentials
}
