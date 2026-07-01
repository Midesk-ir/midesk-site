<script setup lang="ts">
import type { CreateMissionPayload } from '~/types/phase2'

const emit = defineEmits<{
  submit: [payload: CreateMissionPayload]
}>()

const { t } = useI18n()

const submitting = ref(false)

const form = reactive<CreateMissionPayload>({
  destination: '',
  start_date: '',
  end_date: '',
  transport: '',
  description: ''
})

function onSubmit() {
  if (!form.destination || !form.start_date || !form.end_date) return
  submitting.value = true
  emit('submit', {
    destination: form.destination,
    start_date: form.start_date,
    end_date: form.end_date,
    transport: form.transport || undefined,
    description: form.description || undefined
  })
  submitting.value = false
}

function reset() {
  form.destination = ''
  form.start_date = ''
  form.end_date = ''
  form.transport = ''
  form.description = ''
}

defineExpose({ reset })
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField :label="t('hr.missions.fields.destination')" :model-value="form.destination" required>
      <UInput v-model="form.destination" />
    </MideskFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('hr.missions.fields.startDate')" :model-value="form.start_date" field-class="midesk-ltr-field" required>
        <MideskDatePicker v-model="form.start_date" />
      </MideskFormField>
      <MideskFormField :label="t('hr.missions.fields.endDate')" :model-value="form.end_date" field-class="midesk-ltr-field" required>
        <MideskDatePicker v-model="form.end_date" />
      </MideskFormField>
    </div>

    <MideskFormField :label="t('hr.missions.fields.transport')" :model-value="form.transport">
      <UInput v-model="form.transport" />
    </MideskFormField>

    <MideskFormField :label="t('hr.missions.fields.description')" :model-value="form.description">
      <UTextarea v-model="form.description" :rows="3" placeholder=" " />
    </MideskFormField>

    <div class="flex justify-end">
      <UButton type="submit" color="primary" :loading="submitting">
        {{ t('hr.missions.submit') }}
      </UButton>
    </div>
  </form>
</template>
