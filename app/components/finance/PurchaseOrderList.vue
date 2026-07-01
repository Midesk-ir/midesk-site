<script setup lang="ts">
import type { PurchaseOrder, PurchaseOrderStatus } from '~/types/phase3'

defineProps<{
  orders: PurchaseOrder[]
  loading?: boolean
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()

const statusColor: Record<PurchaseOrderStatus, 'neutral' | 'warning' | 'success' | 'error' | 'info' | 'primary'> = {
  draft: 'neutral',
  issued: 'info',
  received: 'success',
  cancelled: 'error'
}
</script>

<template>
  <section class="midesk-card overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 3" :key="i" class="h-14" />
    </div>

    <UiEmptyState
      v-else-if="!orders.length"
      :title="t('finance.purchaseOrders.emptyTitle')"
      :description="t('finance.purchaseOrders.emptyDesc')"
      icon="i-lucide-package"
    />

    <div v-else class="overflow-x-auto">
      <table class="midesk-table w-full min-w-[720px]">
        <thead>
          <tr>
            <th>{{ t('finance.purchaseOrders.columns.title') }}</th>
            <th>{{ t('finance.purchaseOrders.columns.vendor') }}</th>
            <th>{{ t('finance.purchaseOrders.columns.amount') }}</th>
            <th>{{ t('finance.purchaseOrders.columns.date') }}</th>
            <th>{{ t('finance.purchaseOrders.columns.status') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="hover:bg-[var(--color-midesk-surface-hover)]"
          >
            <td class="font-medium text-[var(--color-midesk-text)]">{{ order.title }}</td>
            <td class="text-[var(--color-midesk-muted)]">{{ order.vendor?.name || '—' }}</td>
            <td class="font-semibold text-[var(--color-midesk-text)]">
              <MideskCurrency :amount="order.total_amount" :currency="order.currency" />
            </td>
            <td class="whitespace-nowrap text-[var(--color-midesk-text)]">{{ formatDate(order.created_at.slice(0, 10)) }}</td>
            <td>
              <UBadge variant="subtle" :color="statusColor[order.status]" size="sm">
                {{ t(`finance.purchaseOrders.status.${order.status}`) }}
              </UBadge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
