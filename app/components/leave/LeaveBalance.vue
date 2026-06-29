<script setup lang="ts">
import type { LeaveBalance } from '~/types/phase1'

defineProps<{
  balances: LeaveBalance[]
  loading?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <div class="midesk-card p-5">
    <h2 class="midesk-card-header">{{ t('leave.balance.title') }}</h2>

    <div v-if="loading" class="grid grid-cols-1 gap-3 md:grid-cols-3">
      <USkeleton v-for="i in 3" :key="i" class="midesk-skeleton-card" />
    </div>

    <UiEmptyState
      v-else-if="!balances.length"
      :title="t('common.noResults')"
      icon="i-lucide-calendar-x"
    />

    <div v-else class="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div
        v-for="item in balances"
        :key="item.leave_type.id"
        class="rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.03] p-4"
      >
        <p class="font-medium">{{ item.leave_type.name }}</p>
        <div class="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p class="text-[var(--color-midesk-muted)]">{{ t('leave.balance.total') }}</p>
            <p class="mt-1 text-lg font-bold">
              {{ item.total }}
              <span class="text-xs font-normal text-[var(--color-midesk-muted)]">
                {{ item.leave_type.unit === 'hour' ? t('leave.balance.hours') : t('leave.balance.days') }}
              </span>
            </p>
          </div>
          <div>
            <p class="text-[var(--color-midesk-muted)]">{{ t('leave.balance.used') }}</p>
            <p class="mt-1 text-lg font-bold text-amber-400">{{ item.used }}</p>
          </div>
          <div>
            <p class="text-[var(--color-midesk-muted)]">{{ t('leave.balance.remaining') }}</p>
            <p class="mt-1 text-lg font-bold text-green-400">{{ item.remaining }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
