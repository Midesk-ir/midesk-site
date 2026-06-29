import { localizeDigits, isPersianLocale } from '~/utils/localeDigits'

export function useLocaleDigits() {
  const { locale } = useI18n()

  function ld(value: string | number | null | undefined): string {
    return localizeDigits(value, locale.value)
  }

  function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
    const intlLocale = isPersianLocale(locale.value) ? 'fa-IR' : 'en-US'
    return ld(new Intl.NumberFormat(intlLocale, options).format(value))
  }

  return { ld, localizeDigits: ld, formatNumber, locale }
}
