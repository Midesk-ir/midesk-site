<script setup lang="ts">
import type { SubscriptionPlan, SubscriptionPlanCode } from '~/types/phase5'

const props = defineProps<{
  initial?: SubscriptionPlan | null
  saving?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: Omit<SubscriptionPlan, 'id'> & { id?: string }]
  cancel: []
}>()

const { t } = useI18n()

const form = reactive({
  name: '',
  code: 'starter' as SubscriptionPlanCode,
  features: '',
  priceMonthlyIr: 0,
  priceMonthlyIntl: 0,
  priceYearlyIr: 0,
  priceYearlyIntl: 0,
  maxUsers: 10,
  maxProjects: 10
})

const codeItems = computed(() =>
  (['free', 'starter', 'pro', 'enterprise'] as SubscriptionPlanCode[]).map(code => ({
    label: code,
    value: code
  }))
)

watch(() => props.initial, (plan) => {
  if (!plan) {
    form.name = ''
    form.code = 'starter'
    form.features = ''
    form.priceMonthlyIr = 0
    form.priceMonthlyIntl = 0
    form.priceYearlyIr = 0
    form.priceYearlyIntl = 0
    form.maxUsers = 10
    form.maxProjects = 10
    return
  }

  form.name = plan.name
  form.code = plan.code
  form.features = plan.features.join(', ')
  form.priceMonthlyIr = plan.price_monthly.IR
  form.priceMonthlyIntl = plan.price_monthly.INTL
  form.priceYearlyIr = plan.price_yearly.IR
  form.priceYearlyIntl = plan.price_yearly.INTL
  form.maxUsers = plan.max_users
  form.maxProjects = plan.max_projects
}, { immediate: true })

function onSubmit() {
  emit('submit', {
    id: props.initial?.id,
    name: form.name,
    code: form.code,
    features: form.features.split(',').map(f => f.trim()).filter(Boolean),
    price_monthly: { IR: form.priceMonthlyIr, INTL: form.priceMonthlyIntl },
    price_yearly: { IR: form.priceYearlyIr, INTL: form.priceYearlyIntl },
    max_users: form.maxUsers,
    max_projects: form.maxProjects
  })
}
</script>

<template>
  <div class="midesk-form-fields midesk-form-panel">
    <MideskFormField :label="t('superAdmin.plans.fields.name')" :model-value="form.name">
      <UInput v-model="form.name" placeholder=" " />
    </MideskFormField>

    <MideskFormField :label="t('superAdmin.plans.fields.code')" :model-value="form.code">
      <USelect v-model="form.code" :items="codeItems" />
    </MideskFormField>

    <MideskFormField :label="t('superAdmin.plans.fields.features')" :model-value="form.features">
      <UTextarea v-model="form.features" :rows="3" placeholder=" " />
    </MideskFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('superAdmin.plans.fields.priceMonthlyIr')" :model-value="String(form.priceMonthlyIr)">
        <UInput v-model.number="form.priceMonthlyIr" type="number" placeholder=" " />
      </MideskFormField>
      <MideskFormField :label="t('superAdmin.plans.fields.priceMonthlyIntl')" :model-value="String(form.priceMonthlyIntl)">
        <UInput v-model.number="form.priceMonthlyIntl" type="number" placeholder=" " />
      </MideskFormField>
      <MideskFormField :label="t('superAdmin.plans.fields.priceYearlyIr')" :model-value="String(form.priceYearlyIr)">
        <UInput v-model.number="form.priceYearlyIr" type="number" placeholder=" " />
      </MideskFormField>
      <MideskFormField :label="t('superAdmin.plans.fields.priceYearlyIntl')" :model-value="String(form.priceYearlyIntl)">
        <UInput v-model.number="form.priceYearlyIntl" type="number" placeholder=" " />
      </MideskFormField>
      <MideskFormField :label="t('superAdmin.plans.fields.maxUsers')" :model-value="String(form.maxUsers)">
        <UInput v-model.number="form.maxUsers" type="number" placeholder=" " />
      </MideskFormField>
      <MideskFormField :label="t('superAdmin.plans.fields.maxProjects')" :model-value="String(form.maxProjects)">
        <UInput v-model.number="form.maxProjects" type="number" placeholder=" " />
      </MideskFormField>
    </div>

    <div class="flex flex-wrap gap-2 pt-2">
      <UButton color="primary" :loading="saving" @click="onSubmit">
        {{ t('common.save') }}
      </UButton>
      <UButton color="neutral" variant="ghost" @click="emit('cancel')">
        {{ t('common.cancel') }}
      </UButton>
    </div>
  </div>
</template>
