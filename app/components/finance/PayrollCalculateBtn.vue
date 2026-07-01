<script setup lang="ts">
const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  calculate: [period: string]
}>()

const { t } = useI18n()
const period = ref(new Date().toISOString().slice(0, 7))

function onCalculate() {
  if (!period.value) return
  emit('calculate', period.value)
}
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onCalculate">
    <div class="flex flex-wrap items-end gap-4">
      <MideskFormField
        :label="t('finance.payroll.fields.period')"
        :model-value="period"
        field-class="midesk-ltr-field min-w-[12rem]"
      >
        <UInput v-model="period" type="month" />
      </MideskFormField>
      <UButton type="submit" color="primary" icon="i-lucide-calculator" :loading="props.loading">
        {{ t('finance.payroll.actions.calculate') }}
      </UButton>
    </div>
  </form>
</template>
