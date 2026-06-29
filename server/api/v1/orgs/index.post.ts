import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  const { user, session } = db.requireAuth(event)
  const body = await readBody<{
    name: string
    region: 'IR' | 'INTL'
    locale: string
    calendar_type: 'jalali' | 'gregorian'
    default_currency: string
    timezone: string
  }>(event)

  const tenant = {
    id: randomUUID(),
    name: body.name,
    region: body.region,
    locale: body.locale,
    calendar_type: body.calendar_type,
    default_currency: body.default_currency,
    timezone: body.timezone
  }

  db.tenants.push(tenant)
  session.tenantId = tenant.id
  user.role = 'OWNER'

  return tenant
})
