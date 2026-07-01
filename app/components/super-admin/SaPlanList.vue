<script setup lang="ts">
import type { SubscriptionPlan } from '~/types/phase5'

defineProps<{
  plans: SubscriptionPlan[]
  loading?: boolean
}>()

const emit = defineEmits<{
  create: []
  edit: [plan: SubscriptionPlan]
  delete: [id: string]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="midesk-glass overflow-hidden rounded-xl border border-[var(--color-midesk-border)]">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-midesk-border)] px-5 py-4">
      <h2 class="midesk-card-header">{{ t('superAdmin.plans.title') }}</h2>
      <UButton color="primary" icon="i-lucide-plus" size="sm" @click="emit('create')">
        {{ t('superAdmin.plans.create') }}
      </UButton>
    </div>

    <div v-if="loading" class="space-y-3 p-5">
      <USkeleton v-for="i in 4" :key="i" class="h-10" />
    </div>

    <UiEmptyState
      v-else-if="!plans.length"
      :title="t('superAdmin.plans.emptyTitle')"
      :description="t('superAdmin.plans.emptyDesc')"
      icon="i-lucide-credit-card"
    >
      <template #action>
        <UButton color="primary" @click="emit('create')">{{ t('superAdmin.plans.create') }}</UButton>
      </template>
    </UiEmptyState>

    <div v-else class="overflow-x-auto">
      <table class="w-full min-w-[48rem] text-sm">
        <thead>
          <tr class="border-b border-[var(--color-midesk-border)] text-[var(--color-midesk-muted)]">
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.plans.columns.name') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.plans.columns.code') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.plans.columns.monthly') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.plans.columns.yearly') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.plans.columns.maxUsers') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ t('superAdmin.plans.columns.maxProjects') }}</th>
            <th class="px-4 py-3 text-end font-medium" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="plan in plans"
            :key="plan.id"
            class="border-b border-[var(--color-midesk-border)] last:border-0"
          >
            <td class="px-4 py-3 font-medium">{{ plan.name }}</td>
            <td class="px-4 py-3">
              <UBadge variant="subtle">{{ plan.code }}</UBadge>
            </td>
            <td class="px-4 py-3">
              <MideskCurrency :amount="plan.price_monthly.IR" currency="IRR" />
            </td>
            <td class="px-4 py-3">
              <MideskCurrency :amount="plan.price_yearly.IR" currency="IRR" />
            </td>
            <td class="px-4 py-3">{{ plan.max_users }}</td>
            <td class="px-4 py-3">{{ plan.max_projects }}</td>
            <td class="px-4 py-3 text-end">
              <div class="flex justify-end gap-1">
                <UButton
                  size="sm"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-pencil"
                  @click="emit('edit', plan)"
                />
                <UButton
                  size="sm"
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  @click="emit('delete', plan.id)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
