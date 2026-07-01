<script setup lang="ts">
import type { SaPlatformSettings } from '~/types/phase5'

const props = defineProps<{
  initial: SaPlatformSettings | null
  saving?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: Partial<SaPlatformSettings>]
}>()

const { t } = useI18n()

const form = reactive({
  platform_name: '',
  support_email: '',
  default_trial_days: 14,
  maintenance_mode: false
})

watch(() => props.initial, (settings) => {
  if (!settings) return
  form.platform_name = settings.platform_name
  form.support_email = settings.support_email
  form.default_trial_days = settings.default_trial_days
  form.maintenance_mode = settings.maintenance_mode
}, { immediate: true })

function onSubmit() {
  emit('submit', { ...form })
}
</script>

<template>
  <UCard class="midesk-glass border-[var(--color-midesk-border)]">
    <form class="midesk-form-fields midesk-form-panel" @submit.prevent="onSubmit">
      <MideskFormField :label="t('superAdmin.settings.fields.platformName')" :model-value="form.platform_name">
        <UInput v-model="form.platform_name" placeholder=" " />
      </MideskFormField>

      <MideskFormField
        :label="t('superAdmin.settings.fields.supportEmail')"
        :model-value="form.support_email"
        field-class="midesk-ltr-field"
      >
        <UInput v-model="form.support_email" type="email" placeholder=" " />
      </MideskFormField>

      <MideskFormField
        :label="t('superAdmin.settings.fields.defaultTrialDays')"
        :model-value="String(form.default_trial_days)"
      >
        <UInput v-model.number="form.default_trial_days" type="number" min="0" placeholder=" " />
      </MideskFormField>

      <MideskFormField :label="t('superAdmin.settings.fields.maintenanceMode')" :model-value="String(form.maintenance_mode)">
        <USwitch v-model="form.maintenance_mode" />
      </MideskFormField>

      <div class="pt-2">
        <UButton type="submit" color="primary" :loading="saving">
          {{ t('common.save') }}
        </UButton>
      </div>
    </form>
  </UCard>
</template>
