<script setup lang="ts">
const props = defineProps<{
  amount: number
  currency?: string
}>()

defineOptions({ inheritAttrs: false })

const { locale } = useI18n()

const parts = computed(() =>
  formatCurrencyParts(props.amount, props.currency, locale.value)
)
</script>

<template>
  <span
    v-if="parts.split"
    class="midesk-currency"
    :dir="parts.dir"
    v-bind="$attrs"
  >
    {{ parts.amount }}&nbsp;{{ parts.unit }}
  </span>
  <span
    v-else
    class="midesk-currency-amount"
    :dir="parts.dir"
    v-bind="$attrs"
  >
    {{ parts.text }}
  </span>
</template>
