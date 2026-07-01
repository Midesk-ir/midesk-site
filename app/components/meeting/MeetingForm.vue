<script setup lang="ts">
import type { CreateMeetingPayload, MeetingProvider } from '~/types/phase4'
import type { User } from '~/types'

const props = defineProps<{ members?: User[] }>()
const emit = defineEmits<{ submit: [payload: CreateMeetingPayload] }>()

const { t } = useI18n()

const form = reactive({
  title: '',
  start_date: '',
  start_time: '10:00',
  end_date: '',
  end_time: '11:00',
  provider: 'jitsi' as MeetingProvider,
  attendee_ids: [] as string[]
})

const providerItems = computed(() => [
  { label: 'Jitsi', value: 'jitsi' },
  { label: 'BigBlueButton', value: 'bbb' },
  { label: 'Google Meet', value: 'google_meet' }
])

const memberItems = computed(() =>
  (props.members ?? []).map(m => ({ label: m.name, value: m.id }))
)

function combineDateTime(date: string, time: string) {
  if (!date) return ''
  return new Date(`${date}T${time || '09:00'}`).toISOString()
}

function resetForm() {
  form.title = ''
  form.start_date = ''
  form.start_time = '10:00'
  form.end_date = ''
  form.end_time = '11:00'
  form.provider = 'jitsi'
  form.attendee_ids = []
}

function onSubmit() {
  emit('submit', {
    title: form.title,
    start_at: combineDateTime(form.start_date, form.start_time),
    end_at: combineDateTime(form.end_date || form.start_date, form.end_time),
    provider: form.provider,
    attendee_ids: form.attendee_ids
  })
  resetForm()
}

watch(() => form.start_date, (date) => {
  if (date && !form.end_date) form.end_date = date
})
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField :label="t('meetings.fields.title')" :model-value="form.title">
      <UInput v-model="form.title" placeholder=" " required />
    </MideskFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('meetings.fields.startDate')" :model-value="form.start_date" field-class="midesk-ltr-field">
        <MideskDatePicker v-model="form.start_date" />
      </MideskFormField>
      <MideskFormField :label="t('meetings.fields.startTime')" :model-value="form.start_time" field-class="midesk-ltr-field">
        <UInput v-model="form.start_time" type="time" dir="ltr" />
      </MideskFormField>
      <MideskFormField :label="t('meetings.fields.endDate')" :model-value="form.end_date" field-class="midesk-ltr-field">
        <MideskDatePicker v-model="form.end_date" />
      </MideskFormField>
      <MideskFormField :label="t('meetings.fields.endTime')" :model-value="form.end_time" field-class="midesk-ltr-field">
        <UInput v-model="form.end_time" type="time" dir="ltr" />
      </MideskFormField>
    </div>

    <MideskFormField :label="t('meetings.fields.provider')" :model-value="form.provider">
      <USelect v-model="form.provider" :items="providerItems" value-key="value" label-key="label" />
    </MideskFormField>

    <MideskFormField :label="t('meetings.fields.attendees')" :model-value="form.attendee_ids.join(',')">
      <USelectMenu
        v-model="form.attendee_ids"
        :items="memberItems"
        value-key="value"
        multiple
        :placeholder="t('meetings.fields.attendeesPlaceholder')"
      />
    </MideskFormField>

    <div class="flex justify-end gap-2">
      <UButton type="submit" color="primary">{{ t('meetings.create') }}</UButton>
    </div>
  </form>
</template>
