import type { CreateNotePayload } from '~/types/phase4'

export default defineEventHandler(async (event) => {
  const { user } = requireAuthWithPermission(event, 'notes:manage')
  const db = useMockDb()
  const id = getRouterParam(event, 'id')!
  const body = await readBody<Partial<CreateNotePayload>>(event)
  const data = db.phase4.updateNote(id, body, user.id)
  return { data }
})
