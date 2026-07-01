<script setup lang="ts">
import type { CreateVendorPayload } from '~/types/phase3'

const emit = defineEmits<{
  submit: [payload: CreateVendorPayload]
}>()

const { t } = useI18n()
const submitting = ref(false)

const form = reactive<CreateVendorPayload>({
  name: '',
  code: '',
  contact_name: '',
  email: '',
  phone: '',
  tax_id: ''
})

function onSubmit() {
  if (!form.name.trim()) return
  submitting.value = true
  emit('submit', { ...form })
  form.name = ''
  form.code = ''
  form.contact_name = ''
  form.email = ''
  form.phone = ''
  form.tax_id = ''
  submitting.value = false
}
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('finance.vendors.fields.name')" :model-value="form.name" required>
        <UInput v-model="form.name" />
      </MideskFormField>
      <MideskFormField :label="t('finance.vendors.fields.code')" :model-value="form.code">
        <UInput v-model="form.code" />
      </MideskFormField>
      <MideskFormField :label="t('finance.vendors.fields.contact')" :model-value="form.contact_name">
        <UInput v-model="form.contact_name" />
      </MideskFormField>
      <MideskFormField :label="t('finance.vendors.fields.email')" :model-value="form.email">
        <UInput v-model="form.email" type="email" />
      </MideskFormField>
      <MideskFormField :label="t('finance.vendors.fields.phone')" :model-value="form.phone">
        <UInput v-model="form.phone" />
      </MideskFormField>
      <MideskFormField :label="t('finance.vendors.fields.taxId')" :model-value="form.tax_id">
        <UInput v-model="form.tax_id" />
      </MideskFormField>
    </div>

    <div class="flex justify-end">
      <UButton type="submit" color="primary" :loading="submitting">
        {{ t('finance.vendors.actions.create') }}
      </UButton>
    </div>
  </form>
</template>
