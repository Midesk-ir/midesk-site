<script setup lang="ts">
const props = defineProps<{
  as?: string
  name?: string
  label?: string
  description?: string
  hint?: string
  error?: string | boolean
  help?: string
  required?: boolean
  /** Used to keep the label floated when a select/input already has a value */
  modelValue?: unknown
  fieldClass?: string
}>()

const focused = ref(false)

const filled = computed(() => {
  const value = props.modelValue
  if (value === undefined || value === null) return false
  if (typeof value === 'string') return value.length > 0
  if (typeof value === 'number') return !Number.isNaN(value)
  if (typeof value === 'boolean') return value
  if (Array.isArray(value)) return value.length > 0
  return true
})

function onFocusIn() {
  focused.value = true
}

function onFocusOut(event: FocusEvent) {
  const root = event.currentTarget as HTMLElement | null
  const next = event.relatedTarget as Node | null
  if (root && next && root.contains(next)) return
  focused.value = false
}

const floatingUi = computed(() => {
  if (!props.label) return undefined

  const rootClass = [
    'midesk-floating-field',
    filled.value && 'is-filled',
    focused.value && 'is-focused'
  ].filter(Boolean).join(' ')

  return {
    root: rootClass,
    wrapper: 'midesk-floating-field__meta',
    labelWrapper: 'midesk-floating-field__label-row',
    label: 'midesk-floating-field__label',
    container: 'midesk-floating-field__control',
    description: 'midesk-floating-field__description',
    error: 'midesk-floating-field__error',
    hint: 'midesk-floating-field__hint',
    help: 'midesk-floating-field__help'
  }
})
</script>

<template>
  <UFormField
    :as="as"
    :name="name"
    :label="label"
    :description="description"
    :hint="hint"
    :error="error"
    :help="help"
    :required="required"
    :class="fieldClass"
    :ui="floatingUi"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <slot />
  </UFormField>
</template>
