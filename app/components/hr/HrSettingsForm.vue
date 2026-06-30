<script setup lang="ts">
import type { HrSettings } from '~/types/phase2'

const props = defineProps<{
  initial?: HrSettings | null
}>()

const emit = defineEmits<{
  submit: [payload: Partial<HrSettings>]
}>()

const { t } = useI18n()
const hrStore = useHrStore()

const submitting = ref(false)

const form = reactive<HrSettings>({
  work_start_time: '09:00',
  work_end_time: '17:00',
  late_threshold_minutes: 15,
  overtime_enabled: true,
  contract_expiry_alert_days: 30
})

watch(
  () => props.initial ?? hrStore.settings,
  (settings) => {
    if (!settings) return
    form.work_start_time = settings.work_start_time
    form.work_end_time = settings.work_end_time
    form.late_threshold_minutes = settings.late_threshold_minutes
    form.overtime_enabled = settings.overtime_enabled
    form.contract_expiry_alert_days = settings.contract_expiry_alert_days
  },
  { immediate: true }
)

function onSubmit() {
  submitting.value = true
  emit('submit', { ...form })
  submitting.value = false
}
</script>

<template>
  <div class="midesk-glass rounded-xl border border-[var(--color-midesk-border)] p-5">
    <h2 class="midesk-card-header">{{ t('hr.settings.title') }}</h2>

    <form class="midesk-form-fields" @submit.prevent="onSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <MideskFormField :label="t('hr.settings.workStart')" :model-value="form.work_start_time" field-class="midesk-ltr-field" required>
          <UInput v-model="form.work_start_time" type="time" />
        </MideskFormField>
        <MideskFormField :label="t('hr.settings.workEnd')" :model-value="form.work_end_time" field-class="midesk-ltr-field" required>
          <UInput v-model="form.work_end_time" type="time" />
        </MideskFormField>
      </div>

      <MideskFormField :label="t('hr.settings.lateThreshold')" :model-value="form.late_threshold_minutes" required>
        <UInput v-model.number="form.late_threshold_minutes" type="number" min="0" />
      </MideskFormField>

      <MideskFormField :label="t('hr.settings.overtimeEnabled')" :model-value="form.overtime_enabled">
        <UCheckbox v-model="form.overtime_enabled" :label="t('hr.settings.overtimeEnabledHint')" />
      </MideskFormField>

      <MideskFormField :label="t('hr.settings.contractExpiryAlert')" :model-value="form.contract_expiry_alert_days" required>
        <UInput v-model.number="form.contract_expiry_alert_days" type="number" min="1" />
      </MideskFormField>

      <div class="flex justify-end">
        <UButton type="submit" color="primary" :loading="submitting">
          {{ t('common.save') }}
        </UButton>
      </div>
    </form>
  </div>
</template>
