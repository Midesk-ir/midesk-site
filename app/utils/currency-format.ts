import { isPersianLocale, localizeDigits } from '~/utils/localeDigits'

export interface CurrencyParts {
  /** Render unit and amount in a fixed LTR row (unit on the left). */
  split: boolean
  unit: string
  amount: string
  text: string
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
    return {
      split: true,
      unit,
      amount: amountStr,
      text: `${unit}\u00A0${amountStr}`
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
    text
  }
}

export function formatCurrencyText(
  amount: number,
  currency: string | undefined,
  locale: string
): string {
  return formatCurrencyParts(amount, currency, locale).text
}
