<script setup lang="ts">
const props = withDefaults(defineProps<{
  to?: string
  icon?: string
  /** Use directional back chevron (RTL-aware) */
  back?: boolean
  variant?: 'nav' | 'primary' | 'outline' | 'soft-primary' | 'soft-neutral'
  size?: 'sm' | 'md'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
}>(), {
  variant: 'nav',
  back: false,
  loading: false,
  disabled: false,
  type: 'button'
})

const emit = defineEmits<{
  click: []
}>()

/** Defer so parent state updates run after UButton's async click handler finishes. */
function handleClick() {
  return nextTick(() => emit('click'))
}

const { backIcon } = useDirectionalIcons()

const resolvedIcon = computed(() => {
  if (props.icon) return props.icon
  if (props.back) return backIcon.value
  return undefined
})

const resolvedVariant = computed(() => (props.variant === 'nav' ? 'outline' : props.variant))

const ui = computed(() => {
  const size = props.size ?? 'md'
  switch (resolvedVariant.value) {
    case 'primary':
      return { color: 'primary' as const, variant: 'solid' as const, size }
    case 'outline':
      return { color: 'neutral' as const, variant: 'outline' as const, size }
    case 'soft-primary':
      return { color: 'primary' as const, variant: 'soft' as const, size }
    case 'soft-neutral':
      return { color: 'neutral' as const, variant: 'soft' as const, size }
    default:
      return { color: 'neutral' as const, variant: 'outline' as const, size }
  }
})
</script>

<template>
  <UButton
    :to="to"
    :type="to ? undefined : type"
    :icon="resolvedIcon"
    :loading="loading"
    :disabled="disabled"
    :color="ui.color"
    :variant="ui.variant"
    :size="ui.size"
    class="midesk-page-header-btn"
    :class="`midesk-page-header-btn--${resolvedVariant}`"
    @click="handleClick"
  >
    <slot />
  </UButton>
</template>
