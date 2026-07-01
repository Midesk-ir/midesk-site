<script setup lang="ts">
import type { CreateCrmOpportunityPayload, CrmContact, CrmOpportunityStage } from '~/types/phase5'

const props = defineProps<{
  contacts: CrmContact[]
  defaultContactId?: string
  saving?: boolean
}>()

const emit = defineEmits<{ submit: [payload: CreateCrmOpportunityPayload], cancel: [] }>()
const { t } = useI18n()
const tenantStore = useTenantStore()

const form = reactive({
  title: '',
  contact_id: props.defaultContactId ?? '',
  value: 0,
  currency: tenantStore.tenant?.default_currency ?? 'IRR',
  stage: 'lead' as CrmOpportunityStage,
  probability: 20,
  expected_close_date: ''
})

watch(() => props.defaultContactId, (id) => {
  if (id) form.contact_id = id
}, { immediate: true })

const contactOptions = computed(() =>
  props.contacts.map(c => ({ label: c.company ? `${c.name} (${c.company})` : c.name, value: c.id }))
)

const stageOptions = computed(() =>
  (['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as CrmOpportunityStage[]).map(s => ({
    label: t(`crm.stages.${s}`),
    value: s
  }))
)

function submit() {
  if (!form.title.trim() || !form.contact_id) return
  emit('submit', {
    title: form.title.trim(),
    contact_id: form.contact_id,
    value: form.value,
    currency: form.currency,
    stage: form.stage,
    probability: form.probability,
    expected_close_date: form.expected_close_date || undefined
  })
}
</script>

<template>
  <div class="midesk-form-fields">
    <MideskFormField :label="t('crm.fields.title')" :model-value="form.title" required>
      <UInput v-model="form.title" placeholder=" " />
    </MideskFormField>
    <MideskFormField :label="t('crm.fields.contact')" :model-value="form.contact_id" required>
      <USelect v-model="form.contact_id" :items="contactOptions" :placeholder="t('crm.selectContact')" />
    </MideskFormField>
    <MideskFormField :label="t('crm.fields.value')" :model-value="String(form.value)" field-class="midesk-ltr-field">
      <UInput v-model.number="form.value" type="number" min="0" dir="ltr" />
    </MideskFormField>
    <MideskFormField :label="t('crm.fields.stage')" :model-value="form.stage">
      <USelect v-model="form.stage" :items="stageOptions" />
    </MideskFormField>
    <MideskFormField :label="t('crm.fields.probability')" :model-value="String(form.probability)">
      <UInput v-model.number="form.probability" type="number" min="0" max="100" />
    </MideskFormField>
    <MideskFormField :label="t('crm.fields.expectedClose')" :model-value="form.expected_close_date">
      <MideskDatePicker v-model="form.expected_close_date" />
    </MideskFormField>
    <div class="flex gap-2 pt-1">
      <UButton color="primary" :loading="saving" :disabled="!form.title.trim() || !form.contact_id" @click="submit">
        {{ t('common.save') }}
      </UButton>
      <UButton variant="outline" :disabled="saving" @click="emit('cancel')">
        {{ t('common.cancel') }}
      </UButton>
    </div>
  </div>
</template>
