import type { CreateMissionPayload } from '../../../../../app/types/phase2'

export default defineEventHandler(async (event) => {
  const { db, user } = requireAuthWithPermission(event, 'hr:missions:request')
  const body = await readBody<CreateMissionPayload>(event)
  return { data: db.phase2.createMission(user.id, user.name, body) }
})
