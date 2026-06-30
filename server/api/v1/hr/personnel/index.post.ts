import type { CreatePersonnelPayload } from '../../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'hr:personnel:create')
  const body = await readBody<CreatePersonnelPayload>(event)
  return { data: db.phase2.createPersonnel(body) }
})
