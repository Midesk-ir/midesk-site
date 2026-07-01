<script setup lang="ts">
import type { CreatePersonnelPayload, EmploymentType, Personnel } from '~/types/phase2'
import type { User } from '~/types'

const props = defineProps<{
  initial?: Personnel | null
  users?: User[]
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: CreatePersonnelPayload]
}>()

const { t } = useI18n()
const toast = useToast()

const form = reactive<CreatePersonnelPayload>({
  user_id: '',
  employee_code: '',
  hire_date: '',
  employment_type: 'full_time',
  job_title: '',
  department: '',
  national_id: '',
  birth_date: '',
  address: '',
  emergency_contact: ''
})

const employmentTypes = computed(() =>
  (['full_time', 'part_time', 'contract', 'intern'] as EmploymentType[]).map(type => ({
    label: t(`hr.personnel.employmentType.${type}`),
    value: type
  }))
)

const userItems = computed(() =>
  (props.users ?? []).map(u => ({
    label: u.name,
    value: u.id
  }))
)

watch(
  () => props.initial,
  (person) => {
    if (!person) {
      form.user_id = props.users?.[0]?.id ?? ''
      form.employee_code = ''
      form.hire_date = ''
      form.employment_type = 'full_time'
      form.job_title = ''
      form.department = ''
      form.national_id = ''
      form.birth_date = ''
      form.address = ''
      form.emergency_contact = ''
      return
    }
    form.user_id = person.user.id
    form.employee_code = person.employee_code
    form.hire_date = person.hire_date
    form.employment_type = person.employment_type
    form.job_title = person.job_title ?? ''
    form.department = person.department ?? ''
    form.national_id = person.national_id ?? ''
    form.birth_date = person.birth_date ?? ''
    form.address = person.address ?? ''
    form.emergency_contact = person.emergency_contact ?? ''
  },
  { immediate: true }
)

function onSubmit() {
  if (!form.user_id || !form.employee_code || !form.hire_date) {
    toast.add({ title: t('common.fillRequired'), color: 'warning' })
    return
  }
  emit('submit', {
    user_id: form.user_id,
    employee_code: form.employee_code,
    hire_date: form.hire_date,
    employment_type: form.employment_type,
    job_title: form.job_title || undefined,
    department: form.department || undefined,
    national_id: form.national_id || undefined,
    birth_date: form.birth_date || undefined,
    address: form.address || undefined,
    emergency_contact: form.emergency_contact || undefined
  })
}
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField
      v-if="!initial"
      :label="t('hr.personnel.fields.user')"
      :model-value="form.user_id"
      required
    >
      <USelect v-model="form.user_id" :items="userItems" />
    </MideskFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('hr.personnel.fields.employeeCode')" :model-value="form.employee_code" required>
        <UInput v-model="form.employee_code" />
      </MideskFormField>
      <MideskFormField :label="t('hr.personnel.fields.hireDate')" :model-value="form.hire_date" field-class="midesk-ltr-field" required>
        <MideskDatePicker v-model="form.hire_date" />
      </MideskFormField>
    </div>

    <MideskFormField :label="t('hr.personnel.fields.employmentType')" :model-value="form.employment_type" required>
      <USelect v-model="form.employment_type" :items="employmentTypes" />
    </MideskFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('hr.personnel.fields.jobTitle')" :model-value="form.job_title">
        <UInput v-model="form.job_title" />
      </MideskFormField>
      <MideskFormField :label="t('hr.personnel.fields.department')" :model-value="form.department">
        <UInput v-model="form.department" />
      </MideskFormField>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('hr.personnel.fields.nationalId')" :model-value="form.national_id">
        <UInput v-model="form.national_id" />
      </MideskFormField>
      <MideskFormField :label="t('hr.personnel.fields.birthDate')" :model-value="form.birth_date" field-class="midesk-ltr-field">
        <MideskDatePicker v-model="form.birth_date" />
      </MideskFormField>
    </div>

    <MideskFormField :label="t('hr.personnel.fields.address')" :model-value="form.address">
      <UTextarea v-model="form.address" :rows="2" placeholder=" " />
    </MideskFormField>

    <MideskFormField :label="t('hr.personnel.fields.emergencyContact')" :model-value="form.emergency_contact">
      <UInput v-model="form.emergency_contact" />
    </MideskFormField>

    <div class="flex justify-end gap-2">
      <UButton type="submit" color="primary" :loading="loading">
        {{ initial ? t('common.save') : t('common.create') }}
      </UButton>
    </div>
  </form>
</template>
