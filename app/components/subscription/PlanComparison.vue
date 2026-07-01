<script setup lang="ts">
import type { SubscriptionPlan, SubscriptionPlanCode } from '~/types/phase5'
import { formatCurrencyText } from '~/utils/currency-format'

const props = defineProps<{
  plans: SubscriptionPlan[]
  currentCode: SubscriptionPlanCode
  region: 'IR' | 'INTL'
}>()

const { t, locale } = useI18n()

function price(plan: SubscriptionPlan) {
  return formatCurrencyText(
    plan.price_monthly[props.region],
    props.region === 'IR' ? 'IRR' : 'USD',
    locale.value
  )
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
          <th class="px-3 py-2 text-start">{{ t('subscription.plan') }}</th>
          <th v-for="plan in plans" :key="plan.id" class="px-3 py-2 text-center">{{ plan.name }}</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-b border-[var(--color-midesk-border)]">
          <td class="px-3 py-2">{{ t('subscription.priceMonthly') }}</td>
          <td v-for="plan in plans" :key="plan.id" class="px-3 py-2 text-center">{{ price(plan) }}</td>
        </tr>
        <tr>
          <td class="px-3 py-2" />
          <td v-for="plan in plans" :key="plan.id" class="px-3 py-2 text-center">
            <UButton
              v-if="plan.code !== currentCode"
              :to="`/subscription/checkout?plan=${plan.code}`"
              size="sm"
              color="primary"
            >
              {{ t('subscription.upgrade') }}
            </UButton>
            <UBadge v-else color="success">{{ t('subscription.current') }}</UBadge>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
