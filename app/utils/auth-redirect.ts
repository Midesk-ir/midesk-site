export function safeRedirectTarget(queryRedirect?: string | null, fallback = '/dashboard'): string {
  if (queryRedirect && queryRedirect.startsWith('/') && !queryRedirect.startsWith('//')) {
    return queryRedirect
  }
  return fallback
}

export function hasTenantContext(): boolean {
  return !!getTenantIdCookie().value
}

export function resolvePostAuthTarget(queryRedirect?: string | null): string {
  if (!hasTenantContext()) return '/onboarding'
  return safeRedirectTarget(queryRedirect, '/dashboard')
}

export function loginRedirectPath(fallback = '/dashboard'): string {
  if (!import.meta.client) return fallback
  const params = new URLSearchParams(window.location.search)
  return resolvePostAuthTarget(params.get('redirect'))
}

export function authQueryFromRoute(route: { query: Record<string, unknown> }) {
  const query: Record<string, string> = {}
  const redirect = route.query.redirect
  if (typeof redirect === 'string' && redirect) {
    query.redirect = redirect
  }
  return query
}
