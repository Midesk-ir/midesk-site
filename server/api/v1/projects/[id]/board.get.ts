import type { SwimlaneMode } from '../../../../../app/types/phase1'

export default defineEventHandler((event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const query = getQuery(event)
  const swimlane = (query.swimlane as SwimlaneMode) || 'none'
  const board = db.phase1.getBoardWithColumns(id, db.tasks, swimlane)
  return { data: board }
})
