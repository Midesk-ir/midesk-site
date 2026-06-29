import { defineStore } from 'pinia'
import type { CalendarEvent, Holiday, Shift } from '~/types/phase1'

export const useCalendarStore = defineStore('calendar', () => {
  const { api } = useApi()

  const events = ref<CalendarEvent[]>([])
  const holidays = ref<Holiday[]>([])
  const shifts = ref<Shift[]>([])
  const loading = ref(false)
  const currentMonth = ref<string | null>(null)

  function filterByMonth<T extends { date?: string, start_date?: string }>(
    items: T[],
    prefix: string
  ): T[] {
    return items.filter(item => {
      const date = item.date ?? item.start_date ?? ''
      return date.startsWith(prefix)
    })
  }

  async function fetchMonth(year: number, month: number) {
    const prefix = `${year}-${String(month).padStart(2, '0')}`
    currentMonth.value = prefix
    loading.value = true
    try {
      const [eventsRes, holidaysRes, shiftsRes] = await Promise.all([
        api<{ data: CalendarEvent[] }>('/calendar/events'),
        api<{ data: Holiday[] }>('/calendar/holidays'),
        api<{ data: Shift[] }>('/calendar/shifts')
      ])
      events.value = filterByMonth(eventsRes.data, prefix)
      holidays.value = filterByMonth(holidaysRes.data, prefix)
      shifts.value = filterByMonth(shiftsRes.data, prefix)
      return {
        events: events.value,
        holidays: holidays.value,
        shifts: shifts.value
      }
    } finally {
      loading.value = false
    }
  }

  async function createEvent(payload: Omit<CalendarEvent, 'id'>) {
    const data = await api<{ data: CalendarEvent }>('/calendar/events', {
      method: 'POST',
      body: payload
    })
    const prefix = currentMonth.value
    if (prefix && data.data.start_date.startsWith(prefix)) {
      events.value.push(data.data)
    }
    return data.data
  }

  return {
    events,
    holidays,
    shifts,
    loading,
    currentMonth,
    fetchMonth,
    createEvent
  }
})
