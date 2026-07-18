import type { H3Event } from 'h3'
import { FetchError } from 'ofetch'
import { getQuery, getRequestURL, proxyRequest, readBody } from 'h3'

export type BackendProxyOptions = {
  /** Backend path after /api/v1, e.g. `/tasks/123` */
  path?: string
  method?: string
  body?: BodyInit | Record<string, unknown> | null
  query?: Record<string, string | number | boolean | undefined | null>
  /** When set, replaces the backend JSON body before returning to the client */
  transformResponse?: (body: unknown) => unknown
}

function backendBaseUrl(): string {
  const config = useRuntimeConfig()
  return (config.backendApiUrl as string).replace(/\/$/, '')
}

function requestBackendPath(event: H3Event): string {
  const { pathname, search } = getRequestURL(event)
  return `${pathname.replace(/^\/api\/v1/, '')}${search}`
}

function forwardHeaders(event: H3Event): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json'
  }

  const auth = getRequestHeader(event, 'authorization')
  if (auth) headers.Authorization = auth

  const tenantId = getRequestHeader(event, 'x-tenant-id')
  if (tenantId) headers['X-Tenant-Id'] = tenantId

  const language = getRequestHeader(event, 'accept-language')
  if (language) headers['Accept-Language'] = language

  const contentType = getRequestHeader(event, 'content-type')
  if (contentType) headers['Content-Type'] = contentType

  return headers
}

function backendError(error: unknown): never {
  if (error instanceof FetchError) {
    throw createError({
      statusCode: error.response?.status || error.statusCode || 500,
      statusMessage: error.response?.statusText || error.statusMessage,
      data: error.data ?? { message: error.message }
    })
  }

  throw error
}

async function proxyWithFetch(event: H3Event, options: BackendProxyOptions) {
  const method = (options.method ?? event.method).toUpperCase()
  const path = options.path ?? requestBackendPath(event)
  const url = `${backendBaseUrl()}${path}`

  let body = options.body
  if (body === undefined && !['GET', 'HEAD'].includes(method)) {
    const contentType = getRequestHeader(event, 'content-type') || ''
    if (contentType.includes('application/json')) {
      body = await readBody(event)
    }
  }

  const query = options.query ?? getQuery(event)

  try {
    const response = await $fetch.raw(url, {
      method,
      headers: forwardHeaders(event),
      body: body as Record<string, unknown> | BodyInit | null | undefined,
      query
    })

    const transformed = options.transformResponse
      ? options.transformResponse(response._data)
      : response._data

    setResponseStatus(event, response.status)

    if (response.status === 204) {
      return null
    }

    return transformed
  } catch (error) {
    backendError(error)
  }
}

/**
 * Proxies the current request to midesk-backend and returns the backend response.
 * Uses request streaming for direct path matches; use `options` for remapped routes.
 */
export async function proxyToBackend(event: H3Event, options: BackendProxyOptions = {}) {
  const hasCustomProxy = Boolean(
    options.path
    || options.method
    || options.body !== undefined
    || options.query
    || options.transformResponse
  )

  if (hasCustomProxy) {
    return proxyWithFetch(event, options)
  }

  const contentType = getRequestHeader(event, 'content-type') || ''
  if (contentType.includes('multipart/form-data')) {
    const target = `${backendBaseUrl()}${requestBackendPath(event)}`
    return proxyRequest(event, target)
  }

  if (['GET', 'HEAD', 'DELETE'].includes(event.method)) {
    return proxyWithFetch(event, options)
  }

  const target = `${backendBaseUrl()}${requestBackendPath(event)}`
  return proxyRequest(event, target)
}
