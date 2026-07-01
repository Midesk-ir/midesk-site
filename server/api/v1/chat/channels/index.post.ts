import type { CreateChatChannelPayload } from '~/types/phase4'

export default defineEventHandler(async (event) => {
  const { user } = requireAuthWithPermission(event, 'chat:manage')
  const db = useMockDb()
  const body = await readBody<CreateChatChannelPayload>(event)
  const channel = db.phase4.createChannel(body, user.id)
  return { data: channel }
})
