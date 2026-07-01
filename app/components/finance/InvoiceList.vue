<script setup lang="ts">
import type { Invoice, InvoiceStatus } from '~/types/phase3'

defineProps<{
  invoices: Invoice[]
  loading?: boolean
}>()

const emit = defineEmits<{
  pay: [id: string]
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()
const { can } = usePermissions()

const statusColor: Record<InvoiceStatus, 'neutral' | 'warning' | 'success' | 'error' | 'info' | 'primary'> = {
  draft: 'neutral',
  sent: 'info',
  partially_paid: 'warning',
  paid: 'success',
  overdue: 'error',
  cancelled: 'neutral'
}

function canPay(invoice: Invoice) {
  return can('finance:invoices:view') && !['paid', 'cancelled'].includes(invoice.status)
}
</script>

<template>
  <section class="midesk-card overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="h-14" />
    </div>

    <UiEmptyState
      v-else-if="!invoices.length"
      :title="t('finance.invoices.emptyTitle')"
      :description="t('finance.invoices.emptyDesc')"
      icon="i-lucide-file-text"
    />

    <div v-else class="overflow-x-auto">
      <table class="midesk-table w-full min-w-[720px]">
        <thead>
          <tr>
            <th>{{ t('finance.invoices.columns.number') }}</th>
            <th>{{ t('finance.invoices.columns.vendor') }}</th>
            <th>{{ t('finance.invoices.columns.dueDate') }}</th>
            <th>{{ t('finance.invoices.columns.amount') }}</th>
            <th>{{ t('finance.invoices.columns.status') }}</th>
            <th class="text-end">{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="invoice in invoices"
            :key="invoice.id"
            class="hover:bg-[var(--color-midesk-surface-hover)]"
          >
            <td class="font-medium text-[var(--color-midesk-text)]">{{ invoice.invoice_number }}</td>
            <td class="text-[var(--color-midesk-muted)]">{{ invoice.vendor.name }}</td>
            <td class="whitespace-nowrap text-[var(--color-midesk-text)]">{{ formatDate(invoice.due_date) }}</td>
            <td class="font-semibold text-[var(--color-midesk-text)]">
              <MideskCurrency :amount="invoice.amount" :currency="invoice.currency" />
            </td>
            <td>
              <UBadge variant="subtle" :color="statusColor[invoice.status]" size="sm">
                {{ t(`finance.invoices.status.${invoice.status}`) }}
              </UBadge>
            </td>
            <td class="text-end">
              <UButton
                v-if="canPay(invoice)"
                size="xs"
                color="primary"
                variant="soft"
                icon="i-lucide-banknote"
                @click="emit('pay', invoice.id)"
              >
                {{ t('finance.invoices.actions.pay') }}
              </UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
