<script setup lang="ts">
const props = defineProps<{
  current: number
  limit: number | null
}>()

const { t } = useI18n()

const color = computed(() => {
  if (props.limit == null) return 'success'
  if (props.current > props.limit) return 'error'
  if (props.current >= props.limit) return 'warning'
  return 'success'
})

const label = computed(() => {
  if (props.limit == null) return String(props.current)
  return `${props.current}/${props.limit}`
})
</script>

<template>
  <UBadge
    :color="color"
    variant="subtle"
    size="xs"
    :title="limit != null ? t('columns.wipLimit') : undefined"
  >
    {{ label }}
  </UBadge>
</template>
