/**
 * @mahlaparvaz/vue-datepicker@0.5.1 passes `locale` to DatepickerHeader
 * which does not declare that prop (fragment root) → Vue extraneous attrs warning.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const target = join(
  dirname(fileURLToPath(import.meta.url)),
  '../node_modules/@mahlaparvaz/vue-datepicker/dist/vue-datepicker.es.js'
)

const needle = `enableLocaleSelector: { type: Boolean, default: !0 },
    availableLocales: { type: Array, default: () => ["jalali", "gregorian", "hijri", "chinese"] },
    navigation: { type: Object, required: !0 },`

const patch = `enableLocaleSelector: { type: Boolean, default: !0 },
    availableLocales: { type: Array, default: () => ["jalali", "gregorian", "hijri", "chinese"] },
    locale: { type: String, default: null },
    navigation: { type: Object, required: !0 },`

let source
try {
  source = readFileSync(target, 'utf8')
} catch {
  console.warn('[patch-vue-datepicker] package not installed, skipping')
  process.exit(0)
}

if (source.includes(patch)) {
  console.log('[patch-vue-datepicker] already patched')
  process.exit(0)
}

if (!source.includes(needle)) {
  console.warn('[patch-vue-datepicker] unexpected file format, skipping')
  process.exit(0)
}

writeFileSync(target, source.replace(needle, patch), 'utf8')
console.log('[patch-vue-datepicker] patched DatepickerHeader locale prop')
