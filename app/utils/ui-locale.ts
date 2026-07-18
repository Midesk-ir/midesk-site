import { en, fa_ir } from '@nuxt/ui/locale'

const uiLocales = {
  fa: fa_ir,
  en
} as const

export function resolveUiLocale(code: string) {
  const base = uiLocales[code as keyof typeof uiLocales] ?? en
  return {
    ...base,
    dir: code === 'fa' ? 'rtl' : 'ltr'
  }
}
