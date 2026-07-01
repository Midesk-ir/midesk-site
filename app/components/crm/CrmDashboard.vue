<script setup lang="ts">
import type { CrmDashboard } from '~/types/phase5'

const props = defineProps<{
  dashboard: CrmDashboard | null
  loading?: boolean
}>()

const { t } = useI18n()

const maxFunnel = computed(() => {
  if (!props.dashboard) return 1
  return Math.max(...Object.values(props.dashboard.funnel), 1)
})
</script>

<template>
  <div v-if="loading" class="grid gap-4 lg:grid-cols-2">
    <USkeleton class="midesk-skeleton-card h-64" />
    <USkeleton class="midesk-skeleton-card h-64" />
    <USkeleton class="midesk-skeleton-card h-48 lg:col-span-2" />
  </div>

  <div v-else-if="dashboard" class="grid gap-4 lg:grid-cols-2">
    <UCard class="midesk-glass border-[var(--color-midesk-border)]">
      <template #header><p class="font-semibold">{{ t('crm.funnel') }}</p></template>
      <div class="space-y-3">
        <div v-for="(count, stage) in dashboard.funnel" :key="stage" class="flex items-center gap-3">
          <span class="w-28 shrink-0 text-sm">{{ t(`crm.stages.${stage}`) }}</span>
          <UProgress :value="Math.round((count / maxFunnel) * 100)" class="flex-1" />
          <span class="w-6 shrink-0 text-end text-sm font-medium">{{ count }}</span>
        </div>
      </div>
    </UCard>

    <UCard class="midesk-glass border-[var(--color-midesk-border)]">
      <template #header><p class="font-semibold">{{ t('crm.hotOpportunities') }}</p></template>
      <UiEmptyState
        v-if="!dashboard.hot_opportunities.length"
        :title="t('crm.emptyHotTitle')"
        :description="t('crm.emptyHotDesc')"
        icon="i-lucide-flame"
        class="py-6"
      />
      <ul v-else class="space-y-3">
        <li
          v-for="o in dashboard.hot_opportunities"
          :key="o.id"
          class="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-midesk-border)] p-3"
        >
          <div class="min-w-0">
            <p class="truncate font-medium">{{ o.title }}</p>
            <p class="text-xs text-[var(--color-midesk-muted)]">{{ o.contact.name }}</p>
          </div>
          <div class="shrink-0 text-end">
            <p class="text-sm font-semibold">
              <MideskCurrency :amount="o.value" :currency="o.currency" />
            </p>
            <p class="text-xs text-[var(--color-midesk-muted)]">{{ o.probability }}%</p>
          </div>
        </li>
      </ul>
    </UCard>

    <UCard class="midesk-glass border-[var(--color-midesk-border)] lg:col-span-2">
      <template #header><p class="font-semibold">{{ t('crm.recentActivity') }}</p></template>
      <UiEmptyState
        v-if="!dashboard.recent_activities.length"
        :title="t('crm.emptyActivitiesTitle')"
        :description="t('crm.emptyActivitiesDesc')"
        icon="i-lucide-activity"
        class="py-6"
      />
      <CrmActivityTimeline v-else :activities="dashboard.recent_activities" />
    </UCard>
  </div>
</template>
