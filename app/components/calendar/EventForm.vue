<script setup lang="ts">
import type { CalendarEventType } from '~/types/phase1'

const props = defineProps<{
  initialDate?: string
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  saved: []
}>()

const { t } = useI18n()
const calendarStore = useCalendarStore()
const toast = useToast()

const saving = ref(false)
const form = reactive({
  title: '',
  type: 'meeting' as CalendarEventType,
  start_date: '',
  end_date: '',
  all_day: false,
  color: '#ff5c00'
})

const eventTypes = computed(() =>
  (['meeting', 'deadline', 'reminder', 'other'] as const).map(type => ({
    label: t(`calendar.types.${type}`),
    value: type
  }))
)

function resetForm() {
  const date = props.initialDate ?? new Date().toISOString().slice(0, 10)
  form.title = ''
  form.type = 'meeting'
  form.start_date = date
  form.end_date = date
  form.all_day = true
  form.color = '#ff5c00'
}

watch(open, (v) => {
  if (v) resetForm()
})

watch(() => props.initialDate, () => {
  if (open.value) resetForm()
})

async function submit() {
  if (!form.title.trim() || !form.start_date || !form.end_date) return
  saving.value = true
  try {
    await calendarStore.createEvent({
      title: form.title.trim(),
      type: form.type,
      start_date: form.all_day ? form.start_date : `${form.start_date}T09:00:00`,
      end_date: form.all_day ? form.end_date : `${form.end_date}T10:00:00`,
      all_day: form.all_day,
      color: form.color
    })
    open.value = false
    emit('saved')
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <MideskModal v-model:open="open" :title="t('calendar.newEvent')" :ui="{ content: 'sm:max-w-md' }">
    <div class="midesk-form-fields midesk-form-panel space-y-4">
        <MideskFormField :label="t('calendar.eventTitle')" :model-value="form.title" required>
          <UInput v-model="form.title" placeholder=" " />
        </MideskFormField>

        <MideskFormField :label="t('calendar.eventType')" :model-value="form.type" required>
          <USelect v-model="form.type" :items="eventTypes" />
        </MideskFormField>

        <div class="grid gap-4 sm:grid-cols-2">
          <MideskFormField :label="t('leave.request.startDate')" :model-value="form.start_date" field-class="midesk-ltr-field" required>
            <MideskDatePicker v-model="form.start_date" />
          </MideskFormField>
          <MideskFormField :label="t('leave.request.endDate')" :model-value="form.end_date" field-class="midesk-ltr-field" required>
            <MideskDatePicker v-model="form.end_date" />
          </MideskFormField>
        </div>

        <MideskFormField>
          <UCheckbox v-model="form.all_day" :label="t('calendar.allDay')" />
        </MideskFormField>
      </div>
    <template #footer>
      <UButton variant="ghost" @click="open = false">
        {{ t('common.cancel') }}
      </UButton>
      <UButton :loading="saving" color="primary" @click="submit">
        {{ t('common.create') }}
      </UButton>
    </template>
  </MideskModal>
</template>
