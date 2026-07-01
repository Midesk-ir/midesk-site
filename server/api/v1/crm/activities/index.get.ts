export default defineEventHandler((event) => {
  requireAuthWithPermission(event, 'crm:view')
  const contactId = getQuery(event).contact_id as string | undefined
  const db = useMockDb()
  return { data: db.phase5.listActivities(contactId) }
})
