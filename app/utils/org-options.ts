export type OrgSelectOption = {
  label: string
  value: string
}

const CURRENCIES_BY_REGION = {
  IR: ['IRR', 'USD', 'EUR'],
  INTL: ['USD', 'EUR', 'GBP', 'AED', 'IRR']
} as const

const TIMEZONES_BY_REGION = {
  IR: ['Asia/Tehran'],
  INTL: [
    'UTC',
    'Europe/London',
    'Europe/Berlin',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Dubai',
    'Asia/Singapore',
    'Asia/Tehran'
  ]
} as const

type OrgRegion = keyof typeof CURRENCIES_BY_REGION

export function currencyCodesForRegion(region: OrgRegion): readonly string[] {
  return CURRENCIES_BY_REGION[region]
}

export function timezoneCodesForRegion(region: OrgRegion): readonly string[] {
  return TIMEZONES_BY_REGION[region]
}

export function currencyOptionsForRegion(
  region: OrgRegion,
  t: (key: string) => string
): OrgSelectOption[] {
  return currencyCodesForRegion(region).map(code => ({
    value: code,
    label: t(`onboarding.currencies.${code}`)
  }))
}

export function timezoneOptionsForRegion(
  region: OrgRegion,
  t: (key: string) => string
): OrgSelectOption[] {
  return timezoneCodesForRegion(region).map(code => ({
    value: code,
    label: t(`onboarding.timezones.${code.replace(/\//g, '_')}`)
  }))
}

export function ensureOrgDefaultsForRegion(
  region: OrgRegion,
  current: { default_currency: string, timezone: string }
) {
  const currencies = [...currencyCodesForRegion(region)]
  const timezones = [...timezoneCodesForRegion(region)]

  return {
    default_currency: currencies.includes(current.default_currency)
      ? current.default_currency
      : currencies[0]!,
    timezone: timezones.includes(current.timezone)
      ? current.timezone
      : timezones[0]!
  }
}
