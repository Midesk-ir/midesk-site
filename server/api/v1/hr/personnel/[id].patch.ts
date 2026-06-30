import type { CreatePersonnelPayload, Personnel } from '../../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'hr:personnel:update')
  const id = getRouterParam(event, 'id')!
  const body = await readBody<Partial<CreatePersonnelPayload> & { status?: Personnel['status'] }>(event)
  return { data: db.phase2.updatePersonnel(id, body) }
})
