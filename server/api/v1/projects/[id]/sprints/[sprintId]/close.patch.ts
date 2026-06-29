import type { CloseSprintPayload } from '../../../../../../../app/types/phase1'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const sprintId = getRouterParam(event, 'sprintId')!
  const body = await readBody<CloseSprintPayload>(event)
  const sprint = db.phase1.closeSprint(sprintId, body, db.tasks)
  return { data: sprint }
})
