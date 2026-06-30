export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'leave:policies:view')
  return { data: db.phase2.listLeavePolicies() }
})
