<script setup lang="ts">
import type { CreateInvoicePayload, Vendor } from '~/types/phase3'

const props = defineProps<{
  vendors: Vendor[]
}>()

const emit = defineEmits<{
  submit: [payload: CreateInvoicePayload]
}>()

const { t } = useI18n()
const tenantStore = useTenantStore()
const submitting = ref(false)

const form = reactive<CreateInvoicePayload>({
  vendor_id: '',
  invoice_number: '',
  issue_date: new Date().toISOString().slice(0, 10),
  due_date: '',
  amount: 0,
  currency: tenantStore.tenant?.default_currency ?? 'IRR',
  description: ''
})

const vendorOptions = computed(() =>
  props.vendors.map(v => ({ value: v.id, label: v.name }))
)

watch(() => props.vendors, (list) => {
  if (!form.vendor_id && list.length) form.vendor_id = list[0]!.id
}, { immediate: true })

function onSubmit() {
  if (!form.vendor_id || !form.invoice_number || !form.due_date || form.amount <= 0) return
  submitting.value = true
  emit('submit', { ...form })
  form.invoice_number = ''
  form.amount = 0
  form.description = ''
  submitting.value = false
}
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField
      :label="t('finance.invoices.fields.vendor')"
      :model-value="form.vendor_id"
      field-class="min-w-0"
      required
    >
      <USelect
        v-model="form.vendor_id"
        :items="vendorOptions"
        value-key="value"
        label-key="label"
        :placeholder="t('common.select')"
      />
    </MideskFormField>

    <div class="grid gap-4 sm:grid-cols-2 [&>*]:min-w-0">
      <MideskFormField :label="t('finance.invoices.fields.number')" :model-value="form.invoice_number" required>
        <UInput v-model="form.invoice_number" />
      </MideskFormField>

      <MideskFormField :label="t('finance.invoices.fields.amount')" :model-value="form.amount" required>
        <UInput v-model.number="form.amount" type="number" min="0" />
      </MideskFormField>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 [&>*]:min-w-0">
      <MideskFormField
        :label="t('finance.invoices.fields.issueDate')"
        :model-value="form.issue_date"
        field-class="midesk-ltr-field w-full"
        required
      >
        <MideskDatePicker v-model="form.issue_date" />
      </MideskFormField>

      <MideskFormField
        :label="t('finance.invoices.fields.dueDate')"
        :model-value="form.due_date"
        field-class="midesk-ltr-field w-full"
        required
      >
        <MideskDatePicker v-model="form.due_date" :placeholder="t('finance.invoices.fields.dueDate')" />
      </MideskFormField>
    </div>

    <MideskFormField
      :label="t('finance.invoices.fields.currency')"
      :model-value="form.currency"
      field-class="min-w-0 sm:max-w-xs"
    >
      <UInput v-model="form.currency" />
    </MideskFormField>

    <MideskFormField
      :label="t('finance.invoices.fields.description')"
      :model-value="form.description"
      field-class="min-w-0"
    >
      <UTextarea v-model="form.description" :rows="3" placeholder=" " />
    </MideskFormField>

    <div class="flex justify-end">
      <UButton type="submit" color="primary" :loading="submitting">
        {{ t('finance.invoices.actions.create') }}
      </UButton>
    </div>
  </form>
</template>
