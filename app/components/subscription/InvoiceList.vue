<script setup lang="ts">
import type { SubscriptionInvoice } from '~/types/phase5'
import { formatCurrencyText } from '~/utils/currency-format'

defineProps<{ invoices: SubscriptionInvoice[] }>()
const { t, locale } = useI18n()
</script>

<template>
  <div v-if="!invoices.length" class="py-8 text-center text-sm text-[var(--color-midesk-muted)]">
    {{ t('subscription.noInvoices') }}
  </div>
  <div v-else class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead>
        <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
          <th class="px-3 py-2 text-start">{{ t('subscription.invoicePlan') }}</th>
          <th class="px-3 py-2 text-start">{{ t('subscription.invoiceAmount') }}</th>
          <th class="px-3 py-2 text-start">{{ t('subscription.invoiceDue') }}</th>
          <th class="px-3 py-2 text-start">{{ t('subscription.invoiceStatus') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="inv in invoices" :key="inv.id" class="border-b border-[var(--color-midesk-border)]">
          <td class="px-3 py-2">{{ inv.plan_name }}</td>
          <td class="px-3 py-2 midesk-ltr-field">{{ formatCurrencyText(inv.amount, inv.currency, locale) }}</td>
          <td class="px-3 py-2">{{ inv.due_date }}</td>
          <td class="px-3 py-2">
            <UBadge :color="inv.status === 'paid' ? 'success' : inv.status === 'pending' ? 'warning' : 'error'">
              {{ t(`subscription.invoiceStatuses.${inv.status}`) }}
            </UBadge>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
