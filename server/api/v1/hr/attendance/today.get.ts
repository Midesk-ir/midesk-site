export default defineEventHandler((event) =>
  proxyToBackend(event, { transformResponse: transformAttendanceToday })
)
