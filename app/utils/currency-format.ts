import { isPersianLocale, localizeDigits } from '~/utils/localeDigits'

export interface CurrencyParts {
  /** Logical order: amount then unit (e.g. ۲۲,۷۰۰,۰۰۰ ریال). */
  split: boolean
  unit: string
  amount: string
  text: string
  dir: 'ltr' | 'rtl'
}

function resolveCurrency(currency?: string | null): string {
  return (currency || 'IRR').toUpperCase()
}

export function formatCurrencyParts(
  amount: number,
  currency: string | undefined,
  locale: string
): CurrencyParts {
  const curr = resolveCurrency(currency)
  const persian = isPersianLocale(locale)
  const intlLocale = persian ? 'fa-IR' : 'en-US'
  const maxFractionDigits = curr === 'IRR' ? 0 : 2

  if (curr === 'IRR') {
    const amountStr = localizeDigits(
      new Intl.NumberFormat(intlLocale, { maximumFractionDigits: maxFractionDigits }).format(amount),
      locale
    )
    const unit = persian ? 'ریال' : 'Rial'
    const dir = persian ? 'rtl' : 'ltr'
    const plain = `${amountStr}\u00A0${unit}`
    // RLI/PDI keeps amount→unit reading order inside RTL parents; LTR uses plain text.
    const text = persian ? `\u2067${plain}\u2069` : plain
    return {
      split: true,
      unit,
      amount: amountStr,
      text,
      dir
    }
  }

  const text = localizeDigits(
    new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: curr,
      maximumFractionDigits: maxFractionDigits
    }).format(amount),
    locale
  )

  return {
    split: false,
    unit: '',
    amount: '',
    text,
    dir: persian ? 'rtl' : 'ltr'
  }
}

export function formatCurrencyText(
  amount: number,
  currency: string | undefined,
  locale: string
): string {
  return formatCurrencyParts(amount, currency, locale).text
}
