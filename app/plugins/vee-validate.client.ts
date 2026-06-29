import { Form as VeeForm, Field as VeeField, ErrorMessage as VeeErrorMessage } from 'vee-validate'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VeeForm', VeeForm)
  nuxtApp.vueApp.component('VeeField', VeeField)
  nuxtApp.vueApp.component('VeeErrorMessage', VeeErrorMessage)
})
