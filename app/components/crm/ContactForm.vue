<script setup lang="ts">
import type { CreateCrmContactPayload, CrmContact } from '~/types/phase5'

const props = defineProps<{
  initial?: CrmContact | null
  saving?: boolean
}>()

const emit = defineEmits<{ submit: [payload: CreateCrmContactPayload], cancel: [] }>()
const { t } = useI18n()

const form = reactive({
  name: '',
  company: '',
  email: '',
  phone: '',
  type: 'lead' as CreateCrmContactPayload['type'],
  tagsText: ''
})

watch(() => props.initial, (contact) => {
  if (!contact) {
    form.name = ''
    form.company = ''
    form.email = ''
    form.phone = ''
    form.type = 'lead'
    form.tagsText = ''
    return
  }
  form.name = contact.name
  form.company = contact.company ?? ''
  form.email = contact.email ?? ''
  form.phone = contact.phone ?? ''
  form.type = contact.type
  form.tagsText = contact.tags.join(', ')
}, { immediate: true })

const typeOptions = computed(() =>
  (['lead', 'customer', 'partner', 'vendor'] as const).map(v => ({
    label: t(`crm.types.${v}`),
    value: v
  }))
)

function submit() {
  if (!form.name.trim()) return
  emit('submit', {
    name: form.name.trim(),
    company: form.company || undefined,
    email: form.email || undefined,
    phone: form.phone || undefined,
    type: form.type,
    tags: form.tagsText
      ? form.tagsText.split(',').map(s => s.trim()).filter(Boolean)
      : []
  })
}
</script>

<template>
  <div class="midesk-form-fields">
    <MideskFormField :label="t('crm.fields.name')" :model-value="form.name" required>
      <UInput v-model="form.name" placeholder=" " />
    </MideskFormField>
    <MideskFormField :label="t('crm.fields.company')" :model-value="form.company">
      <UInput v-model="form.company" placeholder=" " />
    </MideskFormField>
    <MideskFormField :label="t('crm.fields.email')" :model-value="form.email" field-class="midesk-ltr-field">
      <UInput v-model="form.email" dir="ltr" placeholder=" " />
    </MideskFormField>
    <MideskFormField :label="t('crm.fields.phone')" :model-value="form.phone" field-class="midesk-ltr-field">
      <UInput v-model="form.phone" dir="ltr" placeholder=" " />
    </MideskFormField>
    <MideskFormField :label="t('crm.fields.type')" :model-value="form.type">
      <USelect v-model="form.type" :items="typeOptions" />
    </MideskFormField>
    <MideskFormField :label="t('crm.fields.tags')" :model-value="form.tagsText">
      <UInput v-model="form.tagsText" :placeholder="t('crm.tagsPlaceholder')" />
    </MideskFormField>
    <div class="flex gap-2 pt-1">
      <UButton color="primary" :loading="saving" :disabled="!form.name.trim()" @click="submit">
        {{ t('common.save') }}
      </UButton>
      <UButton variant="outline" :disabled="saving" @click="emit('cancel')">
        {{ t('common.cancel') }}
      </UButton>
    </div>
  </div>
</template>
