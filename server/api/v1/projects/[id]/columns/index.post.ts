import type { ProjectColumn } from '../../../../../../app/types/phase1'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody<Partial<ProjectColumn>>(event)
  const column = db.phase1.createColumn(id, body)
  return { data: column }
})
