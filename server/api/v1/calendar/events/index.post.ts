import { randomUUID } from 'node:crypto'
import type { CalendarEvent } from '../../../../../app/types/phase1'

export default defineEventHandler(async (event) => {
  const db = useMockDb()
  db.requireAuth(event)
  const body = await readBody<Omit<CalendarEvent, 'id'>>(event)
  const calendarEvent: CalendarEvent = { id: randomUUID(), ...body }
  db.phase1.calendarEvents.push(calendarEvent)
  return { data: calendarEvent }
})
