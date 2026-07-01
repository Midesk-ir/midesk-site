<script setup lang="ts">
import type { CreateCrmActivityPayload, CrmActivityType } from '~/types/phase5'

const props = defineProps<{
  contactId: string
  saving?: boolean
}>()

const emit = defineEmits<{ submit: [payload: CreateCrmActivityPayload], cancel: [] }>()
const { t } = useI18n()

const form = reactive({
  type: 'call' as CrmActivityType,
  subject: '',
  notes: ''
})

const typeOptions = computed(() =>
  (['call', 'email', 'meeting', 'note'] as CrmActivityType[]).map(v => ({
    label: t(`crm.activityTypes.${v}`),
    value: v
  }))
)

function submit() {
  if (!form.subject.trim()) return
  emit('submit', {
    contact_id: props.contactId,
    type: form.type,
    subject: form.subject.trim(),
    notes: form.notes || undefined
  })
}
</script>

<template>
  <div class="midesk-form-fields">
    <MideskFormField :label="t('crm.activityType')" :model-value="form.type">
      <USelect v-model="form.type" :items="typeOptions" />
    </MideskFormField>
    <MideskFormField :label="t('crm.activitySubject')" :model-value="form.subject" required>
      <UInput v-model="form.subject" placeholder=" " />
    </MideskFormField>
    <MideskFormField :label="t('crm.activityNotes')" :model-value="form.notes">
      <UTextarea v-model="form.notes" :rows="4" placeholder=" " />
    </MideskFormField>
    <div class="flex gap-2 pt-1">
      <UButton color="primary" :loading="saving" :disabled="!form.subject.trim()" @click="submit">
        {{ t('common.save') }}
      </UButton>
      <UButton variant="outline" :disabled="saving" @click="emit('cancel')">
        {{ t('common.cancel') }}
      </UButton>
    </div>
  </div>
</template>
