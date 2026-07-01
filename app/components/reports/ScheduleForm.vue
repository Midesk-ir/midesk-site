<script setup lang="ts">
import type { ReportSchedule } from '~/types/phase5'

const props = defineProps<{ modelValue?: ReportSchedule }>()
const emit = defineEmits<{ 'update:modelValue': [value: ReportSchedule] }>()
const { t } = useI18n()

const local = reactive<ReportSchedule>({
  frequency: props.modelValue?.frequency ?? 'weekly',
  recipients: props.modelValue?.recipients ?? []
})

watch(local, (v) => emit('update:modelValue', { ...v }), { deep: true })
</script>

<template>
  <div class="midesk-form-fields">
    <MideskFormField :label="t('reports.scheduleFrequency')" :model-value="local.frequency">
      <USelect
        v-model="local.frequency"
        :items="[
          { label: t('reports.daily'), value: 'daily' },
          { label: t('reports.weekly'), value: 'weekly' },
          { label: t('reports.monthly'), value: 'monthly' }
        ]"
      />
    </MideskFormField>
  </div>
</template>
