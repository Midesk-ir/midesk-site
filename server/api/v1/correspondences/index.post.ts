export default defineEventHandler(async (event) => {
  const { user } = requireAuthWithPermission(event, 'correspondence:manage')
  const body = await readBody(event)
  const db = useMockDb()
  return { data: db.phase5.createCorrespondence(user.id, body) }
})
