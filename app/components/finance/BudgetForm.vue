<script setup lang="ts">
import type { Budget, CostCenter, CreateBudgetPayload } from '~/types/phase3'

const props = defineProps<{
  costCenters?: CostCenter[]
}>()

const emit = defineEmits<{
  submit: [payload: CreateBudgetPayload]
}>()

const { t } = useI18n()

const submitting = ref(false)

const form = reactive<CreateBudgetPayload>({
  cost_center_id: '',
  year: new Date().getFullYear(),
  amount: 0
})

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

const costCenterOptions = computed(() =>
  flatCostCenters.value.map(c => ({ value: c.id, label: c.label }))
)

function onSubmit() {
  if (!form.cost_center_id || !form.amount || !form.year) return
  submitting.value = true
  emit('submit', {
    cost_center_id: form.cost_center_id,
    year: Number(form.year),
    amount: Number(form.amount)
  })
  submitting.value = false
}

function reset() {
  form.cost_center_id = ''
  form.year = new Date().getFullYear()
  form.amount = 0
}

defineExpose({ reset })
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField :label="t('finance.budgets.fields.costCenter')" :model-value="form.cost_center_id" required>
      <USelect
        v-model="form.cost_center_id"
        :items="costCenterOptions"
        value-key="value"
        label-key="label"
        :placeholder="t('common.select')"
      />
    </MideskFormField>

    <div class="grid gap-4 sm:grid-cols-2">
      <MideskFormField :label="t('finance.budgets.fields.year')" :model-value="form.year" required>
        <UInput v-model.number="form.year" type="number" min="2020" max="2100" />
      </MideskFormField>

      <MideskFormField :label="t('finance.budgets.fields.amount')" :model-value="form.amount" required>
        <UInput v-model.number="form.amount" type="number" min="0" />
      </MideskFormField>
    </div>

    <div class="flex justify-end">
      <UButton type="submit" color="primary" :loading="submitting">
        {{ t('finance.budgets.actions.create') }}
      </UButton>
    </div>
  </form>
</template>
