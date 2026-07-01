export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'crm:view')
  const type = getQuery(event).type as string | undefined
  const db = useMockDb()
  return { data: db.phase5.listContacts(type) }
})
