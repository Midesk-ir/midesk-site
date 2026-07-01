<script setup lang="ts">
import type { PayslipDetail } from '~/types/phase3'

defineProps<{
  payslip: PayslipDetail
}>()

const { t } = useI18n()
</script>

<template>
  <div class="space-y-4 text-sm">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-lg font-semibold text-[var(--color-midesk-text)]">{{ payslip.period }}</p>
        <UBadge variant="subtle" color="primary" size="sm" class="mt-1">
          {{ t(`finance.my.payslipStatus.${payslip.status}`) }}
        </UBadge>
      </div>
      <p class="text-xl font-bold text-[var(--color-midesk-accent)]">
        <MideskCurrency :amount="payslip.net_amount" :currency="payslip.currency" />
      </p>
    </div>

    <dl class="space-y-2 rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.02] p-4">
      <div class="flex justify-between gap-3">
        <dt class="text-[var(--color-midesk-muted)]">{{ t('finance.payroll.baseSalary') }}</dt>
        <dd class="font-medium text-[var(--color-midesk-text)]">
          <MideskCurrency :amount="payslip.base_salary" :currency="payslip.currency" />
        </dd>
      </div>
      <div class="flex justify-between gap-3">
        <dt class="text-[var(--color-midesk-muted)]">{{ t('finance.payroll.overtime') }}</dt>
        <dd class="font-medium text-[var(--color-midesk-text)]">
          <MideskCurrency :amount="payslip.overtime_amount" :currency="payslip.currency" />
        </dd>
      </div>
      <div
        v-for="item in payslip.allowances"
        :key="item.name"
        class="flex justify-between gap-3"
      >
        <dt class="text-[var(--color-midesk-muted)]">{{ item.name }}</dt>
        <dd class="font-medium text-[var(--color-midesk-text)]">
          <MideskCurrency :amount="item.amount" :currency="payslip.currency" />
        </dd>
      </div>

      <div class="my-2 border-t border-[var(--color-midesk-border)]" />

      <div class="flex justify-between gap-3 font-semibold">
        <dt class="text-[var(--color-midesk-text)]">{{ t('finance.payroll.gross') }}</dt>
        <dd class="text-[var(--color-midesk-text)]">
          <MideskCurrency :amount="payslip.gross_amount" :currency="payslip.currency" />
        </dd>
      </div>

      <div
        v-for="item in payslip.deductions"
        :key="item.name"
        class="flex justify-between gap-3"
      >
        <dt class="text-[var(--color-midesk-muted)]">{{ item.name }}</dt>
        <dd class="font-medium text-red-400">
          -<MideskCurrency :amount="item.amount" :currency="payslip.currency" />
        </dd>
      </div>

      <div class="my-2 border-t border-[var(--color-midesk-border)]" />

      <div class="flex justify-between gap-3 text-base font-bold">
        <dt class="text-[var(--color-midesk-text)]">{{ t('finance.payroll.net') }}</dt>
        <dd class="text-[var(--color-midesk-accent)]">
          <MideskCurrency :amount="payslip.net_amount" :currency="payslip.currency" />
        </dd>
      </div>
    </dl>
  </div>
</template>
