<script setup lang="ts">
import type { Budget, CostCenter, CreateExpensePayload, ExpenseCategory } from '~/types/phase3'

const props = defineProps<{
  costCenters?: CostCenter[]
  budgets?: Budget[]
}>()

const emit = defineEmits<{
  submit: [payload: CreateExpensePayload]
}>()

const { t } = useI18n()
const tenantStore = useTenantStore()

const submitting = ref(false)

const categories: ExpenseCategory[] = ['travel', 'office', 'software', 'meals', 'equipment', 'other']

const form = reactive<CreateExpensePayload & { receipt_file?: string }>({
  category: 'office',
  cost_center_id: undefined,
  budget_id: undefined,
  amount: 0,
  currency: tenantStore.tenant?.default_currency ?? 'IRR',
  description: '',
  expense_date: new Date().toISOString().slice(0, 10),
  receipt_path: undefined
})

function onReceiptChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  form.receipt_path = file ? file.name : undefined
}

const flatCostCenters = computed(() => flattenCostCenters(props.costCenters ?? []))

function flattenCostCenters(nodes: CostCenter[], depth = 0): Array<{ id: string, label: string }> {
  const result: Array<{ id: string, label: string }> = []
  for (const node of nodes) {
    result.push({ id: node.id, label: `${'—'.repeat(depth)} ${node.name}`.trim() })
    if (node.children?.length) {
      result.push(...flattenCostCenters(node.children, depth + 1))
    }
  }
  return result
}

const categoryOptions = computed(() =>
  categories.map(c => ({ value: c, label: t(`finance.expenses.categories.${c}`) }))
)

const costCenterOptions = computed(() =>
  flatCostCenters.value.map(c => ({ value: c.id, label: c.label }))
)

const budgetOptions = computed(() =>
  (props.budgets ?? []).map(b => ({
    value: b.id,
    label: `${b.cost_center.name} (${b.year})`
  }))
)

function onSubmit() {
  if (!form.description || !form.amount || !form.expense_date) return
  submitting.value = true
  emit('submit', {
    category: form.category,
    cost_center_id: form.cost_center_id || undefined,
    budget_id: form.budget_id || undefined,
    amount: Number(form.amount),
    currency: form.currency,
    description: form.description,
    expense_date: form.expense_date,
    receipt_path: form.receipt_path || undefined
  })
  submitting.value = false
}

function reset() {
  form.category = 'office'
  form.cost_center_id = undefined
  form.budget_id = undefined
  form.amount = 0
  form.description = ''
  form.expense_date = new Date().toISOString().slice(0, 10)
  form.receipt_path = undefined
}

defineExpose({ reset })
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('finance.expenses.fields.category')" :model-value="form.category" required>
        <USelect v-model="form.category" :items="categoryOptions" value-key="value" label-key="label" />
      </MideskFormField>

      <MideskFormField :label="t('finance.expenses.fields.date')" :model-value="form.expense_date" field-class="midesk-ltr-field" required>
        <MideskDatePicker v-model="form.expense_date" />
      </MideskFormField>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('finance.expenses.fields.costCenter')" :model-value="form.cost_center_id">
        <USelect
          v-model="form.cost_center_id"
          :items="costCenterOptions"
          value-key="value"
          label-key="label"
          :placeholder="t('common.select')"
        />
      </MideskFormField>

      <MideskFormField :label="t('finance.expenses.fields.budget')" :model-value="form.budget_id">
        <USelect
          v-model="form.budget_id"
          :items="budgetOptions"
          value-key="value"
          label-key="label"
          :placeholder="t('common.optional')"
        />
      </MideskFormField>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('finance.expenses.fields.amount')" :model-value="form.amount" required>
        <UInput v-model.number="form.amount" type="number" min="0" />
      </MideskFormField>

      <MideskFormField :label="t('finance.expenses.fields.currency')" :model-value="form.currency">
        <UInput v-model="form.currency" />
      </MideskFormField>
    </div>

    <MideskFormField :label="t('finance.expenses.fields.description')" :model-value="form.description" required>
      <UTextarea v-model="form.description" :rows="3" placeholder=" " />
    </MideskFormField>

    <MideskFormField :label="t('finance.expenses.fields.receipt')" :model-value="form.receipt_path">
      <input
        type="file"
        accept="image/*,.pdf"
        class="block w-full text-sm text-[var(--color-midesk-muted)] file:me-3 file:rounded-lg file:border-0 file:bg-[var(--color-midesk-accent-soft)] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[var(--color-midesk-accent)]"
        @change="onReceiptChange"
      />
      <p v-if="form.receipt_path" class="mt-1 text-xs text-[var(--color-midesk-muted)]">{{ form.receipt_path }}</p>
    </MideskFormField>

    <div class="flex justify-end">
      <UButton type="submit" color="primary" :loading="submitting">
        {{ t('finance.expenses.actions.create') }}
      </UButton>
    </div>
  </form>
</template>
