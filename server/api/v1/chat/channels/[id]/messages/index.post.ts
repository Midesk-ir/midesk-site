import type { SendChatMessagePayload } from '~/types/phase4'

export default defineEventHandler(async (event) => {
  const { user } = requireAuthWithPermission(event, 'chat:view')
  const db = useMockDb()
  const id = getRouterParam(event, 'id')!
  const body = await readBody<SendChatMessagePayload>(event)
  const data = db.phase4.sendMessage(id, body, user.id)
  return { data }
})
