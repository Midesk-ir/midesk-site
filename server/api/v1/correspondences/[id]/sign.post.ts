export default defineEventHandler((event) => {
  const { user } = requireAuthWithPermission(event, 'correspondence:manage')
  const id = getRouterParam(event, 'id')!
  const db = useMockDb()
  return { data: db.phase5.signCorrespondence(id, user.id) }
})
