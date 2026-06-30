export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'leave:report:view')
  return { data: db.phase2.getLeaveReport() }
})
