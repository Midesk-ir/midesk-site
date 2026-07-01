<script setup lang="ts">
import type { MyReceipt } from '~/types/phase3'

defineProps<{
  receipts: MyReceipt[]
  loading?: boolean
}>()

const { t } = useI18n()
const { formatDate } = useCalendar()
</script>

<template>
  <section class="midesk-card overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 2" :key="i" class="h-14 rounded-lg" />
    </div>

    <UiEmptyState
      v-else-if="!receipts.length"
      :title="t('finance.my.receiptsEmpty')"
      icon="i-lucide-receipt-text"
      class="py-10"
    />

    <ul v-else class="divide-y divide-[var(--color-midesk-border)]">
      <li
        v-for="receipt in receipts"
        :key="receipt.id"
        class="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-white/[0.02]"
      >
        <div class="min-w-0">
          <p class="truncate font-medium text-[var(--color-midesk-text)]">{{ receipt.title }}</p>
          <p class="text-sm text-[var(--color-midesk-muted)]">
            {{ formatDate(receipt.paid_at) }}
            <span v-if="receipt.reference"> · {{ receipt.reference }}</span>
          </p>
        </div>
        <p class="shrink-0 font-semibold text-[var(--color-midesk-text)]">
          <MideskCurrency :amount="receipt.amount" :currency="receipt.currency" />
        </p>
      </li>
    </ul>
  </section>
</template>
