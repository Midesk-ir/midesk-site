<script setup lang="ts">
import type { CreatePurchaseRequestPayload, PurchaseRequestItem } from '~/types/phase3'

const emit = defineEmits<{
  submit: [payload: CreatePurchaseRequestPayload]
}>()

const { t } = useI18n()
const tenantStore = useTenantStore()
const submitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  currency: tenantStore.tenant?.default_currency ?? 'IRR',
  items: [{ name: '', qty: 1, unit_price: 0 }] as Omit<PurchaseRequestItem, 'total'>[]
})

function addItem() {
  form.items.push({ name: '', qty: 1, unit_price: 0 })
}

function removeItem(index: number) {
  if (form.items.length > 1) form.items.splice(index, 1)
}

const total = computed(() =>
  form.items.reduce((sum, item) => sum + item.qty * item.unit_price, 0)
)

function onSubmit() {
  if (!form.title.trim() || form.items.some(i => !i.name.trim() || i.qty <= 0)) return
  submitting.value = true
  emit('submit', {
    title: form.title,
    description: form.description || undefined,
    currency: form.currency,
    items: form.items.map(i => ({ name: i.name, qty: i.qty, unit_price: i.unit_price }))
  })
  form.title = ''
  form.description = ''
  form.items = [{ name: '', qty: 1, unit_price: 0 }]
  submitting.value = false
}
</script>

<template>
  <form class="midesk-form-fields" @submit.prevent="onSubmit">
    <MideskFormField :label="t('finance.purchaseRequests.fields.title')" :model-value="form.title" required>
      <UInput v-model="form.title" />
    </MideskFormField>

    <MideskFormField :label="t('finance.purchaseRequests.fields.description')" :model-value="form.description">
      <UTextarea v-model="form.description" :rows="3" placeholder=" " />
    </MideskFormField>

    <div>
      <div class="mb-3 flex items-center justify-between gap-2">
        <span class="text-sm font-medium text-[var(--color-midesk-text)]">{{ t('finance.purchaseRequests.fields.items') }}</span>
        <UButton type="button" size="xs" variant="soft" color="primary" icon="i-lucide-plus" @click="addItem">
          {{ t('finance.purchaseRequests.actions.addItem') }}
        </UButton>
      </div>

      <div class="midesk-finance-line-items overflow-x-auto">
        <table class="midesk-table w-full min-w-[520px]">
          <thead>
            <tr>
              <th>{{ t('finance.purchaseRequests.fields.itemName') }}</th>
              <th class="w-24">{{ t('finance.purchaseRequests.fields.qty') }}</th>
              <th class="w-32">{{ t('finance.purchaseRequests.fields.unitPrice') }}</th>
              <th class="w-12" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in form.items" :key="index">
              <td>
                <UInput v-model="item.name" size="sm" />
              </td>
              <td>
                <UInput v-model.number="item.qty" type="number" min="1" size="sm" />
              </td>
              <td>
                <UInput v-model.number="item.unit_price" type="number" min="0" size="sm" />
              </td>
              <td class="text-end">
                <UButton
                  type="button"
                  size="xs"
                  color="error"
                  variant="soft"
                  icon="i-lucide-trash-2"
                  :disabled="form.items.length <= 1"
                  @click="removeItem(index)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="mt-2 text-sm text-[var(--color-midesk-muted)]">
        {{ t('finance.purchaseRequests.fields.total') }}:
        <MideskCurrency
          class="font-semibold text-[var(--color-midesk-text)]"
          :amount="total"
          :currency="form.currency"
        />
      </p>
    </div>

    <div class="flex justify-end">
      <UButton type="submit" color="primary" :loading="submitting">
        {{ t('finance.purchaseRequests.actions.create') }}
      </UButton>
    </div>
  </form>
</template>
