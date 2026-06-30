export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:settings:manage')
  return { data: db.phase2.getSettings() }
})
