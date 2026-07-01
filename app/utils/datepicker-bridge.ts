import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import jalaliPlugin from 'jalali-dayjs'

dayjs.extend(utc)
dayjs.extend(jalaliPlugin)

export type PickerCalendar = 'jalali' | 'gregorian'

export type PickerDateValue = {
  jy?: number
  jm?: number
  jd?: number
  year?: number
  month?: number
  day?: number
} | null

function normalizeIsoInput(value: string) {
  return value.slice(0, 10)
}

export function isoToPickerValue(
  value: string | null | undefined,
  calendar: PickerCalendar
): PickerDateValue {
  if (!value) return null

  const d = dayjs.utc(normalizeIsoInput(value))
  if (!d.isValid()) return null

  if (calendar === 'jalali') {
    const j = d.locale('fa')
    return {
      jy: Number(j.format('YYYY')),
      jm: Number(j.format('M')),
      jd: Number(j.format('D'))
    }
  }

  return {
    year: d.year(),
    month: d.month() + 1,
    day: d.date()
  }
}

export function pickerValueToIso(
  value: PickerDateValue,
  calendar: PickerCalendar
): string | null {
  if (!value) return null

  if (calendar === 'jalali') {
    const { jy, jm, jd } = value
    if (jy == null || jm == null || jd == null) return null

    const jalaliInput = `${jy}-${String(jm).padStart(2, '0')}-${String(jd).padStart(2, '0')}`
    const d = dayjs(jalaliInput, { jalali: true } as Record<string, boolean>)
    if (!d.isValid()) return null
    return d.utc().format('YYYY-MM-DD')
  }

  const { year, month, day } = value
  if (year == null || month == null || day == null) return null

  const d = dayjs.utc(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
  if (!d.isValid()) return null
  return d.format('YYYY-MM-DD')
}
