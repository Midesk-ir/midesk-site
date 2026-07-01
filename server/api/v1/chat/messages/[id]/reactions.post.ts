export default defineEventHandler(async (event) => {
  const { user } = requireAuthWithPermission(event, 'chat:view')
  const db = useMockDb()
  const id = getRouterParam(event, 'id')!
  const body = await readBody<{ emoji: string }>(event)
  const data = db.phase4.addReaction(id, body.emoji, user.id)
  return { data }
})
