<script setup lang="ts">
import type { ContractType, CreateContractPayload, Personnel } from '~/types/phase2'

const props = defineProps<{
  personnel?: Personnel[]
  initial?: Partial<CreateContractPayload>
}>()

const emit = defineEmits<{
  submit: [payload: CreateContractPayload]
}>()

const { t } = useI18n()
const { formatCurrency } = useCalendar()

const submitting = ref(false)

const form = reactive<CreateContractPayload>({
  personnel_id: '',
  type: 'permanent',
  start_date: '',
  end_date: '',
  base_salary: 0,
  currency: 'IRR'
})

const contractTypes = computed(() =>
  (['permanent', 'fixed_term', 'trial', 'intern'] as ContractType[]).map(type => ({
    label: t(`hr.contracts.type.${type}`),
    value: type
  }))
)

const personnelItems = computed(() =>
  (props.personnel ?? []).map(p => ({
    label: `${p.user.name} (${p.employee_code})`,
    value: p.id
  }))
)

watch(
  () => [props.initial, props.personnel] as const,
  ([initial, personnel]) => {
    form.personnel_id = initial?.personnel_id ?? personnel?.[0]?.id ?? ''
    form.type = initial?.type ?? 'permanent'
    form.start_date = initial?.start_date ?? ''
    form.end_date = initial?.end_date ?? ''
    form.base_salary = initial?.base_salary ?? 0
    form.currency = initial?.currency ?? 'IRR'
  },
  { immediate: true }
)

function onSubmit() {
  if (!form.personnel_id || !form.start_date || !form.base_salary) return
  submitting.value = true
  emit('submit', {
    personnel_id: form.personnel_id,
    type: form.type,
    start_date: form.start_date,
    end_date: form.end_date || undefined,
    base_salary: form.base_salary,
    currency: form.currency
  })
  submitting.value = false
}
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField :label="t('hr.contracts.fields.personnel')" :model-value="form.personnel_id" required>
      <USelect v-model="form.personnel_id" :items="personnelItems" />
    </MideskFormField>

    <MideskFormField :label="t('hr.contracts.fields.type')" :model-value="form.type" required>
      <USelect v-model="form.type" :items="contractTypes" />
    </MideskFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('hr.contracts.fields.startDate')" :model-value="form.start_date" field-class="midesk-ltr-field" required>
        <UInput v-model="form.start_date" type="date" />
      </MideskFormField>
      <MideskFormField :label="t('hr.contracts.fields.endDate')" :model-value="form.end_date" field-class="midesk-ltr-field">
        <UInput v-model="form.end_date" type="date" />
      </MideskFormField>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('hr.contracts.fields.salary')" :model-value="form.base_salary" required>
        <UInput v-model.number="form.base_salary" type="number" min="0" />
      </MideskFormField>
      <MideskFormField :label="t('hr.contracts.fields.currency')" :model-value="form.currency">
        <UInput v-model="form.currency" />
      </MideskFormField>
    </div>

    <p v-if="form.base_salary" class="text-sm text-[var(--color-midesk-muted)]">
      {{ formatCurrency(form.base_salary, form.currency) }}
    </p>

    <div class="flex justify-end">
      <UButton type="submit" color="primary" :loading="submitting">
        {{ t('common.create') }}
      </UButton>
    </div>
  </form>
</template>
