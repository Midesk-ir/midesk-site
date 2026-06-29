const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

const TO_LATIN = new Map<string, string>()
for (let i = 0; i < 10; i++) {
  TO_LATIN.set(PERSIAN_DIGITS[i]!, String(i))
  TO_LATIN.set(ARABIC_DIGITS[i]!, String(i))
}

export function isPersianLocale(locale: string): boolean {
  return locale === 'fa' || locale.startsWith('fa-')
}

/** Normalize Persian/Arabic-Indic digits to ASCII 0–9. */
export function normalizeDigitsToLatin(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, ch => TO_LATIN.get(ch) ?? ch)
}

/** Convert digits to match UI locale (fa → ۰–۹, en → 0–9). Idempotent. */
export function localizeDigits(
  value: string | number | null | undefined,
  locale: string
): string {
  if (value == null) return ''
  const latin = normalizeDigitsToLatin(String(value))
  if (isPersianLocale(locale)) {
    return latin.replace(/\d/g, d => PERSIAN_DIGITS[Number(d)]!)
  }
  return latin
}
