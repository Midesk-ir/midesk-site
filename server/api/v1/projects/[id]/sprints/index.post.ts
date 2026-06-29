import type { CreateSprintPayload } from '../../../../../../app/types/phase1'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody<CreateSprintPayload>(event)
  const sprint = db.phase1.createSprint(id, body)
  return { data: sprint }
})
