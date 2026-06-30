import type { CreateContractPayload } from '../../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db } = requireAuthWithPermission(event, 'hr:contracts:manage')
  const body = await readBody<CreateContractPayload>(event)
  return { data: db.phase2.createContract(body) }
})
