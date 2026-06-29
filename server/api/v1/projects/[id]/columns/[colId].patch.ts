import type { ProjectColumn } from '../../../../../../app/types/phase1'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const colId = getRouterParam(event, 'colId')!
  const body = await readBody<Partial<ProjectColumn>>(event)
  const column = db.phase1.updateColumn(colId, body)
  return { data: column }
})
