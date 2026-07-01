<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import type { BudgetOverviewItem } from '~/types/phase3'

const props = defineProps<{
  items: BudgetOverviewItem[]
  loading?: boolean
}>()

const { t, locale } = useI18n()
const { formatCurrency } = useCalendar()
const { formatNumber } = useLocaleDigits()
const { reportChartBase } = useReportChart()

function utilizationColor(percent: number) {
  if (percent >= 90) return 'error' as const
  if (percent >= 75) return 'warning' as const
  return 'primary' as const
}

const chart = computed(() => {
  void locale.value
  if (!props.items.length) return null

  const categories = props.items.map(i => i.cost_center.name)
  const base = reportChartBase('bar')

  const options: ApexOptions = {
    ...base,
    chart: {
      ...base.chart,
      stacked: true,
      stackType: '100%'
    },
    colors: ['#ff5c00', 'rgba(255,255,255,0.12)'],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: '68%',
        dataLabels: { position: 'center' }
      }
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    xaxis: {
      categories,
      labels: {
        style: { colors: '#a3a3a3', fontSize: '12px' },
        formatter: (val: string) => `${formatNumber(Number(val))}%`
      },
      max: 100
    },
    yaxis: {
      labels: {
        style: { colors: '#d4d4d4', fontSize: '13px', fontWeight: 500 }
      }
    },
    grid: {
      borderColor: 'rgba(255,255,255,0.06)',
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
      padding: { left: 8, right: 16 }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: { colors: '#d4d4d4' },
      markers: { shape: 'circle', size: 6 }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number, opts?: { dataPointIndex?: number, seriesIndex?: number }) => {
          const item = props.items[opts?.dataPointIndex ?? 0]
          if (!item) return formatNumber(val)
          if (opts?.seriesIndex === 0) {
            return formatCurrency(item.spent, 'IRR')
          }
          return formatCurrency(item.remaining, 'IRR')
        }
      }
    }
  }

  const series = [
    {
      name: t('finance.budgets.spent'),
      data: props.items.map(i => i.utilization_percent)
    },
    {
      name: t('finance.budgets.remaining'),
      data: props.items.map(i => Math.max(0, 100 - i.utilization_percent))
    }
  ]

  return { options, series }
})
</script>

<template>
  <section class="midesk-card p-5">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="midesk-card-header mb-0">{{ t('finance.budgets.overview') }}</h2>
        <p class="mt-1 text-sm text-[var(--color-midesk-muted)]">{{ t('finance.budgets.overviewHint') }}</p>
      </div>
      <UIcon name="i-lucide-bar-chart-3" class="size-5 text-[var(--color-midesk-accent)]" />
    </div>

    <div v-if="loading" class="space-y-4">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <USkeleton v-for="i in 3" :key="i" class="h-28 rounded-xl" />
      </div>
      <USkeleton class="midesk-skeleton-card-lg h-56 w-full" />
    </div>

    <UiEmptyState
      v-else-if="!items.length"
      :title="t('finance.budgets.emptyTitle')"
      icon="i-lucide-pie-chart"
      class="py-10"
    />

    <div v-else class="space-y-6">
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in items"
          :key="item.cost_center.id"
          class="rounded-xl border border-[var(--color-midesk-border)] bg-white/[0.02] p-4"
        >
          <div class="mb-3 flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="truncate font-medium text-[var(--color-midesk-text)]">{{ item.cost_center.name }}</p>
              <p class="text-xs text-[var(--color-midesk-muted)]">{{ item.cost_center.code }}</p>
            </div>
            <span class="shrink-0 rounded-lg bg-[var(--color-midesk-accent-soft)] px-2 py-1 text-xs font-semibold tabular-nums text-[var(--color-midesk-accent)]">
              {{ formatNumber(item.utilization_percent) }}%
            </span>
          </div>

          <UProgress
            :model-value="item.utilization_percent"
            :color="utilizationColor(item.utilization_percent)"
            size="sm"
            class="mb-3"
          />

          <div class="flex items-center justify-between gap-2 text-xs">
            <span class="text-[var(--color-midesk-muted)]">
              {{ t('finance.budgets.spent') }}:
              <MideskCurrency class="font-medium text-[var(--color-midesk-text)]" :amount="item.spent" currency="IRR" />
            </span>
            <span class="text-[var(--color-midesk-muted)]">
              {{ t('finance.budgets.budget') }}:
              <MideskCurrency class="font-medium text-[var(--color-midesk-text)]" :amount="item.budget" currency="IRR" />
            </span>
          </div>
        </article>
      </div>

      <ClientOnly>
        <ReportsReportChart
          v-if="chart"
          type="bar"
          :options="chart.options"
          :series="chart.series"
          :height="Math.max(220, items.length * 72)"
        />
      </ClientOnly>
    </div>
  </section>
</template>
