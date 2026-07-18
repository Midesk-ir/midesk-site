export default defineEventHandler((event) => {
  const query = getQuery(event)
  const monthParam = String(query.month ?? '')
  const [year, month] = monthParam.includes('-')
    ? monthParam.split('-').map(Number)
    : [new Date().getFullYear(), Number(monthParam) || new Date().getMonth() + 1]

  return proxyToBackend(event, {
    query: { year, month },
    transformResponse: transformAttendanceReport
  })
})
