<script setup lang="ts">
import type { MyPayslipBrief } from '~/types/phase3'

defineProps<{
  payslips: MyPayslipBrief[]
  loading?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const { t } = useI18n()
</script>

<template>
  <section class="midesk-card overflow-hidden">
    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 2" :key="i" class="h-14 rounded-lg" />
    </div>

    <UiEmptyState
      v-else-if="!payslips.length"
      :title="t('finance.my.payslipsEmpty')"
      icon="i-lucide-file-text"
      class="py-10"
    />

    <ul v-else class="divide-y divide-[var(--color-midesk-border)]">
      <li
        v-for="payslip in payslips"
        :key="payslip.id"
        class="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 transition hover:bg-white/[0.02]"
        @click="emit('select', payslip.id)"
      >
        <div>
          <p class="font-medium text-[var(--color-midesk-text)]">{{ payslip.period }}</p>
          <UBadge variant="subtle" size="sm" color="primary" class="mt-1">
            {{ t(`finance.my.payslipStatus.${payslip.status}`) }}
          </UBadge>
        </div>
        <div class="flex items-center gap-2">
          <p class="font-semibold tabular-nums text-[var(--color-midesk-text)]">
            <MideskCurrency :amount="payslip.net_amount" :currency="payslip.currency" />
          </p>
          <UIcon name="i-lucide-chevron-left" class="size-4 text-[var(--color-midesk-muted)] rtl:rotate-180" />
        </div>
      </li>
    </ul>
  </section>
</template>
