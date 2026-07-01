import type { AiQueryPayload } from '~/types/phase4'

export default defineEventHandler(async (event) => {
  const { user } = requireAuthWithPermission(event, 'ai:query')
  const db = useMockDb()
  const body = await readBody<AiQueryPayload>(event)
  const data = db.phase4.createAiQuery(body, user.id)
  return { data }
})
