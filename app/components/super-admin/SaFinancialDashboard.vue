<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import type { SaFinancialStats } from '~/types/phase5'

const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))

const props = defineProps<{
  stats: SaFinancialStats | null
  loading?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  retry: []
}>()

const { t } = useI18n()
const { formatCurrency } = useCalendar()
const { reportChartBase } = useReportChart()

const planChartOptions = computed<ApexOptions>(() => {
  const base = reportChartBase('donut')
  const entries = Object.entries(props.stats?.revenue_by_plan ?? {})

  return {
    ...base,
    labels: entries.map(([key]) => key),
    colors: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
    legend: { position: 'bottom', labels: { colors: '#ccc' } },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val: number) => formatCurrency(val, 'IRR') }
    }
  }
})

const planChartSeries = computed(() =>
  Object.values(props.stats?.revenue_by_plan ?? {})
)

const cycleChartOptions = computed<ApexOptions>(() => {
  const base = reportChartBase('bar')
  const cycle = props.stats?.revenue_by_cycle

  return {
    ...base,
    colors: ['#ef4444', '#f97316'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
    xaxis: {
      categories: [t('superAdmin.financial.monthly'), t('superAdmin.financial.yearly')],
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

const cycleChartSeries = computed(() => [{
  name: t('superAdmin.financial.byCycle'),
  data: [
    props.stats?.revenue_by_cycle.monthly ?? 0,
    props.stats?.revenue_by_cycle.yearly ?? 0
  ]
}])
</script>

<template>
  <div v-if="loading" class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2">
      <USkeleton v-for="i in 2" :key="i" class="midesk-skeleton-stat" />
    </div>
    <div class="grid gap-4 lg:grid-cols-2">
      <USkeleton class="midesk-skeleton-card-lg h-72" />
      <USkeleton class="midesk-skeleton-card-lg h-72" />
    </div>
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
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div class="midesk-stat-card">
        <div class="mb-3 flex items-center justify-between gap-2">
          <span class="text-sm text-[var(--color-midesk-muted)]">{{ t('superAdmin.financial.mrr') }}</span>
          <UIcon name="i-lucide-banknote" class="size-5 text-red-500" />
        </div>
        <p class="text-3xl font-bold">
          <MideskCurrency :amount="stats.mrr" currency="IRR" />
        </p>
      </div>
      <div class="midesk-stat-card">
        <div class="mb-3 flex items-center justify-between gap-2">
          <span class="text-sm text-[var(--color-midesk-muted)]">{{ t('superAdmin.financial.arr') }}</span>
          <UIcon name="i-lucide-trending-up" class="size-5 text-red-500" />
        </div>
        <p class="text-3xl font-bold">
          <MideskCurrency :amount="stats.arr" currency="IRR" />
        </p>
      </div>
      <div class="midesk-stat-card">
        <div class="mb-3 flex items-center justify-between gap-2">
          <span class="text-sm text-[var(--color-midesk-muted)]">{{ t('superAdmin.financial.cancellations') }}</span>
          <UIcon name="i-lucide-user-minus" class="size-5 text-red-500" />
        </div>
        <p class="text-3xl font-bold">{{ stats.cancellations_this_month }}</p>
      </div>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <section class="midesk-card p-5">
        <h2 class="midesk-card-header mb-4">{{ t('superAdmin.financial.byPlan') }}</h2>
        <ClientOnly>
          <VueApexCharts
            type="donut"
            height="280"
            :options="planChartOptions"
            :series="planChartSeries"
          />
        </ClientOnly>
      </section>

      <section class="midesk-card p-5">
        <h2 class="midesk-card-header mb-4">{{ t('superAdmin.financial.byCycle') }}</h2>
        <ClientOnly>
          <VueApexCharts
            type="bar"
            height="280"
            :options="cycleChartOptions"
            :series="cycleChartSeries"
          />
        </ClientOnly>
      </section>
    </div>
  </div>
</template>
