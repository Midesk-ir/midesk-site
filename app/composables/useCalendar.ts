import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import jalaliPlugin from 'jalali-dayjs'
import 'dayjs/locale/fa'
import { isPersianLocale, localizeDigits } from '~/utils/localeDigits'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.extend(jalaliPlugin)

export function useCalendar() {
  const tenantStore = useTenantStore()
  const { locale } = useI18n()

  const calendarType = computed(() => tenantStore.calendarType)
  const tz = computed(() => tenantStore.tenant?.timezone ?? 'Asia/Tehran')

  function formatDate(
    date: string | Date | null | undefined,
    format = 'YYYY/MM/DD'
  ): string {
    if (!date) return '—'
    const d = dayjs.utc(date).tz(tz.value)
    let formatted: string

    if (calendarType.value === 'jalali') {
      // jalali-dayjs formats in Shamsi when locale is 'fa'
      formatted = d.locale('fa').format(format)
    } else {
      // jalali-dayjs hijacks 'fa' locale — use 'en' for Gregorian dates
      formatted = d.locale('en').format(format)
    }

    return localizeDigits(formatted, locale.value)
  }

  function formatDateTime(date: string | Date | null | undefined): string {
    return formatDate(date, 'YYYY/MM/DD HH:mm')
  }

  function formatRelative(date: string | Date | null | undefined): string {
    if (!date) return '—'
    const relative = dayjs.utc(date).tz(tz.value).locale(locale.value === 'fa' ? 'fa' : 'en').fromNow()
    return localizeDigits(relative, locale.value)
  }

  function formatCurrency(amount: number, currency?: string): string {
    const curr = currency ?? tenantStore.tenant?.default_currency ?? 'IRR'
    const intlLocale = isPersianLocale(locale.value) ? 'fa-IR' : 'en-US'
    const formatted = new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: curr === 'IRR' ? 0 : 2
    }).format(amount)
    return localizeDigits(formatted, locale.value)
  }

  function isOverdue(date: string | null | undefined): boolean {
    if (!date) return false
    return dayjs.utc(date).tz(tz.value).isBefore(dayjs().tz(tz.value), 'day')
  }

  return {
    calendarType,
    formatDate,
    formatDateTime,
    formatRelative,
    formatCurrency,
    isOverdue
  }
}
