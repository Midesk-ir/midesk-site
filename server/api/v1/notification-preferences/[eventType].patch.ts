import type { UpdateNotificationPreferencePayload } from '~/types/phase4'

export default defineEventHandler(async (event) => {
  const { user } = requireAuthWithPermission(event, 'notifications:preferences')
  const db = useMockDb()
  const eventType = getRouterParam(event, 'eventType')!
  const body = await readBody<UpdateNotificationPreferencePayload>(event)
  const data = db.phase4.updateNotificationPreference(user.id, eventType, body)
  return { data }
})
