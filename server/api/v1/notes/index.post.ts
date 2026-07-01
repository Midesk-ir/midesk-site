import type { CreateNotePayload } from '~/types/phase4'

export default defineEventHandler(async (event) => {
  const { user } = requireAuthWithPermission(event, 'notes:manage')
  const db = useMockDb()
  const body = await readBody<CreateNotePayload>(event)
  const data = db.phase4.createNote(body, user.id)
  return { data }
})
