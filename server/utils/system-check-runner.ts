import { FetchError } from 'ofetch'
import type { H3Event } from 'h3'
import type {
  SystemCheckCredentials,
  SystemCheckFlow,
  SystemCheckFlowRunResult,
  SystemCheckHealth,
  SystemCheckModuleRunResult,
  SystemCheckProbeRequest,
  SystemCheckProbeResult,
  SystemCheckTarget
} from '../../app/types/system-check'
import { issueMotionCaptchaToken } from './motion-captcha'
import { buildSystemCheckCatalog, getModuleEndpoints, getModuleLabel } from './system-check-catalog'
import { SYSTEM_CHECK_FLOWS } from '../data/system-check-flows'

type AuthSession = {
  tenantToken?: string
  tenantId?: string
  superAdminToken?: string
}

function backendBaseUrl() {
  const config = useRuntimeConfig()
  return (config.backendApiUrl as string).replace(/\/$/, '')
}

function siteApiBaseUrl(event: H3Event) {
  const { origin } = getRequestURL(event)
  return `${origin}/api/v1`
}

function resolveBaseUrl(event: H3Event, target: SystemCheckTarget) {
  return target === 'backend' ? backendBaseUrl() : siteApiBaseUrl(event)
}

function previewBody(data: unknown) {
  try {
    const text = JSON.stringify(data)
    return text.length > 400 ? `${text.slice(0, 400)}…` : text
  } catch {
    return undefined
  }
}

function statusMatches(httpStatus: number, expected?: number | number[]) {
  if (!expected) return httpStatus >= 200 && httpStatus < 300
  return Array.isArray(expected) ? expected.includes(httpStatus) : httpStatus === expected
}

