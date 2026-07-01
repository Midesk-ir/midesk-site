declare module '@mahlaparvaz/vue-datepicker' {
  import type { DefineComponent } from 'vue'

  export const DatepickerHeadless: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >
  export const DatePicker: DefineComponent<
    Record<string, unknown>,
    Record<string, unknown>,
    unknown
  >
}
