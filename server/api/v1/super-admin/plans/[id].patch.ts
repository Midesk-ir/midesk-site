export default defineEventHandler((event) =>
  proxyToBackend(event, {
    transformResponse: (body) => ({
      data: normalizeSuperAdminPlan(unwrapData(body) as Record<string, unknown>)
    })
  })
)