async function loginTenant(
  event: H3Event,
  credentials: SystemCheckCredentials,
  target: SystemCheckTarget
): Promise<AuthSession> {
  const email = credentials.email || process.env.NUXT_SYSTEM_CHECK_EMAIL || 'admin@midesk.io'
  const password = credentials.password || process.env.NUXT_SYSTEM_CHECK_PASSWORD || 'password'

  const baseUrl = resolveBaseUrl(event, target)
  const body: Record<string, unknown> = { email, password }

  if (target === 'site') {
    body.captchaToken = issueMotionCaptchaToken(crypto.randomUUID())
  }

  const login = await $fetch<{ token?: string, data?: { token?: string } }>(`${baseUrl}/auth/login`, {
    method: 'POST',
    body,
    headers: { Accept: 'application/json' }
  })

  const tenantToken = login.token || login.data?.token
  if (!tenantToken) {
    throw createError({ statusCode: 401, statusMessage: 'Tenant login failed' })
  }

  const bootstrap = await $fetch<{ tenant?: { id?: string }, data?: { tenant?: { id?: string } } }>(
    `${baseUrl}/core/bootstrap`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${tenantToken}`
      }
    }
  )

  const tenantId = bootstrap.tenant?.id || bootstrap.data?.tenant?.id
  return { tenantToken, tenantId }
}

function authHeaders(session: AuthSession, auth: SystemCheckProbeRequest['auth']) {
  const headers: Record<string, string> = { Accept: 'application/json' }

  if (auth === 'tenant' && session.tenantToken) {
    headers.Authorization = `Bearer ${session.tenantToken}`
    if (session.tenantId) headers['X-Tenant-Id'] = session.tenantId
  }

  if (auth === 'super-admin' && session.superAdminToken) {
    headers.Authorization = `Bearer ${session.superAdminToken}`
  }

  return headers
}

export async function runSystemCheckProbe(
  event: H3Event,
  input: SystemCheckProbeRequest,
  session: AuthSession = {}
): Promise<{ result: SystemCheckProbeResult, session: AuthSession }> {
  const target = input.target ?? 'site'
  const auth = input.auth ?? 'tenant'
  const started = performance.now()
  let activeSession = { ...session }

  if (auth === 'tenant' && !activeSession.tenantToken) {
    activeSession = {
      ...activeSession,
      ...(await loginTenant(event, input.credentials ?? {}, target))
    }
  }

  if (auth === 'super-admin' && !activeSession.superAdminToken) {
    const saToken = getRequestHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')
    if (!saToken) {
      return {
        session: activeSession,
        result: {
          method: input.method,
          path: input.path,
          target,
          status: 'fail',
          durationMs: Math.round(performance.now() - started),
          message: 'Super-admin token missing'
        }
      }
    }
    activeSession.superAdminToken = saToken
  }

  const baseUrl = resolveBaseUrl(event, target)
  const url = `${baseUrl}${input.path}`

  try {
    const response = await $fetch.raw(url, {
      method: input.method.toUpperCase() as 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
      headers: authHeaders(activeSession, auth),
      body: ['GET', 'HEAD'].includes(input.method.toUpperCase()) ? undefined : input.body,
      ignoreResponseError: true
    })

    const durationMs = Math.round(performance.now() - started)
    const ok = statusMatches(response.status, input.expectStatus)

    return {
      session: activeSession,
      result: {
        method: input.method,
        path: input.path,
        target,
        status: ok ? 'pass' : 'fail',
        httpStatus: response.status,
        durationMs,
        message: ok ? undefined : `Expected success, got ${response.status}`,
        preview: previewBody(response._data)
      }
    }
  } catch (error) {
    const durationMs = Math.round(performance.now() - started)
    const httpStatus = error instanceof FetchError ? (error.response?.status || error.statusCode) : undefined

    return {
      session: activeSession,
      result: {
        method: input.method,
        path: input.path,
        target,
        status: 'fail',
        httpStatus,
        durationMs,
        message: error instanceof Error ? error.message : 'Probe failed',
        preview: error instanceof FetchError ? previewBody(error.data) : undefined
      }
    }
  }
}

export async function runSystemCheckFlow(
  event: H3Event,
  flowId: string,
  credentials?: SystemCheckCredentials
): Promise<SystemCheckFlowRunResult> {
  const flow = SYSTEM_CHECK_FLOWS.find(item => item.id === flowId)
  if (!flow) {
    throw createError({ statusCode: 404, statusMessage: 'Flow not found' })
  }

  const started = performance.now()
  let session: AuthSession = {}
  const steps: SystemCheckFlowRunResult['steps'] = []

  for (const step of flow.steps) {
    if (step.skipIfParams && step.path.includes(':')) {
      steps.push({
        stepId: step.id,
        label: step.label,
        method: step.method,
        path: step.path,
        target: step.target ?? 'site',
        status: 'skip',
        durationMs: 0,
        message: 'Skipped param route'
      })
      continue
    }

    if (step.path === '/auth/login' && step.method === 'POST') {
      const started = performance.now()
      try {
        session = {
          ...session,
          ...(await loginTenant(event, credentials ?? {}, step.target ?? 'site'))
        }
        steps.push({
          stepId: step.id,
          label: step.label,
          method: step.method,
          path: step.path,
          target: step.target ?? 'site',
          status: 'pass',
          httpStatus: 200,
          durationMs: Math.round(performance.now() - started),
          message: 'Tenant session established'
        })
      } catch (error) {
        steps.push({
          stepId: step.id,
          label: step.label,
          method: step.method,
          path: step.path,
          target: step.target ?? 'site',
          status: 'fail',
          durationMs: Math.round(performance.now() - started),
          message: error instanceof Error ? error.message : 'Login failed'
        })
        return {
          flowId: flow.id,
          module: flow.module,
          label: flow.label,
          status: 'fail',
          durationMs: Math.round(performance.now() - started),
          steps
        }
      }
      continue
    }

    const probe = await runSystemCheckProbe(event, {
      method: step.method,
      path: step.path,
      auth: step.auth,
      target: step.target,
      expectStatus: step.expectStatus,
      credentials
    }, session)

    session = probe.session
    const failed = probe.result.status === 'fail'

    steps.push({
      stepId: step.id,
      label: step.label,
      ...probe.result
    })

    if (failed && !step.optional) {
      return {
        flowId: flow.id,
        module: flow.module,
        label: flow.label,
        status: 'fail',
        durationMs: Math.round(performance.now() - started),
        steps
      }
    }
  }

  const hasRequiredFailure = steps.some(step => step.status === 'fail')
  return {
    flowId: flow.id,
    module: flow.module,
    label: flow.label,
    status: hasRequiredFailure ? 'fail' : 'pass',
    durationMs: Math.round(performance.now() - started),
    steps
  }
}

export async function runSystemCheckModule(
  event: H3Event,
  moduleId: string,
  credentials?: SystemCheckCredentials
): Promise<SystemCheckModuleRunResult> {
  const started = performance.now()
  const endpoints = getModuleEndpoints(moduleId).filter(endpoint => endpoint.safeGet)
  let session: AuthSession = {}
  const probes: SystemCheckProbeResult[] = []

  for (const endpoint of endpoints) {
    const auth = endpoint.module === 'super-admin' ? 'super-admin' : 'tenant'
    const probe = await runSystemCheckProbe(event, {
      method: endpoint.method,
      path: endpoint.path,
      auth,
      credentials
    }, session)
    session = probe.session
    probes.push(probe.result)
  }

  const passed = probes.filter(probe => probe.status === 'pass').length
  const failed = probes.filter(probe => probe.status === 'fail').length
  const skipped = probes.filter(probe => probe.status === 'skip').length

  return {
    module: moduleId,
    label: getModuleLabel(moduleId),
    passed,
    failed,
    skipped,
    durationMs: Math.round(performance.now() - started),
    probes
  }
}

export async function runAllSystemCheckFlows(
  event: H3Event,
  credentials?: SystemCheckCredentials
): Promise<SystemCheckFlowRunResult[]> {
  const results: SystemCheckFlowRunResult[] = []
  for (const flow of SYSTEM_CHECK_FLOWS) {
    results.push(await runSystemCheckFlow(event, flow.id, credentials))
  }
  return results
}

export async function getSystemCheckHealth(event: H3Event): Promise<SystemCheckHealth> {
  const catalog = buildSystemCheckCatalog()
  const backendUrl = backendBaseUrl().replace(/\/api\/v1$/, '')

  let backendOk = false
  let backendLatency = 0
  let backendMessage: string | undefined

  const backendStarted = performance.now()
  try {
    const response = await $fetch.raw(`${backendUrl}/up`, { ignoreResponseError: true })
    backendLatency = Math.round(performance.now() - backendStarted)
    backendOk = response.status >= 200 && response.status < 300
    if (!backendOk) backendMessage = `HTTP ${response.status}`
  } catch (error) {
    backendLatency = Math.round(performance.now() - backendStarted)
    backendMessage = error instanceof Error ? error.message : 'Backend unreachable'
  }

  let siteOk = false
  let siteLatency = 0
  let siteMessage: string | undefined
  const siteStarted = performance.now()

  try {
    const response = await $fetch.raw(`${siteApiBaseUrl(event)}/captcha/challenge`, { ignoreResponseError: true })
    siteLatency = Math.round(performance.now() - siteStarted)
    siteOk = response.status >= 200 && response.status < 300
    if (!siteOk) siteMessage = `HTTP ${response.status}`
  } catch (error) {
    siteLatency = Math.round(performance.now() - siteStarted)
    siteMessage = error instanceof Error ? error.message : 'Site API unreachable'
  }

  return {
    backend: { ok: backendOk, latencyMs: backendLatency, url: backendUrl, message: backendMessage },
    site: { ok: siteOk, latencyMs: siteLatency, message: siteMessage },
    catalog: {
      endpointCount: catalog.endpoints.length,
      moduleCount: catalog.modules.length,
      flowCount: catalog.flows.length
    }
  }
}

export function findFlow(flowId: string): SystemCheckFlow | undefined {
  return SYSTEM_CHECK_FLOWS.find(flow => flow.id === flowId)
}
