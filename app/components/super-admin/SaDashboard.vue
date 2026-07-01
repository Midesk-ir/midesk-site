<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import type { SaDashboardStats } from '~/types/phase5'

const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))

const props = defineProps<{
  stats: SaDashboardStats | null
  loading?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  retry: []
}>()

const { t } = useI18n()
const { formatCurrency } = useCalendar()
const { reportChartBase } = useReportChart()

const statCards = computed(() => {
  const s = props.stats
  if (!s) return []

  return [
    { key: 'tenants', label: t('superAdmin.dashboard.tenantsCount'), value: s.tenants_count, icon: 'i-lucide-building' },
    { key: 'mrr', label: t('superAdmin.dashboard.mrr'), value: formatCurrency(s.mrr, 'IRR'), icon: 'i-lucide-banknote' },
    { key: 'arr', label: t('superAdmin.dashboard.arr'), value: formatCurrency(s.arr, 'IRR'), icon: 'i-lucide-trending-up' },
    { key: 'active', label: t('superAdmin.dashboard.activeSubscriptions'), value: s.active_subscriptions, icon: 'i-lucide-check-circle' },
    { key: 'new', label: t('superAdmin.dashboard.newThisMonth'), value: s.new_this_month, icon: 'i-lucide-user-plus' }
  ]
})

const chartOptions = computed<ApexOptions>(() => {
  const base = reportChartBase('area')
  const months = props.stats?.revenue_by_month ?? []

  return {
    ...base,
    colors: ['#ef4444'],
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05 }
    },
    xaxis: {
      categories: months.map(m => m.month),
      labels: { style: { colors: 'var(--color-midesk-muted)' } }
    },
    yaxis: {
      labels: {
        style: { colors: 'var(--color-midesk-muted)' },
        formatter: (val: number) => formatCurrency(val, 'IRR')
      }
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val: number) => formatCurrency(val, 'IRR') }
    }
  }
})

const chartSeries = computed(() => [{
  name: t('superAdmin.dashboard.revenueChart'),
  data: (props.stats?.revenue_by_month ?? []).map(m => m.amount)
}])
</script>

<template>
  <div v-if="loading" class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <USkeleton v-for="i in 5" :key="i" class="midesk-skeleton-stat" />
    </div>
    <USkeleton class="midesk-skeleton-card-lg h-72 w-full" />
  </div>

  <UiEmptyState
    v-else-if="error"
    :title="t('common.error')"
    icon="i-lucide-circle-alert"
  >
    <template #action>
      <UButton color="primary" @click="emit('retry')">{{ t('common.retry') }}</UButton>
    </template>
  </UiEmptyState>

  <div v-else-if="stats" class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <div
        v-for="card in statCards"
        :key="card.key"
        class="midesk-stat-card"
      >
        <div class="mb-3 flex items-center justify-between gap-2">
          <span class="text-sm text-[var(--color-midesk-muted)]">{{ card.label }}</span>
          <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-500/12">
            <UIcon :name="card.icon" class="size-4 text-red-500" />
          </div>
        </div>
        <p class="text-2xl font-bold tracking-tight text-[var(--color-midesk-text)] sm:text-3xl">
          {{ card.value }}
        </p>
      </div>
    </div>

    <section class="midesk-card p-5">
      <h2 class="midesk-card-header mb-4">{{ t('superAdmin.dashboard.revenueChart') }}</h2>
      <ClientOnly>
        <VueApexCharts
          type="area"
          height="280"
          :options="chartOptions"
          :series="chartSeries"
        />
      </ClientOnly>
    </section>
  </div>
</template>
