<script setup lang="ts">
import type { ContractType, CreateContractPayload, Personnel } from '~/types/phase2'

const props = defineProps<{
  personnel?: Personnel[]
  initial?: Partial<CreateContractPayload>
  allowFile?: boolean
  submitLabel?: 'create' | 'save'
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: CreateContractPayload]
}>()

const { t } = useI18n()
const { formatCurrency } = useCalendar()
const toast = useToast()

const attachmentFile = ref<File | null>(null)

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
  if (!form.personnel_id || !form.start_date || !form.base_salary) {
    toast.add({ title: t('common.fillRequired'), color: 'warning' })
    return
  }
  emit('submit', {
    personnel_id: form.personnel_id,
    type: form.type,
    start_date: form.start_date,
    end_date: form.end_date || undefined,
    base_salary: form.base_salary,
    currency: form.currency
  })
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
        <MideskDatePicker v-model="form.start_date" />
      </MideskFormField>
      <MideskFormField :label="t('hr.contracts.fields.endDate')" :model-value="form.end_date" field-class="midesk-ltr-field">
        <MideskDatePicker v-model="form.end_date" />
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

    <MideskFormField
      v-if="allowFile"
      :label="t('hr.contracts.fields.attachment')"
      :model-value="attachmentFile?.name"
    >
      <input
        type="file"
        class="block w-full text-sm text-[var(--color-midesk-muted)] file:me-4 file:rounded-lg file:border-0 file:bg-[var(--color-midesk-accent-soft)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-midesk-accent)]"
        @change="attachmentFile = ($event.target as HTMLInputElement).files?.[0] ?? null"
      >
    </MideskFormField>

    <div class="flex justify-end">
      <UButton type="submit" color="primary" :loading="loading">
        {{ submitLabel === 'save' ? t('common.save') : t('common.create') }}
      </UButton>
    </div>
  </form>
</template>
