<script setup lang="ts">
import type { SubscriptionPlan } from '~/types/phase5'
import { formatCurrencyText } from '~/utils/currency-format'

defineProps<{
  plan: SubscriptionPlan
  region: 'IR' | 'INTL'
  cycle: 'monthly' | 'yearly'
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:cycle': [value: 'monthly' | 'yearly']
  pay: []
  cancel: []
}>()

const { t, locale } = useI18n()

function amount(plan: SubscriptionPlan, region: 'IR' | 'INTL', cycle: 'monthly' | 'yearly') {
  const prices = cycle === 'monthly' ? plan.price_monthly : plan.price_yearly
  return formatCurrencyText(prices[region], region === 'IR' ? 'IRR' : 'USD', locale.value)
}
</script>

<template>
  <UCard class="midesk-glass border-[var(--color-midesk-border)]">
    <div class="space-y-4">
      <h2 class="text-lg font-semibold">{{ plan.name }}</h2>
      <USelect
        :model-value="cycle"
        :items="[
          { label: t('subscription.monthly'), value: 'monthly' },
          { label: t('subscription.yearly'), value: 'yearly' }
        ]"
        @update:model-value="emit('update:cycle', $event as 'monthly' | 'yearly')"
      />
      <p class="text-2xl font-bold">{{ amount(plan, region, cycle) }}</p>
      <ul class="text-sm text-[var(--color-midesk-muted)]">
        <li v-for="f in plan.features" :key="f">• {{ f }}</li>
      </ul>
      <div class="flex gap-2">
        <UButton color="primary" :loading="loading" @click="emit('pay')">
          {{ t('subscription.pay') }}
        </UButton>
        <UButton color="neutral" variant="outline" @click="emit('cancel')">
          {{ t('common.cancel') }}
        </UButton>
      </div>
    </div>
  </UCard>
</template>
