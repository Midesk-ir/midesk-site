export default defineEventHandler((event) => {
  const { db } = requireAuthWithPermission(event, 'hr:contracts:view')
  return { data: db.phase2.listContracts() }
})
