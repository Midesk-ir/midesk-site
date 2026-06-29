import type { CreateWorklogPayload } from '../../../../app/types/phase1'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody<Partial<CreateWorklogPayload>>(event)
  const entry = db.phase1.updateWorklog(id, body)
  return { data: entry }
})
